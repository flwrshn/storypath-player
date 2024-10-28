// app/_layout.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
import { LocationProvider } from "../components/context/LocationContext";
import { UserProvider } from "../components/context/UserContext";

// Create the navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Project-specific Tab Navigator
function ProjectTabNavigator({ route }) {
  const { project } = route.params;

  return (
    <LocationProvider>
      <Tab.Navigator initialRouteName="ProjectHome">
        <Tab.Screen
          name="Project Home"
          component={ProjectHome}
          initialParams={{ project }}
        />
        <Tab.Screen name="Map" component={Map} initialParams={{ project }} />
        <Tab.Screen
          name="QR Scanner"
          component={QRScanner}
          initialParams={{ project }}
        />
      </Tab.Navigator>
    </LocationProvider>
  );
}

// Stack Navigator for the Project List and Details
function ProjectStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProjectList">
      <Stack.Screen name="Project List" component={ProjectList} />
      <Stack.Screen name="Project Details" component={ProjectTabNavigator} />
      <Stack.Screen name="LocationDetail" component={LocationDetail} />
      <Stack.Screen name="VisitedLocations" component={VisitedLocations} />
    </Stack.Navigator>
  );
}

// Drawer Navigator for broader navigation
export default function AppLayout() {
  return (
    <UserProvider>
      <Drawer.Navigator initialRouteName="Home">
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
