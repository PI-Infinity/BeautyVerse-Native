import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  // PanResponder,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  useEffect(() => {
    async function GetAudience(userId) {
      try {
        const response = await fetch(
          backendUrl + `/api/v1/users/${userId}/followings`
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
      GetAudience(currentUser._id);
    }
  }, [currentUser?._id]);

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
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openAddChat = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    openAddChat();
    return () => translateY.stopAnimation(); // Stop the animation on unmount
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: translateY,
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => dispatch(setOpenAddChat(false))}
        style={{
          backgroundColor: currentTheme.background2,
          borderWidth: 1,
          borderColor: currentTheme.line,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          flex: 1,
          position: "absolute",
          bottom: 0,
          width: "100%",
          zIndex: 100,
          height: "100%",
        }}
      >
        <View style={styles.modalContent}>
          <View
            style={{ marginBottom: 8, width: "100%", alignItems: "center" }}
          >
            <Search />
          </View>
          <ScrollView contentContainerStyle={{ gap: 0 }}>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  height: 500,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color={currentTheme.pink} />
              </View>
            ) : (
              <>
                {followings?.map((item, index) => {
                  return (
                    <RenderItem
                      key={index}
                      item={item}
                      GetChatRoom={GetChatRoom}
                      currentTheme={currentTheme}
                    />
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 100,
    height: "100%",
  },
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
    marginBottom: 8,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 50,
  },
});

/**
 * Following items
 */

const RenderItem = ({ item, GetChatRoom, currentTheme }) => {
  // user object state
  const [userObj, setUserObj] = useState(null);

  // get user object from db
  const GetUser = async () => {
    try {
      const response = await axios.get(
        backendUrl + `/api/v1/users/${item?._id}`
      );
      setUserObj(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    GetUser();
  }, []);

  return (
    <TouchableOpacity
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
          userObj
        )
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {item.cover?.length > 10 ? (
          <View>
            {userObj?.online && (
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
            {userObj?.online && (
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
