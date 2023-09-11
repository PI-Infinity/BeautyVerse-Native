import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getFocusedRouteNameFromRoute,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useContext, useEffect, useRef } from "react";
import { Animated, Pressable, View, Dimensions } from "react-native";
import { useDispatch } from "react-redux";
import { RouteNameContext } from "../../context/routName";
import { setZoomToTop } from "../../redux/app";
import { setCleanUp, setFeedRefreshControl } from "../../redux/rerenders";
import * as Haptics from "expo-haptics";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Custom Feed icon for tab bar, includes functions etc.

export const CustomTabBarFeedsIcon = ({
  color,
  render,
  setRender,
  scrollY,
  scrollYF,
  focused,
  currentTheme,
}) => {
  // define some routes and contexts
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  // animate border line width
  const animateValueRef = useRef(new Animated.Value(focused ? 60 : 0));
  const animateValue = animateValueRef.current;

  useEffect(() => {
    if (focused) {
      animateValue.setValue(0);
    }
    Animated.timing(animateValue, {
      toValue: focused ? 60 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  return (
    <View
      style={{
        height: SCREEN_HEIGHT / 12,
        width: 60,
        position: "absolute",
        top: -2,
        paddingTop: 10,
        alignItems: "center",
      }}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          if (isFocused) {
            if (routeName === "Feeds") {
              if (scrollY > 0 || scrollYF > 0) {
                dispatch(setZoomToTop());
              } else {
                dispatch(setFeedRefreshControl(true));
                dispatch(setCleanUp());
              }
            } else {
              navigation.navigate("Feeds");
            }
          } else {
            navigation.navigate("Main");
            setRender(!render);
          }
        }}
      >
        <MaterialCommunityIcons name="cards-variant" size={30} color={color} />
      </Pressable>

      {/* Animated border */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 2,
          width: animateValue, // this is the width we're animating
          backgroundColor: currentTheme.pink,
        }}
      />
    </View>
  );
};
