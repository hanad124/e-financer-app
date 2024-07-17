import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { useTransactionsStore } from "../store/transactions";
import { deleteTransaction as DeleteTransactionApi } from "../apicalls/transactions";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { AuthContext } from "../context/authContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_HEIGHT = 70;
const WIDTH_CARD = SCREEN_WIDTH * 0.85;

const RecentTransactions = () => {
  const { transactions, isLoading, transactionDetails } =
    useTransactionsStore();
  const [transactionList, setTransactionList] = useState(
    transactions?.transactions ?? []
  );

  useEffect(() => {
    useTransactionsStore.getState().getTransactions();
  }, []);

  useEffect(() => {
    setTransactionList(transactions?.transactions ?? []);
  }, [transactions]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/transactions")}>
          <Text className="text-[16px] font-pregular">Recent Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/transactions")}>
          {/* <Link href={`/transactions`} style={{ textDecoration: "none" }}> */}
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
        {/* </Link> */}
      </View>
      <View className="flex flex-col justify-center items-center w-full  ">
        {transactions?.transactions
          ?.slice(0, 11)
          .reverse()
          .map((transaction) => (
            <View key={transaction?.id}>
              {
                <View
                  className="flex flex-row justify-between px-2 items-center w-full py-2 bg-primary/5 mt-3 rounded-lg"
                  key={transaction?.id}
                >
                  <TouchableOpacity
                    onPress={() => {
                      router.push(
                        `/transactions/single-transction/${transaction?.id}`
                      );

                      useTransactionsStore.setState({
                        transactionDetails: transaction,
                      });
                    }}
                    className=" flex-1"
                  >
                    <View className="flex flex-row gap-2 items-center">
                      {/* <Skeleton
                      animate={isLoading}
                      show={isLoading}
                      colorMode="light"
                      duration={500}
                      style={{ width: 30, height: 30 }}
                    >
                    </Skeleton> */}
                      <View className="bg-primary/10 p-2 rounded-lg">
                        <Image
                          source={{ uri: transaction.category?.icon }}
                          style={{ width: 30, height: 30 }}
                        />
                      </View>
                      <View className="flex flex-col gap-1">
                        {/* <Skeleton
                        animate={isLoading}
                        duration={500}
                        style={{ width: 100, height: 20 }}
                        colorMode="light"
                        show={isLoading}
                      >
                      </Skeleton> */}
                        <Text className="text-sm font-pmedium">
                          {transaction?.title}
                        </Text>
                        {/* <Skeleton
                        animate={isLoading}
                        duration={500}
                        style={{ width: 10, height: 20, marginTop: 2 }}
                        colorMode="light"
                        show={isLoading}
                      >
                      </Skeleton> */}
                        <Text className="text-[#348F9F] text-sm">
                          {transaction.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* <Skeleton
                    animate={isLoading}
                    duration={500}
                    style={{ width: 100, height: 20 }}
                    colorMode="light"
                    show={isLoading}
                  >
                  </Skeleton> */}
                  <Text
                    className={` font-pmedium
                     ${
                       transaction.type === "INCOME"
                         ? "text-green-500"
                         : "text-red-500"
                     }`}
                  >
                    {transaction.type === "INCOME" ? "$" : "- $"}
                    {transaction.amount}
                  </Text>
                </View>
              }
            </View>
          ))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
    color: "#68BAA6",
  },
  transactionsContainer: {},
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(105, 87, 231, 0.05)",
    alignContent: "center",
    padding: 10,
    borderRadius: 10,

    // ...SHADOW,
  },
  transactionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 35,
    height: 35,
    borderRadius: 5,
  },
  transactionDetails: {
    flexDirection: "column",
  },
  transactionTitle: {
    fontSize: 16,
  },
  transactionDescription: {
    fontSize: 12,
    color: "#348F9F",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  incomeAmount: {
    color: "#68BAA6",
  },
  expenseAmount: {
    color: "#FF5C5C",
  },
  iconContainer: {
    position: "absolute",
    height: ITEM_HEIGHT,
    right: 15,
    justifyContent: "center",
  },
});

export default RecentTransactions;
