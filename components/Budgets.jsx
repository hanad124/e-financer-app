import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useBudgetsStore } from "../store/budgets";
import { router } from "expo-router";

const Budgets = () => {
  const { budgets } = useBudgetsStore();
  const width = Dimensions.get("window").width;

  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  console.log("budgets:", budgets);

  // get all the budgets of the current month
  const currentMonthBudgets = budgets?.budgets?.filter(
    (budget) =>
      new Date(budget.createdAt).toLocaleString("default", {
        month: "long",
      }) === currentMonth
  );

  console.log("currentMonthBudgets:", currentMonthBudgets);

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View className="flex flex-row justify-between items-center mb-2">
        <TouchableOpacity onPress={() => router.push("/categories")}>
          <Text className="text-[16px] font-pregular">
            {currentMonth} Budgets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/budgets")}
          className="flex flex-row items-center"
        >
          <Text className="text-[#68BAA6] text-[14px]">View all</Text>
        </TouchableOpacity>
      </View>
      <Carousel
        loop
        width={width}
        height={119}
        autoPlay={true}
        data={
          currentMonthBudgets
            ? currentMonthBudgets?.slice(0, 3)
            : [...new Array(1).keys()]
        }
        scrollAnimationDuration={2000}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ item }) => (
          <View style={{ width: width - 50 }}>
            <View
              key={item.id}
              className="rounded-xl border border-[#E3E3E5] relative px-6 py-2"
            >
              <Text className="text-center font-psemibold">{item?.name}</Text>
              <View className="flex flex-row justify-between items-center">
                <View>
                  <Text className="text-[#67677A]">Left to spend</Text>
                  <Text className="text-lg font-psemibold">
                    ${item?.leftToSpend}
                  </Text>
                </View>
                <View>
                  <Text className="text-[#67677A]">Budget</Text>
                  <Text className="text-lg font-psemibold">
                    ${item?.amount}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "#E3E3E5",
                  height: 6,
                  borderRadius: 20,
                }}
                className="my-2"
              >
                <Animated.View
                  style={{
                    width: `${(item?.leftToSpend / item?.amount) * 100}%`,
                    height: 6,
                    backgroundColor: "#6957E7",
                    borderRadius: 20,
                  }}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Budgets;
