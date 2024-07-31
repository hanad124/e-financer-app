import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import Avatar from "../../components/Avatar";
import Banner from "../../components/Banner";
import TopSpendings from "../../components/TopSpendings";
import RecentTransactions from "../../components/RecentTransactions";
import Budgets from "../../components/Budgets";

import { useAuthStore } from "../../store/auth";

const Home = () => {
  const { user } = useAuthStore();
  console.log("--- user ---", user);

  // useEffect(() => {
  //   if (!user) {
  //     alert("User not logged in");
  //   } else {
  //     // alert("User log÷ged in", user.res);
  //     // router.push("/auth/sign-in");
  //   }
  // });
  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="">
        <View className="w-full  min-h-[90vh] px-4 my-6">
          <Avatar />
          <Banner />
          <Budgets />
          <TopSpendings />
          <RecentTransactions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
