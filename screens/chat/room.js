// screens/ChatRoomScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Messages } from "../../screens/chat/messages";
import { Input } from "../../screens/chat/input";
import {
  setRerederRooms,
  setRerenderScroll,
  setChatUser,
} from "../../redux/chat";
// import { LogBox } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { lightTheme, darkTheme } from "../../context/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// LogBox.ignoreLogs([
//   "Sending 'onAnimatedValueUpdate' with no listeners registered",
// ]);

export const Room = ({ route, socket }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const currentChat = useSelector((state) => state.storeChat.currentChat);
  const rerenderMessages = useSelector(
    (state) => state.storeChat.rerenderMessages
  );
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

  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLength, setMessagesLength] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const GetMessages = async () => {
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/chats/messages/" +
          currentChat.room +
          "?page=" +
          page
      );
      setMessagesLength(response.data.length);
      setMessages((prev) => {
        const newChats = response.data.data.chats.filter(
          (newChat) => !prev.some((prevChat) => prevChat._id === newChat._id)
        );
        return [...newChats, ...prev];
      });
    };
    try {
      if (currentChat) {
        GetMessages();
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  }, [rerenderMessages, page]);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        sentAt: new Date(),
      });
    });
  }, []);

  useEffect(() => {
    const Adding = async () => {
      arrivalMessage &&
        (currentChat?.members.member1 === arrivalMessage?.sender ||
          currentChat?.members.member2 === arrivalMessage?.sender) &&
        (await setMessages((prev) => [...prev, arrivalMessage]));
      setTimeout(() => {
        dispatch(setRerenderScroll());
        setLoading(false);
      }, 500);
    };
    Adding();
  }, [arrivalMessage, currentChat]);

  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            height: 500,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={currentTheme.pink} size="large" />
        </View>
      ) : (
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flex: 1,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 100,
            // paddingBottom: Platform.OS === "ios" ? 70 : 0, //Conditional paddingBottom
          }}
          extraScrollHeight={40}
          // behavior={Platform.OS === "ios" ? "padding" : "height"} //Conditional behavior
          // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} //Conditional keyboardVerticalOffset
        >
          <Messages
            messages={messages}
            messagesLength={messagesLength}
            setMessages={setMessages}
            setPage={setPage}
            navigation={navigation}
          />
          <View style={{ position: "absolute", bottom: 0 }}>
            <Input
              targetUser={targetChatMember}
              setMessages={setMessages}
              socket={socket}
            />
          </View>
        </KeyboardAwareScrollView>
      )}
    </>
  );
};
