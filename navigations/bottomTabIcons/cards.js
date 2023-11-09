import { FontAwesome } from "@expo/vector-icons";
import {
  getFocusedRouteNameFromRoute,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useContext, useEffect, useRef } from "react";
import { Animated, Pressable, View, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RouteNameContext } from "../../context/routName";
import { setActiveTabBar, setZoomToTop } from "../../redux/app";
import {
  setCardRefreshControl,
  setCleanUp,
  setRerenderCurrentUser,
} from "../../redux/rerenders";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// define custom cards icon, includes functions etc.

export const CustomTabBarCardsIcon = ({ color, currentTheme, focused }) => {
  // define some contexts and routes

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  // animate border line width
  const animateValueRef = useRef(new Animated.Value(focused ? 60 : 0));
  const animateValue = animateValueRef.current;

  const scrollY = useSelector((state) => state.storeScrolls.cardsScrollY);

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
        paddingTop: 13,
        alignItems: "center",
      }}
    >
      <Pressable
        style={{
          flex: 1,

          width: "100%",
          alignItems: "center",
        }}
        onPress={() => {
          if (isFocused) {
            if (routeName === "cards") {
              if (scrollY > 0) {
                dispatch(setZoomToTop());
              } else {
                dispatch(setCardRefreshControl(true));
                dispatch(setCleanUp());
              }
            } else {
              navigation.navigate("cards");
            }
          } else {
            navigation.navigate("Cards");
          }
          dispatch(setActiveTabBar("Cards"));
        }}
      >
        <FontAwesome name="address-book-o" size={25} color={color} />
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
