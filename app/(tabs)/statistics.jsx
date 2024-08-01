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
  FlatList,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useTransactionsStore } from "../../store/transactions";
import dayjs from "dayjs";
import {
  ArrowLeft,
  ChevronLeft,
  SlidersHorizontal,
  Download,
} from "lucide-react-native";
import { useNavigation, router } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const data = [
  { label: "All", value: "All" },
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
];

const GroupedBars = () => {
  const { transactions } = useTransactionsStore();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [selectedType, setSelectedType] = useState("All");
  const [totalExpensePerWeek, setTotalExpensePerWeek] = useState(0);
  const [progress, setProgress] = useState(0);
  const [spendingDetails, setSpendingDetails] = useState([]);

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Filter by type
        </Text>
      );
    }
    return null;
  };

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

    setSpendingDetails(transactions.transactions);
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
    let filtered = transactions?.transactions;

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

  // filter by type [INCOME, EXPENSE] as dropdown

  const calculateBarData = () => {
    let labels;
    let data;
    const now = dayjs();

    if (selectedFilter === "Month") {
      labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
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
    } else if (selectedFilter === "Year") {
      labels = [
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
        "2010",
        "2009",
        "2008",
        "2007",
        "2006",
        "2005",
        "2004",
        "2003",
        "2002",
        "2001",
        "2000",
      ];
      data = labels.map((label, index) => ({
        label,
        INCOME: 0,
        EXPENSE: 0,
      }));

      filteredTransactions?.forEach((transaction) => {
        const year = dayjs(transaction?.createdAt).year();
        const yearIndex = labels.indexOf(year.toString());
        if (yearIndex !== -1) {
          data[yearIndex][transaction?.type] += transaction?.amount;
        }
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
        frontColor: "#D3D8DB",
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
        frontColor: "#6957E7",
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

  const filterByType = () => {
    const filtered = transactions.transactions.filter(
      (transaction) => transaction.type === selectedType
    );
    if (selectedType === "INCOME") {
      setSpendingDetails(filtered);
    } else if (selectedType === "EXPENSE") {
      setSpendingDetails(filtered);
    } else {
      setSpendingDetails(transactions.transactions);
    }
  };

  useEffect(() => {
    filterByType();
  }, [selectedType]);

  const exportTransactions = async () => {
    const header = `
      <div style="display: flex; justify-content: space-between; align-items: center;
       padding: 20px; 
      background-color: #6957E7; color: white;">
        <div style="display: flex; gap: 15px; align-items: center;">
          <h1>e-Financer</h1>
        </div>  
        <h1>${
          selectedType.charAt(0).toUpperCase() +
          selectedType.slice(1).toLowerCase()
        } Transactions</h1>
        <p><strong>Date:</strong> ${dayjs().format("DD MMM YYYY")}</p>
      </div>
    `;

    const table = spendingDetails
      ?.map(
        (transaction) =>
          `<tr><td>${transaction.title}</td><td>${
            transaction.description
          }</td><td>${transaction.amount}</td><td>${
            transaction.type
          }</td><td>${dayjs(transaction.createdAt).format(
            "DD MMM YYYY"
          )}</td></tr>`
      )
      .join("");

    //  calculate total amount
    const totalAmount = spendingDetails.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );

    const html = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          ${header}
          <table>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
            ${table}
          </table>
          <div style="display: flex; justify-content: center;>
          <div style="display: flex; justify-content: flex-end; padding: 20px;
          background-color: #6957E7; color: white;
          padding: 20px;
          border-radius: 10px;
          width: 300px;
          
          ">
          <h2>Total: $${totalAmount}</h2>
          </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri: pdfUri } = await printToFileAsync({
        html: html,
        width: 612,
        height: 792,
        base64: false,
      });

      await shareAsync(pdfUri);
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className=" bg-white">
        <View style={{ marginTop: 20 }}>
          <View className="flex flex-row items-center mt-4 mx-4 justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft className="h-5 w-5 text-black" />
            </TouchableOpacity>
            <View className="">
              <Text className="text-black   font-pregular">Statistics</Text>
            </View>
            <View>
              <TouchableOpacity onPress={exportTransactions}>
                <Download className="text-black mr-2" size={20} />
              </TouchableOpacity>
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
                  borderRadius: 9,
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
              <ScrollView>
                {/* <BarChart
                  key={selectedFilter}
                  data={calculateBarData()}
                  barWidth={26}
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
                  width={360} // Adjust this width if needed, depending on the amount of data
                /> */}
                <BarChart
                  key={selectedFilter}
                  data={calculateBarData()}
                  barWidth={18}
                  height={200}
                  width={290}
                  minHeight={3}
                  barBorderRadius={3}
                  showGradient
                  // frontColor={transactionType === "Expense" ? "#dc2626" : "#4f46e5"}
                  // gradientColor={transactionType === "Expense" ? "#ea580c" : "#7c3aed"}
                  spacing={20}
                  noOfSections={4}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  xAxisLabelsVerticalShift={2}
                  xAxisLabelTextStyle={{ color: "gray" }}
                  yAxisTextStyle={{ color: "gray" }}
                  isAnimated
                  animationDuration={100}
                  // rulesColor={"#00000020"}
                  // backgroundColor={"white"}
                  // showGradient
                  // gradientColor={"blue"}
                  // barInnerComponent={() => (
                  //   <View style={{ backgroundColor: "pink", height: "100%" }} />
                  // )}
                  // showLine
                  // dashGap={0}
                  // dashWidth={0}
                />
              </ScrollView>
            </View>
          </View>
          {/* // Spending details */}
          <View className="m-4">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-black font-pmedium  mt-2">
                Top Spending
              </Text>
            </View>
            {/* 
           dropdown for filter by type [INCOME, EXPENSE]
          */}
            <View className="">
              <View className="mt-2">{renderLabel()}</View>
              <View className="border border-primary rounded-md mt-2 p-3">
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={data}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Select type" : "..."}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setValue(item.value);
                    setIsFocus(false);

                    // filter transactions by type
                    setSelectedType(item.value);
                  }}
                />
              </View>
            </View>

            <View className="flex flex-col justify-center items-center w-full mt-6  ">
              {spendingDetails?.length > 0 ? (
                spendingDetails
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
                            <View className="bg-primary/10 p-2 rounded-lg">
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
                          <View className="flex flex-col ">
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
                            <Text className="text-[#348F9F] text-sm">
                              {dayjs(transaction.createdAt).format("DD MMM")}
                            </Text>
                          </View>
                        </View>
                      }
                    </View>
                  ))
              ) : (
                <Text className="text-slate-400  text-lg py-10">
                  No transactions yet 🙌
                </Text>
              )}
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
    marginTop: 24,
  },
  chartContainer: {
    flex: 1,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    overflow: "hidden",
  },
});

export default GroupedBars;
