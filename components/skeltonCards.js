import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { lightTheme, darkTheme } from "../context/theme";
import { useSelector } from "react-redux";

const LoadingSkeleton = () => {
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
    <View style={{ width: "100%", opacity: 0.2 }}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: "50%",
            height: 365,

            alignItems: "center",
            borderColor: "rgba(255,255,255,0.05)",
            borderWidth: 0.5,
            gap: 2.5,
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 15,
                marginTop: 20,
              },
            ]}
          />
          <View>
            <Animated.View
              style={[
                animatedStyle,
                {
                  backgroundColor: currentTheme.pink,
                  width: "100%",
                  aspectRatio: 1,
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "60%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,

                margin: 12.5,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "90%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 7.5,
                marginTop: 12.5,
              },
            ]}
          />
        </View>
        <View
          style={{
            width: "50%",
            height: 365,

            alignItems: "center",
            borderColor: "rgba(255,255,255,0.05)",
            borderWidth: 0.5,
            gap: 2.5,
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 15,
                marginTop: 20,
              },
            ]}
          />
          <View>
            <Animated.View
              style={[
                animatedStyle,
                {
                  backgroundColor: currentTheme.pink,
                  width: "100%",
                  aspectRatio: 1,
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "60%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,

                margin: 12.5,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "90%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 7.5,
                marginTop: 12.5,
              },
            ]}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: "50%",
            height: 365,

            alignItems: "center",
            borderColor: "rgba(255,255,255,0.05)",
            borderWidth: 0.5,
            gap: 2.5,
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 15,
                marginTop: 20,
              },
            ]}
          />
          <View>
            <Animated.View
              style={[
                animatedStyle,
                {
                  backgroundColor: currentTheme.pink,
                  width: "100%",
                  aspectRatio: 1,
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "60%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,

                margin: 12.5,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "90%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 7.5,
                marginTop: 12.5,
              },
            ]}
          />
        </View>
        <View
          style={{
            width: "50%",
            height: 365,

            alignItems: "center",
            borderColor: "rgba(255,255,255,0.05)",
            borderWidth: 0.5,
            gap: 2.5,
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 15,
                marginTop: 20,
              },
            ]}
          />
          <View>
            <Animated.View
              style={[
                animatedStyle,
                {
                  backgroundColor: currentTheme.pink,
                  width: "100%",
                  aspectRatio: 1,
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "60%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,

                margin: 12.5,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "90%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 7.5,
                marginTop: 12.5,
              },
            ]}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: "50%",
            height: 365,

            alignItems: "center",
            borderColor: "rgba(255,255,255,0.05)",
            borderWidth: 0.5,
            gap: 2.5,
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 15,
                marginTop: 20,
              },
            ]}
          />
          <View>
            <Animated.View
              style={[
                animatedStyle,
                {
                  backgroundColor: currentTheme.pink,
                  width: "100%",
                  aspectRatio: 1,
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "60%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,

                margin: 12.5,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "90%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 7.5,
                marginTop: 12.5,
              },
            ]}
          />
        </View>
        <View
          style={{
            width: "50%",
            height: 365,

            alignItems: "center",
            borderColor: "rgba(255,255,255,0.05)",
            borderWidth: 0.5,
            gap: 2.5,
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 15,
                marginTop: 20,
              },
            ]}
          />
          <View>
            <Animated.View
              style={[
                animatedStyle,
                {
                  backgroundColor: currentTheme.pink,
                  width: "100%",
                  aspectRatio: 1,
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "60%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,

                margin: 12.5,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "70%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
              },
            ]}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                height: 5,
                width: "90%",
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                margin: 7.5,
                marginTop: 12.5,
              },
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
    width: 150,
    alignItems: "center",
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
