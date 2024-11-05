// app/screens/ProjectHome.jsx
import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "@/components/context/UserContext";
import { getDistance } from "geolib";
import LocationCard from "@/components/LocationCard";
import { parseLocationPosition } from "@/utils/parseLocation";
import { getTrackings, createTracking } from "@/services/api";

const ProjectHome = ({ navigation, route }) => {
  const { project, locations } = route.params;
  const { user, userLocation, getTrackingsByProject } = useContext(UserContext);
  // Get visited locations for the current project
  const { visitedTrackings, score } = getTrackingsByProject(project.id);

  // Check if user is within 50 meters of any location
  const checkProximityToLocations = async () => {
    try {
      await Promise.all(
        locations.map(async (location) => {
          const locationCoordinates = parseLocationPosition(
            location.location_position
          );
          const distance = getDistance(userLocation, locationCoordinates);

          // Track If user is within 50m of the location and
          // the scoring is based on location and
          // if it is not visited
          if (
            distance <= 50 &&
            project.participant_scoring === "Number of Locations Entered" &&
            !visitedTrackings.some(
              (tracking) => tracking.location_id === location.id
            )
          ) {
            const trackingData = {
              project_id: project.id,
              location_id: location.id,
              participant_username: user,
              points: location.score_points,
            };

            await createTracking(trackingData);
            console.log("Tracking recorded.");
            handleLocationProximity(location, navigation.navigate);
          }
        })
      );
    } catch (error) {
      console.error("Error in processing locations:", error);
    }
  };

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

  // Navigate to VisitedLocations and pass only the visited locations for this project
  const handleVisitedLocationsPress = () => {
    const visitedLocations = locations.filter((location) =>
      visitedTrackings.some((tracking) => tracking.location_id === location.id)
    );
    navigation.navigate("Visited Locations", { locations: visitedLocations });
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
          Locations visited {visitedTrackings.length}/{locations.length}
        </Text>
      </TouchableOpacity>
      <View>
        <Text>User Score: {score}</Text>
      </View>
    </View>
  );
};

export default ProjectHome;
