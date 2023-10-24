// screens/ChatRoomScreen.js
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Modal,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Language } from "../../context/language";

const AIConsultant = ({
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  currentTheme,
  botMessages,
  dots,
  input,
  setInput,
  loadingTyping,
  SendMessage,
  setBot,
  setBotMessages,
  bot,
}) => {
  const [mBottom, setMbottom] = useState(new Animated.Value(0));
  const animateMBottom = (toValue) => {
    Animated.timing(mBottom, {
      toValue,
      duration: 300, // you can adjust the duration
      useNativeDriver: false,
    }).start();
  };
  const language = Language();
  return (
    <Modal
      animationType="fadeIn"
      isVisible={bot}
      transparent
      onRequestClose={() => setBot(false)}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: currentTheme.background,

            marginTop: 50,
          }}
        >
          <View
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT - 50,
              backgroundColor: currentTheme.background2,
              alignItems: "center",
              padding: 10,
              borderWidth: 1.5,
              borderColor: currentTheme.pink,
              borderBottomWidth: 0,
              borderBottomEndRadius: 0,
              borderBottomLeftRadius: 0,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                marginVertical: 15,
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="robot-love-outline"
                size={20}
                color={currentTheme.pink}
              />
              <Text
                style={{
                  color: currentTheme.font,
                  letterSpacing: 0.5,
                  fontWeight: "bold",
                  marginTop: 2,
                  fontSize: 16,
                }}
              >
                {language.language.Chat.chat.aiConsultant}
              </Text>
            </View>
            <ScrollView
              style={{
                zIndex: 9,
                width: "100%",
                padding: 20,
                paddingTop: 0,
                // height: SCREEN_HEIGHT - 200,
              }}
              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 250,
              }}
            >
              <BotMessages
                botMessages={botMessages}
                currentTheme={currentTheme}
                SCREEN_WIDTH={SCREEN_WIDTH}
              />

              <View style={{ marginVertical: 10 }}>
                {loadingTyping && (
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
                      {language.language.Chat.chat.consultantTyping}
                      {Array(dots + 1).join(".")}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <Animated.View
              style={{
                position: "absolute",
                bottom: mBottom,
                zIndex: 10,
                width: SCREEN_WIDTH,
                height: 150,
                backgroundColor: currentTheme.background,
                borderBottomEndRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            >
              <BotInput
                input={input}
                setInput={setInput}
                currentTheme={currentTheme}
                SendMessage={SendMessage}
                SCREEN_WIDTH={SCREEN_WIDTH}
                animateMBottom={animateMBottom}
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <Pressable
                  style={{
                    height: 35,
                    marginVertical: 10,
                    padding: 8,
                    paddingHorizontal: 15,
                    borderRadius: 50,
                    backgroundColor: currentTheme.pink,
                    alignItems: "center",
                    width: "40%",
                  }}
                  onPress={() => {
                    setBot(false);
                    setBotMessages([]);
                  }}
                >
                  <Text style={{ color: "#fff" }}>
                    {language.language.Chat.chat.disableBot}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AIConsultant;

const BotMessages = ({ botMessages, currentTheme, SCREEN_WIDTH }) => {
  return (
    <>
      {botMessages?.length > 0 &&
        botMessages?.map((item, index) => {
          if (index !== 0) {
            return (
              <View
                key={index}
                style={{
                  width: SCREEN_WIDTH - 60,
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
    </>
  );
};

const BotInput = ({
  input,
  setInput,
  currentTheme,
  SendMessage,
  scrollRef,
  SCREEN_WIDTH,
  animateMBottom,
}) => {
  const language = Language();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 300}
    >
      <View
        style={{
          minHeight: 65,
          paddingHorizontal: SCREEN_WIDTH / 15,
          backgroundColor: currentTheme.background,
          borderTopWidth: 1,
          borderColor: currentTheme.line,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <TextInput
          placeholder={language.language.Chat.chat.typeText}
          placeholderTextColor={currentTheme.disabled}
          onChangeText={setInput}
          value={input}
          onFocus={() => animateMBottom(260)}
          onBlur={() => animateMBottom(0)}
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
