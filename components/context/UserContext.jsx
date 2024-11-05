import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { getTrackings } from "@/services/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackings, setTrackings] = useState([]);

  // Load the user data from AsyncStorage when the app starts
  const loadUserData = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem("participant_username");
      if (savedUsername) {
        setUser(savedUsername);
        await fetchTrackings(savedUsername);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trackings for the user
  const fetchTrackings = async (username) => {
    try {
      const trackings = await getTrackings(username);
      setTrackings(trackings);
    } catch (error) {
      console.error("Failed to fetch trackings:", error);
    }
  };

  // Function to get trackings by project_id
  const getTrackingsByProject = async (projectId) => {
    try {
      // Fetch the latest trackings for the user
      await fetchTrackings(user);

      // Filter trackings for the specific project
      const visitedTrackings = trackings.filter(
        (tracking) => tracking.project_id === projectId
      );

      const score = visitedTrackings.reduce(
        (total, tracking) => total + tracking.points,
        0
      );

      return { visitedTrackings, score };
    } catch (error) {
      console.error("Failed to get trackings by project:", error);
      return { visitedTrackings: [], score: 0 };
    }
  };

  // Add a new tracking and update state
  const addTracking = async (projectId, locationId, points) => {
    try {
      // Create tracking in the backend
      await createTracking({
        project_id: projectId,
        location_id: locationId,
        participant_username: user,
        points,
      });

      // Update local trackings by fetching the latest data
      await fetchTrackings(user);
      console.log("Tracking created and trackings updated.");
    } catch (error) {
      console.error("Failed to add tracking:", error);
    }
  };

  // Conditionally start watching the user's location
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

  // Initialize user data and location tracking
  useEffect(() => {
    const initializeUserContext = async () => {
      setLoading(true);
      await loadUserData();
      setLoading(false);
    };
    initializeUserContext();
  }, []);

  // Watch for changes in the user state to restart location tracking
  useEffect(() => {
    if (user) {
      startWatchingLocation(); // Restart location tracking when user changes
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        userLocation,
        trackings,
        getTrackingsByProject,
        addTracking,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
