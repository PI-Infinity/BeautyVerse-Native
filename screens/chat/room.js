// screens/ChatRoomScreen.js
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  View,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/socketContext";
import { darkTheme, lightTheme } from "../../context/theme";
import { setRerenderScroll } from "../../redux/chat";
import { Input } from "../../screens/chat/input";
import { Messages } from "../../screens/chat/messages";
import AIConsultant from "./AIConsultant";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Language } from "../../context/language";
import { BlurView } from "expo-blur";
import { ActivityIndicator } from "react-native-paper";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

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

  // defines language
  const language = Language();

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

  // defines target user
  const [targetUser, setTargetUser] = useState(null);

  // defines bot answers or not
  const [bot, setBot] = useState(false);

  // define target member
  let targetChatMember;
  if (currentChat?.members.member1 === currentUser._id) {
    targetChatMember = {
      id: currentChat?.members.member2,
      name: currentChat?.members.member2Name,
      cover: currentChat?.members.member2Cover,
      pushNotificationToken: currentChat?.members.member2PushNotificationToken,
    };
  } else {
    targetChatMember = {
      id: currentChat?.members.member1,
      name: currentChat?.members.member1Name,
      cover: currentChat?.members.member1Cover,
      pushNotificationToken: currentChat?.members.member1PushNotificationToken,
    };
  }

  // defines messages list
  const [messages, setMessages] = useState([]);

  // defins messages length
  const [messagesLength, setMessagesLength] = useState([]);
  // defines pages for backend to get messages on scrolling
  const [page, setPage] = useState(1);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Get messages function
   */
  useEffect(() => {
    const GetMessages = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/v1/chats/messages/" + currentChat.room + "?page=1"
        );
        if (response && response.data) {
          // handle the response
          setMessagesLength(response.data.length);
          setMessages(response.data.data.chats);
          setTimeout(() => {
            setLoading(false);
            setTimeout(() => {
              dispatch(setRerenderScroll());
            }, 300);
          }, 200);
        } else {
          console.error(
            "The response or the data from the server was undefined."
          );
        }
      } catch (error) {
        Alert.alert(error.response.data.message);
      }
    };
    if (currentChat?.room) {
      GetMessages();
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
        backendUrl +
          "/api/v1/chats/messages/" +
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
              messageUniqueId: data.messageUniqueId,
              senderId: data.senderId,
              receiverId: data.receiverId,
              text: data.text,
              sentAt: new Date(),
              file: data.file?.url ? data.file : "",
              status: data.status,
            },
          ]);
      };

      Adding();
      dispatch(setRerenderScroll());
    });
  }, [isFocused]);

  // messages scroll ref
  const flatListRef = useRef(null);

  /**
   * Bot assistant
   */

  const [botMessages, setBotMessages] = useState([]);
  const [input, setInput] = useState("");
  const lang = useSelector((state) => state.storeApp.language);
  const [loadingTyping, setLoadingTyping] = useState(true);
  const [activeBookings, setActiveBookings] = useState([]);

  // dots animation
  const [dots, setDots] = useState(0);

  useEffect(() => {
    // Set an interval to update the number of dots
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4);
    }, 500); // Change dots every 500ms

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const GetUser = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/v1/users/" + targetChatMember.id
        );
        setTargetUser(response.data.data.user);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    const GetBookings = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/bookings/" +
            currentUser._id +
            `?status=active&date=""
          }&createdAt=""&procedure=""`
        );
        setActiveBookings(response.data.data.bookings);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    GetUser();
    GetBookings();
  }, []);

  /**
   *
   * Send message
   */

  const SendMessage = async (txt) => {
    setLoadingTyping(true);
    setInput("");

    // Added this part to ensure user messages are correctly appended.
    const updatedMessages = [...botMessages, { role: "user", content: txt }];
    setBotMessages(updatedMessages);

    try {
      const response = await axios.post(backendUrl + "/ai/assistent", {
        text: JSON.stringify(updatedMessages),
      });

      // Use a functional update for state to ensure we always work with the most up-to-date state.
      setBotMessages((prev) => [
        ...prev,
        {
          content: response.data.data.answer.choices[0].message.content,
          role: "assistant",
        },
      ]);
      setLoadingTyping(false); // Moved this to a finally block to ensure it always runs
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (bot) {
      let {
        notifications,
        visitors,
        visitorsStats,
        feeds,
        followers,
        followings,
        statistics,
        ...filtered
      } = targetUser;

      SendMessage(
        `Hello! you are the personal consultant for ${
          targetUser.name
        }. your responses are based solely on the information provided about ${
          targetUser.name
        }. You will not use any external or intrinsic knowledge beyond the data provided. If any unrelated topics arise, please remember that you specialize only in the data about ${
          targetUser.name
        } and will refrain from discussing other subjects. Feel free to anwer relevant to the provided data! Language setting: ${lang}. Please adhere to this topic, or You might not be able to assist. data: ${JSON.stringify(
          filtered
        )}, language: ${lang}, activeBookings: ${JSON.stringify(
          activeBookings
        )} . (by this active bookings you can define what time is not available). always try to answer shortly as possible! if role: assistant content includes once "hello", don't say one more time!`
      );
    }
  }, [bot]);

  return (
    <BlurView tint="extra-dark" intensity={100} style={{ flex: 1 }}>
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
        <>
          {!bot && (
            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 100,
                height:
                  Platform.OS === "ios" ? screenHeight : screenHeight - 410,
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
              {targetUser &&
                targetUser.type !== "user" &&
                !targetUser.online &&
                !bot && (
                  <View
                    style={{
                      paddingHorizontal: 15,
                      alignItems: "center",
                      marginVertical: 15,
                    }}
                  >
                    <Text
                      style={{
                        color: currentTheme.disabled,
                        letterSpacing: 0.3,
                        textAlign: "center",
                        lineHeight: 18,
                      }}
                    >
                      {`${targetUser?.name}` +
                        language?.language?.Chat?.chat?.assistantOffer}
                    </Text>
                    <Pressable
                      onPress={() => setBot(true)}
                      style={{
                        margin: 8,
                        backgroundColor: currentTheme.pink,
                        borderRadius: 50,
                        padding: 8,
                        width: 170,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="robot-love-outline"
                        size={20}
                        color="#fff"
                      />
                      <Text
                        style={{
                          color: currentTheme.font,
                          letterSpacing: 0.3,
                          fontWeight: "bold",
                        }}
                      >
                        {language?.language?.Chat?.chat?.aiConsultant}
                      </Text>
                    </Pressable>
                  </View>
                )}
              <Input
                targetUser={targetChatMember}
                setMessages={setMessages}
                flatListRef={flatListRef}
              />
            </View>
          )}
        </>
      )}
      {bot && targetUser?.type !== "user" && (
        <AIConsultant
          SCREEN_HEIGHT={SCREEN_HEIGHT}
          SCREEN_WIDTH={SCREEN_WIDTH}
          bot={bot}
          setBot={setBot}
          SendMessage={SendMessage}
          botMessages={botMessages}
          input={input}
          setInput={setInput}
          dots={dots}
          currentTheme={currentTheme}
          loadingTyping={loadingTyping}
          setBotMessages={setBotMessages}
        />
      )}
    </BlurView>
  );
};
