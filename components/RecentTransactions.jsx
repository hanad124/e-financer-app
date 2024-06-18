import { View, Text, Image } from "react-native";
import React from "react";
import { useTransactionsStore } from "../store/transactions";

const RecentTransactions = () => {
  const { transactions } = useTransactionsStore();

  console.log("transactions", transactions.transactions);
  return (
    <View>
      <View className="flex flex-row justify-between items-center mt-2">
        <Text className="text-lg font-bold">Recent Transactions</Text>
        <Text className="text-sm text-[#68BAA6]">View all</Text>
      </View>
      <View className="pt-3 flex flex-col gap-y-2">
        {transactions?.transactions?.map((transaction, index) => (
          <View
            key={index}
            className="flex flex-row items-center justify-between bg-primary/5 p-2 rounded-lg shadow-md"
          >
            <View className="flex flex-row items-center">
              <View className="bg-white/50 relative p-1 rounded-lg">
                <Image
                  source={{ uri: transaction.category.icon }}
                  className="w-7 h-7"
                  //   resizeMode="contain"
                />
              </View>
              <View className="flex flex-col ml-2">
                <Text className="text-sm ">{transaction.title}</Text>
                <Text className="text-xs text-[#348F9F]">
                  {transaction.description}
                </Text>
              </View>
            </View>
            <Text
              className={`text-sm font-bold ${
                transaction.type === "INCOME"
                  ? "text-[#68BAA6]"
                  : "text-[#FF5C5C]"
              }`}
            >
              {transaction.type === "credit" ? "+ " : "- "}${transaction.amount}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecentTransactions;
