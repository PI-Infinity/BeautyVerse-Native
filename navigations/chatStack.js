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
import { FontAwesome } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setOpenAddChat } from "../redux/chat";
import { CacheableImage } from "../components/cacheableImage";
import { MaterialIcons } from "@expo/vector-icons";
import { Language } from "../context/language";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { lightTheme, darkTheme } from "../context/theme";
import { SendOrder } from "../screens/orders/sendOrder";
import { SentOrders } from "../screens/sentOrders/sentOrders";
import axios from "axios";

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

export function ChatStack({ route, socket, navigation }) {
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

  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    const GetUser = async () => {
      try {
        // Make a request to get the current user's data from the server
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetChatMember?.id}`
        );
        // Set the current user in the user's Redux store
        setUserObj(response.data.data.user);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    if (targetChatMember) {
      // Call GetUser if currUser is not null
      GetUser();
    }
  }, [currentChat]);

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
        children={() => <Chat socket={socket} navigation={navigation} />}
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
            letterSpacing: 0.5,
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
          headerLeft: () => (
            <TouchableOpacity
              acitveOpacity={0.3}
              style={{ marginLeft: 15, padding: 5 }}
              onPress={() => dispatch(setOpenAddChat(true))}
            >
              <FontAwesome name="plus" size={18} color={currentTheme.font} />
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <View style={{ marginRight: 15 }}>
          //     <FontAwesome name="bars" size={18} color={currentTheme.font} />
          //   </View>
          // ),
        }}
      />
      <Stack.Screen
        name="Room"
        children={() => <Room socket={socket} navigation={navigation} />}
        options={({ route, navigation }) => ({
          headerBackTitleVisible: false,
          // title: "name",
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
                  user: userObj,
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
            letterSpacing: 0.5,
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="User"
        component={User}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: (props) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                width: "100%",
                gap: 5,
              }}
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
              {route.params.user.subscription.status === "active" && (
                <MaterialIcons name="verified" size={14} color="#F866B1" />
              )}
            </View>
          ),
          headerRight: (props) => {
            if (currentUser?.type.toLowerCase() !== "beautycenter") {
              return (
                <View style={{ marginRight: 20 }}>
                  {route.params.user._id !== currentUser._id && (
                    <TouchableOpacity
                      acitveOpacity={0.3}
                      onPress={() =>
                        navigation.navigate("Send Order", {
                          user: route.params.user,
                        })
                      }
                    >
                      <FontAwesome
                        name="calendar"
                        size={18}
                        color={currentTheme.font}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }
          },
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            letterSpacing: 0.5,
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="UserVisit"
        component={User}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: (props) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                width: "100%",
                gap: 5,
              }}
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
              {route.params.user.subscription.status === "active" && (
                <MaterialIcons name="verified" size={14} color="#F866B1" />
              )}
            </View>
          ),
          headerRight: (props) => {
            if (currentUser?.type.toLowerCase() !== "beautycenter") {
              return (
                <View style={{ marginRight: 20 }}>
                  {route.params.user._id !== currentUser._id && (
                    <TouchableOpacity
                      acitveOpacity={0.3}
                      onPress={() =>
                        navigation.navigate("Send Order", {
                          user: route.params.user,
                        })
                      }
                    >
                      <FontAwesome
                        name="calendar"
                        size={18}
                        color={currentTheme.font}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }
          },

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
            letterSpacing: 0.5,
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
            letterSpacing: 0.5,
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="Send Order"
        component={SendOrder}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Booking",
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
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="Sent Orders"
        component={SentOrders}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "My Bookings",
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
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
    </Stack.Navigator>
  );
}
