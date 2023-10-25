import { FontAwesome } from "@expo/vector-icons";
import {
  getFocusedRouteNameFromRoute,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import { darkTheme, lightTheme } from "../../context/theme";
import {
  setRerenderCurrentUser,
  setRerenderBookings,
} from "../../redux/rerenders";
import { setZoomToTop } from "../../redux/app";
import { Circle } from "../../components/skeltons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// profile custom icon with functions and profile cover

export const CustomTabBarProfileIcon = (props) => {
  // define some routes and contexts

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  // // recieved and sent bookings redux states
  // const newBookings = useSelector((state) => state.storeBookings.new);
  const newSentBookings = useSelector((state) => state.storeSentBookings.new);

  // Select theme from global Redux state (dark or light theme)
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // cover loading state
  const [loadCover, setLoadCover] = useState(true);

  useEffect(() => {
    setLoadCover(true);
    if (props?.currentUser?.cover === "") {
      setLoadCover(false);
    }
  }, [props.currentUser?.cover]);

  // animate border line width
  const animateValueRef = useRef(new Animated.Value(props.focused ? 60 : 0));
  const animateValue = animateValueRef.current;

  useEffect(() => {
    if (props.focused) {
      animateValue.setValue(0);
    }
    Animated.timing(animateValue, {
      toValue: props.focused ? 60 : 0,
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
        top: -3,
        paddingTop: 12,
        alignItems: "center",
      }}
    >
      <Pressable
        stylr={{
          flex: 1,

          width: "100%",
          alignItems: "center",
        }}
        onPress={() => {
          if (isFocused) {
            if (routeName !== "UserProfile") {
              navigation.navigate("UserProfile");
            } else {
              if (props.scrollY > 0) {
                dispatch(setZoomToTop());
              } else {
                dispatch(setRerenderCurrentUser());
                dispatch(setRerenderBookings());
              }
            }
          } else {
            navigation.navigate("Profile");
          }
        }}
      >
        <View
          style={{
            height: SCREEN_HEIGHT / 12,
            width: 60,
            alignItems: "center",
          }}
        >
          {(props.unreadNotifications > 0 ||
            // newBookings > 0 ||
            (props.currentUser.type === "specialist" &&
              newSentBookings > 0)) && (
            <View
              style={{
                width: "auto",
                minWidth: 15,
                height: 15,
                backgroundColor: props.currentTheme.pink,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                zIndex: 2,
                right: 12,
                top: -7,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 10,
                  textAlign: "center",
                  letterSpacing: 0.15,
                }}
              >
                {props.unreadNotifications +
                  (props.currentUser.type === "specialist"
                    ? newSentBookings
                    : 0)}
              </Text>
            </View>
          )}
          {loadCover && (
            <View
              style={{
                position: "absolute",
                zIndex: 1000,
                overflow: "hidden",
                height: 27,
                width: 27,
                borderRadius: 50,
              }}
            >
              <Circle />
            </View>
          )}
          {props.currentUser?.cover?.length > 0 ? (
            <CacheableImage
              key={props.currentUser?.cover}
              style={{
                height: 27,
                width: 27,
                borderRadius: 50,
                borderWidth: 1.75,
                borderColor: props.focused
                  ? props.currentTheme.pink
                  : props.currentTheme.disabled,
              }}
              source={{ uri: props.currentUser?.cover }}
              manipulationOptions={[
                { resize: { width: 100, height: 100 } },
                { rotate: 90 },
              ]}
              onLoad={() => setLoadCover(false)}
            />
          ) : (
            <FontAwesome
              name="user-circle-o"
              size={25}
              // style={{ marginTop: 5 }}
              color={
                isFocused
                  ? props.currentTheme.pink
                  : props.currentTheme.disabled
              }
            />
          )}
        </View>
      </Pressable>
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
