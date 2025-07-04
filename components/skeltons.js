import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { lightTheme, darkTheme } from "../context/theme";
import { useSelector } from "react-redux";
import { BlurView } from "expo-blur";

// define skelotns

export const Circle = ({ borderRadius }) => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const animatedValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1,
      }
    ).start();
  }, []);

  const animatedStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.5],
    }),
  };

  return (
    <BlurView
      tint="light"
      intensity={20}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: borderRadius ? borderRadius : 0,
      }}
    >
      {/* <Animated.View
        style={[
          styles.circle,
          animatedStyle,
          {
            // backgroundColor: currentTheme.disabled,
            borderRadius: borderRadius ? borderRadius : 0,
          },
        ]}
      /> */}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: "100%",
    height: "100%",
  },
});
