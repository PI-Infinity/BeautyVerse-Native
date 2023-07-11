import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";

/**
 * animated button component
 */

export default function AnimatedButton({ navigation, currentTheme, title }) {
  const animation = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      { iterations: -1 }
    ).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const colorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 0, 150, 1)", "rgba(255, 105, 180, 1)"],
  });

  const colorInterpolation2 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 105, 180, 1)", "rgba(255, 0, 150, 1)"],
  });
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={() => navigation.navigate("Login")}
      style={{
        width: "50%",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        position: "relative",
        bottom: 30,
        backgroundColor: currentTheme.pink,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", letterSpacing: 0.5 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
