import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Avatar from "../../components/Avatar";
import Banner from "../../components/Banner";
import TopSpendings from "../../components/TopSpendings";
import RecentTransactions from "../../components/RecentTransactions";

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView className="">
        <View className="w-full  min-h-[90vh] px-4 my-6 mt-6">
          <Avatar />
          <Banner />
          <TopSpendings />
          <RecentTransactions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
