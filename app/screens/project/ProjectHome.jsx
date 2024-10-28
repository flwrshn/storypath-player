import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useCallback } from "react";
import { UserContext } from "@/components/context/UserContext";
import { LocationContext } from "@/components/context/LocationContext";
import { getLocations } from "@/services/api";
import LocationCard from "@/components/LocationCard";

const ProjectHome = ({ route }) => {
  const { project } = route.params;
  const { locations, setLocations } = useContext(LocationContext);
  const { user, userLocation, visitedLocations, addVisitedLocation } =
    useContext(UserContext);

  const fetchLocations = useCallback(
    // Memoize fetchLocations until setLocations changes
    async (projectId) => {
      try {
        const fetchedLocations = await getLocations(projectId);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    },
    [setLocations]
  );

  useEffect(() => {
    if (project.homescreen_display === "Display all locations") {
      fetchLocations(project.id);
    }
  }, [project, fetchLocations]);

  return (
    <View>
      <Text>Project: {project.title}</Text>
      <Text>Instructions: {project.instructions}</Text>
      {/* Conditional display based on homescreen_display */}
      {project.homescreen_display === "Display initial clue" ? (
        <View>
          <Text> The initial clue is: {project.initial_clue}</Text>
        </View>
      ) : (
        <View>
          <Text>Project Locations:</Text>
          {locations.length > 0 ? (
            locations.map((location) => (
              <View key={location.id}>
                <LocationCard key={location.id} location={location} />
              </View>
            ))
          ) : (
            <Text>No locations found for this project.</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default ProjectHome;
