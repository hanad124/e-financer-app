import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { useAuthStore } from "../store/auth";
import { removeToken } from "../utils/storage";
import { useNavigation, router } from "expo-router";
import { AuthContext } from "../context/authContext";
import { LogOut } from "lucide-react-native";
import { Skeleton } from "moti/skeleton";

const Avatar = () => {
  const { user, isLoading } = useAuthStore();
  // const userData = user?.data;
  const [greeting, setGreeting] = useState("");
  const [userData, setUserData] = useState("");

  const { setIsAuthenticated } = useContext(AuthContext);

  console.log("isLoading", isLoading);

  const navigation = useNavigation();

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning ☀️");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon 🌞");
    } else {
      setGreeting("Good evening 🌜");
    }
  }, []);

  // get user data from AsyncStorage
  useEffect(() => {
    useAuthStore.getState().getUserInfo();
  }, []);

  // const handleLogout = async () => {
  //   try {
  //     Alert.alert(
  //       "Logout",
  //       "Are you sure you want to logout?",
  //       [
  //         {
  //           text: "Cancel",
  //           style: "cancel",
  //         },
  //         {
  //           text: "Logout",
  //           onPress: () => {
  //             removeToken();
  //             setIsAuthenticated(false);
  //             router.push("/auth/sign-in");
  //           },

  //           // remove goals from goals and filter goals
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View className="flex flex-row items-center gap-4">
        <TouchableOpacity
          onPress={() => {
            router.push("/profile");
          }}
        >
          <Skeleton
            animate={isLoading}
            show={isLoading}
            radius={"round"}
            colorMode="light"
            duration={500}
            style={styles.avatar}
          >
            <Image source={{ uri: user?.data?.avatar }} style={styles.avatar} />
          </Skeleton>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.name}>Hello, {user?.data?.name}</Text>
          <Text style={styles.email}>{greeting}</Text>
        </View>
      </View>
      {/* 
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Logout",
                onPress: () => {
                  removeToken();
                  setIsAuthenticated(false);
                  router.push("/auth/sign-in");
                },
              },
            ],
            { cancelable: false }
          );
        }}
      >
        <LogOut size={19} color={"black"} />
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Logout",
                onPress: () => {
                  removeToken();
                  setIsAuthenticated(false);
                  setTimeout(() => {
                    router.push("/auth/sign-in");
                  }, 0);
                },
              },
            ],
            { cancelable: false }
          );
        }}
      >
        <LogOut size={19} color={"black"} />
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
    borderColor: "#6957E7",
    borderWidth: 2,
    borderRadius: 50,
    padding: 4,
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
    fontSize: 17,
    fontWeight: "500",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
});

export default Avatar;
