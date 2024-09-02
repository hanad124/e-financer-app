import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { RadioButton } from "react-native-paper";

import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../../components/CustomButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ChevronLeft } from "lucide-react-native";

import { createGoal } from "../../apicalls/goals";
import { useGoalsStore } from "../../store/goals";
import { useCategoriesStore } from "../../store/categories";

const schema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, "Name is too short")
    .max(15, "Name is too long"),
  amount: z
    .number()
    .min(1, "Amount is required")
    .max(1000000, "Amount is too high"),
  targetDate: z.date("Please enter a valid date "),
  icon: z.string().optional(),
});

const CreateGoal = () => {
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchIcon, setSearchIcon] = useState("");

  const icons = useCategoriesStore((state) => state.icons);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = useCallback((date) => {
    setSelectedDate(date);
    hideDatePicker();
  }, []);

  const minimumDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      data.icon = selectedIcon;
      setLoading(true);
      try {
        const response = await createGoal(data);
        Alert.alert(response?.data?.message);
        setLoading(false);
        reset();
        useGoalsStore.getState().getGoals();
        router.push("goals");
      } catch (error) {
        console.log(error);
        Alert.alert("An error occurred");
      }
    },
    [selectedIcon, reset]
  );

  const filteredIcons = useMemo(() => {
    return icons.filter((icon) =>
      icon?.name.toLowerCase().includes(searchIcon.toLowerCase())
    );
  }, [icons, searchIcon]);

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="h-screen">
        <View className="w-full  min-h-[90vh] px-4 mt-10  bg-white">
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
                Create Goal
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-black text-lg mt-5">What is your goal?</Text>

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
                  placeholder="Goal Name"
                />
              )}
              name="name"
              defaultValue=""
            />
            {errors.name && (
              <Text style={{ color: "red" }}>{errors.name.message}</Text>
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
                  className="border-[1px] border-slate-400  rounded-lg shadow py-[6px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const numberValue = parseFloat(text);
                    onChange(numberValue);
                  }}
                  value={value?.toString()}
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

          <View className="mt-5">
            <Text className="text-black ">Target Date</Text>
            <Controller
              control={control}
              name="targetDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    onPress={showDatePicker}
                    className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[10px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
                  >
                    <Text>
                      {selectedDate
                        ? selectedDate.toDateString()
                        : "Select Date"}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    minimumDate={minimumDate}
                    onConfirm={(date) => {
                      onChange(date);
                      handleConfirm(date);
                    }}
                    onCancel={hideDatePicker}
                  />
                </>
              )}
              rules={{ required: "Target date is required" }}
            />
            {errors.targetDate && (
              <Text style={{ color: "red" }}>{errors.targetDate.message}</Text>
            )}
          </View>

          <View className="mt-5">
            <Text className="text-black">Search Icon</Text>
            <TextInput
              style={{
                padding: 10,
              }}
              className="border-[1px] border-slate-400  rounded-lg shadow py-[6px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
              onChangeText={setSearchIcon}
              value={searchIcon}
              placeholder="Search Icon"
            />
          </View>

          <View className="mt-5">
            <Text className="text-black">Select Icon</Text>
            <View className="flex flex-wrap mt-2">
              <RadioButton.Group
                onValueChange={setSelectedIcon}
                value={selectedIcon}
              >
                <View className="flex flex-row flex-wrap w-full space-x-2 min-w-full">
                  {(filteredIcons.length > 0 ? filteredIcons : icons).map(
                    (icon) => (
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
                              selectedIcon === icon?.icon ? "white" : "#6957E7"
                            }
                          />
                        </View>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </RadioButton.Group>
            </View>
          </View>

          <View className="my-5" style={{ marginBottom: ".5rem" }}>
            <CustomButton
              text="Create Goal"
              handlePress={handleSubmit(onSubmit)}
              isLoading={loading}
              containerStyles="mb-10"
              loadinState={"Creating Goal"}
            />
          </View>

          <View className="mt-16"></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateGoal;
