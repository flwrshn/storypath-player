import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { LocationContext } from "@/components/context/LocationContext";
import * as Location from "expo-location";
import { getDistance } from "geolib";

const Map = ({ route }) => {
  const { project } = route.params;
  const { locations } = useContext(LocationContext);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [visitedLocations, setVisitedLocations] = useState(new Set());

  // Helper function to parse location_position
  const parseLocationPosition = (locationPosition) => {
    const [latitude, longitude] = locationPosition
      .replace(/[()]/g, "")
      .split(",")
      .map((coord) => parseFloat(coord));
    return { latitude, longitude };
  };

  // Check if the user's location matches any of the location coordinates
  const checkUserAtLocation = (userLoc) => {
    locations.forEach((location) => {
      const locationCoords = parseLocationPosition(location.location_position);
      const distance = getDistance(userLoc, locationCoords);
      if (distance <= 50) {
        // Mark the location as visited if within 50 meters
        setVisitedLocations((prev) => new Set(prev).add(location.id));
      }
    });
  };

  // Request location permission and get user's location
  useEffect(() => {
    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Update every 10 meters
          },
          (location) => {
            const userCoordinates = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setUserLocation(userCoordinates);
            checkUserAtLocation(userCoordinates);
          }
        );
      }
    }
    requestLocationPermission();
  }, []);

  const initialRegion = {
    latitude: userLocation ? userLocation.latitude : -27.4975, // Default to UQ St Lucia
    longitude: userLocation ? userLocation.longitude : 153.0137,
    latitudeDelta: 0.05, // Wider view
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project: {project.title}</Text>
      {userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={locationPermission}
          userLocationUpdateInterval={5000}
          userLocationPriority="high"
          showsMyLocationButton={true}
          followsUserLocation={true}
        >
          {/* Arrow marker for user location */}
          <Marker
            coordinate={userLocation}
            title="Current location"
            pinColor="blue"
            flat={true}
          />

          {/* Display all locations */}
          {locations.map((location) => {
            const coordinates = parseLocationPosition(
              location.location_position
            );
            const isVisited = visitedLocations.has(location.id);
            return (
              <View key={location.id}>
                <Circle
                  center={coordinates}
                  radius={100}
                  strokeWidth={2}
                  strokeColor={isVisited ? "green" : "red"} // Green for visited, red for unvisited
                  fillColor={
                    isVisited ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)"
                  }
                />
                <Marker
                  coordinate={coordinates}
                  title={location.location_name}
                  description={`Points: ${location.score_points} ${
                    isVisited ? "(Visited)" : ""
                  }`}
                  pinColor={isVisited ? "green" : "red"} // Green for visited, red for unvisited
                />
              </View>
            );
          })}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}

      {/* Display message if no locations have been visited */}
      {visitedLocations.size === 0 && (
        <SafeAreaView style={styles.noLocationView}>
          <Text style={styles.noLocationText}>
            No locations visited yet. Explore to start unlocking!
          </Text>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  title: {
    padding: 10,
    fontSize: 18,
  },
  noLocationView: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  noLocationText: {
    fontSize: 16,
    backgroundColor: "black",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
});

export default Map;
