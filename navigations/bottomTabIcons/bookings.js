import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RouteNameContext } from "../../context/routName";
import { setRerenderBookings } from "../../redux/rerenders";
import { setActiveTabBar } from "../../redux/app";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// define custom filter icons

export const CustomTabBarBookingsIcon = ({
  sum,
  focused,
  currentTheme,
  color,
}) => {
  // define some routes and contexts
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  // recieved and sent bookings redux states
  const newBookings = useSelector((state) => state.storeBookings.new);
  const newSentBookings = useSelector((state) => state.storeSentBookings.new);

  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // navigate state, after change state value, runs useeffect to navigate trough screen
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    navigation.navigate("Main");
  }, [navigate]);

  const routeName = useContext(RouteNameContext);

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
        top: -1.5,
        paddingTop: 5,
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={
          isFocused
            ? () => dispatch(setRerenderBookings())
            : currentUser.type === "user"
            ? () => {
                navigation.navigate("BMSSent");
                dispatch(setActiveTabBar("BMSSent"));
              }
            : () => {
                navigation.navigate("BMS");
                dispatch(setActiveTabBar("BMS"));
              }
        }
      >
        <View
          style={{
            height: SCREEN_HEIGHT / 12,
            width: 60,
            alignItems: "center",
          }}
        >
          {/** badge for filter */}
          {/* {sum > 0 && !focused && (
            <View
              style={{
                width: "auto",
                minWidth: 15,
                height: 15,
                backgroundColor: currentTheme.pink,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                position: "absolute",
                top: -2,
                right: 15,
                marginBottom: 2,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 3, // negative value places shadow on top
                },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text
                style={{
                  color: "#f1f1f1",
                  fontSize: 10,
                  fontWeight: "bold",
                  letterSpacing: 0.15,
                }}
              >
                {sum}
              </Text>
            </View>
          )} */}

          {/* {routeName === "Filter" ||
          routeName === "Filter1" ||
          routeName === "Search" ||
          routeName === "Search1" ? (
            <FontAwesome
              name="arrow-up"
              size={27}
              color={sum > 0 && focused ? color : currentTheme.pink}
              style={{ paddingTop: 5 }}
            />
          ) : ( */}
          <View
            acitveOpacity={0.3}
            style={{
              // marginRight: 10,
              // marginLeft: 4,
              flexDirection: "row",
              opacity: 1,
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: currentTheme.line,
              // borderRadius: 50,
              padding: 5.5,
              paddingTop: 5.4,

              // paddingHorizontal: 5,
              // marginTop: 3,
            }}
          >
            {(currentUser.type === "user" ? newSentBookings : newBookings) >
              0 && (
              <View
                style={{
                  width: "auto",
                  minWidth: 13,
                  height: 13,
                  backgroundColor: currentTheme.pink,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  zIndex: 2,
                  right: -2,
                  top: -2,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10 }}>
                  {currentUser.type === "user" ? newSentBookings : newBookings}
                </Text>
              </View>
            )}
            <FontAwesome5
              name="clipboard-list"
              size={26}
              color={color}
              // style={{ position: "relative", bottom: 1 }}
            />
            {/* <Text
                  style={{
                    color: color,
                    fontWeight: "bold",
                    letterSpacing: -2,
                    fontSize: 24,
                  }}
                >
                  BMS
                </Text> */}
          </View>
          {/* )} */}
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
