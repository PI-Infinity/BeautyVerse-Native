// screens/ChatRoomScreen.js
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../../context/language";
import { useSocket } from "../../context/socketContext";
import { darkTheme, lightTheme } from "../../context/theme";
import { ProceduresOptions } from "../../datas/registerDatas";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * Chat room
 */

export const AIAssistent = ({ route }) => {
  // defines socket server
  const socket = useSocket();

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines navigation
  const navigation = useNavigation();

  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // text loading state
  const [loading, setLoading] = useState(false);
  // define all beautyverse's procedures list
  const proceduresOptions = ProceduresOptions();
  let filtered = proceduresOptions?.filter(
    (item) => item.value.split(" - ")?.length < 2
  );

  // defines loading state
  const [messages, setMessages] = useState([]);

  // text input
  const [input, setInput] = useState("");

  // scrolling ref
  const scrollRef = useRef();

  const SendMessage = async (txt) => {
    setLoading(true);
    setInput("");

    // Added this part to ensure user messages are correctly appended.
    const updatedMessages = [...messages, { role: "user", content: txt }];
    setMessages(updatedMessages);

    try {
      const response = await axios.post(backendUrl + "/ai/assistent", {
        text: JSON.stringify(updatedMessages),
      });

      // Use a functional update for state to ensure we always work with the most up-to-date state.
      setMessages((prev) => [
        ...prev,
        {
          content: response.data.data.answer.choices[0].message.content,
          role: "assistant",
        },
      ]);
      setLoading(false); // Moved this to a finally block to ensure it always runs
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    SendMessage(
      "Hi, you are my beauty and self-care assistant. Please focus on beauty and care topics. If a topic arises that is not related to beauty or care, kindly remember that you are specialized in beauty and care only, and you won't discuss other spheres. Let's begin! Please feel free and ask any question! language: " +
        lang +
        ", (if question will not be from beauty and self care, don't answer! don't write about this if nobody answers)"
    );
  }, []);

  // defines current chat
  const currentChat = useSelector((state) => state.storeChat.currentChat);

  // defines language
  const language = Language();

  // getting screen height passed as route from parent screen
  const { screenHeight } = route.params;

  // rerender messages redux state
  const rerenderMessages = useSelector(
    (state) => state.storeChat.rerenderMessages
  );

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // language
  const lang = useSelector((state) => state.storeApp.language);

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
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
        style={{
          width: "100%",
          zIndex: 100,
          height: Platform.OS === "ios" ? screenHeight : screenHeight - 410,
        }}
      >
        {messages?.length > 0 &&
          messages?.map((item, index) => {
            if (index !== 0) {
              return (
                <View
                  key={index}
                  style={{
                    width: SCREEN_WIDTH - 40,
                    padding: 12.5,
                    borderWidth: 1,
                    borderColor:
                      item.role === "assistant"
                        ? currentTheme.pink
                        : currentTheme.disabled,
                    borderRadius: 30,
                    borderTopLeftRadius: item.role === "assistant" ? 0 : 30,
                    borderTopRightRadius: item.role === "user" ? 0 : 30,
                    marginTop: 6,
                  }}
                >
                  <Text
                    style={{
                      color: currentTheme.font,
                      letterSpacing: 0.5,
                      lineHeight: 18,
                      fontSize: 14,
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
              );
            }
          })}

        <View style={{ marginVertical: 10 }}>
          {loading && (
            <View
              style={{
                padding: 8,
                paddingHorizontal: 15,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor: currentTheme.line,
                width: 200,
                backgroundColor: currentTheme.background2,
              }}
            >
              <Text style={{ color: currentTheme.font }}>
                {language.language.Chat.chat.assistantTyping}
                {Array(dots + 1).join(".")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Input
        input={input}
        setInput={setInput}
        currentTheme={currentTheme}
        SendMessage={SendMessage}
        scrollRef={scrollRef}
      />
    </>
  );
};

const Input = ({ input, setInput, currentTheme, SendMessage, scrollRef }) => {
  const language = Language();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 300}
    >
      <View
        style={{
          width: SCREEN_WIDTH,
          minHeight: 65,
          paddingHorizontal: SCREEN_WIDTH / 15,
          // marginBottom: Platform.OS === "ios" ? 95 : 105,
          // paddingBottom: 8,

          backgroundColor: currentTheme.background,
          borderTopWidth: 1,
          borderColor: currentTheme.line,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <TextInput
          placeholder={language?.language?.Chat?.chat?.typeText}
          placeholderTextColor={currentTheme.disabled}
          onChangeText={setInput}
          value={input}
          onFocus={() => scrollRef.current.scrollToEnd({ animated: true })}
          // onBlur={() => setMbottom(100)}
          multiline
          style={{
            flex: 1.6,
            color: currentTheme.font,
            width: "70%",
          }}
          // ref={inputRef}
        />

        <TouchableOpacity
          onPress={input?.length > 0 ? () => SendMessage(input) : undefined}
          activeOpacity={0.3}
          style={{ position: "absolute", right: 25 }}
        >
          <FontAwesome name="send" size={20} color={currentTheme.pink} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
