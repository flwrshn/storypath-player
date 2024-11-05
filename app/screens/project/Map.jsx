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

// TODO: if project homescreen display is "Display all locations" also display all the locations

const Map = ({ route }) => {
  const { userLocation, visitedLocations } = useContext(UserContext);
  const { project, locations } = route.params;

  const initialRegion = {
    latitude: userLocation ? userLocation.latitude : -27.4975, // Default to UQ St Lucia
    longitude: userLocation ? userLocation.longitude : 153.0137,
    latitudeDelta: 0.05, // Wider view
    longitudeDelta: 0.05,
  };

  const visitedLocationsList = locations.filter((location) =>
    visitedLocations[project.id]?.locations.has(location.id)
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {visitedLocationsList.length > 0
          ? // Map over visited locations
            visitedLocationsList.map((location) => {
              if (location.location_position) {
                const coordinates = parseLocationPosition(
                  location.location_position
                );

                return (
                  <View key={location.id}>
                    <Circle
                      center={coordinates}
                      radius={50}
                      strokeWidth={2}
                      strokeColor="purple"
                      fillColor="rgba(140, 20, 252,0.3)"
                    />
                    <Marker
                      coordinate={coordinates}
                      title={location.location_name}
                      description={`Points: ${location.score_points}`}
                      pinColor="red"
                    />
                  </View>
                );
              }
              return null;
            })
          : // Show only the user's location if no locations are visited
            userLocation && (
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
