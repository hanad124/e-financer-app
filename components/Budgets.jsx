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
import { PlusCircle } from "lucide-react-native";

const Budgets = () => {
  const { budgets, setBudgetId } = useBudgetsStore();
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
        <TouchableOpacity onPress={() => router.push("/budgets")}>
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
      {budgets?.budgets?.length > 0 ? (
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
          renderItem={({ item, index }) => (
            <>
              <View style={{ width: width - 50 }}>
                <View
                  key={item.id}
                  className="rounded-xl border  border-[#E3E3E5] bg-white relative px-6 py-2"
                >
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/budgets/self");
                      setBudgetId(item.id);
                      useBudgetsStore.setState({
                        budget: item,
                      });
                    }}
                  >
                    <Text className="text-center font-psemibold text-[#303048]">
                      {item?.name}
                    </Text>
                    <View className="flex flex-row justify-between items-center">
                      <View>
                        <Text className="text-[#67677A]">Left to spend</Text>
                        <Text className="text-lg font-psemibold text-[#303048]">
                          ${item?.leftToSpend}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-[#67677A]">Budget</Text>
                        <Text className="text-lg font-psemibold text-[#303048]">
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
                          backgroundColor: "#6347EB",
                          borderRadius: 20,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        />
      ) : (
        <View className="flex justify-center items-center py-4 border border-primary/60 rounded-lg bg-primary/10 ">
          <Text className="text-primary">No budgets for this month</Text>
          <TouchableOpacity
            onPress={() => router.push("/budgets/create")}
            className="flex flex-row items-center gap-1 mt-1"
          >
            <Text className="text-primary ">Create new one </Text>
            <PlusCircle className="text-primary" size={15} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Budgets;
