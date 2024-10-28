import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useCallback } from "react";
import { UserContext } from "@/components/context/UserContext";
import { LocationContext } from "@/components/context/LocationContext";
import { getLocations } from "@/services/api";

// Component to display individual location details
const LocationCard = ({ location }) => (
  <View
    key={location.id}
    style={{
      marginTop: 8,
      borderWidth: 1,
      borderColor: "black",
      backgroundColor: "white",
    }}
  >
    <Text>Name: {location.location_name}</Text>
    <Text>Trigger: {location.location_trigger}</Text>
    <Text>Position: {location.location_position}</Text>
    {location.clue && <Text>Clue: {location.clue}</Text>}
  </View>
);

const ProjectHome = ({ route }) => {
  const { project } = route.params;
  const { locations, setLocations } = useContext(LocationContext);
  const { user, userLocation } = useContext(UserContext);

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
    <ScrollView>
      <Text>Project: {project.title}</Text>
      <Text>Instructions: {project.instructions}</Text>
      {/* Conditional display based on homescreen_display */}
      {project.homescreen_display === "Display initial clue" ? (
        <View>
          <Text>Initial Clue:</Text>
          <Text>{project.initial_clue}</Text>
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
      <Text>
        Location: {userLocation.latitude}, {userLocation.longitude}
      </Text>
    </ScrollView>
  );
};

export default ProjectHome;

// import React, { useContext, useEffect, useState } from "react";
// import { Text, View, Alert } from "react-native";
// import MapView, { Circle, Marker } from "react-native-maps";
// import { LocationContext } from "@/components/context/LocationContext";
// import { UserContext } from "@/components/context/UserContext";
// import { getDistance } from "geolib";
// import { createTracking } from "@/services/api";

// // Helper function to parse location_position
// const parseLocationPosition = (locationPosition) => {
//   const [latitude, longitude] = locationPosition
//     .replace(/[()]/g, "")
//     .split(",")
//     .map((coord) => parseFloat(coord));
//   return { latitude, longitude };
// };

// const ProjectHome = ({ route }) => {
//   const { project } = route.params;
//   const { locations } = useContext(LocationContext);
//   const { user, userLocation } = useContext(UserContext);

//   const [visitedLocations, setVisitedLocations] = useState(new Set());

//   // Check if the user's location matches any of the location coordinates
//   const checkUserAtLocation = (userLoc) => {
//     locations.forEach(async (location) => {
//       const locationCoords = parseLocationPosition(location.location_position);
//       const distance = getDistance(userLoc, locationCoords);
//       const isWithinRadius = distance <= 100; // Considered as "entered" if within 100 meters

//       // If within radius, mark as visited and create tracking if scoring is based on locations entered
//       if (isWithinRadius && !visitedLocations.has(location.id)) {
//         setVisitedLocations((prev) => new Set(prev).add(location.id));

//         if (
//           project.participant_scoring === "Number of Locations Entered" &&
//           user &&
//           user.trim() !== ""
//         ) {
//           const trackingData = {
//             project_id: project.id,
//             location_id: location.id,
//             participant_username: user,
//             points: location.score_points,
//           };

//           try {
//             await createTracking(trackingData);
//             Alert.alert(
//               "Success",
//               `Location entered! You earned ${location.score_points} points at ${location.location_name}.`
//             );
//           } catch (error) {
//             console.error("Failed to create tracking:", error);
//           }
//         }
//       }
//     });
//   };

//   // Run the check when the user's location updates
//   useEffect(() => {
//     if (
//       userLocation &&
//       project.participant_scoring === "Number of Locations Entered"
//     ) {
//       checkUserAtLocation(userLocation);
//     }
//   }, [userLocation]);

//   return (
//     <View>
//       <Text>Project: {project.title}</Text>
//     </View>
//   );
// };

// export default ProjectHome;
