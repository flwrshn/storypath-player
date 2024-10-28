import React, { useContext, useEffect, useState } from "react";
import { Text, View, Alert } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { LocationContext } from "@/components/context/LocationContext";
import { UserContext } from "@/components/context/UserContext";
import { getDistance } from "geolib";
import { createTracking } from "@/services/api";

// Helper function to parse location_position
const parseLocationPosition = (locationPosition) => {
  const [latitude, longitude] = locationPosition
    .replace(/[()]/g, "")
    .split(",")
    .map((coord) => parseFloat(coord));
  return { latitude, longitude };
};

const ProjectHome = ({ route }) => {
  const { project } = route.params;
  const { locations } = useContext(LocationContext);
  const { user, userLocation } = useContext(UserContext);

  const [visitedLocations, setVisitedLocations] = useState(new Set());

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
    <View>
      <Text>Project: {project.title}</Text>
    </View>
  );
};

export default ProjectHome;
