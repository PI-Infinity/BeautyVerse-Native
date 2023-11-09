import { BlurView } from "expo-blur";
import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const LoadingScreen = ({ currentTheme, theme }) => {
  const spinValue = useRef(new Animated.Value(0)).current; // Using useRef to persist animation value

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    spinAnimation.start(); // Starting the animation when component is mounted

    return () => spinAnimation.stop(); // Stopping the animation when the component is unmounted
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={[
        styles.loading,
        {
          backgroundColor: currentTheme.background,
          flex: 1,
        },
      ]}
    >
      <ImageBackground
        style={[
          styles.loading,
          {
            flex: 1,
          },
        ]}
        source={theme ? require("../assets/background.jpg") : null}
      >
        <BlurView
          intensity={60}
          tint="dark"
          style={[
            styles.loading,
            {
              backgroundColor: !theme
                ? currentTheme.background
                : "rgba(1,2,0,0.5)",
              flex: 1,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 7.5,
              paddingHorizontal: 15,
              borderRadius: 50,
              marginBottom: 30,
            }}
          >
            {/* {theme && (
          <Animated.Image
            style={{
              width: 35,
              height: 35,
              transform: [{ rotate: spin }],
            }}
            source={require("../assets/icon.png")}
          />
        )} */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.loadingText,
                  { color: currentTheme.pink, letterSpacing: 1 },
                ]}
              >
                Beauty
              </Text>
              <Text
                style={[
                  styles.loadingText,
                  { color: currentTheme.font, letterSpacing: 1 },
                ]}
              >
                Verse
              </Text>
            </View>
          </View>
          <ActivityIndicator
            color={currentTheme.pink}
            size={20}
            style={{ marginBottom: SCREEN_HEIGHT / 10 }}
          />
        </BlurView>
      </ImageBackground>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    position: "absolute",
    zIndex: 100000,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
});
