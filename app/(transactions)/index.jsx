import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React from "react";

const index = () => {
  return (
    <SafeAreaView>
      <ScrollView className="">
        <View className="w-full  min-h-[90vh] px-4 my-6 mt-0">
          <Text>Transactions</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
