import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { useGoalsStore } from "../../store/goals";

const Goals = () => {
  const navigation = useNavigation();

  const { goals, getGoals } = useGoalsStore();
  const animatedValues = useRef(
    goals?.goals?.map(() => new Animated.Value(0))
  ).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      goals?.goals?.forEach((goal, index) => {
        const progressValue = (goal.savedAmount / goal.amount) * 100;
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
    console.log("goals", goals);
    getGoals();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView className=" bg-white">
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
                // fontFamily: "pmedium",
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
                const progressWidth = animatedValues[index].interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                });

                return (
                  <View
                    key={goal.id}
                    className="flex flex-col w-full rounded-xl shadow-md p-5 mt-5  "
                    
                  >
                    <LinearGradient
                      colors={[
                        "rgba(62,101,252,1)",
                        "rgba(153,16,180,1)",
                        // "rgba(0,212,255,1)",
                      ]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        flex: 1,
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View className="flex flex-row items-center justify-between">
                        <View>
                          <Text className="text-white font-pmedium">
                            {goal.name}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-white font-pmedium">Saved</Text>
                          <Text className="text-white font-pmedium">
                            $ {goal.savedAmount}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-white  font-pmedium">
                            Target
                          </Text>
                          <Text className="text-white  font-pmedium">
                            $ {goal.amount}
                          </Text>
                        </View>
                      </View>
                      <View>
                        {/* progress bar with percentage */}
                        <View className="flex flex-row items-center justify-between mt-5">
                          <View className="w-5/6 bg-[#E0E0E0] h-2 rounded-full">
                            <Animated.View
                              style={{
                                width: progressWidth,
                                height: "100%",
                                backgroundColor: "#FF6D3F",
                                borderRadius: 20,
                              }}
                            ></Animated.View>
                          </View>
                          <View className="">
                            <Text className="text-white font-pmedium">
                              {((goal.savedAmount / goal.amount) * 100).toFixed(
                                0
                              )}
                              %
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  goalCard: {
    padding: 15,
    borderRadius: 10,
    background: `linear-gradient(124deg, rgba(215,64,95,1) 0%, rgba(64,217,39,1) 100%, rgba(153,16,180,1) 100%)`,
  },
});

export default Goals;
