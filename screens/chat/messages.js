// screens/ChatRoomScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Message } from "../../screens/chat/message";

export const Messages = ({ route, navigation, messages, setMessages }) => {
  const flatListRef = useRef(null);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const rerenderScroll = useSelector((state) => state.storeChat.rerenderScroll);

  // This effect will run every time a new message is added to the `messages` state
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 0);
    }
  }, [rerenderScroll, messages]);
  return (
    <ScrollView ref={flatListRef} contentContainerStyle={{ paddingBottom: 20 }}>
      {messages?.map((item, index, arr) => {
        let prevMessage = index - 1;
        let nextMessage = index + 1;
        if (
          item?.senderId === currentUser?._id ||
          item?.receiverId === currentUser?._id
        ) {
          return (
            <Message
              key={index}
              {...item}
              setMessages={setMessages}
              messages={messages}
              prevMessage={arr[prevMessage] && arr[prevMessage]}
              nextMessage={arr[nextMessage] && arr[nextMessage]}
            />
          );
        }
      })}
    </ScrollView>
  );
};
