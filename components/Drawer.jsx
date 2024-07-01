import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

// components
import Home from "../app/(tabs)/home";
import Profile from "../app/(tabs)/profile";
import Transactions from "../app/transactions";

const Drawer = createDrawerNavigator();

const CustomDrawer = () => {
  return (
    <Drawer.Navigator>
      {/* <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} /> */}
      <Drawer.Screen 
        name="transactions/index" 
        component={Transactions} 
        options={{ title: "Transactions" }}
      />
    </Drawer.Navigator>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
