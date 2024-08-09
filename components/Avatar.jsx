import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuthStore } from "../store/auth";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";

const Avatar = () => {
  const { user, isLoading, getUserInfo } = useAuthStore();
  const [greeting, setGreeting] = useState("");

  const updateGreeting = useCallback(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning ☀️");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon 🌞");
    } else {
      setGreeting("Good evening 🌜");
    }
  }, []);

  useEffect(() => {
    updateGreeting();
    getUserInfo();
  }, [updateGreeting, getUserInfo]);

  const handleProfilePress = () => {
    router.push("/profile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={handleProfilePress}>
          <Skeleton
            animate={isLoading}
            show={isLoading}
            radius="round"
            colorMode="light"
            duration={500}
            style={styles.avatar}
          >
            <Image source={{ uri: user?.data?.avatar }} style={styles.avatar} />
          </Skeleton>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.name}>Hello, {user?.data?.name}</Text>
          <Text style={styles.greeting}>{greeting}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderColor: "#6957E7",
    borderWidth: 2,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: "500",
  },
  greeting: {
    fontSize: 14,
    color: "gray",
  },
});

export default Avatar;
