import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { lightTheme, darkTheme } from "../context/theme";
import { useSelector } from "react-redux";

export const Circle = () => {
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
    <View style={{ gap: 8 }}>
      <Animated.View
        style={[
          styles.circle,
          animatedStyle,
          { backgroundColor: currentTheme.pink },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    // flexDirection: "column",
    padding: 10,
    paddingHorizontal: 15,
    opacity: 0.3,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
});
