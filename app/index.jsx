import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../assets/constants";
import CustomButton from "../components/CustomButton";
import SplashScreenView from "../SplashScreenView";

export default function Page() {
  const [isShowSplashSCreen, setIsShowSplashScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplashScreen(false);
    }, 3000);
  }, []);

  if (isShowSplashSCreen) {
    return <SplashScreenView />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className="" contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={images.onboardingImage1}
            resizeMode="contain"
            className="w-[5rem] h-[5rem]"
          />
          <View className="relative mt-10 w-full">
            <Text className="text-3xl text-black font-bold text-center">
              Get start to manage {"\n"} your Expenses
            </Text>
            <Text className="text text-gray-400 mt-4  text-center mx-10">
              Unlock Insights, Seize Control: Track Your Expenses, Transform
              Your Future
            </Text>
            <CustomButton
              text={"Get Started"}
              handlePress={() => router.push("/sign-in")}
              // handlePress={() => router.push("/home")}
              containerStyles="w-full mt-10"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#6957E7" />
    </SafeAreaView>
  );
}
