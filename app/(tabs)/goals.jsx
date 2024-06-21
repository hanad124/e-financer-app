import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CirclePlus } from "lucide-react-native";
import { router } from "expo-router";

import { useNavigation } from "@react-navigation/native"; // assuming you are using react-navigation
import { LinearGradient } from "expo-linear-gradient";
import { useGoalsStore } from "../../store/goals";

const Goals = () => {
  const navigation = useNavigation();
  const { goals, getGoals } = useGoalsStore();
  const animatedValues = useRef(
    goals?.goals?.map(() => new Animated.Value(0)) || []
  ).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      goals?.goals?.forEach((goal, index) => {
        const progressValue = (goal?.savedAmount / goal?.amount) * 100;
        Animated.timing(animatedValues[index], {
          toValue: progressValue,
          duration: 500,
          useNativeDriver: false,
        }).start();
      });
      isFirstRender.current = false;
    }
  }, [goals, animatedValues]);

  useEffect(() => {
    getGoals();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView className=" bg-white h-screen">
        <View className="mt-10">
          {/* header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft className="text-black " size={24} />
            </TouchableOpacity>
            <Text
              style={{
                color: "black",
                fontSize: 24,
                marginLeft: 80,
              }}
            >
              Goals
            </Text>
          </View>

          {/* goals */}
          <View className="flex flex-col items-center justify-center mx-4">
            <View className="flex flex-col items-center justify-center mt-10 w-full">
              {goals?.goals?.map((goal, index) => {
                const progressWidth = animatedValues[index]?.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                });

                return (
                  <View
                    key={goal.id}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      marginVertical: 10,
                    }}
                  >
                    <LinearGradient
                      colors={["rgba(62,101,252,1)", "rgba(153,16,180,1)"]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 10,
                        padding: 10,
                        paddingHorizontal: 30,
                        paddingVertical: 30,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View>
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            {goal?.name}
                          </Text>
                        </View>
                        <View>
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            Saved
                          </Text>
                          <Text style={{ color: "white" }}>
                            $ {goal?.savedAmount}
                          </Text>
                        </View>
                        <View>
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            Target
                          </Text>
                          <Text style={{ color: "white" }}>
                            $ {goal?.amount}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        {/* progress bar with percentage */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              width: "80%",
                              backgroundColor: "#E0E0E0",
                              height: 10,
                              borderRadius: 20,
                            }}
                          >
                            <Animated.View
                              style={{
                                width: progressWidth,
                                height: 10,
                                backgroundColor: "#FF6D3F",
                                borderRadius: 20,
                              }}
                            />
                          </View>
                          <View>
                            <Text
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              {goals &&
                                (
                                  (goal?.savedAmount / goal?.amount) *
                                  100
                                )?.toFixed(0) + "%"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 
          add new goal button
           */}
          <View className="flex flex-row items-center justify-center mt-10">
            <TouchableOpacity
              onPress={() => router.push("/(goals)/create-goal")}
              className="flex flex-row items-center space-x-2 justify-center  text-black rounded-full p-4"
            >
              <CirclePlus size={20} color={"black"} />
              <Text className="text-black">Add New Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Goals;
