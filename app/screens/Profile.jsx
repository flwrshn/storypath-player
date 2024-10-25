import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  Button,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get screen dimensions for styling
const { height } = Dimensions.get("window");

const Profile = () => {
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState("");

  // Load saved username and photo from AsyncStorage on mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem(
          "participant_username"
        );
        const savedPhoto = await AsyncStorage.getItem("participant_photo");

        if (savedUsername) setUsername(savedUsername);
        if (savedPhoto) setPhoto(savedPhoto);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  // Save username and photo to AsyncStorage
  const saveProfileData = async (newUsername, newPhoto) => {
    try {
      if (newUsername !== null) {
        await AsyncStorage.setItem("participant_username", newUsername);
      }
      if (newPhoto !== null) {
        await AsyncStorage.setItem("participant_photo", newPhoto);
      }
    } catch (error) {
      console.error("Failed to save profile data:", error);
    }
  };

  // Handle photo selection
  const handlePhotoChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedPhotoUri = result.assets[0].uri;
      setPhoto(selectedPhotoUri);
      await saveProfileData(null, selectedPhotoUri);
    }
  };

  // Handle username change
  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  // Save profile data when user presses 'Save'
  const handleSavePress = async () => {
    try {
      // Save the username and photo to AsyncStorage
      await saveProfileData(username, null);

      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  // Handle photo removal
  const handlePhotoRemove = async () => {
    setPhoto(null);
    await saveProfileData(null, "");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity onPress={handlePhotoChange}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      {photo && <Button title="Remove Photo" onPress={handlePhotoRemove} />}
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={handleUsernameChange}
      />
      <Button title="Save" onPress={handleSavePress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  photo: {
    width: "100%",
    height: height / 3,
    borderRadius: 10,
    marginBottom: 20,
  },
  photoPlaceholder: {
    width: "100%",
    height: height / 3,
    borderRadius: 10,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  photoText: {
    color: "#888",
    fontSize: 18,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default Profile;
