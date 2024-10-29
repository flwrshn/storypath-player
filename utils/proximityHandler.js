// app/utils/proximityHandler.js
import { Alert } from "react-native";

export const handleLocationProximity = (location, navigate) => {
  Alert.alert(
    "Location Nearby!",
    `You are within 50 meters of ${location.location_name}.`,
    [
      {
        text: "Dismiss", // Option to do nothing and close the alert
        style: "cancel",
      },
      {
        text: "Learn More",
        onPress: () => navigate("Location Detail", { location }),
      },
    ]
  );
};
