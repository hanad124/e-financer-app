import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router"; // Assuming Expo Router supports navigation links

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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_HEIGHT = 70;
const WIDTH_CARD = SCREEN_WIDTH * 0.85;

const SHADOW = {
  shadowColor: "black",
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.5,
  shadowRadius: 5,
};

const RecentTransactions = () => {
  const { transactions, deleteTransaction } = useTransactionsStore();
  const [transactionList, setTransactionList] = useState(
    transactions?.transactions ?? []
  );

  useEffect(() => {
    useTransactionsStore.getState().getTransactions();
  }, []);

  useEffect(() => {
    setTransactionList(transactions?.transactions ?? []);
  }, [transactions]);

  const handleRemoveTransaction = useCallback(
    (transaction) => {
      try {
        DeleteTransactionApi(transaction.id);
      } catch (error) {
        console.log(error);
      }

      setTransactionList((prev) =>
        prev.filter((item) => item.id !== transaction.id)
      );

      ToastAndroid.show("Transaction deleted", ToastAndroid.SHORT);
    },
    [deleteTransaction]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text className="text-lg font-pmedium">Recent Transactions</Text>
        {/* <Link href={`/transactions`} style={{ textDecoration: "none" }}> */}
        <Text style={styles.viewAllText}>View all</Text>
        {/* </Link> */}
      </View>
      <View className="flex flex-col ">
        {transactionList
          .slice(0, 11)
          .reverse()
          .map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onRemove={handleRemoveTransaction}
            />
          ))}
      </View>
    </GestureHandlerRootView>
  );
};

const TransactionItem = ({ transaction, onRemove }) => {
  const swipeTranslateX = useSharedValue(0);
  const pressed = useSharedValue(false);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  const marginVertical = useSharedValue(7);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onUpdate((event) => {
      if (event.translationX < 0) {
        swipeTranslateX.value = event.translationX;
      }
    })
    .onFinalize(() => {
      const isShouldDismiss = swipeTranslateX.value < -SCREEN_WIDTH * 0.3;
      if (isShouldDismiss) {
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        swipeTranslateX.value = withTiming(
          -SCREEN_WIDTH,
          undefined,
          (isDone) => {
            if (isDone) {
              runOnJS(onRemove)(transaction);
            }
          }
        );
      } else {
        swipeTranslateX.value = withSpring(0);
      }
      pressed.value = false;
    });

  const transformStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: swipeTranslateX.value },
      { scale: withTiming(pressed.value ? 1.15 : 1) },
    ],
  }));

  const deleteIconOpacity = useAnimatedStyle(() => ({
    opacity: swipeTranslateX.value < 0 ? 1 : 0,
  }));

  const itemHeightStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginVertical: marginVertical.value,
  }));

  return (
    <TouchableOpacity
      onPress={() => {
        useTransactionsStore.setState({ transactionId: transaction.id });
        router.push(`/(transactions)/${transaction.id}`);
      }}
      style={{ width: "100%" }}
    >
      <GestureDetector gesture={pan}>
        <Animated.View style={itemHeightStyle}>
          <Animated.View style={[styles.iconContainer, deleteIconOpacity]}>
            <MaterialIcons name="delete" size={25} color="#FF165D" />
          </Animated.View>
          <Animated.View
            style={[styles.transactionContainer, transformStyle]}
            className="items-center"
          >
            <View style={styles.transactionContent}>
              <View className="bg-white/40 rounded-xl p-1">
                <Image
                  source={{ uri: transaction.category.icon }}
                  style={styles.transactionIcon}
                />
              </View>
              <View style={styles.transactionDetails} className="ml-2">
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                transaction.type === "INCOME"
                  ? styles.incomeAmount
                  : styles.expenseAmount,
              ]}
            >
              {transaction.type === "credit" ? "+ " : "- "}${transaction.amount}
            </Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </TouchableOpacity>
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

    ...SHADOW,
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
