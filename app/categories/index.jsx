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

import { useCategoriesStore } from "../../store/categories";

import { ArrowLeft, Trash2, Pencil, Plus } from "lucide-react-native";
import { deleteCategory } from "../../apicalls/categories";
import LoadingOverlay from "../../components/LoadingOverlay";

const index = () => {
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const { categories, setCategoryId } = useCategoriesStore();
  console.log("categories", categories?.categories);

  //   search categories
  useEffect(() => {
    if (search.length > 0) {
      const filtered = categories?.categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories?.data);
    }
  }, [search]);

  //   delete category
  const handleDelete = async (id) => {
    // 1st ask for confirmation
    Alert.alert("Delete Category", "Are you sure you want to delete?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          setLoading(true);
          const res = await deleteCategory(id);
          console.log("delete res:::", res);
          useCategoriesStore.getState().getCategories();
          alert("Category deleted successfully");
          setLoading(false);
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="bg-white pt-5">
      <LoadingOverlay loading={loading} />
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
              Categories
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/categories/create")}
              className="flex flex-row items-center justify-between"
            >
              <Plus size={16} color={"black"} />
              <Text className="text-black font-pmedium">Add Category</Text>
            </TouchableOpacity>
          </View>

          {/* 
            search input
          */}
          <View className="">
            <TextInput
              placeholder="Search categories"
              value={search}
              onChangeText={(text) => setSearch(text)}
              className="border-[1px] border-slate-400 px-2 rounded-lg shadow py-[9px] w-full mt-2 focus:border-[2px] focus:border-primary focus:ring-4 focus:ring-primary"
            />
          </View>
          <View className="flex flex-col justify-center gap-y-2 items-center w-full mt-5">
            {filteredCategories?.length > 0
              ? filteredCategories?.map((category, index) => (
                  <View
                    key={index}
                    className="flex flex-row justify-between items-center w-full bg-primary/5 rounded-lg py-2"
                  >
                    <View className="flex flex-row items-center gap-2 px-4 rounded-lg">
                      <View className="bg-white rounded-xl p-1">
                        <Image
                          source={{ uri: category?.icons?.icon }}
                          className="w-9 h-9 "
                          resizeMode="contain"
                        />
                      </View>
                      <View className="flex flex-col gap-[3px]">
                        <Text className="">{category?.name}</Text>
                        <View className="bg-[#68BAA6] rounded-full flex justify-center items-center p-[2px]  w-fit max-w-[20px] text-center h-fit pb-[3px] max-h-[20px]">
                          <Text className="text-white">
                            {category?.transactionCount}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <View className="flex flex-row gap-2">
                        <TouchableOpacity
                          onPress={() => {
                            router.push("/categories/[id]");
                            setCategoryId(category.id);
                          }}
                          className="p-2 bg-primary rounded-lg"
                        >
                          <Pencil size={16} color={"white"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            handleDelete(category.id);
                          }}
                          className="p-2 bg-primary rounded-lg"
                        >
                          <Trash2 size={16} color={"white"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              : categories?.categories?.map((category, index) => (
                  <View
                    key={index}
                    className="flex flex-row justify-between items-center w-full bg-primary/5 rounded-lg py-2"
                  >
                    <View className="flex flex-row items-center gap-2 px-4 rounded-lg">
                      <View className="bg-white rounded-xl p-1">
                        <Image
                          source={{ uri: category?.icons?.icon }}
                          className="w-9 h-9 "
                          resizeMode="contain"
                        />
                      </View>
                      <View className="flex flex-col gap-[3px]">
                        <Text className="">{category?.name}</Text>
                        <View className="bg-[#68BAA6] rounded-full flex justify-center items-center p-[2px]  w-fit max-w-[20px] text-center h-fit pb-[3px] max-h-[20px]">
                          <Text className="text-white">
                            {category?.transactionCount}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <View className="flex flex-row gap-2">
                        <TouchableOpacity
                          onPress={() => {
                            router.push("/categories/[id]");
                            setCategoryId(category.id);
                          }}
                          className="p-2 bg-primary rounded-lg"
                        >
                          <Pencil size={16} color={"white"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={
                            category?.transactionCount > 0 ? true : false
                          }
                          onPress={() => {
                            handleDelete(category.id);
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
  );
};

export default index;
