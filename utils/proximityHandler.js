// app/utils/proximityHandler.js
import { Alert } from "react-native";

export const handleLocationProximity = (location, navigate) => {
  Alert.alert("Success!", `You are within ${location.location_name}.`, [
    {
      text: "Dismiss", // Option to do nothing and close the alert
      style: "cancel",
    },
    {
      text: "Learn More",
      onPress: () => navigate("Location Detail", { location }),
    },
  ]);
};
