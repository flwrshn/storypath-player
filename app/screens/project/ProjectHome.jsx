// import { View, Text, ScrollView } from "react-native";
// import React, { useContext, useEffect, useCallback } from "react";
// import { UserContext } from "@/components/context/UserContext";
// import { LocationContext } from "@/components/context/LocationContext";
// import { getLocations } from "@/services/api";
// import LocationCard from "@/components/LocationCard";

// const ProjectHome = ({ route }) => {
//   const { project } = route.params;
//   const { locations, setLocations } = useContext(LocationContext);
//   const { user, userLocation, visitedLocations, addVisitedLocation } =
//     useContext(UserContext);

//   const fetchLocations = useCallback(
//     // Memoize fetchLocations until setLocations changes
//     async (projectId) => {
//       try {
//         const fetchedLocations = await getLocations(projectId);
//         setLocations(fetchedLocations);
//       } catch (error) {
//         console.error("Failed to fetch locations:", error);
//       }
//     },
//     [setLocations]
//   );

//   useEffect(() => {
//     if (project.homescreen_display === "Display all locations") {
//       fetchLocations(project.id);
//     }
//   }, [project, fetchLocations]);

//   return (
//     <View>
//       <Text>Project: {project.title}</Text>
//       <Text>Instructions: {project.instructions}</Text>
//       {/* Conditional display based on homescreen_display */}
//       {project.homescreen_display === "Display initial clue" ? (
//         <View>
//           <Text> The initial clue is: {project.initial_clue}</Text>
//         </View>
//       ) : (
//         <View>
//           <Text>Project Locations:</Text>
//           {locations.length > 0 ? (
//             locations.map((location) => (
//               <View key={location.id}>
//                 <LocationCard key={location.id} location={location} />
//               </View>
//             ))
//           ) : (
//             <Text>No locations found for this project.</Text>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// export default ProjectHome;

import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useCallback } from "react";
import { UserContext } from "@/components/context/UserContext";
import { LocationContext } from "@/components/context/LocationContext";
import { getLocations } from "@/services/api";
import { getDistance } from "geolib";
import LocationCard from "@/components/LocationCard";
import { parseLocationPosition } from "@/utils/parseLocation";
import { useNavigation } from "expo-router";

const ProjectHome = ({ route }) => {
  const navigation = useNavigation();
  const { project } = route.params;
  const { locations, setLocations } = useContext(LocationContext);
  const { userLocation, visitedLocations, addVisitedLocation } =
    useContext(UserContext);

  // Fetch locations based on project
  const fetchLocations = useCallback(
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

  // Check if user is within 50 meters of any location
  const checkProximityToLocations = () => {
    locations.forEach((location) => {
      const locationCoordinates = parseLocationPosition(
        location.location_position
      );
      const distance = getDistance(userLocation, locationCoordinates);

      if (distance <= 50 && !visitedLocations.has(location.id)) {
        handleLocationProximity(location);
      }
    });
  };

  // Handle logic when user is within proximity of a location
  const handleLocationProximity = (location) => {
    addVisitedLocation(location.id);

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

  // Effect to fetch locations
  useEffect(() => {
    if (project.homescreen_display === "Display all locations") {
      fetchLocations(project.id);
    }
  }, [project, fetchLocations]);

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
            visitedLocations: visitedLocationsList,
          })
        }
      >
        <Text>
          Locations visited {visitedLocations.size}/{locations.length}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectHome;
