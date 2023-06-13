import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Vibration,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setRerenderMessages, setRerederRooms } from "../../redux/chat";
import GetTimesAgo from "../../functions/getTimesAgo";
import { Language } from "../../context/language";
import { CacheableImage } from "../../components/cacheableImage";
import { FontAwesome } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Message = (props) => {
  const language = Language();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const currentChat = useSelector((state) => state.storeChat.currentChat);

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

  // define sender
  let currentUserSender;
  if (props.senderId === currentUser._id) {
    currentUserSender = true;
  } else {
    currentUserSender = false;
  }

  // delete message
  const DeleteMessage = async (m) => {
    try {
      props.setMessages(props.messages.filter((me) => me._id !== m._id));
      if (m.senderId === currentUser._id) {
        await axios.delete(
          "https://beautyverse.herokuapp.com/api/v1/chats/messages/" + m._id
        );
        let lastMsgIndex = props.messages.findIndex(
          (item) => item._id === m._id
        );

        if (lastMsgIndex === props.messages.length - 1) {
          let newLastMessage = props.messages[lastMsgIndex - 1];

          await axios.patch(
            "https://beautyverse.herokuapp.com/api/v1/chats/" +
              currentChat.room,
            {
              lastMessage: newLastMessage?.text,
              lastMessageCreatedAt: newLastMessage?.sentAt,
              lastSender: newLastMessage?.senderId,
              status: "read",
            }
          );
        }
      } else {
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/messages/" + m._id,
          {
            receiverId: "",
          }
        );
      }

      dispatch(setRerederRooms());
      dispatch(setRerenderMessages());
    } catch (error) {
      console.log(error);
    }
  };

  // define times ago

  const currentPostTime = GetTimesAgo(new Date(props.sentAt).getTime());

  let definedTime;
  if (currentPostTime?.includes("min")) {
    definedTime =
      currentPostTime?.slice(0, -3) + language?.language.Main.feedCard.min;
  } else if (currentPostTime?.includes("h")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.h;
  } else if (currentPostTime?.includes("d")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.d;
  } else if (currentPostTime?.includes("j")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.justNow;
  } else if (currentPostTime?.includes("w")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.w;
  } else if (currentPostTime?.includes("mo")) {
    definedTime =
      currentPostTime?.slice(0, -2) + language?.language.Main.feedCard.mo;
  } else if (currentPostTime?.includes("y")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.y;
  }

  const chatUser = useSelector((state) => state.storeChat.chatUser);

  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onLongPress={() => {
        Vibration.vibrate();
        DeleteMessage(props);
      }}
      delayLongPress={300}
      style={{
        marginTop: props.senderId !== props.prevMessage?.senderId ? 10 : 2,
        width: SCREEN_WIDTH,
        paddingHorizontal: 15,

        // flexDirection: "row",
        alignItems: currentUserSender ? "flex-end" : "start",
      }}
    >
      <View
        style={{
          backgroundColor: currentUserSender
            ? "rgba(255,255,255,0.03)"
            : "rgba(255,255,255,0.1)",
          padding: 10,
          borderRadius: 15,
          gap: 5,
          alignItems: currentUserSender ? "flex-end" : "start",
          maxWidth: SCREEN_WIDTH - 80,
        }}
      >
        {!currentUserSender &&
          props.senderId !== props.prevMessage?.senderId && (
            <Pressable
              onPress={() =>
                props.navigation.navigate("User", {
                  user: chatUser,
                })
              }
            >
              {targetChatMember.cover.length > 0 ? (
                <CacheableImage
                  source={{ uri: targetChatMember.cover }}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 50,
                    resizeMode: "cover",
                  }}
                  onPress={() =>
                    props.navigation.navigate("User", {
                      user: props.chatUser,
                    })
                  }
                  manipulationOptions={[
                    { resize: { width: 40, height: 40 } },
                    { rotate: 90 },
                  ]}
                />
              ) : (
                <View
                  style={{
                    borderRadius: 100,
                    width: 40,
                    aspectRatio: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <FontAwesome name="user" size={20} color="#e5e5e5" />
                </View>
              )}
            </Pressable>
          )}
        <Text style={{ color: "#e5e5e5" }} multiline>
          {props.text}
        </Text>
        <Text style={{ color: "#888", fontSize: 12 }}>{definedTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
