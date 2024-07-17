import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, CirclePlus, Trash } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useGoalsStore } from "../../store/goals";
import { deleteGoal, sendPushNotification } from "../../apicalls/goals";
import { savePushToken } from "../../apicalls/auth";

const Goals = () => {
  const navigation = useNavigation();
  const { goals } = useGoalsStore();
  const [filter, setFilter] = useState("ongoing");
  const animatedValues = useRef([]).current;
  const [pushToken, setPushToken] = useState(null);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  const responseListener = React.useRef();
  const notificationListener = React.useRef();

  // useEffect(() => {
  //   async function registerForPushNotificationsAsync() {
  //     let token;
  //     if (Device.isDevice) {
  //       const { status: existingStatus } =
  //         await Notifications.getPermissionsAsync();
  //       let finalStatus = existingStatus;
  //       if (existingStatus !== "granted") {
  //         const { status } = await Notifications.requestPermissionsAsync();

  //         finalStatus = status;
  //       }
  //       if (finalStatus !== "granted") {
  //         alert("Failed to get push token for push notification!");
  //         return;
  //       }
  //       // token = (await Notifications.getExpoPushTokenAsync()).data;
  //       const projectId =
  //         Constants?.expoConfig?.extra?.eas?.projectId ??
  //         Constants?.easConfig?.projectId;

  //       if (!projectId) {
  //         alert("Please set your project ID in app.json");
  //       }

  //       token = (
  //         await Notifications.getExpoPushTokenAsync({
  //           projectId,
  //         })
  //       ).data;

  //       setPushToken(token);
  //     } else {
  //       alert("Must use physical device for Push Notifications");
  //     }

  //     if (Platform.OS === "android") {
  //       Notifications.setNotificationChannelAsync("default", {
  //         name: "default",
  //         importance: Notifications.AndroidImportance.MAX,
  //         vibrationPattern: [0, 250, 250, 250],
  //         lightColor: "#FF231F7C",
  //       });
  //     }

  //     return token;
  //   }

  //   registerForPushNotificationsAsync();

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       const {
  //         notification: {
  //           request: {
  //             content: {
  //               data: { screen },
  //             },
  //           },
  //         },
  //       } = response;

  //       // When the user taps on the notification, this line checks if they //are suppose to be taken to a particular screen
  //       if (screen) {
  //         router.push(screen);
  //       }
  //     });

  //   // save push token
  //   if (pushToken) {
  //     // console.log("====pushToken====", pushToken);
  //     savePushToken({
  //       expoPushToken: pushToken,
  //     });
  //   }

  //   const subscription = Notifications.addNotificationReceivedListener(
  //     (notification) => {
  //       console.log("=== subscription notification ===", notification);
  //     }
  //   );

  //   useGoalsStore.getState().getGoals();
  //   return () => {
  //     subscription.remove();
  //   };
  // }, [goals]);

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
  const handleDeleteGoal = (id) => {
    //  confirm
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // delete goal
            deleteGoal(id).then(() => {
              console.log("Goal deleted successfully");

              // remove goals from goals and filter goals
              // setFilter(filteredGoals?.filter((goal) => goal.id !== id));
            });
          },

          // remove goals from goals and filter goals
        },
      ],
      { cancelable: false }
    );
  };

  // sendPushNotification
  const handleSendPushNotifi = async () => {
    try {
      await sendPushNotification();
    } catch (error) {
      console.error("Error sending push notification", error);
      Alert.alert("Error", "Failed to send push notification");
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="bg-white h-screen">
        <View className="mt-10">
          {/* header */}
          <View className="flex flex-row items-center mb-5 mx-6 justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft className="h-5 w-5 text-black" />
            </TouchableOpacity>
            <View className="">
              <Text className="text-black text-[16px]  font-pregular -ml-10">
                Goals
              </Text>
            </View>
            <View></View>
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
          <View className="flex flex-col  justify-center">
            {filter === "ongoing" && filteredGoals?.length === 0 ? (
              <View className="flex justify-start mx-16 pt-5">
                <Text className="text-black font-pregular my-10 text-center text-[13px]">
                  No ongoing goals found. Start saving to create new ones!
                </Text>
              </View>
            ) : filter === "ongoing" && filteredGoals?.length > 0 ? (
              <View className="flex justify-start mx-8 pt-5">
                <Text className="text-black font-pregular text-[15px]">
                  Ongoing goals
                </Text>
              </View>
            ) : null}
            {filter === "completed" && filteredGoals?.length === 0 ? (
              <View className="flex justify-start mx-16 pt-5">
                <Text className="text-black font-pregular my-10 text-center text-[13px]">
                  Only goals completed within the last 24hrs will appear here.
                </Text>
              </View>
            ) : filter === "completed" && filteredGoals?.length > 0 ? (
              <View className="flex justify-start mx-8 pt-5">
                <Text className="text-black font-pregular text-[15px]">
                  Completed goals
                </Text>
              </View>
            ) : null}
            <View className="flex flex-col items-center justify-center mt-5 w-full">
              {filteredGoals?.map((goal, index) => {
                const progressPercentage =
                  (goal?.savedAmount / goal?.amount) * 100;
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
                        paddingVertical: 35,
                      }}
                    >
                      <TouchableOpacity
                        className="bg-white/50  absolute flex justify-center items-center right-8 rounded-full p-[4px] top-2"
                        onPress={() => {
                          handleDeleteGoal(goal?.id);
                        }}
                      >
                        <Trash size={16} color={"red"} />
                      </TouchableOpacity>
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
