// app/screens/tabs/ProjectHome.jsx
import { View, Text } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

const ProjectHome = () => {
  const route = useRoute();
  const { project } = route.params;

  return (
    <View>
      <Text>ProjectHome</Text>
      <Text className="text-lg mb-2">Description: {project.description}</Text>
      <Text className="text-lg mb-2">
        Published: {project.is_published ? "Yes" : "No"}
      </Text>
      <Text className="text-lg mb-2">
        Scoring: {project.participant_scoring}
      </Text>
      <Text className="text-lg mb-2">Instructions: {project.instructions}</Text>
      <Text className="text-lg mb-2">Initial Clue: {project.initial_clue}</Text>
      <Text className="text-lg mb-2">
        Homescreen Display: {project.homescreen_display}
      </Text>
    </View>
  );
};

export default ProjectHome;
