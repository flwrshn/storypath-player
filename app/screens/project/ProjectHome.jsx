// app/screens/tabs/ProjectHome.jsx
import { View, Text } from "react-native";
import React, { useEffect, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { getLocations } from "@/services/api";
import { LocationContext } from "@/components/context/LocationContext";

const ProjectHome = ({ route }) => {
  const { project } = route.params;
  const { locations, setLocations } = useContext(LocationContext);

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
      {/* Conditional display based on homescreen_display */}
      {project.homescreen_display === "Display initial clue" ? (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Initial Clue:</Text>
          <Text style={{ fontSize: 14, marginTop: 4 }}>
            {project.initial_clue}
          </Text>
        </View>
      ) : project.homescreen_display === "Display all locations" ? (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Project Locations:
          </Text>
          {locations.length > 0 ? (
            locations.map((location) => (
              <View
                key={location.id}
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  backgroundColor: "white",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                  Name: {location.location_name}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  Trigger: {location.location_trigger}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  Position: {location.location_position}
                </Text>

                {/* Display location clue if not blank */}
                {location.clue && (
                  <Text style={{ fontSize: 14, marginTop: 4 }}>
                    Clue: {location.clue}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text>No locations found for this project.</Text>
          )}
        </View>
      ) : (
        <Text style={{ fontSize: 14 }}>Invalid display option.</Text>
      )}
    </ScrollView>
  );
};

export default ProjectHome;
