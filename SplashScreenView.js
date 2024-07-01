import { View, Text, Image } from "react-native";
import React from "react";

import logoImaga from "./assets/Logo.png";

const SplashScreen = () => {
  return (
    <View
      className=""
      style={{
        height: "100vh",
        backgroundColor: "#6957E7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
      }}
    >
      <Image
        source={logoImaga}
        style={{ width: 170, height: 100, marginBottom: 0 }}
      />
      <Text
        style={{ color: "white", fontSize: 19, fontWeight: 600, marginTop: 4 }}
      >
        e-Financer
      </Text>
    </View>
  );
};

export default SplashScreen;
