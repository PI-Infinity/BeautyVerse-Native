import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/socketContext";
import { darkTheme, lightTheme } from "../../context/theme";
import { storage } from "../../firebase";
import { setRooms, setRerenderScroll, setRerederRooms } from "../../redux/chat";
import { File } from "../../screens/chat/file";
import { sendNotification } from "../../components/pushNotifications";

/**
 * Room Input component
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Input = ({
  targetUser,
  setMessages,
  arrivalMessage,
  flatListRef,
}) => {
  // define socket server
  const socket = useSocket();

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define redux dispatch
  const dispatch = useDispatch();

  // define file and text input states
  const [text, setText] = useState("");
  const [file, setFile] = useState("");

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define current chat
  const currentChat = useSelector((state) => state.storeChat.currentChat);

  // chats
  const rooms = useSelector((state) => state.storeChat.rooms);

  // avoid firs render to read message
  const isFirstRender = useRef(true);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
    if (isFirstRender.current) {
      isFirstRender.current = false; // update the flag after the first render
      return;
    }
    // ReadMessage();
  }, [arrivalMessage]);

  let hght = SCREEN_HEIGHT > 700 ? 100 : 70;

  // define margin bottom dinamically
  const [mBottom, setMbottom] = useState(0);

  // send file loading
  const [loading, setLoading] = useState(false);

  // add file
  const [uploadProgress, setUploadProgress] = useState(0);
  const [blobFile, setBlobFile] = useState(null);

  // cancel uploading
  const uploadTaskRef = useRef(null);

  const cancelUpload = () => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
    }
  };

  // convert file to blob
  async function uriToBlob(uri) {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      const response = await fetch(uri);
      return await response.blob();
    }
  }

  useEffect(() => {
    if (file?.type === "video") {
      (async () => {
        const blob = await uriToBlob(file?.uri);
        setBlobFile(blob);
        // You can now use the 'blob' for uploading.
      })();
    }
  }, [file]);

  /**
   * Upload file to cloud and mongoDB
   */

  async function FileUpload() {
    setLoading(true);
    // check file
    if (file[0] && file[0]?.type !== "video") {
      let imgId = currentChat?.room + "image" + uuid.v4();
      let fileRef = ref(storage, `chats/${currentChat.room}/${imgId}/`);
      const blb = await uriToBlob(file[0].uri);

      if (fileRef) {
        // add desktop version
        const snapshot = await uploadBytesResumable(fileRef, blb);
        const url = await getDownloadURL(snapshot.ref);
        try {
          SendMessage(url, "img", imgId);
          setTimeout(async () => {
            setFile([]);

            setLoading(false);
          }, 2000);
        } catch (error) {
          console.error(error.response.data.message);
          setTimeout(async () => {
            setLoading(false);
          }, 2000);
        }
      }
    } else if (file && file?.type === "video") {
      let videoId = currentChat?.room + "video" + uuid.v4();

      let videosRef = ref(storage, `chats/${currentChat?.room}/${videoId}/`);

      const uploadTask = uploadBytesResumable(videosRef, blobFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          try {
            SendMessage(url, "video", videoId);
            setTimeout(async () => {
              setFile([]);

              setLoading(false);
            }, 3000);
          } catch (error) {
            console.error(error.response.data.message);
            setTimeout(async () => {
              setLoading(false);
            }, 3000);
          }
        }
      );
    }
  }

  const videoRef = useRef();

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Send message function
   */

  const SendMessage = async (url, format, fileId) => {
    try {
      setText("");
      setFile([]);
      const msgId = uuid.v4();
      await setMessages((prev) => [
        ...prev,
        {
          messageUniqueId: msgId,
          room: currentChat.room,
          senderId: currentUser._id,
          receiverId: targetUser.id,
          text: text,
          file: {
            url: url,
            type: format,
            height: format === "img" ? file[0].height : file.height,
            width: format === "img" ? file[0].width : file.width,
            id: fileId,
          },
          sentAt: new Date(),
          status: "unread",
        },
      ]);

      dispatch(setRerenderScroll());
      await axios.post(backendUrl + "/api/v1/chats/messages", {
        messageUniqueId: msgId,
        room: currentChat.room,
        senderId: currentUser._id,
        receiverId: targetUser.id,
        text: text,
        file: {
          url: url,
          type: format,
          height: format === "img" ? file[0].height : file.height,
          width: format === "img" ? file[0].width : file.width,
          id: fileId,
        },
        sentAt: new Date(),
        status: "unread",
      });

      socket.emit("sendMessage", {
        messageUniqueId: msgId,
        room: currentChat.room,
        senderId: currentUser._id,
        senderName: currentUser.name,
        senderCover: currentUser.cover,
        receiverId: targetUser.id,
        text: text,
        file: {
          url: url,
          type: format,
          height: format === "img" ? file[0].height : file.height,
          width: format === "img" ? file[0].width : file.width,
          id: fileId,
        },
        status: "unread",
      });

      let updatedRoomObj = {
        lastMessage: text?.length > 0 ? text : "File...",
        lastMessageCreatedAt: new Date().toISOString(),
        lastMessageSeen: "unread",
        lastSender: currentUser._id,
        status: "unread",
        hideFor: "",
      };
      await axios.patch(backendUrl + "/api/v1/chats/" + currentChat.room, {
        ...updatedRoomObj,
      });

      // update chats for target user
      socket.emit("updateChat", {
        targetId: targetUser.id,
      });

      if (targetUser?.pushNotificationToken) {
        await sendNotification(
          targetUser?.pushNotificationToken,
          currentUser.name,
          text,
          targetUser
        );
      }

      // update current user chats state
      dispatch(setRerederRooms());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? hght : 300}
    >
      <View
        style={{
          width: SCREEN_WIDTH,
          minHeight: 65,
          paddingHorizontal: SCREEN_WIDTH / 15,
          // marginBottom: Platform.OS === "ios" ? 95 : 105,
          // paddingBottom: 8,
          marginBottom: mBottom,
          backgroundColor: currentTheme.background,
          borderTopWidth: 1,
          borderColor: currentTheme.line,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <TextInput
          placeholder="Type something.."
          placeholderTextColor={currentTheme.disabled}
          onChangeText={setText}
          value={text}
          onFocus={() => {
            setMbottom(0);
            flatListRef.current.scrollToEnd({ animated: true });
          }}
          onBlur={() => setMbottom(100)}
          multiline
          style={{
            flex: 1.6,
            color: "#e5e5e5",
          }}
          ref={inputRef}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 30,
          }}
        >
          <File
            flatListRef={flatListRef}
            loading={loading}
            setLoading={setLoading}
            videoRef={videoRef}
            file={file}
            setFile={setFile}
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
            cancelUpload={cancelUpload}
          />
        </View>
        <TouchableOpacity
          onPress={
            text?.length > 0 && file?.length < 1
              ? () => SendMessage()
              : file?.length > 0
              ? () => FileUpload()
              : undefined
          }
          activeOpacity={0.3}
          style={{ position: "absolute", right: 25 }}
        >
          <FontAwesome name="send" size={20} color={currentTheme.pink} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});
