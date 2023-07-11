import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { lightTheme, darkTheme } from "../context/theme";
import { useSelector } from "react-redux";

/**
 * Skelton component
 */

const LoadingSkeleton = () => {
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define animation
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
          duration: 800,
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
      <View
        style={[styles.skeleton, { backgroundColor: currentTheme.background2 }]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Animated.View
            style={[
              styles.circle,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <View>
            <Animated.View
              style={[
                styles.line,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
            <Animated.View
              style={[
                styles.line2,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line4,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink, marginBottom: 30 },
            ]}
          />
        </View>
      </View>
      <View
        style={[styles.skeleton, { backgroundColor: currentTheme.background2 }]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Animated.View
            style={[
              styles.circle,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <View>
            <Animated.View
              style={[
                styles.line,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
            <Animated.View
              style={[
                styles.line2,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line4,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink, marginBottom: 30 },
            ]}
          />
        </View>
      </View>
      <View
        style={[styles.skeleton, { backgroundColor: currentTheme.background2 }]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Animated.View
            style={[
              styles.circle,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <View>
            <Animated.View
              style={[
                styles.line,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
            <Animated.View
              style={[
                styles.line2,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line4,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink, marginBottom: 30 },
            ]}
          />
        </View>
      </View>
      <View
        style={[styles.skeleton, { backgroundColor: currentTheme.background2 }]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Animated.View
            style={[
              styles.circle,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <View>
            <Animated.View
              style={[
                styles.line,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
            <Animated.View
              style={[
                styles.line2,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line4,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink, marginBottom: 30 },
            ]}
          />
        </View>
      </View>
      <View
        style={[styles.skeleton, { backgroundColor: currentTheme.background2 }]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Animated.View
            style={[
              styles.circle,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <View>
            <Animated.View
              style={[
                styles.line,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
            <Animated.View
              style={[
                styles.line2,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line4,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink, marginBottom: 30 },
            ]}
          />
        </View>
      </View>
      <View
        style={[styles.skeleton, { backgroundColor: currentTheme.background2 }]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Animated.View
            style={[
              styles.circle,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <View>
            <Animated.View
              style={[
                styles.line,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
            <Animated.View
              style={[
                styles.line2,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line4,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink, marginBottom: 30 },
            ]}
          />
        </View>
      </View>
      <View
        style={[styles.skeleton, { backgroundColor: currentTheme.background2 }]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Animated.View
            style={[
              styles.circle,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <View>
            <Animated.View
              style={[
                styles.line,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
            <Animated.View
              style={[
                styles.line2,
                animatedStyle,
                { backgroundColor: currentTheme.pink },
              ]}
            />
          </View>
        </View>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line4,
              animatedStyle,
              { backgroundColor: currentTheme.pink },
            ]}
          />
          <Animated.View
            style={[
              styles.line3,
              animatedStyle,
              { backgroundColor: currentTheme.pink, marginBottom: 30 },
            ]}
          />
        </View>
      </View>
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
    height: 45,
    width: 45,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
  line: {
    height: 5,
    width: 150,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
  line2: {
    height: 5,
    width: 100,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
  line3: {
    height: 5,
    width: "100%",
    // width: 100,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
  line4: {
    height: 5,
    width: "90%",
    // width: 100,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
});

export default LoadingSkeleton;
