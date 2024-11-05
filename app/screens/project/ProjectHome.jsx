// app/screens/ProjectHome.jsx
import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "@/components/context/UserContext";
import { getDistance } from "geolib";
import LocationCard from "@/components/LocationCard";
import { parseLocationPosition } from "@/utils/parseLocation";
import { handleLocationProximity } from "@/utils/proximityHandler";
import { getTrackings } from "@/services/api";

// Track user location
// If the user location is within the bounds of a location and not in visited locations
// Make a tracking
// Update the user's visited locations

const ProjectHome = ({ navigation, route }) => {
  const { project, locations } = route.params;
  const {
    user,
    userLocation,
    visitedLocations,
    projectScore,
    addTracking,
    setProjectTrackings,
  } = useContext(UserContext);

  // Set the visited locations and score for the current project
  useEffect(() => {
    setProjectTrackings(project.id);
  }, [project.id]);

  // Get the current project's visited locations and score
  const projectData = visitedLocations[project.id] || {
    locations: [],
    score: 0,
  };

  // Check if user is within 50 meters of any location
  const checkProximityToLocations = () => {
    locations.forEach((location) => {
      const locationCoordinates = parseLocationPosition(
        location.location_position
      );
      const distance = getDistance(userLocation, locationCoordinates);

      // Track if user is within 50m of the location and it's not already visited
      if (
        distance <= 50 &&
        project.participant_scoring === "Number of Locations Entered" &&
        !projectData.locations.includes(location.id)
      ) {
        addTracking(project.id, location.id, location.score_points);
        handleLocationProximity(location, navigation.navigate);
      }
    });
  };

  // Navigate to VisitedLocations and pass all locations
  const handleVisitedLocationsPress = () => {
    const visitedLocationsFull = visitedLocations
      .map((locationId) =>
        locations.find((location) => location.id === locationId)
      )
      .filter((location) => location !== undefined);
    navigation.navigate("Visited Locations", {
      locations: visitedLocationsFull,
    });
  };

  // Effect to check proximity when user location or project locations change
  useEffect(() => {
    if (userLocation && locations.length > 0) {
      checkProximityToLocations();
    }
  }, [userLocation, locations]);

  return (
    <View>
      <Text>Project: {project.title}</Text>
      <Text>Scoring: {project.participant_scoring}</Text>
      <Text>Instructions: {project.instructions}</Text>
      <Text>Home screen display: {project.homescreen_display}</Text>
      {project.homescreen_display === "Display initial clue" ? (
        <View>
          <Text>The initial clue is: {project.initial_clue}</Text>
        </View>
      ) : (
        <View>
          <Text>Project Locations:</Text>
          {locations.length > 0 ? (
            locations.map((location) => (
              <View key={location.id}>
                <LocationCard location={location} />
              </View>
            ))
          ) : (
            <Text>No locations found for this project.</Text>
          )}
        </View>
      )}
      <Text>
        User location: {userLocation.latitude}, {userLocation.longitude}
      </Text>

      <TouchableOpacity
        className="bg-[#0CC000] items-center"
        onPress={handleVisitedLocationsPress}
      >
        <Text>
          Locations visited {visitedLocations.length}/{locations.length}
        </Text>
      </TouchableOpacity>
      <View>
        <Text>User Score: {projectScore}</Text>
      </View>
    </View>
  );
};

export default ProjectHome;
