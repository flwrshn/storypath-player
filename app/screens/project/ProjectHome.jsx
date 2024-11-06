// app/screens/ProjectHome.jsx
import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "@/components/context/UserContext";
import { getDistance } from "geolib";
import LocationCard from "@/components/LocationCard";
import { parseLocationPosition } from "@/utils/parseLocation";
import { handleLocationProximity } from "@/utils/routeLocation";

const ProjectHome = ({ navigation, route }) => {
  const { project, locations } = route.params;
  const { user, userLocation, addTracking, trackings, projectScores } =
    useContext(UserContext);

  const maxScore = locations.reduce((acc, loc) => acc + loc.score_points, 0);
  const visitedLocations = locations.filter((location) =>
    trackings.some(
      (tracking) =>
        tracking.participant_username === user &&
        tracking.project_id === project.id &&
        tracking.location_id === location.id
    )
  );

  // Check if user is within 50 meters of any location
  const checkProximityToLocations = async () => {
    try {
      await Promise.all(
        locations.map(async (location) => {
          const locationCoordinates = parseLocationPosition(
            location.location_position
          );
          const distance = getDistance(userLocation, locationCoordinates);

          if (
            user &&
            distance <= 50 &&
            project.participant_scoring === "Number of Locations Entered"
          ) {
            await addTracking(project.id, location.id, location.score_points);
            // Only navigate when they are a user
            handleLocationProximity(location, navigation.navigate);
          }
        })
      );
    } catch (error) {
      console.error("Error in processing locations:", error);
    }
  };

  // Navigate to VisitedLocations and pass only the visited locations for this project
  const handleVisitedLocationsPress = () => {
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
          Locations visited {visitedLocations.length}/{locations.length}
        </Text>
      </TouchableOpacity>
      <View>
        <Text>
          Project Score: {projectScores[project.id] || 0}/{maxScore}
        </Text>
      </View>
    </View>
  );
};

export default ProjectHome;
