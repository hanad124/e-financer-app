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
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTransactionsStore } from "../../store/transactions";
import {
  deleteTransaction,
  getTransactions,
} from "../../apicalls/transactions";
import LoadingOverlay from "../../components/LoadingOverlay";

import { ArrowLeft, Trash2, Pencil, Plus } from "lucide-react-native";

const index = () => {
  const [search, setSearch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const { transactions, setTransactionId } = useTransactionsStore();

  console.log("transactions", transactions?.transactions);

  //  search transactions
  useEffect(() => {
    if (search.length > 0) {
      const filtered = transactions?.transactions?.filter((transaction) =>
        transaction?.title?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions?.transactions);
    }
  }, [search]);

  // delete transaction
  const handleDelete = async (id) => {
    // 1st ask for confirmation
    Alert.alert("Delete Transaction", "Are you sure you want to delete?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          setLoading(true);
          const res = await deleteTransaction(id);
          console.log("delete res:::", res);
          useTransactionsStore.getState().getTransactions();
          // update the the filtered transactions and transactions
          setFilteredTransactions(
            transactions?.transactions.filter(
              (transaction) => transaction.id !== id
            )
          );

          alert("Transaction deleted successfully");
          setLoading(false);
        },
      },
    ]);
  };
  return (
    <>
      <LoadingOverlay loading={loading} />
      <SafeAreaView className="bg-white pt-5">
        <ScrollView className="bg-white">
          <View className="w-full  min-h-[90vh] px-4 my-6 mt-0  bg-white">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex flex-row items-center"
            >
              <ArrowLeft size={20} color={"black"} />
              <Text className="text-lg font-pmedium text-gray-800 ml-2">
                Back
              </Text>
            </TouchableOpacity>

            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-pmedium text-gray-800 ml-2 my-4">
                Transactions
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/create")}
                className="flex flex-row items-center justify-between"
              >
                <Plus size={16} color={"black"} />
                <Text className="text-black font-pmedium">Add Transaction</Text>
              </TouchableOpacity>
            </View>
            {/* 
            search input
          */}
            <View className="">
              <TextInput
                placeholder="Search Transactions"
                value={search}
                onChangeText={(text) => setSearch(text)}
                className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
              />
            </View>

            <View className="flex flex-col justify-center gap-y-2 items-center w-full mt-5">
              {filteredTransactions?.length > 0
                ? filteredTransactions?.map((transaction, index) => (
                    <View
                      key={index}
                      className="flex flex-row justify-between items-center w-full bg-primary/5 rounded-lg py-2"
                    >
                      <View className="flex flex-row items-center gap-2 px-4 rounded-lg">
                        <View className="bg-white rounded-xl p-1">
                          <Image
                            source={{ uri: transaction?.category?.icon }}
                            className="w-9 h-9 "
                            resizeMode="contain"
                          />
                        </View>
                        <View className="flex flex-col gap-[2px]">
                          <Text className="text-black font-pmedium">
                            {transaction.title}
                          </Text>
                          <Text className="text-[#348F9F]  text-sm">
                            {transaction.description}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View className="flex flex-row gap-2">
                          <TouchableOpacity
                            onPress={() => {
                              router.push("/transactions/[id]");
                              setTransactionId(transaction.id);
                            }}
                            className="p-2 bg-primary rounded-lg"
                          >
                            <Pencil size={16} color={"white"} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              handleDelete(transaction.id);
                            }}
                            className="p-2 bg-primary rounded-lg"
                          >
                            <Trash2 size={16} color={"white"} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                : transactions?.transactions?.map((transaction, index) => (
                    <View
                      key={index}
                      className="flex flex-row justify-between items-center w-full bg-primary/5 rounded-lg py-2"
                    >
                      <View className="flex flex-row items-center gap-2 px-4 rounded-lg">
                        <View className="bg-white rounded-xl p-1">
                          <Image
                            source={{ uri: transaction?.category?.icon }}
                            className="w-9 h-9 "
                            resizeMode="contain"
                          />
                        </View>
                        <View className="flex flex-col gap-[3px]">
                          <Text className="text-black font-pmedium">
                            {transaction.title}
                          </Text>
                          <Text className="text-[#348F9F]  text-sm">
                            {transaction.description}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View className="flex flex-row gap-2">
                          <TouchableOpacity
                            onPress={() => {
                              router.push("/categories/[id]");
                              setTransactionId(transaction.id);
                            }}
                            className="p-2 bg-primary rounded-lg"
                          >
                            <Pencil size={16} color={"white"} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            // disabled={
                            //   category?.transactionCount > 0 ? true : false
                            // }
                            onPress={() => {
                              // handleDelete(category.id);
                            }}
                            className="p-2 bg-primary rounded-lg"
                          >
                            <Trash2 size={16} color={"white"} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
  },
});
export default index;
