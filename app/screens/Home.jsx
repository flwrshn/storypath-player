// app/screens/Home.jsx
import { View, Text } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "@/components/context/UserContext";

const Home = ({}) => {
  const { user } = useContext(UserContext);

  return (
    <View>
      <Text>{user ? user : "Guest"}</Text>
      <Text className="font-bold">Home</Text>
    </View>
  );
};

export default Home;
