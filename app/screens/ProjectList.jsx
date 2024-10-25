// app/screens/ProjectList.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPublishedProjects } from "@/services/api";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getPublishedProjects();
        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectPress = async (project) => {
    navigation.navigate("Project Details", { project });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-lg">Loading projects...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Project List</Text>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-3 mb-2 bg-white rounded-lg"
            onPress={() => handleProjectPress(item)}
          >
            <Text className="text-xl font-semibold">{item.title}</Text>
            <Text>Participants: {item.participantCount}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ProjectList;
