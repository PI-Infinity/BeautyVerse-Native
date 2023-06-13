import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Animated,
  // PanResponder,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setOpenAddChat,
  setCurrentChat,
  setRerederRooms,
} from "../../redux/chat";
import axios from "axios";
import { Search } from "../../screens/chat/search";
import { CacheableImage } from "../../components/cacheableImage";
import { useNavigation } from "@react-navigation/native";
import { lightTheme, darkTheme } from "../../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const AddChat = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [followings, setFollowings] = useState([]);

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  useEffect(() => {
    async function GetAudience(userId) {
      try {
        const response = await fetch(
          `https://beautyverse.herokuapp.com/api/v1/users/${userId}/followings`
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

  // get chat room
  const GetChatRoom = async (member2) => {
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
    };
    try {
      navigation.navigate("Room", {
        newChat,
      });
      const response = await axios.post(
        "https://beautyverse.herokuapp.com/api/v1/chats/",
        {
          room: currentUser?._id + member2.member2Id,
          members: {
            member1: currentUser._id,
            member2: member2.member2Id,
          },
          lastMessage: "",
          lastSender: "",
        }
      );
      dispatch(setCurrentChat(response.data.data.chat));
      dispatch(setRerederRooms());
      dispatch(setOpenAddChat(false));
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
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

  const RenderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        { borderWidth: 1, borderColor: currentTheme.line },
      ]}
      onPress={() =>
        GetChatRoom({
          member2Id: item._id,
          member2Name: item.name,
          member2Cover: item.cover,
        })
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {item.cover?.length > 10 && (
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

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderMove: (_, gestureState) => {
  //       if (gestureState.dy > 0) {
  //         translateY.setValue(gestureState.dy);
  //       }
  //     },
  //     onPanResponderRelease: (_, gestureState) => {
  //       if (gestureState.dy > 100) {
  //         closeAddChat();
  //       } else {
  //         openAddChat();
  //       }
  //     },
  //   })
  // ).current;

  const openAddChat = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeAddChat = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    openAddChat();

    return () => translateY.stopAnimation(); // Stop the animation on unmount
  }, []);

  // ... your existing components ...

  return (
    <Animated.View
      // {...panResponder.panHandlers}
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
                  return <RenderItem key={index} item={item} />;
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
