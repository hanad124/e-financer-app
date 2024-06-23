import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Slot, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)/reset-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />{" "}
        <Stack.Screen
          name="transactions/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="transactions/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(goals)/create-goal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="categories/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="categories/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="categories/create"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
