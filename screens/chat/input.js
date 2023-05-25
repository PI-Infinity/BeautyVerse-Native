import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import {
  setRerenderMessages,
  setRerederRooms,
  setRerenderScroll,
} from "../../redux/chat";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Input = ({ targetUser, setMessages, socket }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState("");

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const currentChat = useSelector((state) => state.storeChat.currentChat);

  const SendMessage = async () => {
    try {
      setText("");
      setFile("");
      await setMessages((prev) => [
        ...prev,
        {
          room: currentChat.room,
          senderId: currentUser._id,
          receiverId: targetUser.id,
          text: text,
          file: file,
          sentAt: new Date().toISOString(),
        },
      ]);
      dispatch(setRerenderScroll());
      socket.current.emit("sendMessage", {
        room: currentChat.room,
        senderId: currentUser._id,
        senderName: currentUser.name,
        senderCover: currentUser.cover,
        receiverId: targetUser.id,
        text: text,
        file: file,
      });
      await axios.post(
        "https://beautyverse.herokuapp.com/api/v1/chats/messages",
        {
          room: currentChat.room,
          senderId: currentUser._id,
          receiverId: targetUser.id,
          text: text,
          file: file,
          sentAt: new Date(),
        }
      );
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/chats/" + currentChat.room,
        {
          lastMessage: text,
          lastMessageCreatedAt: new Date(),
          lastSender: currentUser._id,
          status: "unread",
        }
      );
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/chats/" + currentChat.room,
        {
          hideFor: "",
        }
      );
      dispatch(setRerenderMessages());
      dispatch(setRerederRooms());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // delete message
  const DeleteMessage = async () => {
    try {
      await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/chats/messages"
      );
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // read message
  const ReadMessage = async () => {
    try {
      if (currentChat.lastSender !== currentUser._id) {
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/" + currentChat.room,
          {
            status: "read",
          }
        );
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        height: 60,
        paddingHorizontal: SCREEN_WIDTH / 8,
        backgroundColor: "#222",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <TextInput
        placeholder="Type something.."
        placeholderTextColor="#555"
        onChangeText={setText}
        autoFocus
        onFocus={ReadMessage}
        value={text}
        multiline
        onSubmitEditing={() => {
          if (text?.length) {
            SendMessage();
          } else {
            console.log("no message");
          }
        }}
        // autoofcus
        style={{
          // height: "100%",
          width: "100%",
          color: "#e5e5e5",
        }}
      />
      <FontAwesome
        name="image"
        size={18}
        color="#e5e5e5"
        style={{ marginRight: 15 }}
      />
      <TouchableOpacity
        onPress={text?.length > 0 ? SendMessage : undefined}
        activeOpacity={0.3}
      >
        <FontAwesome name="send" size={20} color="#e5e5e5" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});
