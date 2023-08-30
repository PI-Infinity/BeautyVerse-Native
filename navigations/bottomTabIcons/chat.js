import { FontAwesome } from "@expo/vector-icons";
import {
  getFocusedRouteNameFromRoute,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setRerederRooms } from "../../redux/chat";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// defined custom chat icon with functions

export const CustomTabBarChatIcon = ({ color, currentTheme, focused }) => {
  // defined some routes and contexts

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);
  const rooms = useSelector((state) => state.storeChat.rooms);
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define unread messages for chat, shown in badge

  const definedQnt =
    rooms?.length > 0 &&
    rooms?.filter(
      (r) => r.status === "unread" && r.lastSender !== currentUser._id
    );
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
        paddingTop: 13,
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => {
          if (isFocused) {
            if (routeName === "Chats") {
              dispatch(setRerederRooms());
            } else {
              dispatch(setRerederRooms());
              navigation.navigate("Chats");
            }
          } else {
            navigation.navigate("Chat");
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
          {/** badge for chat */}
          {rooms?.length > 0 && definedQnt.length > 0 && (
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
                top: -8,
                right: 14,
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
                {definedQnt?.length}
              </Text>
            </View>
          )}
          <FontAwesome
            name="wechat"
            size={26}
            color={color}
            // style={{ marginTop: 5 }}
          />
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
