import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AnimatedButton({ navigation, currentTheme, title }) {
  const animation = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
        easing: Easing.ease, // Updated line
      }),
      { iterations: -1 }
    ).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const leftPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-100%", "100%"],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate("Login")}
      style={{
        width: "50%",
        height: 45,

        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        position: "relative",
        bottom: 30,
        backgroundColor: currentTheme.pink,
        overflow: "hidden", // Ensuring the animated gradient doesn't overflow
        borderWidth: 1.5,
        borderColor: currentTheme.line,
      }}
    >
      {/* Top Shadow */}
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: 15,
        }}
      />
      {/* bottom Shadow */}
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "transparent"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 15,
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          left: leftPosition,
          width: "50%",
          height: "100%",
        }}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.1)",
            "rgba(255,255,255,0.2)",
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0.2)",
            "rgba(255,255,255,0.1)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Animated.View>

      <Text
        style={{
          color: "#fff",
          fontWeight: "bold",
          letterSpacing: 0.5,
          zIndex: 1,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
