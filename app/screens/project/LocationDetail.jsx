import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { WebView } from "react-native-webview";

const LocationDetail = ({ route }) => {
  const { location } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{location.location_name}</Text>
      <Text style={styles.info}>Points: {location.score_points}</Text>
      {location.location_content ? (
        <WebView
          source={{ html: location.location_content }}
          style={{
            height: 400,
          }}
        />
      ) : null}
    </ScrollView>
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
