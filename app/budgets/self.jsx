import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  ToastAndroid,
  Linking,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBudgetsStore } from "../../store/budgets";

import { ChevronLeft, Pen } from "lucide-react-native";

const Self = () => {
  const { budget } = useBudgetsStore();
  const navigation = useNavigation();

  console.log("budget detail:", budget);
  return (
    <>
      <SafeAreaView className="bg-white pt-5">
        <ScrollView className="bg-white">
          <View className="w-full  min-h-[90vh] px-4 my-6 mt-0  bg-white">
            <View className="flex flex-row items-center justify-between  my-2 mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="flex flex-row items-center"
              >
                <ChevronLeft size={18} color={"black"} />
                <Text className="text-[16px] text-gray-800 ml-2">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push(`/budgets/${budget.id}`);
                  useBudgetsStore.setState({
                    budget: budget,
                  });
                }}
                className="flex flex-row items-center"
              >
                <Pen size={18} color={"black"} />
                <Text className="text-[16px] text-gray-800 ml-2">Edit</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-5 px-3">
              <View>
                <View className="flex justify-center items-center">
                  <View className="bg-primary/10 p-2 rounded-full border border-primary">
                    <Image
                      source={{ uri: budget?.icon }}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text className=" capitalize font-pmedium text-lg text-[#303048]">
                    {budget?.name}
                  </Text>
                </View>
                <Text className="text-center capitalize font-psemibold mt-2 text-3xl text-[#303048]">
                  ${budget?.amount}
                </Text>
              </View>

              <View className="rounded-xl border  border-[#E3E3E5] mt-10 px-6 py-2 relative">
                {budget?.isEditted && (
                  <View className="bg-red-500/20 border border-orange-500 rounded-lg p-1 absolute -right-3 -top-4">
                    <Text className="text-orange-500 text-xs">Edited</Text>
                  </View>
                )}
                <View className="flex flex-row justify-between items-center">
                  <View>
                    <Text className="text-[#67677A]">Left to spend</Text>
                    <Text className="text-lg font-psemibold mt-1  text-[#303048]">
                      ${budget?.leftToSpend}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-[#67677A]">Budget</Text>
                    <Text className="text-lg font-psemibold mt-1  text-[#303048]">
                      ${budget?.amount}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: "#E3E3E5",
                    height: 6,
                    borderRadius: 20,
                  }}
                  className="my-2"
                >
                  <View
                    style={{
                      width: `${(budget?.leftToSpend / budget?.amount) * 100}%`,
                      height: 6,
                      backgroundColor: "#6957E7",
                      borderRadius: 20,
                    }}
                  />
                </View>
              </View>

              {budget?.transactions.length <= 0 ? (
                <Text className="mt-10 text-[#303048] text-lg text-center">
                  Not used yet (:
                </Text>
              ) : (
                <>
                  <Text className="mt-10 text-[#303048] text-lg">
                    Transacrions used this budget
                  </Text>

                  <View className="rounded-xl border  border-[#E3E3E5] mt-4 relative px-6 py-2">
                    {budget?.transactions.map((transaction, index) => (
                      <View
                        key={index}
                        className="flex flex-row justify-between items-center py-2 px-2 border-b-[#E3E3E5]"
                      >
                        <View
                          className={`w-full ${
                            index !== budget.transactions.length - 1
                              ? "border-b"
                              : "border-none"
                          } pb-2 border-[#E3E3E5]`}
                        >
                          <View className="flex flex-row items-center justify-between">
                            <Text className="text-lg text-[#303048] capitalize">
                              {transaction?.title}
                            </Text>
                            <Text className=" text-[#303048] capitalize">
                              {new Date(
                                transaction?.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Text>
                            <Text className="text-lg text-[#303048]">
                              ${transaction?.amount}
                            </Text>
                          </View>
                          <View>
                            <View
                              style={{
                                backgroundColor: "#E3E3E5",
                                height: 4,
                                borderRadius: 20,
                              }}
                              className="my-2"
                            >
                              <View
                                style={{
                                  width: `${
                                    (transaction?.amount / budget?.amount) * 100
                                  }%`,
                                  height: 4,
                                  backgroundColor: "#6957E7",
                                  borderRadius: 20,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Self;
