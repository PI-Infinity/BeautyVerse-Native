// screens/ChatRoomScreen.js
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setRerenderScroll, updateRoom } from "../../redux/chat";
import { Input } from "../../screens/chat/input";
import { Messages } from "../../screens/chat/messages";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useSocket } from "../../context/socketContext";
import { darkTheme, lightTheme } from "../../context/theme";

/**
 * Chat room
 */

export const Room = ({ route }) => {
  // defines socket server
  const socket = useSocket();

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines navigation
  const navigation = useNavigation();

  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines loading state
  const [loading, setLoading] = useState(true);

  // defines current chat
  const currentChat = useSelector((state) => state.storeChat.currentChat);

  // getting screen height passed as route from parent screen
  const { screenHeight } = route.params;

  // rerender messages redux state
  const rerenderMessages = useSelector(
    (state) => state.storeChat.rerenderMessages
  );

  // define current user
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

  // defines messages list
  const [messages, setMessages] = useState([]);
  // defins messages length
  const [messagesLength, setMessagesLength] = useState([]);
  // defines pages for backend to get messages on scrolling
  const [page, setPage] = useState(1);

  /**
   * Get messages function
   */
  useEffect(() => {
    const GetMessages = async () => {
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/chats/messages/" +
          currentChat.room +
          "?page=1"
      );
      setMessagesLength(response.data.length);
      setMessages(response.data.data.chats);
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          dispatch(setRerenderScroll());
        }, 300);
      }, 200);
    };
    try {
      if (currentChat) {
        GetMessages();
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  }, [rerenderMessages, currentChat?.room]);

  // load more messages state
  const [loadingMore, setLoadingMore] = useState(false);

  /**
   * Add old messages on scroll to top
   */
  const AddMessages = async () => {
    setLoadingMore(true);
    try {
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/chats/messages/" +
          currentChat.room +
          "?page=" +
          page
      );
      setMessagesLength(response.data.length);
      setMessages((prev) => {
        const newMessages = response.data.data.chats;
        return newMessages.reduce((acc, curr) => {
          const existingMsgIndex = acc.findIndex((msg) => msg._id === curr._id);
          if (existingMsgIndex !== -1) {
            // Message already exists, merge the data
            const mergedMsgs = { ...acc[existingMsgIndex], ...curr };
            return [
              ...acc.slice(0, existingMsgIndex),
              mergedMsgs,
              ...acc.slice(existingMsgIndex + 1),
            ];
          } else {
            // Message doesn't exist, add to the start of the array
            return [curr, ...acc];
          }
        }, prev);
      });
      setLoadingMore(false);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    AddMessages();
  }, [page]);

  // defines when screen focused
  const isFocused = useIsFocused();

  /**
   * Getting new message on real time used socket io
   */
  useEffect(() => {
    socket.on("getMessage", (data) => {
      const Adding = async () => {
        data &&
          (currentChat?.members.member1 === data?.senderId ||
            currentChat?.members.member2 === data?.senderId) &&
          setMessages((prev) => [
            ...prev,
            {
              sender: data.senderId,
              receiverId: data.receiverId,
              text: data.text,
              sentAt: new Date(),
              file: data.file?.url ? data.file : "",
            },
          ]);
        dispatch(
          updateRoom({
            roomId: data.room,
            lastMessageCreatedAt: new Date().toISOString(),
            lastSender: data.senderId,
            lastMessage: data.text,
            status: isFocused ? "read" : "unread",
            file: data.file?.url ? data.file : "",
          })
        );
      };
      Adding();
      dispatch(setRerenderScroll());
    });
  }, [isFocused]);

  // messages scroll ref
  const flatListRef = useRef(null);

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
        <View
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 100,
            height: screenHeight,
          }}
        >
          <Messages
            messages={messages}
            messagesLength={messagesLength}
            setMessages={setMessages}
            setPage={setPage}
            navigation={navigation}
            AddMessages={AddMessages}
            loading={loadingMore}
            setLoading={setLoadingMore}
            flatListRef={flatListRef}
          />
          <Input
            targetUser={targetChatMember}
            setMessages={setMessages}
            flatListRef={flatListRef}
          />
        </View>
      )}
    </>
  );
};
