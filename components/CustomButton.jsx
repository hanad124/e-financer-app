import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import React, { useRef, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";

const CustomButton = ({
  text,
  handlePress,
  containerStyles,
  isLoading,
  loadinState,
  disabled,
  ...props
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
    }
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <TouchableOpacity
      style={{
        ...styles.buttonContainer,

        ...{
          opacity: isLoading || disabled ? 0.5 : 1,
          marginTop: 24,
          ...containerStyles,
        },
      }}
      onPress={handlePress}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <View style={styles.button}>
          <Text style={styles.text}>{loadinState}</Text>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Feather name="loader" size={18} color="white" />
          </Animated.View>
        </View>
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = {
  buttonContainer: {
    backgroundColor: "#6957E7",
    borderRadius: 10,
    width: "100%",
    textAlign: "center",
    paddingVertical: 16,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
};

export default CustomButton;
