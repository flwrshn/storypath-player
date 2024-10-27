// components/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the user data from AsyncStorage when the app starts
    const loadUserData = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem(
          "participant_username"
        );
        if (savedUsername) setUser(savedUsername);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Conditionally start watching the user's location based on project scoring
    const startWatchingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Update every 10 meters
          },
          (location) => {
            const userCoordinates = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setUserLocation(userCoordinates);
          }
        );
      } else {
        console.error("Permission to access location was denied");
      }
    };

    loadUserData();
    startWatchingLocation();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, userLocation }}>
      {children}
    </UserContext.Provider>
  );
};
