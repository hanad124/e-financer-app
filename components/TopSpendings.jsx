import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useCategoriesStore } from "../store/categories";
import rightArrowIcon from "../assets/icons/rightarrow-icon.png";
import { router } from "expo-router";

const TopSpendings = () => {
  const { categories } = useCategoriesStore();

  const categoriesData = categories.categories;

  return (
    <View>
      <View className="flex flex-row justify-between items-center ">
        <TouchableOpacity onPress={() => router.push("/categories")}>
          <Text className="text-[16px] font-pregular">Top Spendings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/categories")}
          className="flex flex-row items-center"
        >
          <Image
            source={rightArrowIcon}
            resizeMode="contain"
            style={{ width: 11, height: 11 }}
          />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row ">
        {categoriesData
          ?.sort((a, b) => b.totalExpense - a.totalExpense)
          .slice(0, 4)
          ?.reverse()
          .map((category) => {
            return (
              <View
                key={category.id}
                style={{ margin: 10 }}
                className=" rounded-xl bg-primary/5 relative flex flex-col items-center justify-center py-2 px-2"
              >
                <Image
                  source={{ uri: category.icons.icon }}
                  style={{ width: 40, height: 40 }}
                  className=""
                />
                <Text>{category.name}</Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default TopSpendings;
