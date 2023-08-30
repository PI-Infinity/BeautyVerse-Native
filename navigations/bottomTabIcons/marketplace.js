import { Fontisto } from "@expo/vector-icons";
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
import { setRerenderProducts } from "../../redux/Marketplace";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// marketplace icon

export const CustomTabBarMarketplaceIcon = ({
  color,
  currentTheme,
  focused,
}) => {
  // define some contexts and routes

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  const RName = useContext(RouteNameContext);

  let Color;
  if (RName === "Filter1" || RName === "Search1") {
    Color = currentTheme.disabled;
  } else {
    Color = color;
  }

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
        top: -4,
        paddingTop: 13,
        alignItems: "center",
      }}
    >
      <Pressable
        style={{}}
        onPress={() => {
          if (isFocused) {
            // if (routeName === "cards") {
            // if (scrollY > 0) {
            //   dispatch(setZoomToTop());
            // } else {
            //   dispatch(setCardRefreshControl(true));
            //   dispatch(setCleanUp());
            // }
            dispatch(setRerenderProducts());
            // } else {
            //   navigation.navigate("Marketplace")
            // }
          } else {
            navigation.navigate("Marketplace");
          }
        }}
      >
        <Fontisto name="shopping-bag-1" size={25} color={Color} />
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
