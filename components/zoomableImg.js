// import React, { useRef } from "react";
// import { Image } from "react-native";
// import Animated, {
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   withSpring,
// } from "react-native-reanimated";
// import {
//   PinchGestureHandler,
//   PinchGestureHandlerGestureEvent,
// } from "react-native-gesture-handler";

// const ZoomableImage = ({ source, style }) => {
//   const scale = useRef(new Animated.Value(1)).current;
//   const pinchGestureHandler =
//     useAnimatedGestureHandler <
//     PinchGestureHandlerGestureEvent >
//     {
//       onStart: (event, ctx) => {
//         ctx.startScale = scale.value;
//       },
//       onActive: (event, ctx) => {
//         scale.value = ctx.startScale * event.scale;
//       },
//       onEnd: () => {
//         scale.value = withSpring(1); // Reset the image scale after releasing the pinch gesture
//       },
//     };

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   return (
//     <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
//       <Animated.View style={animatedStyle}>
//         <Image source={source} style={style} />
//       </Animated.View>
//     </PinchGestureHandler>
//   );
// };

// export default ZoomableImage;
