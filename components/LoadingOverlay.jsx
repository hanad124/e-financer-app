import React from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { BlurView } from "expo-blur";
import { useRef, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";

const LoadingOverlay = ({ loading }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
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
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      {loading && (
        <View style={styles.overlay}>
          <BlurView intensity={50} tint="dark" style={styles.absolute}>
            <View style={styles.button}>
              {/* <Text style={styles.loadingText}>Loading...</Text> */}
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Feather name="loader" size={24} color="white" />
              </Animated.View>
            </View>
          </BlurView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
  },
});

export default LoadingOverlay;
