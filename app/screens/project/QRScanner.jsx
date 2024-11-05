// app/screens/project/QRScanner.jsx
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import React, { useState, useContext } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { UserContext } from "@/components/context/UserContext";
import { createTracking } from "@/services/api";

const QRScanner = ({ navigation, route }) => {
  const { project, locations } = route.params;
  const { user, loading, getTrackingsByProject } = useContext(UserContext);
  const { visitedTrackings } = getTrackingsByProject(project.id);

  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  const handleLocationProximity = (location, navigate) => {
    Alert.alert("Success!", `You are within ${location.location_name}.`, [
      {
        text: "Dismiss", // Option to do nothing and close the alert
        style: "cancel",
      },
      {
        text: "Learn More",
        onPress: () => navigate("Location Detail", { location }),
      },
    ]);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    // Checking if it's a QR code
    if (type !== "org.iso.QRCode") {
      Alert.alert("Error", "Please scan a QR code!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      return;
    }

    // Data is stored as project_id, location_id i.e. 1,3 so we split the data
    const [scannedProjectId, scannedLocationId] = data.split(",");

    if (scannedProjectId === project.id) {
      Alert.alert("Error", "Scanned code does not match the current project!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }

    const scannedLocation = locations.find(
      (location) => location.id.toString() === scannedLocationId
    );

    if (!scannedLocation) {
      Alert.alert("Error", "Scanned location is not valid for this project!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      return;
    }

    if (
      visitedTrackings.some(
        (tracking) => tracking.location_id.toString() === scannedLocationId
      )
    ) {
      Alert.alert("Error", "This location has already been visited!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      return;
    }

    // Track only if scoring is by QR code and username exists
    if (project.participant_scoring === "Number of Scanned QR Codes" && user) {
      const trackingData = {
        project_id: project.id,
        location_id: scannedLocation.id,
        participant_username: user,
        points: scannedLocation.score_points,
      };

      await createTracking(trackingData);
      console.log("Tracking recorded.");
    }
    handleLocationProximity(scannedLocation, navigation.navigate);
    setScannedData(data);
  };

  return (
    <View style={styles.container}>
      <Text>Project: {project.title}</Text>
      <CameraView
        style={styles.camera}
        type="front"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      ></CameraView>
      {scanned && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>Scanned data: {scannedData}</Text>
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scanResultContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default QRScanner;
