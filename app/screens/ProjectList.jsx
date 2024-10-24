// // app/screens/ProjectList.jsx
// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import getProjects from "@/services/api";

// const mockProjects = [
//   { id: 1, title: "Museum Tour" },
//   { id: 2, title: "City Treasure Hunt" },
//   { id: 3, title: "Virtual Nature Walk" },
// ];

// const ProjectList = () => {
//   const navigation = useNavigation();

//   const handleProjectPress = (project) => {
//     // Navigate to the ProjectTabNavigator with the selected project
//     navigation.navigate("Project Details", { project });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Project List</Text>
//       <FlatList
//         data={mockProjects}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.projectCard}
//             onPress={() => handleProjectPress(item)}
//           >
//             <Text style={styles.projectTitle}>{item.title}</Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   projectCard: {
//     padding: 12,
//     marginBottom: 8,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     elevation: 1,
//   },
//   projectTitle: {
//     fontSize: 18,
//   },
// });

// export default ProjectList;

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
import { getProjects } from "@/services/api"; // Import the getProjects function

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch projects from the API
    const fetchProjects = async () => {
      try {
        const projectData = await getProjects();
        setProjects(projectData); // Set the state with fetched projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    };

    fetchProjects();
  }, []);

  const handleProjectPress = (project) => {
    // Navigate to the ProjectTabNavigator with the selected project
    navigation.navigate("Project Details", { project });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project List</Text>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectCard}
            onPress={() => handleProjectPress(item)}
          >
            <Text style={styles.projectTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  projectCard: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  projectTitle: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProjectList;
