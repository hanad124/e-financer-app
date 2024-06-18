import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView className="">
        <View className="w-full  min-h-[90vh] px-4 my-6 mt-20">
          <Text className="text-3xl text-black font-bold text-center">
            Welcome Back
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
