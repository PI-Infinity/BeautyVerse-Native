import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  Pressable,
  Alert,
  Vibration,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentChat,
  setRerederRooms,
  setRerenderScroll,
  setChatUser,
} from "../../redux/chat";
import GetTimesAgo from "../../functions/getTimesAgo";
import { Language } from "../../context/language";
import { CacheableImage } from "../../components/cacheableImage";
import { FontAwesome } from "@expo/vector-icons";
import { lightTheme, darkTheme } from "../../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Rooms = ({ navigation, search, socket }) => {
  const dispatch = useDispatch();
  const currentChat = useSelector((state) => state.storeChat.currentChat);
  const rerenderRooms = useSelector((state) => state.storeChat.rerenderRooms);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const [loading, setLoading] = useState(false);
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const GetChats = async () => {
      try {
        const response = await axios.get(
          "https://beautyverse.herokuapp.com/api/v1/chats/members/" +
            currentUser._id
        );
        setRooms(response.data.data.chats);
        setLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
        setLoading(false);
      }
    };
    if (currentUser._id) {
      setLoading(true);
      GetChats();
    }
  }, [rerenderRooms]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("chatUpdate", (data) => {
        setTimeout(() => {
          dispatch(setRerederRooms());
        }, 2000);
      });
    }
  }, []);

  useEffect(() => {
    if (socket.current && rooms.length > 0) {
      socket.current.on("getMessage", (data) => {
        let updatedRooms = rooms.map((item) => {
          if (item.room === data.room) {
            return {
              ...item,
              lastMessage: data.text,
              lastMessageCreatedAt: new Date().toISOString(),
              lastSender: data.senderId,
              status: "unread",
              hideFor: "",
            };
          }
          return item;
        });
        setRooms(updatedRooms);
      });
    } else if (socket.current) {
      socket.current.on("getMessage", (data) => {
        let updatedRooms = {
          room: data.room,
          members: {
            member1: data.senderId,
            member1Name: data.senderName,
            member1Cover: data.senderCover,
            member2: data.receiverId,
          },
          lastMessage: data.text,
          lastMessageCreatedAt: new Date().toISOString(),
          lastSender: data.senderId,
          status: "unread",
          hideFor: "",
        };

        setRooms((prev) => [...prev, updatedRooms]);
      });
    }
  }, [socket, rooms]);

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
        <ScrollView>
          {rooms?.length > 0 ? (
            rooms
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
                        rooms={rooms}
                        setRooms={setRooms}
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
              <Text style={{ color: "rgba(255,255,255,0.3)" }}>
                No chats found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({});

const RoomItem = ({
  targetChatMember,
  item,
  rooms,
  setRooms,
  navigation,
  socket,
}) => {
  const dispatch = useDispatch();

  const currentChat = useSelector((state) => state.storeChat.currentChat);
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const GetUser = async () => {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetChatMember?.id}`
      );
      dispatch(setChatUser(response.data.data.user));
    } catch (error) {
      console.log(error);
    }
  };
  // get chat room
  const GetChatRoom = async (Room, member2) => {
    GetUser();
    try {
      await dispatch(setCurrentChat(Room));
      navigation.navigate("Room", {
        Room,
      });
      if (Room.lastSender !== currentUser._id) {
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/" + Room.room,
          {
            status: "read",
          }
        );
      }
      dispatch(setRerederRooms());
      dispatch(setRerenderScroll());
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  // delete chat
  const DeleteChat = async (ch) => {
    try {
      setRooms(rooms.filter((room) => room.room !== ch.room));

      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/chats/messages/" +
          ch.room +
          "/" +
          currentUser._id
      );
      if (ch.hideFor?.length > 0) {
        await axios.delete(
          "https://beautyverse.herokuapp.com/api/v1/chats/" + ch.room
        );
      } else {
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/" + ch.room,
          {
            hideFor: currentUser._id,
          }
        );
        socket.current.emit("updateChat", {
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
    <Pressable
      onPress={() => GetChatRoom(item)}
      onLongPress={() => {
        Vibration.vibrate();
        DeleteChat(item);
      }}
      delayLongPress={300}
      style={{
        width: SCREEN_WIDTH - 60,
        borderRadius: 5,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
        flexDirection: "row",
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
          justifyContent: "center",
          paddingLeft: 15,
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#e5e5e5" }}>
          {targetChatMember.name}
        </Text>
        <Text
          style={{
            color:
              item.status === "unread" && item.lastSender !== currentUser._id
                ? "green"
                : "#888",
          }}
        >
          {item.lastMessage}
        </Text>
      </View>
      <View style={{ flex: 2, height: "100%", justifyContent: "center" }}>
        <Text style={{ color: "#888", fontSize: 12 }}>{definedTime}</Text>
      </View>
    </Pressable>
  );
};
