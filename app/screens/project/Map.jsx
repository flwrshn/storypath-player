import { View, Text } from "react-native";
import React from "react";

const Map = () => {
  return (
    <View>
      <Text>Map</Text>
    </View>
  );
};

export default Map;

// import React, { useState, useEffect, useContext } from "react";
// import {
//   StyleSheet,
//   Appearance,
//   View,
//   SafeAreaView,
//   Text,
//   Alert,
// } from "react-native";
// import MapView, { Circle, Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import { getDistance } from "geolib";

// import { LocationContext } from "@/components/context/LocationContext";
// import { UserContext } from "@/components/context/UserContext";
// import { createTracking } from "@/services/api"; // Import your API handler

// // Define Stylesheet
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   nearbyLocationSafeAreaView: {
//     backgroundColor: "black",
//   },
//   nearbyLocationView: {
//     padding: 20,
//   },
//   nearbyLocationText: {
//     color: "white",
//     lineHeight: 25,
//   },
// });

// // Get light or dark mode
// const colorScheme = Appearance.getColorScheme();

// function NearbyLocation(props) {
//   if (typeof props.location !== "undefined") {
//     return (
//       <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
//         <View style={styles.nearbyLocationView}>
//           <Text style={styles.nearbyLocationText}>
//             {props.location.location_name}
//           </Text>
//           {props.distance.nearby && (
//             <Text style={{ ...styles.nearbyLocationText, fontWeight: "bold" }}>
//               Within 100 Metres!
//             </Text>
//           )}
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// export default function Map({ route }) {
//   const { project } = route.params; // Retrieve project from route params
//   const { locations } = useContext(LocationContext); // Use locations from LocationContext
//   const { user } = useContext(UserContext); // Use user from UserContext

//   const updatedLocations = locations.map((location) => {
//     const [latitude, longitude] = location.location_position
//       .replace(/[()]/g, "")
//       .split(", ");
//     location.coordinates = {
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//     };
//     return location;
//   });

//   const initialMapState = {
//     locationPermission: false,
//     locations: updatedLocations,
//     userLocation: {
//       latitude: -27.4975,
//       longitude: 153.0137, // Default to UQ St Lucia
//     },
//     nearbyLocation: {},
//     visitedLocations: new Set(), // Track visited locations
//   };

//   const [mapState, setMapState] = useState(initialMapState);

//   useEffect(() => {
//     async function requestLocationPermission() {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === "granted") {
//         setMapState((prevState) => ({
//           ...prevState,
//           locationPermission: true,
//         }));
//       }
//     }
//     requestLocationPermission();
//   }, []);

//   useEffect(() => {
//     function calculateDistance(userLocation) {
//       const nearestLocations = mapState.locations
//         .map((location) => {
//           const metres = getDistance(userLocation, location.coordinates);
//           location["distance"] = {
//             metres: metres,
//             nearby: metres <= 100,
//           };
//           return location;
//         })
//         .sort(
//           (prevLoc, currLoc) =>
//             prevLoc.distance.metres - currLoc.distance.metres
//         );

//       return nearestLocations.shift();
//     }

//     let locationSubscription = null;

//     if (mapState.locationPermission) {
//       (async () => {
//         locationSubscription = await Location.watchPositionAsync(
//           {
//             accuracy: Location.Accuracy.High,
//             distanceInterval: 10, // Update every 10 meters
//           },
//           async (location) => {
//             const userLocation = {
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//             };

//             const nearbyLocation = calculateDistance(userLocation);

//             // Check if within 100 meters and not visited
//             if (
//               nearbyLocation.distance.nearby &&
//               !mapState.visitedLocations.has(nearbyLocation.id)
//             ) {
//               // Mark as visited
//               setMapState((prevState) => ({
//                 ...prevState,
//                 visitedLocations: new Set(prevState.visitedLocations).add(
//                   nearbyLocation.id
//                 ),
//               }));

//               // Create tracking if scoring is based on location entry
//               if (
//                 project.participant_scoring === "Number of Locations Entered" &&
//                 user &&
//                 user.trim() !== ""
//               ) {
//                 const trackingData = {
//                   project_id: project.id,
//                   location_id: nearbyLocation.id,
//                   participant_username: user,
//                   points: nearbyLocation.score_points,
//                 };

//                 try {
//                   await createTracking(trackingData);
//                   Alert.alert(
//                     "Success",
//                     `Location entered! You earned ${nearbyLocation.score_points} points at ${nearbyLocation.location_name}.`
//                   );
//                 } catch (error) {
//                   console.error("Failed to create tracking:", error);
//                 }
//               }
//             }

//             setMapState((prevState) => ({
//               ...prevState,
//               userLocation,
//               nearbyLocation,
//             }));
//           }
//         );
//       })();
//     }

//     return () => {
//       if (locationSubscription) {
//         locationSubscription.remove();
//       }
//     };
//   }, [mapState.locationPermission]);

//   return (
//     <>
//       <MapView
//         camera={{
//           center: mapState.userLocation,
//           pitch: 0,
//           heading: 0,
//           altitude: 3000,
//           zoom: 15,
//         }}
//         showsUserLocation={mapState.locationPermission}
//         style={styles.container}
//       >
//         {mapState.locations.map((location) => (
//           <Circle
//             key={location.id}
//             center={location.coordinates}
//             radius={100}
//             strokeWidth={3}
//             strokeColor="#A42DE8"
//             fillColor={
//               colorScheme === "dark"
//                 ? "rgba(128,0,128,0.5)"
//                 : "rgba(210,169,210,0.5)"
//             }
//           />
//         ))}
//       </MapView>
//       <NearbyLocation {...mapState.nearbyLocation} />
//     </>
//   );
// }
