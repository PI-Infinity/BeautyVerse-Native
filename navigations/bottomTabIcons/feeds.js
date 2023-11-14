import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getFocusedRouteNameFromRoute,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useContext, useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RouteNameContext } from "../../context/routName";
import { setActiveTabBar, setZoomToTop } from "../../redux/app";
import {
  setCleanUp,
  setFeedRefreshControl,
  setRerenderCurrentUser,
} from "../../redux/rerenders";
import * as Haptics from "expo-haptics";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Custom Feed icon for tab bar, includes functions etc.

export const CustomTabBarFeedsIcon = ({
  color,
  render,
  setRender,
  focused,
  currentTheme,
}) => {
  // define some routes and contexts
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  const scrollY = useSelector((state) => state.storeScrolls.feedsScrollY);
  const scrollYF = useSelector((state) => state.storeScrolls.feedsScrollYF);

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
        style={{
          flex: 1,

          width: "100%",
          alignItems: "center",
        }}
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
          dispatch(setActiveTabBar("Feeds"));
        }}
      >
        <MaterialCommunityIcons name="cards-variant" size={30} color={color} />
      </Pressable>

      {/* Animated border */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 2,
          width: focused ? 60 : 0,
          backgroundColor: currentTheme.pink,
        }}
      />
    </View>
  );
};
