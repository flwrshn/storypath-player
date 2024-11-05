import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { getTrackings, createTracking } from "@/services/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState({});
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [projectScore, setProjectScore] = useState(0);

  // Load the user data from AsyncStorage when the app starts
  const loadUserData = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem("participant_username");
      const savedProjectData = await AsyncStorage.getItem("projectData");

      if (savedUsername) {
        setUser(savedUsername);

        // Load project data from AsyncStorage if available
        if (savedProjectData) {
          setProjectData(JSON.parse(savedProjectData));
        } else {
          await fetchTrackings(savedUsername); // Fetch trackings for the user
        }
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

      // Organize trackings by project
      const organisedData = trackings.reduce((acc, tracking) => {
        const { project_id, location_id, points } = tracking;

        // Initialize project if it doesn't exist
        if (!acc[project_id]) {
          acc[project_id] = { locations: [], score: 0 };
        }

        // Add location if not already present
        if (!acc[project_id].locations.includes(location_id)) {
          acc[project_id].locations.push(location_id);
        }

        // Update score
        acc[project_id].score += points;

        return acc;
      }, {});

      setProjectData(organisedData); // Set the organised data
      await AsyncStorage.setItem("projectData", JSON.stringify(organisedData));
    } catch (error) {
      console.error("Failed to fetch trackings:", error);
    }
  };

  // Set the visited locations and score for a specific project
  const setProjectTrackings = (projectId) => {
    const project = projectData[projectId] || { locations: [], score: 0 };
    setVisitedLocations([...project.locations]);
    setProjectScore(project.score);
  };

  // Add a new tracking and update state
  const addTracking = async (projectId, locationId, points) => {
    try {
      // Create a tracking entry in the API
      await createTracking({
        project_id: projectId,
        location_id: locationId,
        points,
      });

      // Update state
      setProjectData((prev) => {
        const updated = { ...prev };

        if (!updated[projectId]) {
          updated[projectId] = { locations: [], score: 0 };
        }

        // Add location if not already present
        if (!updated[projectId].locations.includes(locationId)) {
          updated[projectId].locations.push(locationId);
        }

        // Update score
        updated[projectId].score += points;

        return updated;
      });

      // Save updated project data to AsyncStorage
      await AsyncStorage.setItem("projectData", JSON.stringify(projectData));

      // Update the current project's visited locations and score
      setProjectTrackings(projectId);
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
        setUser,
        loading,
        userLocation,
        projectData,
        visitedLocations,
        projectScore,
        addTracking,
        fetchTrackings,
        setProjectTrackings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
