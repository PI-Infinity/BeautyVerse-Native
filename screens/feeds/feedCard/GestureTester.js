import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AnimatedGesture, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

const GestureTester = () => {
  // open and hide reports component
  const y = useSharedValue(0);
  const startY = useSharedValue(0);

  const ClosWindow = useAnimatedGestureHandler({
    onStart: (event) => {
      startY.value = y.value;
    },
    onActive: (event) => {
      y.value = startY.value + event.translationY;
    },
    onEnd: (event) => {
      console.log(event);
    },
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));
  return (
    <AnimatedGesture.View
      style={[
        {
          backgroundColor: "red",
          flex: 1,
          position: "absolute",
          zIndex: 1000,
          width: 400,
          height: 400,
        },
        animatedContainerStyle,
      ]}
    >
      <PanGestureHandler onGestureEvent={ClosWindow}>
        <AnimatedGesture.View
          style={{
            height: 35,
            width: "100%",
            alignItems: "center",
            backgroundColor: "blue",
          }}
        >
          <View
            style={{
              height: 5,
              width: "45%",
              borderRadius: 50,
              backgroundColor: "green",
            }}
          />
        </AnimatedGesture.View>
      </PanGestureHandler>
    </AnimatedGesture.View>
  );
};

export default GestureTester;

const styles = StyleSheet.create({});
