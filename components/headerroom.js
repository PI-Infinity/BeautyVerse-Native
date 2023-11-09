import React, { useRef } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";

const HeadroomHeader = ({ title }) => {
  // Animated value to control the header's translateY value
  const scrollY = useRef(new Animated.Value(0)).current;

  // Calculate the header's translateY value based on the scroll position
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 60, 61],
    outputRange: [0, -60, -60],
    extrapolateLeft: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            // Use the interpolated value for the translateY transform
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
      >
        {/* Your scrollable content here */}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#333",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  title: {
    color: "#fff",
  },
  scrollView: {
    flex: 1,
    paddingTop: 60, // Same as the header height
  },
});

export default HeadroomHeader;
