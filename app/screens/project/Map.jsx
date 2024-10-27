// app/screens/project/Map.jsx
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
  const [nearbyLocation, setNearbyLocation] = useState(null);

  // Request location permission and get user's location
  useEffect(() => {
    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
        const userLoc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: userLoc.coords.latitude,
          longitude: userLoc.coords.longitude,
        });
      }
    }
    requestLocationPermission();
  }, []);

  // Helper function to parse location_position
  const parseLocationPosition = (locationPosition) => {
    const [latitude, longitude] = locationPosition
      .replace(/[()]/g, "")
      .split(",")
      .map((coord) => parseFloat(coord));
    return { latitude, longitude };
  };

  // Calculate nearest location
  useEffect(() => {
    if (userLocation && locations.length > 0) {
      const nearestLocation = locations
        .map((location) => {
          const coordinates = parseLocationPosition(location.location_position);
          const distance = getDistance(userLocation, coordinates);
          return { ...location, coordinates, distance };
        })
        .sort((a, b) => a.distance - b.distance)[0]; // Get the nearest location

      if (nearestLocation.distance <= 100) {
        setNearbyLocation(nearestLocation);
      } else {
        setNearbyLocation(null);
      }
    }
  }, [userLocation, locations]);

  const initialRegion = {
    latitude: userLocation ? userLocation.latitude : -27.4975,
    longitude: userLocation ? userLocation.longitude : 153.0137,
    latitudeDelta: 0.01, // Adjusted for campus level view
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project: {project.title}</Text>
      {userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={locationPermission}
        >
          {/* Marker for user's current location */}
          <Marker coordinate={userLocation} title="Current location" />

          {/* Map through locations and display circles and markers */}
          {locations.map((location) => {
            const coordinates = parseLocationPosition(
              location.location_position
            );
            return (
              <View key={location.id}>
                <Circle
                  center={coordinates}
                  radius={100}
                  strokeWidth={2}
                  strokeColor="#FF0000"
                  fillColor="rgba(255,0,0,0.3)"
                />
                <Marker
                  coordinate={coordinates}
                  title={location.location_name}
                  description={`Points: ${location.score_points}`}
                />
              </View>
            );
          })}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}

      {/* Display nearby location info if within 100 meters */}
      {nearbyLocation && (
        <SafeAreaView style={styles.nearbyLocationView}>
          <Text style={styles.nearbyLocationText}>
            {nearbyLocation.location_name} is within 100 meters!
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
  nearbyLocationView: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  nearbyLocationText: {
    fontSize: 16,
    backgroundColor: "black",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
});

export default Map;
