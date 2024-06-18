import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/auth";
import { removeToken } from "../utils/storage";

const Avatar = () => {
  const user = useAuthStore((state) => state.user);
  const userData = user?.data;
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <View
      style={styles.container}
      // onPress={() => {
      //   alert("Image loading...");
      //   removeToken();
      // }}
    >
      <TouchableOpacity
        onPress={() => {
          alert("Removing token...");
          removeToken();
        }}
      >
        <Image source={{ uri: userData?.avatar }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.name}>Hello {userData?.name}</Text>
        <Text style={styles.email}>{greeting}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Horizontal layout
    alignItems: "center", // Center items vertically
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50, // Circular avatar
  },
  textContainer: {
    marginLeft: 10, // Spacing between avatar and text
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
});

export default Avatar;
