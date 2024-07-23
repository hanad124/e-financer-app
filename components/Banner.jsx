import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
  Image,
} from "react-native";
import bacImage from "../assets/images/banner-img.png";
import uppIcon from "../assets/icons/up-icon.png";
import downIcon from "../assets/icons/down-icon.png";
import { useTransactionsStore } from "../store/transactions";
const Banner = () => {
  const [progress, setProgress] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);

  const { transactions } = useTransactionsStore();

  // const startMonthExpense = transactions?.startMonthExpense;
  // const endMonthExpense = transactions?.endMonthExpense;
  const totalBalance = transactions?.totalBalance;

  const totalExpense = transactions?.totalExpense;
  const totalIncome = transactions?.totalIncome;

  const progressPercentage = (totalIncome - totalExpense) / totalBalance;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress + 10 > 100 ? 100 : prevProgress + 10
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
      isFirstRender.current = false;
    }
  }, [progress, animatedValue]);

  const progressBarWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", `${progress}%`],
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={bacImage} style={styles.backgroundImage}>
        <Text style={styles.bannerText} className="text-white">
          Total Balance
        </Text>
        <Text
          style={styles.bannerText}
          className={`${
            transactions?.totalBalance < 0 ? "text-red-400" : "text-white"
          }`}
        >
          {
            // if expense has -1 remove the - sign and add $ sign
            transactions?.totalBalance < 0
              ? "- $" + Math.abs(transactions?.totalBalance)
              : "$" + transactions?.totalBalance
          }
        </Text>
        {/* <Text className="text-white text-start  text-sm">Monthly Expenses</Text>
        <View style={styles.progressBarBackground} className="mt-2">
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressBarWidth,
              },
            ]}
          />
        </View>
        <View className="flex flex-row justify-between mt-2">
          <Text className="text-white text-start text-sm ">
            {" "}
            <Text className="text-white text-start mt-2">$0</Text>
          </Text>
          <Text className="text-white text-right text-sm">
            {" "}
            <Text className="text-white text-start mt-2">$0</Text>
          </Text>
        </View> */}

        <View className="flex items-center flex-row justify-between mt-2">
          {/* income banner */}
          <View className="flex items-center bg-white/70 flex-row justify-center gap-2 mt-2 p-4 py-[2px] rounded-xl">
            <View className="bg-white rounded-full p-[7px]">
              <Image
                source={downIcon}
                style={{ width: 14, height: 14 }}
                resizeMode="contain"
              />
            </View>
            <View className="flex flex-col items-center">
              <Text className="text-black text-start  font-psemibold">
                Income
              </Text>
              <Text className="text-black text-start w-full  font-psemibold">
                $ {transactions?.totalIncome}
              </Text>
            </View>
          </View>
          {/* expense banner */}
          <View className="flex items-center bg-white/70 flex-row justify-center gap-2 mt-2 p-4 py-[2px] rounded-xl">
            <View className="bg-white rounded-full p-[7px]">
              <Image
                source={uppIcon}
                style={{ width: 14, height: 14 }}
                resizeMode="contain"
              />
            </View>
            <View className="flex flex-col items-center">
              <Text className="text-black text-start  font-psemibold">
                Expense
              </Text>
              <Text className="text-black text-left w-full  font-psemibold">
                $ {transactions?.totalExpense}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  bannerText: {
    fontSize: 18,
    fontWeight: "medium",
    // color: "#fff",
    textAlign: "center",
  },
  progressBarBackground: {
    height: 7,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#76c7c0",
    borderRadius: 10,
  },
  progressText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
  },
});

export default Banner;
