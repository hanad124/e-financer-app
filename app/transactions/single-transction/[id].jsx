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
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import dayjs from "dayjs";

import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Download } from "lucide-react-native";

;

import LoadingOverlay from "../../../components/LoadingOverlay";
import { useTransactionsStore } from "../../../store/transactions";

const TransactionDetail = () => {
  const { transactionDetails } = useTransactionsStore();


  return (
    <>
      <LoadingOverlay />
      <SafeAreaView className="bg-primary">
        <ScrollView className="bg-primary pt-5">
          <View className="flex flex-row items-center mt-4 mx-4 ">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft className="h-5 w-5 text-white" />
            </TouchableOpacity>
            <View className="ml-20">
              <Text className="text-white text-[16px] font-pregular">
                Transaction Details
              </Text>
            </View>
            <View></View>
          </View>
          <View className="w-full  min-h-[90vh] mt-12 p-4  rounded-t-3xl bg-white">
            <View className="flex flex-col items-center mt-4 mb-6">
              <View
                className={`border-2 border-primary p-4 rounded-full flex justify-center items-center`}
              >
                <Image
                  source={{
                    uri: transactionDetails?.category?.icon,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    maxHeight: 40,
                    maxWidth: 40,
                  }}
                />
              </View>
              <View
                className={`${
                  transactionDetails?.type === "INCOME"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                } mt-4 px-[10px] py-[2px] rounded-full`}
              >
                <Text
                  className={`capitalize font-pmedium ${
                    transactionDetails?.type === "INCOME"
                      ? "text-green-500"
                      : "text-red-500"
                  } text-sm tracking-wider`}
                >
                  {transactionDetails?.type}
                </Text>
              </View>
              <Text className="text-2xl font-pmedium mt-1">
                ${transactionDetails?.amount}
              </Text>
            </View>
            {/* 
            transcation details
            */}
            <View className="m-4">
              <Text className="font-pmedium">Transaction details</Text>

              <View className="flex flex-row items-center justify-between mt-2">
                <Text className="text-gray-500 font-pregular text-[14px]">
                  Type
                </Text>
                <Text
                  className={`capitalize ${
                    transactionDetails?.type === "INCOME"
                      ? "text-green-500"
                      : "text-red-500"
                  } text-[16px]`}
                >
                  {transactionDetails?.type}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between mt-2">
                <Text className="text-gray-500 font-pregular text-[14px]">
                  Name
                </Text>
                <Text
                  className={`capitalize text-black font-pregular text-[14px]`}
                >
                  {transactionDetails?.title}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between mt-2">
                <Text className="text-gray-500 font-pregular text-[14px]">
                  Time
                </Text>
                <Text
                  className={` text-black font-pregular text-[14px] uppercase`}
                >
                  {new Date(transactionDetails?.createdAt).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit", second: "2-digit" }
                  )}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between mt-2">
                <Text className="text-gray-500 font-pregular text-[14px]">
                  Date
                </Text>
                <Text
                  className={`capitalize text-black font-pregular text-[14px]`}
                >
                  {new Date(transactionDetails?.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}
                </Text>
              </View>
              <View className="border-y-[1px] border-gray-100 py-4 mt-4">
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-gray-500 font-pregular text-[14px]">
                    Spending
                  </Text>
                  <Text
                    className={`capitalize text-black font-pregular text-[14px]`}
                  >
                    $ {transactionDetails?.amount}
                  </Text>
                </View>
                <View className="flex flex-row items-center justify-between mt-2">
                  <Text className="text-gray-500 font-pregular text-[14px]">
                    Fee
                  </Text>
                  <Text
                    className={`capitalize text-black font-pregular text-[14px]`}
                  >
                    {0}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center justify-between mt-4">
                <Text className="text-gray-500 font-pregular text-[14px]">
                  Total
                </Text>
                <Text
                  className={`capitalize text-black  text-[15px] font-pmedium`}
                >
                  $ {transactionDetails?.amount}
                </Text>
              </View>

              {transactionDetails?.type === "EXPENSE" && (
                <View>
                  <Text className="text-gray-500 font-pregular mt-4 text-[14px]">
                    Receipts
                  </Text>

                  {transactionDetails?.receipt ? (
                    <View
                      className="mt-2 p-2 rounded-md border-[1px]  border-gray-100 border-dotted w-full flex flex-row flex-wrap"
                      style={{ borderStyle: "dashed" }}
                    >
                      {transactionDetails?.type === "EXPENSE" &&
                        transactionDetails?.receipt && (
                          // <Image
                          //   src={{
                          //     uri: transactionDetails?.receipt,
                          //   }}
                          //   style={{ width: 100, height: 100 }}
                          // />

                          <Image
                            source={{
                              uri: transactionDetails?.receipt,
                            }}
                            style={{
                              width: 50,
                              height: 50,
                              maxHeight: 50,
                              maxWidth: 50,
                              borderRadius: 6,
                            }}
                          />
                        )}
                    </View>
                  ) : (
                    <Text className="text-gray-500 text-center font-pregular mt-4 text-[14px]">
                      No Receipts
                    </Text>
                  )}
                </View>
              )}

              
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default TransactionDetail;
