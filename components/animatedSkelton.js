// import React, { useEffect } from "react";
// import { View, StyleSheet } from "react-native";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withRepeat,
//   withSequence,
//   withTiming,
// } from "react-native-reanimated";

// const AnimatedSkeleton = ({ circle, width, height, animation }) => {
//   const animatedValue = useSharedValue(0);

//   console.log(width);

//   useEffect(() => {
//     if (animation === "pulse") {
//       animatedValue.value = withRepeat(
//         withSequence(
//           withTiming(1, { duration: 1000 }),
//           withTiming(0, { duration: 1000 })
//         ),
//         -1
//       );
//     }
//   }, [animation, animatedValue]);

//   const animatedStyle = useAnimatedStyle(() => {
//     const backgroundColor = animatedValue.value
//       ? "rgba(224, 224, 224, " + animatedValue.value + ")"
//       : "rgba(240, 240, 240, 1 - " + animatedValue.value + ")";
//     return {
//       backgroundColor,
//     };
//   });

//   const skeletonStyle = {
//     width,
//     height,
//     borderRadius: circle ? height / 2 : 4,
//   };

//   return (
//     <Animated.View style={[styles.skeleton, skeletonStyle, animatedStyle]} />
//   );
// };

// const styles = StyleSheet.create({
//   skeleton: {
//     alignSelf: "stretch",
//   },
// });

// export default AnimatedSkeleton;
