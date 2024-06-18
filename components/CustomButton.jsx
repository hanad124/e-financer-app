import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Loader } from "lucide-react-native";

const CustomButton = ({
  text,
  handlePress,
  containerStyles,
  isLoading,
  loadinState,
}) => {
  return (
    <TouchableOpacity
      className={`bg-primary rounded-lg w-full text-center py-4 ${containerStyles} `}
      onPress={handlePress}
    >
      {isLoading ? (
        <View className="flex" style={styles.button}>
          <Text className="text-white text-center">{loadinState}</Text>
          <Loader size={18} color="white" className="animate-spin" />
        </View>
      ) : (
        <Text className="text-white text-center">{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = {
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
};
