import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity, Image, Text, Dimensions } from "react-native";
import { Chat } from "../screens/chat/chat";
import { Room } from "../screens/chat/room";
import Icon from "react-native-vector-icons/FontAwesome";
import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setOpenAddChat } from "../redux/chat";
import { CacheableImage } from "../components/cacheableImage";

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

export function ChatStack({ route, navigation, socket }) {
  const currentChat = useSelector((state) => state.storeChat.currentChat);
  const currentUser = useSelector((state) => state.storeUser.currentUser);

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

  const dispatch = useDispatch();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chats"
        component={withVariant2(socket)}
        options={{
          headerBackTitleVisible: false,
          title: "Chats",
          headerStyle: {
            backgroundColor: "#111",
            height: 50,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: "#111",
          },
          headerLeft: () => (
            <TouchableOpacity
              acitveOpacity={0.3}
              style={{ marginLeft: 15 }}
              onPress={() => dispatch(setOpenAddChat(true))}
            >
              <Icon name="plus" size={18} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ marginRight: 15 }}>
              <Icon name="bars" size={18} color="#fff" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Room"
        component={withVariant(socket)}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "name",
          headerStyle: {
            backgroundColor: "#111",
            height: 50,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: (props) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
                width: SCREEN_WIDTH - 150,
              }}
            >
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

              <Text
                style={{
                  fontSize: 18,
                  letterSpacing: 0.5,
                  color: "#e5e5e5",
                  fontWeight: "bold",
                }}
              >
                {targetChatMember?.name}
              </Text>
            </View>
          ),
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: "#111",
          },
        })}
      />
    </Stack.Navigator>
  );
}
