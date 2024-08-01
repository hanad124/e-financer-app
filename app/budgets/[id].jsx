import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  Animated,
  Image,
  //   styleSheet
  StyleSheet,
  ToastAndroid,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, router } from "expo-router";
import { useForm, Controller, set } from "react-hook-form";
import { number, z } from "zod";
import { RadioButton } from "react-native-paper";

import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ChevronLeft } from "lucide-react-native";

import { updateBudget as updateBudgetData } from "../../apicalls/budgets";
import { useBudgetsStore } from "../../store/budgets";
import { useCategoriesStore } from "../../store/categories";

// schema [name, amount, description, icon]
const schema = z.object({
  name: z.string().nonempty("Name is required").min(3, "Name is too short"),
  amount: z.number().positive().int().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const updateBudget = () => {
  const navigation = useNavigation();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seatchIcon, setSearchIcon] = useState("");
  const [filteredIcons, setFilteredIcons] = useState([]);

  const { budgetId, budget } = useBudgetsStore();
  console.log("BUDGET::", budget);

  const icons = useCategoriesStore((state) => state.icons);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset(budget);
    setValue("amount", Number(budget?.amount));
    setSelectedIcon(budget?.icon);
  }, [budget, setValue, reset]);


  //   track errors
  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  const onSubmit = async (data) => {
    data.icon = selectedIcon;
    console.log("data", data);
    setLoading(true);
    try {
      const response = await updateBudgetData(budgetId, data);
      console.log("budget response", response?.data?.message);
      // if (response?.data?.status === 200) {
      Alert.alert(response?.data?.message);
      setLoading(false);
      reset();
      useBudgetsStore.getState().getBudgets();
      router.push("/budgets");
      // }
    } catch (error) {
      console.log(error);
      Alert.alert(response?.data?.message);
    }
  };

  // search icons
  const searchIcon = (text) => {
    setSearchIcon(text);
    const filteredIcons = icons.filter((icon) =>
      icon?.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredIcons(filteredIcons);
    console.log("filtered icons", filteredIcons);
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="h-screen">
        <View className="w-full  min-h-[90vh] px-4 mt-10  bg-white">
          {/* header */}
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <ChevronLeft className="text-black " size={18} />

              <Text
                style={{
                  color: "black",
                  fontSize: 15,
                  textAlign: "center",
                }}
                className="text-center ml-10 font-pmedium"
              >
                Update budget
              </Text>
            </TouchableOpacity>
          </View>

          {/* ===== form ====== */}
          {/* name */}
          <View className="mt-5">
            <Text className="text-black">Name</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[6px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Budget Name"
                />
              )}
              name="name"
              defaultValue=""
            />
            {errors.name && (
              <Text style={{ color: "red" }}>{errors.name.message}</Text>
            )}
          </View>
          {/* amount */}
          <View className="mt-4">
            <Text className="text-sm font-pregular text-gray-800">Amount</Text>
            <Controller
              control={control}
              name="amount"
              rules={{ required: "Amount is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType="numeric"
                  style={{ padding: 10 }}
                  className="border-[1px] border-slate-400  rounded-lg shadow py-[6px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const numberValue = parseFloat(text) || 0; // Handle non-numeric input
                    onChange(numberValue);
                  }}
                  value={String(value)} // Ensure value is correctly handled
                  placeholder="Amount"
                />
              )}
            />
            {errors.amount && (
              <Text className="text-red-500">{errors.amount.message}</Text>
            )}
          </View>
          {/* description */}
          <View className="mt-5">
            <Text className="text-black">Description</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[6px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Description"
                />
              )}
              name="description"
              defaultValue=""
            />
            {errors.name && (
              <Text style={{ color: "red" }}>{errors.name.message}</Text>
            )}
          </View>

          {/* 
          search icons
           */}
          <View className="mt-5">
            <Text className="text-black">Search Icon</Text>
            <TextInput
              style={{
                padding: 10,
              }}
              className="border-[1px] border-slate-400  rounded-lg shadow py-[6px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
              onChangeText={(text) => searchIcon(text)}
              value={seatchIcon}
              placeholder="Search Icon"
            />
          </View>

          {/* 
          icons section
           */}
          <View className="mt-5">
            <Text className="text-black">Select Icon</Text>
            <View className="flex flex-wrap mt-2">
              <RadioButton.Group
                onValueChange={(value) => setSelectedIcon(value)}
                value={selectedIcon}
              >
                <View className="flex flex-row flex-wrap w-full space-x-2 min-w-full">
                  {filteredIcons.length > 0
                    ? filteredIcons?.map((icon) => (
                        <TouchableOpacity
                          key={icon?.id}
                          onPress={() => setSelectedIcon(icon?.icon)}
                          className=""
                        >
                          <View
                            style={[
                              {
                                borderRadius: 8,
                                padding: 8,
                                margin: 4,
                              },
                            ]}
                            className={`flex flex-col items-center p-4 rounded-lg ${
                              selectedIcon === icon?.icon
                                ? "bg-primary"
                                : "bg-primary/5"
                            }`}
                          >
                            <Image
                              source={{ uri: icon?.icon }}
                              style={{
                                width: 35,
                                height: 35,
                              }}
                              tintColor={
                                selectedIcon === icon?.icon
                                  ? "white"
                                  : "#6957E7"
                              }
                            />
                          </View>
                        </TouchableOpacity>
                      ))
                    : icons?.map((icon) => (
                        <TouchableOpacity
                          key={icon?.id}
                          onPress={() => setSelectedIcon(icon?.icon)}
                          className=""
                        >
                          <View
                            style={[
                              {
                                borderRadius: 8,
                                padding: 8,
                                margin: 4,
                              },
                            ]}
                            className={`flex flex-col items-center p-4 rounded-lg ${
                              selectedIcon === icon?.icon
                                ? "bg-primary"
                                : "bg-primary/5"
                            }`}
                          >
                            <Image
                              source={{ uri: icon?.icon }}
                              style={{
                                width: 35,
                                height: 35,
                              }}
                              tintColor={
                                selectedIcon === icon?.icon
                                  ? "white"
                                  : "#6957E7"
                              }
                            />
                          </View>
                        </TouchableOpacity>
                      ))}
                </View>
              </RadioButton.Group>
            </View>
          </View>

          {/* submit button */}
          <View className="my-5" style={{ marginBottom: ".5rem" }}>
            <CustomButton
              text="Update Budget"
              handlePress={() => {
                handleSubmit(onSubmit)();
              }}
              isLoading={loading}
              containerStyles="mb-10"
              loadinState={"Updating budget..."}
            />
          </View>

          <View className="mt-16"></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default updateBudget;
