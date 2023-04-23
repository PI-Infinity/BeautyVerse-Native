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
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setOpenAddChat,
  setCurrentChat,
  setRerederRooms,
} from "../../redux/chat";
import axios from "axios";
import { Search } from "../../screens/chat/search";
import { CacheableImage } from "../../components/cacheableImage";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const AddChat = ({ navigation }) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const [followings, setFollowings] = useState([]);

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  useEffect(() => {
    async function GetAudience(userId) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/followings`
      )
        .then((response) => response.json())
        .then((data) => {
          setFollowings(data.data?.followings);
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    }
    if (currentUser?._id) {
      GetAudience();
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
      Alert.alert(error.response.data.message);
    }
  };

  const RenderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() =>
        GetChatRoom({
          member2Id: item._doc.followingId,
          member2Name: item.followingName,
          member2Cover: item.followingCover,
        })
      }
    >
      <CacheableImage
        style={{ height: 40, width: 40, borderRadius: 50, resizeMode: "cover" }}
        source={{ uri: item.followingCover }}
        manipulationOptions={[
          { resize: { width: 40, height: 40 } },
          { rotate: 90 },
        ]}
      />
      <Text style={{ fontSize: 14, fontWeight: "bold", color: "#e5e5e5" }}>
        {item?.followingName}
      </Text>
      <Text style={{ fontSize: 14, color: "#e5e5e5" }}>
        {item?.followingType}
      </Text>
    </TouchableOpacity>
  );

  return (
    <TouchableOpacity
      onPress={() => dispatch(setOpenAddChat(false))}
      style={{
        backgroundColor: "#222",
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
        <Search />
        <ScrollView contentContainerStyle={{ gap: 10 }}>
          {followings?.map((item, index) => {
            return <RenderItem key={index} item={item} />;
          })}
        </ScrollView>
      </View>
    </TouchableOpacity>
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
    width: SCREEN_WIDTH - 60,
    marginBottom: 10,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 10,
  },
});
