import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import DeleteChatPopup from "../../components/confirmDialog";
import { Language } from "../../context/language";
import { useSocket } from "../../context/socketContext";
import { darkTheme, lightTheme } from "../../context/theme";
import GetTimesAgo from "../../functions/getTimesAgo";
import {
  setChatUser,
  setCurrentChat,
  setRerederRooms,
  setRerenderScroll,
  setRooms,
} from "../../redux/chat";

/**
 * Rooms component
 * Defines 2 component (list, item)
 * Item bellow
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Rooms = ({ navigation, search }) => {
  // define redux dispatch
  const dispatch = useDispatch();

  // define socket server
  const socket = useSocket();

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines rooms list
  const rooms = useSelector((state) => state.storeChat.rooms);

  // real time rooms update
  useEffect(() => {
    socket.on("chatUpdate", (data) => {
      dispatch(setRerederRooms());
    });
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            height: SCREEN_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 0 }}
        >
          {rooms?.length > 0 ? (
            rooms &&
            [...rooms]
              .sort(
                (a, b) =>
                  new Date(b.lastMessageCreatedAt) -
                  new Date(a.lastMessageCreatedAt)
              )
              ?.filter((item) => {
                let targetChatMember;
                if (item?.members.member1 === currentUser._id) {
                  targetChatMember = {
                    id: item?.members.member2,
                    name: item?.members.member2Name,
                    cover: item?.members.member2Cover,
                  };
                } else {
                  targetChatMember = {
                    id: item?.members.member1,
                    name: item?.members.member1Name,
                    cover: item?.members.member1Cover,
                  };
                }
                return targetChatMember?.name
                  ?.toLowerCase()
                  .includes(search.toLowerCase());
              })
              ?.map((item, index) => {
                // define target member
                let targetChatMember;
                if (item?.members.member1 === currentUser._id) {
                  targetChatMember = {
                    id: item?.members.member2,
                    name: item?.members.member2Name,
                    cover: item?.members.member2Cover,
                  };
                } else {
                  targetChatMember = {
                    id: item?.members.member1,
                    name: item?.members.member1Name,
                    cover: item?.members.member1Cover,
                  };
                }
                if (item.lastMessage !== "") {
                  if (item.hideFor !== currentUser._id) {
                    return (
                      <RoomItem
                        key={index}
                        targetChatMember={targetChatMember}
                        item={item}
                        navigation={navigation}
                        socket={socket}
                      />
                    );
                  }
                }
              })
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: SCREEN_HEIGHT / 1.4,
              }}
            >
              <Text
                style={{
                  letterSpacing: 0.3,
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                No chats found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
};

/**
 * Chat room list Item
 */

const RoomItem = ({ targetChatMember, item, navigation, socket }) => {
  // defines redux dispatch
  const dispatch = useDispatch();

  // defines rooms list
  const rooms = useSelector((state) => state.storeChat.rooms);

  // delete confrim
  const [deletePopup, setDeletePopup] = useState(false);

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines user object
  const [userObj, setUserObj] = useState(null);

  // Get user info from db
  const GetUser = async () => {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetChatMember?.id}`
      );
      dispatch(setChatUser(response.data.data.user));
      setUserObj(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    GetUser();
  }, []);

  /* 
    get chat room on press and navigate
  */
  const GetChatRoom = async (Room) => {
    try {
      dispatch(setCurrentChat(Room));
      navigation.navigate("Room", { user: userObj });
      if (Room.lastSender !== currentUser._id) {
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/" + Room.room,
          {
            status: "read",
          }
        );
      }
      let currentRoomIndex = rooms.findIndex((r) => r._id === item._id);

      if (currentRoomIndex !== -1) {
        let newRooms = [...rooms];
        newRooms[currentRoomIndex] = {
          ...newRooms[currentRoomIndex],
          status: "read",
        };
        dispatch(setRooms(newRooms));
      }
      dispatch(setRerenderScroll());
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  // delete chat
  const DeleteChat = async (ch) => {
    try {
      dispatch(setRooms(rooms.filter((room) => room.room !== ch.room)));

      if (ch.hideFor?.length > 0) {
        await axios.delete(
          "https://beautyverse.herokuapp.com/api/v1/chats/" + ch.room
        );
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/messages/" +
            ch.room +
            "/" +
            currentUser._id
        );
      } else {
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/" + ch.room,
          {
            status: "read",
            lastMessage: "User has deleted own messages..",
            hideFor: currentUser._id,
          }
        );
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/messages/" +
            ch.room +
            "/" +
            currentUser._id
        );
        socket.emit("updateChat", {
          targetId: targetChatMember.id,
        });
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  // define times ago
  const language = Language();
  const currentPostTime = GetTimesAgo(
    new Date(item.lastMessageCreatedAt).getTime()
  );

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

  return (
    <>
      {deletePopup && (
        <DeleteChatPopup
          isVisible={deletePopup}
          onClose={() => setDeletePopup(false)}
          onDelete={() => DeleteChat(item)}
          title="Are you sure to want to delete this Chat?"
          delet="Delete"
          cancel="Cancel"
        />
      )}
      <Pressable
        onPress={() => GetChatRoom(item)}
        onLongPress={() => {
          Vibration.vibrate();
          setDeletePopup(true);
        }}
        delayLongPress={300}
        style={{
          width: SCREEN_WIDTH - 20,
          borderRadius: 5,
          height: 70,
          borderBottomWidth: 1,
          borderBottomColor: "#222",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {targetChatMember.cover?.length > 30 ? (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 100,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CacheableImage
                style={{
                  height: 52,
                  width: 52,
                  borderRadius: 100,
                  resizeMode: "cover",
                }}
                source={{ uri: targetChatMember.cover }}
              />
            </View>
          ) : (
            <View
              style={{
                borderRadius: 100,
                width: 50,
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <FontAwesome name="user" size={25} color="#e5e5e5" />
            </View>
          )}
        </View>
        <View
          style={{
            flex: 6,
            paddingLeft: 0,
            gap: 3,
            height: 45,
            paddingTop: 5,
            overflow: "hidden",
          }}
        >
          <Text
            style={{ fontWeight: "bold", letterSpacing: 0.3, color: "#e5e5e5" }}
          >
            {targetChatMember.name}
          </Text>
          <Text
            style={{
              letterSpacing: 0.3,
              color:
                item.status === "unread" && item.lastSender !== currentUser._id
                  ? "green"
                  : "#888",
            }}
          >
            {item.lastMessage}
          </Text>
        </View>
        <View style={{ flex: 1.5, height: "100%", justifyContent: "center" }}>
          <Text
            style={{
              letterSpacing: 0.3,
              color: "#888",
              fontSize: 12,
            }}
          >
            {definedTime}
          </Text>
        </View>
      </Pressable>
    </>
  );
};
