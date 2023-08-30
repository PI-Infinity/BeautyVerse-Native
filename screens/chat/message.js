import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Video } from "expo-av";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
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
import { darkTheme, lightTheme } from "../../context/theme";
import { useSocket } from "../../context/socketContext";

/**
 * Each message component
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Message = (props) => {
  // console.log("unique id: " + props.data.messageUniqueId);
  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines socket server
  const socket = useSocket();

  // message data
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  // console.log(props.data);
  // console.log(props?.data);

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

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // read message
  const ReadMessage = async () => {
    console.log(props?.data?.messageUniqueId);
    try {
      await axios.patch(
        backendUrl + "/api/v1/chats/seen/" + props?.data?.messageUniqueId,
        {
          status: "read",
        }
      );
      await axios.patch(backendUrl + "/api/v1/chats/" + currentChat.room, {
        status: "read",
        lastMessageSeen: "seen",
      });
      socket.emit("updateMessage", {
        targetId: props.data?.senderId,
        data: props.data,
      });
      dispatch(setRerederRooms());
    } catch (error) {
      console.log(error.response.data?.message);
      console.log("error");
    }
  };

  useEffect(() => {
    // if (data?.receiverId !== currentUser._id) {
    socket.on("messageUpdate", ({ Msg }) => {
      if (Msg.messageUniqueId === props?.data?.messageUniqueId) {
        setData({ ...Msg, status: "seen" });
        dispatch(setRerederRooms());
      }
    });
    // }
  }, []);

  useEffect(() => {
    if (
      props.data?.senderId !== currentUser._id &&
      props.data?.status === "unread"
    ) {
      ReadMessage();
    }
  }, [props.data?.messageUniqueId]);

  /**
   * Delete message function
   */
  const DeleteMessage = async (m) => {
    try {
      // delete from usestate
      props.setMessages(
        props.messages.filter((me) => me.messageUniqueId !== m)
      );

      // delete from db if sender is current user
      if (props?.data?.senderId === currentUser._id) {
        console.log("delete by sender");

        await axios.delete(backendUrl + "/api/v1/chats/messages/" + m);
        if (props?.data?.file?.url) {
          Deleting();
        }
        // define last message for change room options
        let lastMsgIndex = props.messages.findIndex(
          (item) => item.messageUniqueId === m
        );

        // change room object
        if (lastMsgIndex === props.messages.length - 1) {
          let newLastMessage = props.messages[lastMsgIndex - 1];
          if (newLastMessage) {
            await axios.patch(
              backendUrl + "/api/v1/chats/" + currentChat.room,
              {
                lastMessage:
                  newLastMessage?.text.length > 0
                    ? newLastMessage.text
                    : "File...",
                lastMessageCreatedAt: newLastMessage?.sentAt,
                lastSender: newLastMessage?.senderId,
                status: "read",
                lastMessageSeen: "seen",
              }
            );
          }
        }
      } else {
        // delete reciever id field if sender not current user
        await axios.patch(backendUrl + "/api/v1/chats/messages/" + m, {
          receiverId: "",
        });
      }

      dispatch(setRerederRooms());
    } catch (error) {
      console.log(error);
    }
  };

  // delete file from cloud
  const Deleting = async () => {
    // Create a reference to the file to delete
    let fileRef = ref(storage, `chats/${currentChat?.room}/${data?.file?.id}`);

    // remove feed

    deleteObject(fileRef).then(() => {
      console.log("Deleting...");
    });
  };

  // define times ago
  const currentPostTime = GetTimesAgo(new Date(data?.sentAt).getTime());

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
  if (data?.file?.type === "video") {
    let originalHeight =
      data?.file?.width >= data?.file?.height
        ? data?.file?.width
        : data?.file?.height;
    let originalWidth =
      data?.file?.width >= data?.file?.height
        ? data?.file?.height
        : data?.file?.width;

    let percented = originalWidth / (SCREEN_WIDTH / 2);

    hght = originalHeight / percented;
  } else if (data?.file?.type === "img") {
    let originalHeight = data?.file?.height;
    let originalWidth = data?.file?.width;

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
          marginTop: data?.senderId !== props.prevMessage?.senderId ? 10 : 2,
          width: SCREEN_WIDTH,
          paddingHorizontal: 15,
          // flexDirection: "row",
          alignItems:
            data?.senderId === currentUser._id ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            backgroundColor:
              data?.senderId === currentUser._id
                ? currentTheme.background
                : currentTheme.background2,
            padding: 10,
            borderRadius: 15,
            gap: 5,
            alignItems:
              data?.senderId === currentUser._id ? "flex-end" : "flex-start",
            maxWidth: SCREEN_WIDTH - 80,
          }}
        >
          {!data?.senderId === currentUser._id &&
            props.data?.senderId !== props.prevMessage?.senderId && (
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
                    <FontAwesome
                      name="user"
                      size={20}
                      color={currentTheme.disabled}
                    />
                  </View>
                )}
              </Pressable>
            )}
          {data?.file?.url && (
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
              {data?.file?.type === "video" ? (
                <Video
                  style={{
                    width: SCREEN_WIDTH / 2,
                    height: hght,
                  }}
                  source={{
                    uri: data?.file?.url,
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
                  source={{ uri: data?.file?.url }}
                  onLoad={() => setLoadFile(false)}
                />
              )}
            </View>
          )}
          {data?.text?.length > 0 && (
            <Text style={{ color: currentTheme.font }} multiline>
              {data?.text}
            </Text>
          )}
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Text style={{ color: "#888", fontSize: 12 }}>{definedTime}</Text>
            {data?.senderId === currentUser._id && (
              <MaterialIcons
                name="done-all"
                color={
                  data?.status === "unread"
                    ? currentTheme.disabled
                    : currentTheme.pink
                }
              />
            )}
          </View>
        </View>
      </Pressable>
      {deletePopup && (
        <DeleteMessagePopup
          isVisible={deletePopup}
          onClose={() => setDeletePopup(false)}
          onDelete={() => DeleteMessage(data?.messageUniqueId)}
          title="Are you sure to want to delete this message?"
          delet="Delete"
          cancel="Cancel"
        />
      )}
    </>
  );
};
