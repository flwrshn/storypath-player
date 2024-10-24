// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import screens
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import ProjectList from "./screens/ProjectList";
import About from "./screens/About";
import ProjectHome from "./screens/tabs/ProjectHome";
import Map from "./screens/tabs/Map";
import QRScanner from "./screens/tabs/QRScanner";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Project-specific Tab Navigator
function ProjectTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="ProjectHome">
      <Tab.Screen name="Project Home" component={ProjectHome} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="QR Scanner" component={QRScanner} />
    </Tab.Navigator>
  );
}

// Stack Navigator for the Project List and Details
function ProjectStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProjectList">
      <Stack.Screen name="Project List" component={ProjectList} />
      <Stack.Screen name="Project Details" component={ProjectTabNavigator} />
    </Stack.Navigator>
  );
}

// Drawer Navigator for broader navigation
export default function AppLayout() {
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  // Load the saved username from AsyncStorage
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem(
          "participant_username"
        );
        if (savedUsername) {
          setUsername(savedUsername);
          navigation.setOptions({ title: savedUsername });
        }
      } catch (error) {
        console.error("Failed to load username:", error);
      }
    };

    loadUsername();
  }, [navigation]);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitle: username ? `Welcome, ${username}` : "Welcome",
      }}
    >
      <Drawer.Screen name="screens/Home" component={Home} />
      <Drawer.Screen name="screens/Profile" component={Profile} />
      <Drawer.Screen
        name="screens/ProjectList"
        component={ProjectStackNavigator}
      />
      <Drawer.Screen name="screens/About" component={About} />
    </Drawer.Navigator>
  );
}
