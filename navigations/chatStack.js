import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  Pressable,
} from "react-native";
import { Chat } from "../screens/chat/chat";
import { Room } from "../screens/chat/room";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useState, useEffect } from "react";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setOpenAddChat } from "../redux/chat";
import { CacheableImage } from "../components/cacheableImage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Language } from "../context/language";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { lightTheme, darkTheme } from "../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Stack = createStackNavigator();

const withVariant = (socket) => {
  return (props) => {
    return <Room {...props} socket={socket} />;
  };
};
const withVariant2 = (socket) => {
  return (props) => {
    return <Chat {...props} socket={socket} />;
  };
};

const withVariant3 = (Component, variant) => {
  return (props) => {
    return <User {...props} variant={variant} />;
  };
};

export function ChatStack({ route, socket }) {
  const language = Language();
  const currentChat = useSelector((state) => state.storeChat.currentChat);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  // define target member
  let targetChatMember;
  if (currentChat?.members.member1 === currentUser._id) {
    targetChatMember = {
      id: currentChat?.members.member2,
      name: currentChat?.members.member2Name,
      cover: currentChat?.members.member2Cover,
    };
  } else {
    targetChatMember = {
      id: currentChat?.members.member1,
      name: currentChat?.members.member1Name,
      cover: currentChat?.members.member1Cover,
    };
  }

  const chatUser = useSelector((state) => state.storeChat.chatUser);

  const dispatch = useDispatch();
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
        cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
      }}
    >
      <Stack.Screen
        name="Chats"
        component={withVariant2(socket)}
        options={{
          headerBackTitleVisible: false,
          title: "Chats",
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
          headerLeft: () => (
            <TouchableOpacity
              acitveOpacity={0.3}
              style={{ marginLeft: 15 }}
              onPress={() => dispatch(setOpenAddChat(true))}
            >
              <Icon name="plus" size={18} color={currentTheme.font} />
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <View style={{ marginRight: 15 }}>
          //     <Icon name="bars" size={18} color={currentTheme.font} />
          //   </View>
          // ),
        }}
      />
      <Stack.Screen
        name="Room"
        component={withVariant(socket)}
        options={({ route, navigation }) => ({
          headerBackTitleVisible: false,
          title: chatUser?.name,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: (props) => (
            <Pressable
              onPress={() =>
                navigation.navigate("User", {
                  user: chatUser,
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
                width: SCREEN_WIDTH - 150,
              }}
            >
              {targetChatMember?.cover?.length > 0 && (
                <CacheableImage
                  source={{ uri: targetChatMember?.cover }}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 50,
                    resizeMode: "cover",
                  }}
                  manipulationOptions={[
                    { resize: { width: 30, height: 30 } },
                    { rotate: 90 },
                  ]}
                />
              )}

              <Text
                style={{
                  fontSize: 18,
                  letterSpacing: 0.5,
                  color: currentTheme.font,
                  fontWeight: "bold",
                }}
              >
                {targetChatMember?.name}
              </Text>
            </Pressable>
          ),
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="User"
        component={withVariant3(User, "visitPage")}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerTitle: (props) => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text
                style={{
                  fontSize: 18,
                  letterSpacing: 0.5,
                  color: currentTheme.font,
                  fontWeight: "bold",
                }}
              >
                {route.params.user.name}
              </Text>
              <MaterialIcons name="verified" size={14} color="#1DA1F2" />
            </View>
          ),

          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="ScrollGallery"
        component={ScrollGallery}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.feeds,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
    </Stack.Navigator>
  );
}
