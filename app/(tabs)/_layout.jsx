import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "../../assets/constants";

const TabIcon = ({ focused, icon, color, name, isCreateTab }) => {
  const imageStyle = isCreateTab
    ? styles.createIcon
    : [styles.icon, { tintColor: focused ? color : "rgba(0,0,0,0.5)" }];
  return (
    <View style={styles.tabItem}>
      <Image source={icon} resizeMode="contain" style={imageStyle} />
      <Text
        style={[styles.text, { color: focused ? color : "rgba(0,0,0,0.5)" }]}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
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
              color="#6957E7"
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
              color="#6957E7"
              focused={focused}
              name="Statistics"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Add Transaction",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.addIcon}
              focused={focused}
              color="#6957E7"
              isCreateTab={true}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.heartIcon}
              color="#6957E7"
              focused={focused}
              name="Goals"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.userIcon}
              color="#6957E7"
              focused={focused}
              name="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 10,
    fontFamily: "sans-serif",
  },
  createIcon: {
    top: -30,
    width: 50,
    height: 50,
  },
});

export default TabsLayout;
