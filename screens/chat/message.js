import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { Video } from "expo-av";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import DeleteMessagePopup from "../../components/confirmDialog";
import { Language } from "../../context/language";
import { storage } from "../../firebase";
import GetTimesAgo from "../../functions/getTimesAgo";
import { setRerederRooms } from "../../redux/chat";

/**
 * Each message component
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Message = (props) => {
  // defines language
  const language = Language();

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines current chat
  const currentChat = useSelector((state) => state.storeChat.currentChat);

  // defines file loading state
  const [loadFile, setLoadFile] = useState(true);

  useEffect(() => {
    setLoadFile(true);
  }, [props.file.url]);

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

  /**
   * Delete message function
   */
  const DeleteMessage = async (m) => {
    try {
      // delete from usestate
      props.setMessages(props.messages.filter((me) => me._id !== m));
      if (props.file.url) {
        Deleting();
      }
      // delete from db if sender is current user
      if (props.senderId === currentUser._id) {
        await axios.delete(
          "https://beautyverse.herokuapp.com/api/v1/chats/messages/" + m
        );

        // define last message for change room options
        let lastMsgIndex = props.messages.findIndex((item) => item._id === m);

        // change room object
        if (lastMsgIndex === props.messages.length - 1) {
          let newLastMessage = props.messages[lastMsgIndex - 2];

          await axios.patch(
            "https://beautyverse.herokuapp.com/api/v1/chats/" +
              currentChat.room,
            {
              lastMessage:
                newLastMessage?.text.length > 0
                  ? newLastMessage.text
                  : "File...",
              lastMessageCreatedAt: newLastMessage?.sentAt,
              lastSender: newLastMessage?.senderId,
              status: "read",
            }
          );
        }
      } else {
        // delete reciever id field if sender not current user
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/messages/" + m._id,
          {
            receiverId: "",
          }
        );
      }

      dispatch(setRerederRooms());
    } catch (error) {
      console.log(error);
    }
  };

  // delete file from cloud
  const Deleting = async () => {
    const values = [];

    // Create a reference to the file to delete
    let fileRef = ref(storage, `chats/${currentChat?.room}/${props.file.id}`);

    // remove feed

    deleteObject(fileRef).then(() => {
      console.log("Deleting...");
    });
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

  // define chat user
  const chatUser = useSelector((state) => state.storeChat.chatUser);

  // define file height
  let hght;
  if (props.file.type === "video") {
    let originalHeight =
      props.file.width >= props.file.height
        ? props.file.width
        : props.file.height;
    let originalWidth =
      props.file.width >= props.file.height
        ? props.file.height
        : props.file.width;

    let percented = originalWidth / (SCREEN_WIDTH / 2);

    hght = originalHeight / percented;
  } else if (props.file.type === "img") {
    let originalHeight = props.file.height;
    let originalWidth = props.file.width;

    let percented = originalWidth / (SCREEN_WIDTH / 2);
    hght = originalHeight / percented;
  }

  // delete confrim
  const [deletePopup, setDeletePopup] = useState(false);

  return (
    <>
      <Pressable
        activeOpacity={0.3}
        onLongPress={() => {
          Vibration.vibrate();
          setDeletePopup(true);
        }}
        delayLongPress={300}
        style={{
          marginTop: props.senderId !== props.prevMessage?.senderId ? 10 : 2,
          width: SCREEN_WIDTH,
          paddingHorizontal: 15,
          // flexDirection: "row",
          alignItems: currentUserSender ? "flex-end" : "flex-start",
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
            alignItems: currentUserSender ? "flex-end" : "flex-start",
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
          {props.file.url && (
            <View>
              {loadFile && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: SCREEN_WIDTH / 2,
                    height: hght,
                    position: "absolute",
                    zIndex: 100,
                  }}
                >
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
              {props.file.type === "video" ? (
                <Video
                  style={{
                    width: SCREEN_WIDTH / 2,
                    height: hght,
                  }}
                  source={{
                    uri: props.file.url,
                  }}
                  rate={1.0}
                  volume={1.0}
                  shouldPlay={true}
                  isLooping
                  resizeMode="contain"
                  useNativeControls={true}
                  onLoad={() => {
                    setLoadFile(false);
                  }}
                />
              ) : (
                <CacheableImage
                  style={{
                    width: SCREEN_WIDTH / 2,
                    height: hght,
                    borderRadius: 5,
                    borderWidth: 2,
                    // borderColor: props.currentTheme.line,
                    resizeMode: "cover",
                  }}
                  source={{ uri: props.file.url }}
                  onLoad={() => setLoadFile(false)}
                />
              )}
            </View>
          )}
          {props.text?.length > 0 && (
            <Text style={{ color: "#e5e5e5" }} multiline>
              {props.text}
            </Text>
          )}
          <Text style={{ color: "#888", fontSize: 12 }}>{definedTime}</Text>
        </View>
      </Pressable>
      {deletePopup && (
        <DeleteMessagePopup
          isVisible={deletePopup}
          onClose={() => setDeletePopup(false)}
          onDelete={() => DeleteMessage(props._id)}
          title="Are you sure to want to delete this message?"
          delet="Delete"
          cancel="Cancel"
        />
      )}
    </>
  );
};
