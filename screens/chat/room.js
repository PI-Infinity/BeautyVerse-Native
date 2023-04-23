// screens/ChatRoomScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Messages } from "../../screens/chat/messages";
import { Input } from "../../screens/chat/input";
import { setRerederRooms, setRerenderScroll } from "../../redux/chat";

export const Room = ({ route, navigation, socket }) => {
  const dispatch = useDispatch();

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

  useEffect(() => {
    const GetMessages = async () => {
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/chats/messages/" +
          currentChat.room
      );
      setMessages(response.data.data.chats);
    };
    try {
      if (currentChat) {
        GetMessages();
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  }, [currentChat, rerenderMessages]);

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
      }, 0);
    };
    Adding();
  }, [arrivalMessage, currentChat]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        // paddingBottom: 30,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Add keyboardVerticalOffset
    >
      <Messages messages={messages} setMessages={setMessages} />
      <Input
        targetUser={targetChatMember}
        setMessages={setMessages}
        socket={socket}
      />
    </KeyboardAvoidingView>
  );
};
