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
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBudgetsStore } from "../../store/budgets";
import { deleteBudget } from "../../apicalls/budgets";

import { ChevronLeft, Trash2, Pencil, Plus } from "lucide-react-native";
import LoadingOverlay from "../../components/LoadingOverlay";

const index = () => {
  const [search, setSearch] = useState("");
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const { budgets, setBudgetId } = useBudgetsStore();

  console.log("budgets: ", budgets);

  useEffect(() => {
    if (budgets?.budgets) {
      setFilteredBudgets(budgets?.budgets);
    }
  }, [budgets?.budgets]);

  //  search budgets
  useEffect(() => {
    if (search.length > 0) {
      const filtered = budgets?.budgets?.filter((budget) => {
        console.log("Budget::", budget);
        return budget?.name?.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredBudgets(filtered);
    } else {
      setFilteredBudgets(budgets?.budgets);
    }
  }, [search]);

  // delete budget
  const handleDelete = async (id) => {
    // 1st ask for confirmation
    Alert.alert("Delete Budget", "Are you sure you want to delete?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          setLoading(true);
          const res = await deleteBudget(id);
          console.log("delete res:::", res);
          useBudgetsStore.getState().getBudgets();
          // update the the filtered budgets
          setFilteredBudgets(
            budgets?.budgets.filter((budget) => budget.id !== id)
          );

          alert("Badget deleted successfully");
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
            <View className="flex flex-row items-center justify-between  my-2 mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="flex flex-row items-center"
              >
                <ChevronLeft size={18} color={"black"} />
                <Text className="text-[16px] text-gray-800 ml-2">Back</Text>
              </TouchableOpacity>
            </View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg  text-gray-800 ml-2 mb-4">Budgets</Text>
              <TouchableOpacity
                onPress={() => router.push("/budgets/create")}
                className="flex flex-row items-center justify-between bg-primary px-2 py-1 rounded-md"
              >
                <Plus size={16} color={"white"} />
                <Text className="text-white ml-1">Add Budget</Text>
              </TouchableOpacity>
            </View>

            <View className="">
              <TextInput
                placeholder="Search budgets"
                value={search}
                onChangeText={(text) => setSearch(text)}
                className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[7px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
              />
            </View>

            <View className="flex flex-col justify-center gap-y-2 items-center w-full mt-5">
              {filteredBudgets?.length > 0 ? (
                filteredBudgets?.map((budget, index) => (
                  <View
                    key={index}
                    className="flex flex-row justify-between items-center w-full bg-primary/5 rounded-lg py-2"
                  >
                    <TouchableOpacity
                      onPress={() => {
                        router.push("/budgets/self");
                        useBudgetsStore.setState({
                          budget: budget,
                        });
                      }}
                      className="flex flex-row items-center gap-2 px-4 rounded-lg flex-1"
                    >
                      <View className="bg-white rounded-xl p-1">
                        <Image
                          source={{ uri: budget?.icon }}
                          className="w-9 h-9 "
                          resizeMode="contain"
                        />
                      </View>
                      <View className="flex flex-col gap-[2px]">
                        <View className="flex flex-row items-center gap-2">
                          <Text className="text-black font-pmedium">
                            {budget?.name}
                          </Text>
                          <View className=" bg-primary/10 border border-primary px-2 rounded flex justify-center items-center">
                            <Text className="text-primary font-pregular">
                              {budget?.leftToSpend}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-[#348F9F]  text-sm">
                          {budget?.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View>
                      <View className="flex flex-row gap-2 mr-2">
                        <TouchableOpacity
                          onPress={() => {
                            router.push(`/budgets/${budget.id}`);
                            setBudgetId(budget.id);
                            useBudgetsStore.setState({
                              budget: budget,
                            });
                          }}
                          className="p-2 bg-primary rounded-lg"
                        >
                          <Pencil size={16} color={"white"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            handleDelete(budget?.id);
                          }}
                          className="p-2 bg-primary rounded-lg"
                        >
                          <Trash2 size={16} color={"white"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className="flex justify-center items-center">
                  <Text>No budgets</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default index;
