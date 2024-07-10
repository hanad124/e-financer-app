import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CirclePlus } from "lucide-react-native";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useGoalsStore } from "../../store/goals";
import { getGoals } from "../../apicalls/goals";

const Goals = () => {
  const navigation = useNavigation();
  const { goals } = useGoalsStore();
  const [filter, setFilter] = useState("ongoing");
  const animatedValues = useRef([]).current;

  useEffect(() => {
    useGoalsStore.getState().getGoals();
  }, [goals]);

  useEffect(() => {
    if (goals?.goals) {
      goals.goals.forEach((goal, index) => {
        if (!animatedValues[index]) {
          animatedValues[index] = new Animated.Value(
            (goal?.savedAmount / goal?.amount) * 100
          );
        }
        const progressValue = (goal?.savedAmount / goal?.amount) * 100;
        Animated.timing(animatedValues[index], {
          toValue: progressValue,
          duration: 500,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [goals]);

  const filteredGoals = goals?.goals?.filter((goal) => {
    if (filter === "ongoing") {
      return goal.savedAmount < goal.amount;
    } else if (filter === "completed") {
      // return goal.savedAmount >= goal.amount;

      // remove the completed goals that thier acheivedData is greate then 24 hours ago until  the acheivedDate
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      return (
        goal.savedAmount >= goal.amount &&
        new Date(goal.achievedDate) > yesterday
      );
    }
    return true;
  });

  // handle getGoals
  const HandleGetGoals = async () => {
    try {
      const res = await getGoals();
      console.log("==== goals response ====", res);
    } catch (error) {
      console.error("API call error:::::", error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="bg-white h-screen">
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
              <ArrowLeft className="text-black" size={24} />
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

          {/* filter buttons */}
          <View className="flex flex-row justify-center mt-4">
            <TouchableOpacity
              onPress={() => setFilter("ongoing")}
              className={`px-4 py-2 rounded-full ${
                filter === "ongoing" ? "bg-primary" : "bg-gray-200"
              } mx-2`}
            >
              <Text
                className={`text-${filter === "ongoing" ? "white" : "black"}`}
              >
                Ongoing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("completed")}
              className={`px-4 py-2 rounded-full ${
                filter === "completed" ? "bg-primary" : "bg-gray-200"
              } mx-2`}
            >
              <Text
                className={`text-${filter === "completed" ? "white" : "black"}`}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {/* goals */}
          <View className="flex flex-col items-center justify-center">
            <View className="flex flex-col items-center justify-center mt-5 w-full">
              {filteredGoals?.map((goal, index) => {
                const progressPercentage =
                  (goal?.savedAmount / goal?.amount) * 100;
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
                      marginVertical: 7,
                    }}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(0, 124, 255, .8)",
                        "rgba(153, 0, 255, .6)",
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 15,
                        paddingHorizontal: 30,
                        paddingVertical: 25,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View className="flex flex-col items-center">
                          <View className="bg-white p-2 rounded-full">
                            <Image
                              source={{ uri: goal?.icon }}
                              tintColor={"#FF6D3F"}
                              style={{
                                width: 34,
                                height: 34,
                              }}
                            />
                          </View>
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            {goal?.name}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-white text-[18px]">Saved</Text>
                          <Text style={{ color: "white" }}>
                            $ {goal?.savedAmount}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-white text-[18px]">Target</Text>
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
                              height: 8,
                              borderRadius: 20,
                            }}
                          >
                            {/* <Animated.View
                              style={{
                                width: progressWidth,
                                height: 8,
                                backgroundColor: "#FF6D3F",
                                borderRadius: 20,
                              }}
                            /> */}

                            <Animated.View
                              style={{
                                width: `${
                                  (goal?.savedAmount / goal?.amount) * 100
                                }%`,
                                height: 8,
                                backgroundColor: "#FF6D3F",
                                borderRadius: 20,
                              }}
                            />
                          </View>
                          <View>
                            <Text
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              {progressPercentage.toFixed(0)}%
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

          {/* add new goal button */}
          <View className="flex flex-row items-center justify-center mt-5">
            <TouchableOpacity
              onPress={() => router.push("/(goals)/create-goal")}
              className="flex flex-row items-center space-x-2 justify-center text-black rounded-full p-4"
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
