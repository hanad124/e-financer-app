import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, router } from "expo-router";
import { getToken } from "../../utils/storage"; // Import your token storage functions

const AuthLayout = () => {
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      console.log("token", token);
      if (token) {
        // Redirect to home screen or dashboard if user is already authenticated
        router.push("/home");
      } else {
        router.push("/auth/sign-in");
      }
    };
    checkAuth();
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
