// screens/ChatRoomScreen.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../context/theme";
import { Message } from "../../screens/chat/message";
import { useSocket } from "../../context/socketContext";

/**
 * Messages list in room
 */

export const Messages = ({
  navigation,
  messages,
  setPage,
  loading,
  messagesLength,
  flatListRef,
  setMessages,
}) => {
  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines rerender scroll state
  const rerenderScroll = useSelector((state) => state.storeChat.rerenderScroll);

  const socket = useSocket();
  // on navigate scrolls to bottom
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current.scrollToEnd({ animated: true });
    }, 100);
  }, [rerenderScroll]);

  // handle scrolling to top function gettings old messages
  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (!loading && y < -80) {
      if (messagesLength > messages?.length) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <ScrollView
      ref={flatListRef}
      contentContainerStyle={{
        paddingBottom: 20,
        justifyContent: "flex-end",
      }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {loading && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            top: 0,
            alignItems: "center",
            padding: 10,
          }}
        >
          <ActivityIndicator size="small" color={currentTheme.pink} />
        </View>
      )}
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
              data={item}
              messages={messages}
              prevMessage={arr[prevMessage] && arr[prevMessage]}
              nextMessage={arr[nextMessage] && arr[nextMessage]}
              navigation={navigation}
              setMessages={setMessages}
            />
          );
        }
      })}
    </ScrollView>
  );
};
