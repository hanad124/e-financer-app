import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ text, handlePress, containerStyles }) => {
  return (
    <TouchableOpacity
      className={`bg-primary rounded-lg w-full text-center py-4 ${containerStyles}`}
      onPress={handlePress}
    >
      <Text className="text-white text-center">{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
