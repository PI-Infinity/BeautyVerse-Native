import * as React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Constants from "expo-constants";

const colors = [
  "#111", // white
  "#30102E", // black
  "#102530", // blue
  "#1F3010", // green
  "#301010", // pink
  "#111", // white
  "#30102E", // black
  "#102530", // blue
  "#1F3010", // green
  "#301010", // pink
];

export default function ColorChangingBackground({ children }) {
  const [value, setValue] = React.useState(0);
  const backgroundColor = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v === 9 ? 0 : v + 1));
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    Animated.timing(backgroundColor, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false,
    }).start(() => {
      backgroundColor.setValue(0);
    });
  }, [value]);

  const backgroundColorStyle = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors[value], colors[value === 9 ? 0 : value + 1]],
  });

  const animatedStyle = { backgroundColor: backgroundColorStyle };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    // padding: 8,
  },
});
