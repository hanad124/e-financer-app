import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useTransactionsStore } from "../../store/transactions";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "expo-router";

const GroupedBars = () => {
  const { transactions } = useTransactionsStore();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Week");
  const [totalExpensePerWeek, setTotalExpensePerWeek] = useState(0);
  const [progress, setProgress] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);

  const totalExpenses = transactions?.totalExpense;
  const totalWeeklyExpense = transactions?.transactions?.totalWeeklyExpense;

  const progressValue = (totalWeeklyExpense / totalExpenses) * 100;

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

  const navigation = useNavigation();

  useEffect(() => {
    filterTransactions(selectedFilter);
    const fetchTransactions = async () => {
      await useTransactionsStore.getState().getTransactions();
    };
    fetchTransactions();
  }, [selectedFilter, transactions]);

  useEffect(() => {
    const now = dayjs();
    const filtered = transactions.transactions?.filter((t) =>
      dayjs(t.createdAt).isSame(now, "week")
    );

    const total = filtered
      ?.filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + t.amount, 0);

    setTotalExpensePerWeek(total);
  }, [filteredTransactions]);

  const filterTransactions = (filter) => {
    const now = dayjs();
    let filtered = transactions.transactions;

    switch (filter) {
      case "Today":
        filtered = filtered?.filter((t) =>
          dayjs(t.createdAt).isSame(now, "day")
        );
        break;
      case "Week":
        filtered = filtered?.filter((t) =>
          dayjs(t.createdAt).isSame(now, "week")
        );
        break;
      case "Month":
        filtered = filtered?.filter((t) =>
          dayjs(t.createdAt).isSame(now, "month")
        );
        break;
      case "Year":
        filtered = filtered?.filter((t) =>
          dayjs(t.createdAt).isSame(now, "year")
        );
        break;
      default:
        break;
    }

    setFilteredTransactions(filtered);
  };

  // const calculateBarData = () => {
  //   let labels;
  //   let data;
  //   const now = dayjs();

  //   if (selectedFilter === "Month" || selectedFilter === "Year") {
  //     labels = [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec",
  //     ];
  //     data = labels.map((label, index) => ({
  //       label,
  //       INCOME: 0,
  //       EXPENSE: 0,
  //     }));

  //     filteredTransactions?.forEach((transaction) => {
  //       const month = dayjs(transaction.createdAt).month();
  //       data[month][transaction.type] += transaction.amount;
  //     });
  //   } else {
  //     labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //     data = labels.map((label, index) => ({
  //       label,
  //       INCOME: 0,
  //       EXPENSE: 0,
  //     }));

  //     filteredTransactions?.forEach((transaction) => {
  //       const day = dayjs(transaction.createdAt).day();
  //       data[day][transaction.type] += transaction.amount;
  //     });
  //   }

  //   const barData = data.flatMap((d) => [
  //     {
  //       value: d.INCOME,
  //       label: d.label,
  //       frontColor: "#D3D8DB", // Green for INCOME
  //       topLabelComponent: () =>
  //         d.INCOME > 0 ? (
  //           <Text
  //             style={{
  //               color: "#D3D8DB",
  //               fontSize: 12,
  //               marginBottom: -4,
  //               marginRight: -20,
  //               width: 50,
  //               height: 20,
  //             }}
  //           >
  //             ${d.INCOME}
  //           </Text>
  //         ) : null,
  //     },
  //     {
  //       value: d.EXPENSE,
  //       label: d.label,
  //       frontColor: "#6957E7", // Red for EXPENSE
  //       topLabelComponent: () =>
  //         d.EXPENSE > 0 ? (
  //           <Text
  //             style={{
  //               color: "#6957E7",
  //               fontSize: 12,
  //               marginBottom: -4,
  //               marginRight: -15,

  //               width: 50,
  //               height: 20,
  //             }}
  //           >
  //             ${d.EXPENSE}
  //           </Text>
  //         ) : null,
  //     },
  //   ]);

  //   return barData;
  // };

  const calculateBarData = () => {
    let labels;
    let data;
    const now = dayjs();

    if (selectedFilter === "Month" || selectedFilter === "Year") {
      labels = [
        "Jan '23",
        "Feb '23",
        "Mar '23",
        "Apr '23",
        "May '23",
        "Jun '23",
        "Jul '23",
        "Aug '23",
        "Sep '23",
        "Oct '23",
        "Nov '23",
        "Dec '23",
      ];
      data = labels.map((label, index) => ({
        label,
        INCOME: 0,
        EXPENSE: 0,
      }));

      filteredTransactions?.forEach((transaction) => {
        const month = dayjs(transaction.createdAt).month();
        data[month][transaction.type] += transaction.amount;
      });
    } else {
      labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      data = labels.map((label, index) => ({
        label,
        INCOME: 0,
        EXPENSE: 0,
      }));

      filteredTransactions?.forEach((transaction) => {
        const day = dayjs(transaction.createdAt).day();
        data[day][transaction.type] += transaction.amount;
      });
    }

    const barData = data.flatMap((d) => [
      {
        value: d.INCOME,
        label: d.label,
        frontColor: "#D3D8DB", // Green for INCOME
        topLabelComponent: () =>
          d.INCOME > 0 ? (
            <Text
              style={{
                color: "#D3D8DB",
                fontSize: 12,
                marginBottom: -4,
                marginRight: -20,
                width: 50,
                height: 20,
              }}
            >
              ${d.INCOME}
            </Text>
          ) : null,
      },
      {
        value: d.EXPENSE,
        label: d.label,
        frontColor: "#6957E7", // Red for EXPENSE
        topLabelComponent: () =>
          d.EXPENSE > 0 ? (
            <Text
              style={{
                color: "#6957E7",
                fontSize: 12,
                marginBottom: -4,
                marginRight: -15,
                width: 50,
                height: 20,
              }}
            >
              ${d.EXPENSE}
            </Text>
          ) : null,
      },
    ]);

    return barData;
  };
  return (
    <SafeAreaView>
      <ScrollView className=" bg-white">
        <View style={{ marginTop: 20 }}>
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
              Statistics
            </Text>
          </View>
          {/* Total Expense per week banner */}
          <View
            style={{
              backgroundColor: "#6957E7",
              padding: 8,
              paddingHorizontal: 25,
              borderRadius: 15,
              marginHorizontal: 20,
              marginTop: 30,
            }}
          >
            <Text
              style={{
                color: "white",
                // fontFamily: "pmedium",
                fontSize: 19,
                textAlign: "center",
              }}
            >
              Total Expense
            </Text>
            <Text
              style={{
                color: "white",
                // fontFamily: "pregular",
                fontSize: 15,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              $ {totalExpensePerWeek} / {totalExpenses} per Week
            </Text>

            {/* 
            progress bar
             */}
            <View
              style={{
                backgroundColor: "#D3D8DB",
                borderRadius: 10,
                height: 10,
                marginTop: 10,
                width: "100%",
              }}
              className="mb-2"
            >
              <View
                style={{
                  width: `${progressValue}%`,
                  backgroundColor: "#68BAA6",
                  height: 10,
                  borderRadius: 10,
                }}
              />
            </View>
          </View>
          <View style={styles.filtersContainer}>
            {["Today", "Week", "Month", "Year"].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={{
                  backgroundColor:
                    selectedFilter === filter ? "#6957E7" : "#EEF9FC",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  margin: 8,
                }}
              >
                <Text
                  style={{
                    color: selectedFilter === filter ? "white" : "black",
                    // fontFamily: "pmedium",
                  }}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={styles.container}
            className="shadow-md border-[1px] border-slate-200"
          >
            <View style={styles.chartContainer}>
              <BarChart
                key={selectedFilter} // Force re-render on filter change
                data={calculateBarData()}
                barWidth={26}
                height={250}
                spacing={14}
                roundedTop
                roundedBottom
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                hideYAxisText
                xAxisLabelTextStyle={{ fontSize: 10, rotate: 45 }}
                yAxis={false}
                noOfSections={3}
                maxValue={450}
                width={360}
              />
            </View>
          </View>
          {/* // Spending details */}
          <View className="m-4">
            <Text className="text-black font-pmedium text-lg mt-2">
              Spending details
            </Text>
            <View className="flex flex-col justify-center items-center w-full  ">
              {transactions.transactions
                ?.slice(0, 11)
                .reverse()
                .map((transaction) => (
                  <View key={transaction?.id}>
                    {
                      <View
                        className="flex flex-row justify-between px-2 items-center w-full py-2 bg-primary/5 mt-3 rounded-lg"
                        key={transaction?.id}
                      >
                        <View className="flex flex-row gap-2 items-center">
                          <View className="bg-white/60 p-1 rounded-lg">
                            <Image
                              source={{ uri: transaction.category?.icon }}
                              style={{ width: 30, height: 30 }}
                            />
                          </View>
                          <View>
                            <Text className="text-black font-pmedium">
                              {transaction.title}
                            </Text>
                            <Text className="text-[#348F9F]  text-sm">
                              {transaction.description}
                            </Text>
                          </View>
                        </View>
                        <Text
                          className={
                            transaction.type === "INCOME"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {transaction.type === "INCOME" ? "$" : "- $"}
                          {transaction.amount}
                        </Text>
                      </View>
                    }
                  </View>
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    overflow: "hidden",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 20,
    marginTop: 10,
  },
  chartContainer: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    // paddingBottom: 10,
  },
});

export default GroupedBars;
