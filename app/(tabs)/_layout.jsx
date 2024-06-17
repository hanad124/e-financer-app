import { View, Text, Image } from "react-native";
import { Tabs, Redirect } from "expo-router";

import { icons } from "../../assets/constants";

const TabIcon = ({ focused, icon, color, name, ...props }) => {
  return (
    <View className="items-center gap-1 justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={focused ? color : "rgba(0,0,0,0.5)"}
        className={`w-5 h-5 ${focused ? "tint-primary" : "tint-gray-400"}`}
      />
      <Text
        className={`
      ${focused ? "font-psemibold text-primary" : "font-pregular"} text-[10px]
        `}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#6957E7",
          tabBarInactiveTintColor: "rgba(0,0,0,0.5)",

          tabBarStyle: {
            paddingVertical: 10,
            height: 70,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.HomeIcon}
                color={"#6957E7"}
                focused={focused}
                name="Home"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: "Statistics",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.statisticsIcon}
                color={"#6957E7"}
                focused={focused}
                name="Statistics"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.addIcon}
                focused={focused}
                name="Create"
                color={"#6957E7"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: "goals",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.heartIcon}
                color={"#6957E7"}
                focused={focused}
                name="goals"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.userIcon}
                color={"#6957E7"}
                focused={focused}
                name="profile"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
