// LocationCard.jsx
import React from "react";
import { View, Text } from "react-native";

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

export default LocationCard;
