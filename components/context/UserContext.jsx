// components/context/LocationContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");

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
      }
    };

    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};