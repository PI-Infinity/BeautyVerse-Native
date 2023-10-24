import React, { useRef } from "react";
import { Dimensions, Animated, View } from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { CacheableImage } from "../components/cacheableImage";

/**
 * Zoomable image component
 */

const ZoomableImage = ({ source, ...props }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPinchEvent = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: false,
  });

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    }
  };

  const panStyle = {
    width: "100%",
    transform: [{ scale }],
  };

  return (
    <PinchGestureHandler
      onGestureEvent={onPinchEvent}
      onHandlerStateChange={onPinchStateChange}
    >
      <Animated.View style={panStyle}>
        <CacheableImage
          {...props}
          source={source}
          style={props.style}
          manipulationOptions={props.manipulationOptions}
        />
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default ZoomableImage;
