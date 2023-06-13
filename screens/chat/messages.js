// screens/ChatRoomScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, Text, Alert, ScrollView, Pressable } from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Message } from "../../screens/chat/message";

export const Messages = ({
  route,
  navigation,
  messages,
  setMessages,
  setPage,
  messagesLength,
}) => {
  const flatListRef = useRef(null);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const rerenderScroll = useSelector((state) => state.storeChat.rerenderScroll);

  const [messagesData, setMessagesData] = useState([]);

  useEffect(() => {
    setMessagesData(messages);
  }, [messages]);

  // This effect will run every time a new message is added to the `messages` state
  const scrollingRefDisable = useRef(true);
  const [isScrollViewReady, setIsScrollViewReady] = useState(false);

  useEffect(() => {
    if (scrollingRefDisable.current) {
      scrollingRefDisable.current = false;
      return;
    }
    if (flatListRef && flatListRef.current && isScrollViewReady) {
      // Add this check
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 10);
    }
  }, [rerenderScroll]);

  return (
    <ScrollView
      ref={flatListRef}
      contentContainerStyle={{ paddingBottom: 20 }}
      onLayout={() => setIsScrollViewReady(true)}
    >
      {messagesLength > messagesData?.length && (
        <Pressable
          onPress={() => {
            setPage((prev) => prev + 1);
          }}
          style={{
            padding: 10,
            backgroundColor: "#222",
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>Load more messages</Text>
        </Pressable>
      )}
      {messagesData?.map((item, index, arr) => {
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
              messages={messagesData}
              prevMessage={arr[prevMessage] && arr[prevMessage]}
              nextMessage={arr[nextMessage] && arr[nextMessage]}
              navigation={navigation}
            />
          );
        }
      })}
    </ScrollView>
  );
};
