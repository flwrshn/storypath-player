import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const VisitedLocations = ({ route }) => {
  const { visitedLocations } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visited Locations</Text>
      {visitedLocations.length > 0 ? (
        <FlatList
          data={visitedLocations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.locationCard}>
              <Text style={styles.locationName}>{item.location_name}</Text>
              <Text style={styles.locationInfo}>
                Points: {item.score_points}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text>No locations visited yet.</Text>
      )}
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
  locationCard: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationInfo: {
    fontSize: 16,
  },
});

export default VisitedLocations;
