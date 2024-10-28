import { View, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { getDistance } from "geolib";
import MapView, { Circle, Marker } from "react-native-maps";
import { parseLocationPosition } from "@/utils/parseLocation";
import { UserContext } from "@/components/context/UserContext";
import { LocationContext } from "@/components/context/LocationContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

const Map = () => {
  const { userLocation } = useContext(UserContext);
  const { locations } = useContext(LocationContext);

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
        {locations.map((location) => {
          if (location.location_position) {
            const coordinates = parseLocationPosition(
              location.location_position
            );

            return (
              <View key={location.id}>
                {/* Circle around the location */}
                <Circle
                  center={coordinates}
                  radius={100}
                  strokeWidth={2}
                  strokeColor="red"
                  fillColor="rgba(255,0,0,0.3)"
                />
                {/* Marker for the location */}
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
        })}
      </MapView>
    </View>
  );
};

export default Map;
