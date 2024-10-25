// app/screens/tabs/ProjectHome.jsx
import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { getLocations } from "../../../services/api";

const ProjectHome = ({ route }) => {
  const { project } = route.params;
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch locations if "homescreen_display" is "Display all locations"
    if (project.homescreen_display === "Display all locations") {
      fetchLocations(project.id);
    }
  }, [project]);

  // Function to fetch project locations
  const fetchLocations = async (projectId) => {
    try {
      const fetchedLocations = await getLocations(projectId);
      setLocations(fetchedLocations);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  return (
    <ScrollView>
      <Text className="text-2xl mb-5"> {project.title}</Text>
      <Text>Description: {project.description}</Text>
      <Text>Scoring: {project.participant_scoring}</Text>
      <Text>Instructions: {project.instructions}</Text>
      <Text>Initial Clue: {project.initial_clue}</Text>
      <Text>Homescreen Display: {project.homescreen_display}</Text>
      {project.homescreen_display === "Display all locations" && (
        <View>
          <Text className="text-2xl mb-2">Project Locations:</Text>
          {locations.length > 0 ? (
            locations.map((location) => (
              <View key={location.id} className="mb-2 border">
                <Text>Name: {location.location_name}</Text>
                <Text>Trigger: {location.location_trigger}</Text>
                <Text>Position: {location.location_position}</Text>
                <Text>Clue: {location.clue}</Text>
              </View>
            ))
          ) : (
            <Text>No locations found for this project.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default ProjectHome;
