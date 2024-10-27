import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { LocationContext } from "@/components/context/LocationContext";
import { UserContext } from "@/components/context/UserContext";
import { getDistance } from "geolib";
import { createTracking } from "@/services/api";

const Map = ({ route }) => {
  const { project } = route.params;
  const { locations } = useContext(LocationContext);
  const { user, userLocation } = useContext(UserContext);

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
    locations.forEach(async (location) => {
      const locationCoords = parseLocationPosition(location.location_position);
      const distance = getDistance(userLoc, locationCoords);
      const isWithinRadius = distance <= 100; // Considered as "entered" if within 100 meters

      // If within radius, mark as visited and create tracking if scoring is based on locations entered
      if (isWithinRadius && !visitedLocations.has(location.id)) {
        setVisitedLocations((prev) => new Set(prev).add(location.id));

        if (
          project.participant_scoring === "Number of Locations Entered" &&
          user &&
          user.trim() !== ""
        ) {
          const trackingData = {
            project_id: project.id,
            location_id: location.id,
            participant_username: user,
            points: location.score_points,
          };

          try {
            await createTracking(trackingData);
            Alert.alert(
              "Success",
              `Location entered! You earned ${location.score_points} points at ${location.location_name}.`
            );
          } catch (error) {
            console.error("Failed to create tracking:", error);
          }
        }
      }
    });
  };

  // Run the check when the user's location updates
  useEffect(() => {
    if (
      userLocation &&
      project.participant_scoring === "Number of Locations Entered"
    ) {
      checkUserAtLocation(userLocation);
    }
  }, [userLocation]);

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
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* Arrow marker for user location */}
          <Marker
            coordinate={userLocation}
            title="Current location"
            description="Your current location"
            pinColor="blue"
            rotation={90}
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
                  strokeColor={isVisited ? "green" : "red"}
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
                  pinColor={isVisited ? "green" : "red"}
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
