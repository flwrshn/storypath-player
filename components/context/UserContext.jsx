// components/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { getTrackings, createTracking } from "@/services/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitedLocations, setVisitedLocations] = useState(new Set());
  const [score, setScore] = useState(0); // User score

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

  // Fetch trackings and update state
  const fetchTrackings = async (username) => {
    try {
      const trackings = await getTrackings(username);
      const projectVisitedLocations = trackings.reduce((acc, tracking) => {
        const { project_id, location_id, points } = tracking;
        if (!acc[project_id]) {
          acc[project_id] = { locations: new Set(), points: 0 };
        }
        acc[project_id].locations.add(location_id);
        acc[project_id].points += points;
        return acc;
      }, {});
      setVisitedLocations(projectVisitedLocations);
    } catch (error) {
      console.error("Failed to fetch trackings:", error);
    }
  };

  // Update score and track location visits
  const addTracking = async (projectId, locationId, points) => {
    try {
      // Create a tracking entry in the API
      await createTracking({
        project_id: projectId,
        location_id: locationId,
        points,
      });

      // Update state
      setVisitedLocations((prev) => {
        const updated = { ...prev };
        if (!updated[projectId]) {
          updated[projectId] = { locations: new Set(), points: 0 };
        }
        updated[projectId].locations.add(locationId);
        updated[projectId].points += points;
        return updated;
      });

      setScore((prev) => prev + points);
    } catch (error) {
      console.error("Failed to add tracking:", error);
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
        setUser,
        loading,
        userLocation,
        visitedLocations,
        addTracking,
        score,
        fetchTrackings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
