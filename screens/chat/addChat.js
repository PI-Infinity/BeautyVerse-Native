import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import { darkTheme, lightTheme } from "../../context/theme";
import {
  setCurrentChat,
  setOpenAddChat,
  setRerederRooms,
} from "../../redux/chat";
import { Search } from "../../screens/chat/search";
import { FontAwesome } from "@expo/vector-icons";

/**
 * Add new chat component in chat.
 * defines 2 components (list, item)
 * item bellow
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const AddChat = ({}) => {
  // defines navigation
  const navigation = useNavigation();

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines serch state
  const [search, setSearch] = useState("");

  // defines loading state
  const [loading, setLoading] = useState(true);

  // defines followings list, where new chat user choise from
  const [followings, setFollowings] = useState([]);

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Gett followings
   */
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function GetAudience() {
      try {
        const response = await fetch(
          backendUrl +
            `/api/v1/users/${currentUser?._id}/followings?page=1&limit=10`
        );
        const data = await response.json();
        setFollowings(data.data?.followings);
        setTimeout(() => {
          setLoading(false);
        }, 300);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    if (currentUser?._id) {
      GetAudience();
    }
  }, [currentUser?._id]);

  const AddAudience = async () => {
    try {
      const response = await axios.get(
        backendUrl +
          `/api/v1/users/${currentUser?._id}/followings?page=${
            page + 1
          }&limit=5`
      );
      setFollowings((prev) => {
        const newUsers = response.data.data.followings;
        return newUsers.reduce((acc, curr) => {
          const existingUserIndex = acc.findIndex(
            (user) => user._id === curr._id
          );
          if (existingUserIndex !== -1) {
            // User already exists, merge the data
            const mergedUser = { ...acc[existingUserIndex], ...curr };
            return [
              ...acc.slice(0, existingUserIndex),
              mergedUser,
              ...acc.slice(existingUserIndex + 1),
            ];
          } else {
            // User doesn't exist, add to the end of the array
            return [...acc, curr];
          }
        }, prev);
      });
      setPage(page + 1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /* 
    get chat room function 
  */

  const GetChatRoom = async (member2, userObj) => {
    // creatue new chat object
    let newChat = {
      room: currentUser?._id + member2.member2Id,
      members: {
        member1: currentUser._id,
        member2: member2.member2Id,
        member2Cover: member2.member2Cover,
        member2Name: member2.member2Name,
      },
      lastMessage: "",
      lastSender: "",
      status: "read",
      lastMessageSeen: "",
    };
    try {
      // navigate to room passed new chat and user in route
      navigation.navigate("Room", {
        newChat,
        user: userObj,
      });
      // add new chat in mongoDB
      const response = await axios.post(backendUrl + "/api/v1/chats/", {
        room: currentUser?._id + member2.member2Id,
        members: {
          member1: currentUser._id,
          member2: member2.member2Id,
        },
        lastMessage: "",
        lastSender: "",
        status: "read",
        lastMessageSeen: "",
      });
      // define new chat in redux
      dispatch(setCurrentChat(response.data.data.chat));
      // rerender rooms
      dispatch(setRerederRooms());
      // close add chat component
      dispatch(setOpenAddChat(false));
    } catch (error) {
      if (error.response) {
        Alert.alert(
          error.response.data
            ? error.response.data.message
            : "An error occurred"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        Alert.alert("An error occurred. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        Alert.alert("An error occurred. Please try again.");
      }
      console.log(error.config);
    }
  };

  // animation for add chat component
  const openAddChat = useSelector((state) => state.storeChat.openAddChat);

  return (
    <Modal
      transparent
      animationType="slide"
      isVisible={openAddChat}
      onRequestClose={() => dispatch(setOpenAddChat(false))}
    >
      <Pressable
        onPress={() => dispatch(setOpenAddChat(false))}
        style={{
          flex: 1,
          width: "100%",
          zIndex: 100,
          height: "100%",
          alignItems: "center",
          paddingTop: 70,
          backgroundColor: currentTheme.background2,
        }}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: currentTheme.background,
              borderWidth: 1.5,
              borderBottomWidth: 0,
              borderColor: currentTheme.pink,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              flex: 1,
            },
          ]}
        >
          <View
            style={{ marginBottom: 8, width: "100%", alignItems: "center" }}
          >
            <Search search={search} setSearch={setSearch} />
          </View>
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
                <ActivityIndicator size="small" color={currentTheme.pink} />
              </View>
            ) : (
              <FlatList
                data={followings?.filter((i, x) =>
                  i.name?.toLowerCase()?.includes(search?.toLocaleLowerCase())
                )}
                renderItem={({ item, index }) => (
                  <RenderItem
                    key={index}
                    item={item}
                    GetChatRoom={GetChatRoom}
                    currentTheme={currentTheme}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={AddAudience} // Add this function to handle the bottom reach
                onEndReachedThreshold={0.5} // This indicates at what point (as a threshold) should the onEndReached be triggered, 0.5 is halfway.
              />
            )}
          </>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 10,
    justifyContent: "center",
    borderRadius: 4,
    alignItems: "center",
    width: "100%",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 5,
  },
  userItem: {
    width: SCREEN_WIDTH - 50,
    marginBottom: 4,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 4,
    borderRadius: 50,
  },
});

/**
 * Following items
 */

const RenderItem = ({ item, GetChatRoom, currentTheme }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.userItem,
        { borderWidth: 1, borderColor: currentTheme.line },
      ]}
      onPress={() =>
        GetChatRoom(
          {
            member2Id: item._id,
            member2Name: item.name,
            member2Cover: item.cover,
          },
          item
        )
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {item.cover?.length > 10 ? (
          <View>
            {item?.online && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "#3bd16f",
                  borderRadius: 50,
                  position: "absolute",
                  zIndex: 100,
                  right: 1,
                  bottom: 1,
                  borderWidth: 1.5,
                  borderColor: currentTheme.background,
                }}
              ></View>
            )}
            <CacheableImage
              style={{
                height: 40,
                width: 40,
                borderRadius: 50,
                resizeMode: "cover",
              }}
              source={{ uri: item.cover }}
              manipulationOptions={[
                { resize: { width: 40, height: 40 } },
                { rotate: 90 },
              ]}
            />
          </View>
        ) : (
          <View>
            {item?.online && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "#3bd16f",
                  borderRadius: 50,
                  position: "absolute",
                  zIndex: 100,
                  right: 1,
                  bottom: 1,
                  borderWidth: 1.5,
                  borderColor: currentTheme.background,
                }}
              ></View>
            )}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: currentTheme.line,
              }}
            >
              <FontAwesome name="user" size={24} color="#e5e5e5" />
            </View>
          </View>
        )}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#e5e5e5",
            letterSpacing: 0.2,
          }}
        >
          {item?.name}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          color: currentTheme.disabled,
          letterSpacing: 0.2,
          paddingRight: 8,
        }}
      >
        {item.type === "beautycenter"
          ? "Beauty Salon"
          : item.type === "specialist"
          ? "Specialist"
          : item?.type}
      </Text>
    </TouchableOpacity>
  );
};
