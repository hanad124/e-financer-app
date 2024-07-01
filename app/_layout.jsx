import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useContext } from "react";
import { Slot, Stack, useRouter, usePathname } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, AuthContext } from "../context/authContext";

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
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  console.log("isAuthenticated", isAuthenticated);
  console.log("isLoading", isLoading);
  console.log("pathname", pathname);

  useEffect(() => {
    if (!isLoading) {
      if (
        (isAuthenticated && pathname.startsWith("/auth")) ||
        pathname === "/"
      ) {
        router.push("/home"); // Redirect to home page or any protected page if authenticated
      }
      if (!isAuthenticated && pathname.startsWith("/auth")) {
        router.push("/sign-in"); // Redirect to login page if not authenticated
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
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
          </>
        ) : (
          <>
            <Stack.Screen
              name="auth/login"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="auth/register"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="auth/reset-password"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="auth/verify-email"
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
