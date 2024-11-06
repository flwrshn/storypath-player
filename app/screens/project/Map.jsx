import { View, StyleSheet } from "react-native";
import React, { useContext } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { parseLocationPosition } from "@/utils/parseLocation";
import { UserContext } from "@/components/context/UserContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

const Map = ({ route }) => {
  const { userLocation, trackings } = useContext(UserContext);
  const { project, locations } = route.params;

  // Determine locations to display based on homescreen_display setting
  const displayLocationsList =
    project.homescreen_display === "Display all locations"
      ? locations
      : locations.filter((location) =>
          trackings.some(
            (tracking) =>
              tracking.project_id === project.id &&
              tracking.location_id === location.id
          )
        );

  const initialRegion = {
    latitude: userLocation ? userLocation.latitude : -27.4975, // Default to UQ St Lucia
    longitude: userLocation ? userLocation.longitude : 153.0137,
    latitudeDelta: 0.05, // Wider view
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {displayLocationsList.map((location) => {
          const coordinates = parseLocationPosition(location.location_position);

          // Check if the location is visited
          const isVisited = trackings.some(
            (tracking) =>
              tracking.user === user &&
              tracking.project_id === project.id &&
              tracking.location_id === location.id
          );

          return (
            <View key={location.id}>
              <Circle
                center={coordinates}
                radius={50}
                strokeWidth={2}
                strokeColor="purple"
                fillColor="rgba(140, 20, 252, 0.3)"
              />
              <Marker
                coordinate={coordinates}
                title={location.location_name}
                description={`${
                  isVisited ? "Visited" : "Not Visited"
                } - Points: ${location.score_points}`}
                pinColor="purple"
              />
            </View>
          );
        })}

        {/* Show only the user's location if no locations are displayed */}
        {displayLocationsList.length === 0 && userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

export default Map;
