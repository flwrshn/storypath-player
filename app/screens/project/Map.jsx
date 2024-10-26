// app / screens / tabs / Map.jsx;
import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LocationContext } from "../../../components/context/LocationContext";

const Map = ({ route }) => {
  const { project } = route.params;
  const { locations } = useContext(LocationContext);
  // Locations has attributes

  const initialRegion = {
    latitude: -27.4975, // UQ St Lucia Campus coordinates
    longitude: 153.0137,
    latitudeDelta: 0.01, // Adjusted for campus-level view
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <Text className="text-lg">Project: {project.title}</Text>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
          title="UQ St Lucia Campus"
          description="University of Queensland, St Lucia Campus"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
