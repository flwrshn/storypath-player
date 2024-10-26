import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLayout from "./_layout";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer fallback={<Text>Loading...</Text>}>
        <AppLayout />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
