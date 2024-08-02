import { Text, View, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useContext } from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, AuthContext } from "../context/authContext";

import Logo from "../assets/Logo.png";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

  useEffect(() => {
    const routeHandler = async () => {
      if (!isLoading) {
        if (
          (isAuthenticated && pathname.startsWith("/auth")) ||
          (isAuthenticated && pathname === "/auth/sign-in")
        ) {
          router.push("/home");
          return null;
        }
        if (isAuthenticated && pathname === "/") {
          router.push("/home");
          return null;
        }
        if (!isAuthenticated && pathname === "/home") {
          router.push("/auth/sign-in");
          return null;
        } else {
          return;
        }
      }
    };

    routeHandler();
  }, [isLoading, isAuthenticated, pathname]);

  if (isLoading) {
    return (
      <View className="bg-primary h-screen flex items-center justify-center">
        <View className="flex flex-col items-center gap-y-4">
          <View className="flex flex-col itec gap-y-2">
            <Image source={Logo} className="w-20 h-20" />
            <Text className="text-white text-2xl font-bold">e-Financer</Text>
          </View>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        initialRouteName={isAuthenticated ? "/home" : "/sign-in"}
        screenOptions={{
          headerShown: false,
        }}
      >
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
          name="transactions/single-transction/[id]"
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
        <Stack.Screen
          name="budgets/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
