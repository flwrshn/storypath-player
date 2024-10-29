// app/screens/ProjectHome.jsx
import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "@/components/context/UserContext";
import { getDistance } from "geolib";
import LocationCard from "@/components/LocationCard";
import { parseLocationPosition } from "@/utils/parseLocation";
import { useNavigation } from "expo-router";
import { handleLocationProximity } from "@/utils/proximityHandler";

const ProjectHome = ({ route }) => {
  const navigation = useNavigation();
  const { project, locations } = route.params;
  const { userLocation, visitedLocations, addTracking, score } =
    useContext(UserContext);

  // Check if user is within 50 meters of any location
  const checkProximityToLocations = () => {
    locations.forEach((location) => {
      const locationCoordinates = parseLocationPosition(
        location.location_position
      );
      const distance = getDistance(userLocation, locationCoordinates);
      // If user is within 50m of the location and it's not already visited
      if (
        distance <= 50 &&
        !visitedLocations[project.id]?.locations.has(location.id)
      ) {
        addTracking(project.id, location.id, location.score_points);
        handleLocationProximity(location, navigation.navigate);
      }
    });
  };

  // Navigate to VisitedLocations and pass all locations
  const handleVisitedLocationsPress = () => {
    navigation.navigate("Visited Locations", { locations });
  };

  // Effect to check proximity
  // FIXME: Need for locations?
  useEffect(() => {
    if (userLocation && locations.length > 0) {
      checkProximityToLocations();
    }
  }, [userLocation, locations]);

  return (
    <View>
      <Text>Project: {project.title}</Text>
      <Text>Instructions: {project.instructions}</Text>
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
          Locations visited {visitedLocations[project.id]?.locations.size || 0}/
          {locations.length}
        </Text>
      </TouchableOpacity>
      {/* FIXME: Need to have project specific score */}
      <View>
        <Text>User Score: {score}</Text>
      </View>
    </View>
  );
};

export default ProjectHome;
