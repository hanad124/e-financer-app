import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useCategoriesStore } from "../store/categories";
import rightArrowIcon from "../assets/icons/rightarrow-icon.png";
import { router } from "expo-router";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

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
        {categoriesData ? (
          categoriesData
            .sort((a, b) => b.totalExpense - a.totalExpense)
            .slice(-4)
            .map((category) => (
              <View
                key={category.id}
                style={{ margin: 10 }}
                className="rounded-xl bg-primary/5 relative flex flex-col items-center justify-center py-2 px-2"
              >
                <Image
                  source={{ uri: category.icons.icon }}
                  style={{ width: 40, height: 40 }}
                  className=""
                />
                <Text>{category.name}</Text>
              </View>
            ))
        ) : (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ type: "timing", duration: 1000, loop: true }}
              style={{ margin: 10 }}
              className="rounded-xl bg-primary/5 relative flex flex-col items-center justify-center py-2 px-2"
            >
              <Skeleton
                colorMode="light"
                width={40}
                height={40}
                radius={20}
              />
              <Skeleton
                colorMode="light"
                width={60}
                height={20}
                radius={4}
                style={{ marginTop: 5 }}
              />
            </MotiView>
          ))
        )}
      </View>
    </View>
  );
};

export default TopSpendings;
