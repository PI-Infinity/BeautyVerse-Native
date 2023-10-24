import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  Animated,
  PanResponder,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import {
  PinchGestureHandler,
  State,
  PanGestureHandler,
} from "react-native-gesture-handler";

const InteractiveImage = ({
  source,
  style,
  containerStyle,
  translateX,
  translateY,
  scale,
}) => {
  const lastScale = useRef(1);
  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: false }
  );

  const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: false,
  });

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.END) {
      lastScale.current *= event.nativeEvent.scale;
      scale.setValue(lastScale.current);
      scale.setOffset(0);
    }
  };

  const onPanStateChange = (event) => {
    if (event.nativeEvent.oldState === State.END) {
      translateX.setOffset(translateX._value);
      translateY.setOffset(translateY._value);
      translateX.setValue(0);
      translateY.setValue(0);
    }
  };

  return (
    <View style={containerStyle}>
      <PinchGestureHandler
        onGestureEvent={onPinchEvent}
        onHandlerStateChange={onPinchStateChange}
      >
        <Animated.View style={{ flex: 1 }}>
          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={onPanStateChange}
          >
            <Animated.View
              style={{
                flex: 1,
                transform: [
                  { scale: scale },
                  { translateX: translateX },
                  { translateY: translateY },
                ],
              }}
            >
              <Animated.Image source={source} style={style} />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const EditCoverPopup = ({ image, setFile, setEditPopup, FileUpload }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const [translateXValue, setTranslateXValue] = useState(0);
  const [translateYValue, setTranslateYValue] = useState(0);

  useEffect(() => {
    const translateXListener = translateX.addListener(({ value }) =>
      setTranslateXValue(value)
    );
    const translateYListener = translateY.addListener(({ value }) =>
      setTranslateYValue(value)
    );

    // Clean up the listeners on unmount
    return () => {
      translateX.removeListener(translateXListener);
      translateY.removeListener(translateYListener);
    };
  }, []);

  const xInPercent = translateXValue / (SCREEN_WIDTH / 100);
  const yInPercent = translateYValue / (SCREEN_WIDTH / 100);

  let difference = SCREEN_WIDTH - image?.cover?.width;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 10000,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pressable
        onPress={() => {
          setEditPopup(false);
          setFile(null);
        }}
        style={{ width: "100%", flex: 1 }}
      ></Pressable>
      <View
        style={{
          aspectRatio: 1,
          width: SCREEN_WIDTH,
          zIndex: 0,
        }}
      >
        <View
          pointerEvents="none"
          style={{
            aspectRatio: 1,
            width: SCREEN_WIDTH,
            borderRadius: 10000,
            borderWidth: 5,
            borderColor: "rgba(255,255,255,0.2)",
            zIndex: 1,
            position: "absolute",
          }}
        ></View>

        <InteractiveImage
          source={image?.cover}
          scale={scale}
          translateX={translateX}
          translateY={translateY}
          style={{
            width: SCREEN_WIDTH,
            resizeMode: "cover",
            height: image?.cover.height + difference,
          }}
        />
      </View>
      <Pressable
        onPress={() => FileUpload(scale, xInPercent, yInPercent)}
        style={{
          marginTop: 15,
          height: 50,
          width: SCREEN_WIDTH / 2,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 50,
          borderWidth: 3,
          borderColor: "rgba(255,255,255,0.1)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Upload</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setEditPopup(false);
          setFile(null);
        }}
        style={{ width: "100%", flex: 1 }}
      ></Pressable>
    </View>
  );
};

export default EditCoverPopup;

const styles = StyleSheet.create({});
