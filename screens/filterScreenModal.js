import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../context/theme";
import { setScreenModal, setUserScreenModal } from "../redux/app";
import { Filter } from "./filter";
import { setFilterScreenModal } from "../redux/filter";

// Get the full width of the device's screen
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const FilterScreenModal = ({ screen, navigation }) => {
  // dispatch
  const dispatch = useDispatch();

  // loading
  const [loading, setLoading] = useState(true);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [animation] = useState(new Animated.Value(0));

  // Separate Animated.Value for opacity
  const [opacityAnim] = useState(new Animated.Value(1));

  const blurViewOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  useEffect(() => {
    const showModal = () => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };
    showModal();
  }, []);

  const hideModal = () => {
    Animated.parallel([
      // Slide animation
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Fade out animation
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(setFilterScreenModal({}));
      // Reset the opacityAnim for the next time the modal is displayed
      opacityAnim.setValue(1);
    });
  };

  const containerStyle = {
    width: "100%",
    height: "100%",
    transform: [
      {
        ["translateX"]: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [SCREEN_WIDTH, 0],
        }),
      },
    ],
    backgroundColor: "rgba(1, 2, 12, 0.5)",
    paddingTop: 25,
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 10000,
      }}
    >
      <Animated.View style={{ opacity: opacityAnim }}>
        <BlurView tint="dark" intensity={60}>
          <Animated.View style={[containerStyle, styles.modal]}>
            {loading ? (
              // <ActivityIndicator color={currentTheme.pink} size={24} />
              <View></View>
            ) : (
              <Animated.View style={[containerStyle, styles.modal]}>
                {screen === "Filter" && (
                  <Filter hideModal={hideModal} navigation={navigation} />
                )}
              </Animated.View>
            )}
          </Animated.View>
        </BlurView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    // Style your modal here
  },
});
