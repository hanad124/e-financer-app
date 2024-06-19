import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useAuthStore } from "../store/auth";
import { removeToken } from "../utils/storage";
import { useNavigation, router } from "expo-router";
import { getUser } from "../utils/storage";

import { LogOut } from "lucide-react-native";

const Avatar = () => {
  const user = useAuthStore((state) => state.user);
  // const userData = user?.data;
  const [greeting, setGreeting] = useState("");
  const [userData, setUserData] = useState("");

  console.log("userData", userData);

  const navigation = useNavigation();

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

  // get user data from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUserData(user);
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <View className="flex flex-row items-center gap-4">
        <Image source={{ uri: userData?.avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>Hello {userData?.name}</Text>
          <Text style={styles.email}>{greeting}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          removeToken();
          ToastAndroid.show("Logged out!", ToastAndroid.SHORT);
          router.push("/sign-in");
        }}
      >
        <LogOut size={24} color={"black"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Horizontal layout
    alignItems: "center", // Center items vertically
    padding: 10,
    justifyContent: "space-between",
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
