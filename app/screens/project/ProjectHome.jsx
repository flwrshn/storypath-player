// app/screens/ProjectHome.jsx
import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "@/components/context/UserContext";
import { getDistance } from "geolib";
import LocationCard from "@/components/LocationCard";
import { parseLocationPosition } from "@/utils/parseLocation";
import { useNavigation } from "expo-router";

const ProjectHome = ({ route }) => {
  const navigation = useNavigation();
  const { project, locations } = route.params;
  const { userLocation } = useContext(UserContext);

  // Check if user is within 50 meters of any location
  const checkProximityToLocations = () => {
    locations.forEach((location) => {
      const locationCoordinates = parseLocationPosition(
        location.location_position
      );
      const distance = getDistance(userLocation, locationCoordinates);

      if (distance <= 50) {
        handleLocationProximity(location);
      }
    });
  };

  // Handle logic when user is within proximity of a location
  const handleLocationProximity = (location) => {
    Alert.alert(
      "Success!",
      `You are within 50 meters of ${location.location_name}.`,
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("LocationDetail", { location }),
        },
      ]
    );
  };

  // Effect to check proximity
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
        onPress={() =>
          navigation.navigate("VisitedLocations", {
            locations,
          })
        }
      >
        <Text>
          Locations visited {locations.length}/{locations.length}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectHome;
