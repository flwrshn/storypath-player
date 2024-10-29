// app/_layout.tsx
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getLocations } from "@/services/api";
import { UserProvider } from "@/components/context/UserContext";

// Import screens
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import ProjectList from "./screens/ProjectList";
import About from "./screens/About";
import ProjectHome from "./screens/project/ProjectHome";
import Map from "./screens/project/Map";
import QRScanner from "./screens/project/QRScanner";
import LocationDetail from "./screens/project/LocationDetail";
import VisitedLocations from "./screens/project/VisitedLocations";

// Create the navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Project-specific Tab Navigator
function ProjectTabNavigator({ route }) {
  const { project } = route.params;
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch locations when tapping on project
  useEffect(() => {
    const fetchProjectLocations = async () => {
      try {
        const fetchedLocations = await getLocations(project.id);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectLocations();
  }, [project.id]);

  // Show loading indicator while fetching locations
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Tab.Navigator initialRouteName="ProjectHome">
      <Tab.Screen
        name="Project Home"
        component={ProjectHome}
        initialParams={{ project, locations }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        initialParams={{ project, locations }}
      />
      <Tab.Screen
        name="QR Scanner"
        component={QRScanner}
        initialParams={{ project, locations }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator for the Project List and Details
function ProjectStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProjectList">
      <Stack.Screen name="Project List" component={ProjectList} />
      <Stack.Screen name="Project Details" component={ProjectTabNavigator} />
      <Stack.Screen name="Visited Locations" component={VisitedLocations} />
      <Stack.Screen name="Location Detail" component={LocationDetail} />
    </Stack.Navigator>
  );
}

// Drawer Navigator for broader navigation
export default function AppLayout() {
  return (
    <UserProvider>
      <Drawer.Navigator initialRouteName="screens/Home">
        <Drawer.Screen name="screens/Home" component={Home} />
        <Drawer.Screen name="screens/Profile" component={Profile} />
        <Drawer.Screen
          name="screens/ProjectList"
          component={ProjectStackNavigator}
        />
        <Drawer.Screen name="screens/About" component={About} />
      </Drawer.Navigator>
    </UserProvider>
  );
}
