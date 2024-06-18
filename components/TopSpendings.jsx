import { View, Text, Image } from "react-native";
import React from "react";
import { useCategoriesStore } from "../store/categories";
import rightArrowIcon from "../assets/icons/rightarrow-icon.png";

const TopSpendings = () => {
  const { categories } = useCategoriesStore();

  console.log("categories", categories);
  const categoriesData = categories.categories;

  return (
    <View>
      <View className="flex flex-row justify-between items-center">
        <Text className="text-lg font-bold">Top Spendings</Text>
        <Image
          source={rightArrowIcon}
          resizeMode="contain"
          style={{ width: 11, height: 11 }}
        />
      </View>
      {/* 
      display top 3 categories with highest spending with their icons
       */}
      <View className="flex flex-row mt-2">
        {categoriesData
          ?.sort((a, b) => b.totalExpense - a.totalExpense)
          .slice(0, 4)
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
