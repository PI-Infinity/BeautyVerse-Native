import React, { useRef, useEffect } from "react";
import { Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedLinearGradientExample = () => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const gradientColors = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffafbd", "#ffc3a0"],
  });

  return (
    // <View style={{ height: 3, backgroundColor: "red" }}>
    <AnimatedLinearGradient
      style={{ height: 3 }}
      colors={[
        "#ce2bdf",
        "#2bc6df",
        "#2bdf61",
        "#dfc32b",
        "#2bc6df",
        "#ce2bdf",
        // "#df2bb8",
        // "#2b8edf",
        // "#d3df2b",
        // "#2bdfd9",
        // "#df8c2b",
        // "#2bbedf",
        // "#df2bb0",
        // "#c3df2b",
        // "#ea7c7c",
        // "#2bdf61",
        // "#dfc32b",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      //   style={{ flex: 1 }}
    />
    // </View>
  );
};

export default AnimatedLinearGradientExample;
