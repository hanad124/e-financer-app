import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  ToastAndroid,
} from "react-native";

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller, set } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";
import { useCategoriesStore } from "../../store/categories";
import { useTransactionsStore } from "../../store/transactions";
import { RadioButton } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

import {
  createTransaction,
  getTransactionById,
  updateTransaction,
} from "../../apicalls/transactions";

import ExpenseIcon from "../../assets/icons/expense-icon.png";
import IncomeIcon from "../../assets/icons/income-icon.png";
import { router, useNavigation } from "expo-router";

import { ArrowLeft } from "lucide-react-native";

const TransactionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

const UpdateTransaction = () => {
  const { categories } = useCategoriesStore();

  const navigation = useNavigation();

  const transactionTypes = [
    {
      id: "INCOME",
      name: "Income",
      icon: IncomeIcon,
    },
    {
      id: "EXPENSE",
      name: "Expense",
      icon: ExpenseIcon,
    },
  ];
  const categoriesData = categories.categories;
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] =
    useState("EXPENSE");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    register,
  } = useForm({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      amount: 0,
    },
  });

  // set default values
  useEffect(() => {
    const fetchData = async () => {
      const transactionId = useTransactionsStore.getState().transactionId;

      if (transactionId) {
        const res = await getTransactionById(transactionId);
        const transaction = res.data?.transaction;

        console.log("transaction data:", transaction);

        setSelectedTransactionType(transaction?.type);
        setValue("title", transaction?.title);
        setValue("amount", Number(transaction?.amount));
        setValue("description", transaction?.description);
      }
    };

    fetchData();

    return () => {
      useTransactionsStore.setState({ transactionId: "" });
    };
  }, [useTransactionsStore.getState().transactionId]);

  useEffect(() => {
    setValue("type", selectedTransactionType);
    setValue("category", selectedCategory);
  }, [selectedTransactionType, selectedCategory]);

  // track errors
  useEffect(() => {
    console.log("errors", errors);

    // display exact error message in the alert
  }, [errors]);

  const onSubmit = async (data) => {
    console.log("data", data);

    setLoading(true);
    try {
      const res = await updateTransaction(
        useTransactionsStore.getState().transactionId,
        data
      );

      if (res.status === 200) {
        setLoading(false);
        reset();
        ToastAndroid.show(
          `${res.data.message || "Transaction updated successfully!"}`,
          ToastAndroid.SHORT
        );
        router.push("/home");
        await useTransactionsStore.getState().getTransactions();
      } else {
        ToastAndroid.show(`${res.data.message}`, ToastAndroid.SHORT);

        setLoading(false);
      }
    } catch (error) {
      console.error("API call error", error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="mt-10">
        <View className="flex flex-row items-center justify-between px-4 my-2 mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex flex-row items-center"
          >
            <ArrowLeft size={20} color={"black"} />
            <Text className="text-lg font-pmedium text-gray-800 ml-2">
              Back
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full  min-h-[90vh] px-4 my-6 mt-0">
          <View className="">
            <Text className="text-lg font-pmedium text-gray-800">
              Select Transaction Type
            </Text>
            <View className="flex flex-col gap-y-4 justify-start mt-1 ">
              {transactionTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles]}
                  onPress={() => setSelectedTransactionType(type.id)}
                  className="flex flex-row gap-x-4 items-center"
                >
                  <View
                    style={selectedTransactionType === type.id && styles}
                    className={`${
                      selectedTransactionType === type.id
                        ? "bg-primary"
                        : "bg-primary/5"
                    } flex flex-col items-center p-4 rounded-lg`}
                  >
                    <Image
                      source={type.icon}
                      style={[styles.categoryIcon]}
                      resizeMode="contain"
                      tintColor={
                        selectedTransactionType === type.id
                          ? "white"
                          : "#6957E7"
                      }
                      className=""
                    />
                  </View>
                  <Text style={styles.categoryText} className="font-pmedium">
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-sm font-pregular text-gray-800">Name</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{
                    padding: 10,
                  }}
                  className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Title"
                />
              )}
              name="title"
              rules={{ required: "Title is required" }}
            />
            {errors.title && (
              <Text className="text-red-500">{errors.title.message}</Text>
            )}
          </View>
          <View className="mt-4">
            <Text className="text-sm font-pregular text-gray-800">Amount</Text>

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType="numeric"
                  style={{
                    padding: 10,
                  }}
                  className="border-[1px] border-slate-400  rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const numberValue = parseFloat(text);
                    onChange(numberValue);
                  }}
                  value={value}
                  placeholder="Amount"
                />
              )}
              name="amount"
              rules={{ required: "Amount is required" }}
            />
            {errors.amount && (
              <Text className="text-red-500">{errors.amount.message}</Text>
            )}
          </View>

          <View className="my-4">
            <View className="">
              <Text className="text-sm font-pregular text-gray-800">
                Description
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={{
                      padding: 10,
                    }}
                    className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Description"
                  />
                )}
                name="description"
              />

              <View className="mt-5">
                <Text className="text-sm font-pmedium text-gray-800">
                  Choose category
                </Text>

                <RadioButton.Group
                  onValueChange={(newValue) => setSelectedCategory(newValue)}
                  value={selectedCategory}
                >
                  <View className="flex flex-row flex-wrap  relative w-full">
                    {categoriesData.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryContainer]}
                        onPress={() => setSelectedCategory(category.id)}
                        className="flex flex-col items-center"
                      >
                        <View
                          styles={
                            selectedCategory === category.id &&
                            styles.selectedCategory
                          }
                          className={`${
                            selectedCategory === category.id
                              ? "bg-primary"
                              : "bg-primary/5"
                          } flex flex-col items-center p-4 rounded-lg`}
                        >
                          <Image
                            source={{ uri: category.icons.icon }}
                            style={[styles.categoryIcon]}
                            resizeMode="contain"
                            tintColor={
                              selectedCategory === category.id
                                ? "white"
                                : "#6957E7"
                            }
                            className=""
                          />
                        </View>
                        <Text style={styles.categoryText}>{category.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </RadioButton.Group>
              </View>

              <CustomButton
                text="Update Transaction"
                handlePress={() => {
                  handleSubmit(onSubmit)();

                  if (errors.type) {
                    ToastAndroid.show(errors.type.message, ToastAndroid.SHORT);
                  }

                  if (errors.category) {
                    ToastAndroid.show(
                      errors.category.message,
                      ToastAndroid.SHORT
                    );
                  }
                }}
                containerStyles="w-full mt-6 "
                isLoading={loading}
                loadinState={"updating transaction..."}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    // flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  selectedCategory: {
    backgroundColor: "#d0e0fc",
  },
  categoryIcon: {
    width: 30,
    height: 30,
    // marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
  },
});

export default UpdateTransaction;
