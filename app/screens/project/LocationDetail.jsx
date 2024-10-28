import React from "react";
import { View, Text, StyleSheet } from "react-native";

const LocationDetail = ({ route }) => {
  const { location } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{location.location_name}</Text>
      <Text style={styles.info}>Points: {location.score_points}</Text>
      <Text style={styles.info}>{location.description}</Text>
      {/* Add more location details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default LocationDetail;
