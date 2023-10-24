import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Animated, ImageBackground, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useSocket } from "../../context/socketContext";
import { AddChat } from "../../screens/chat/addChat";
import { Rooms } from "../../screens/chat/rooms";
import { Search } from "../../screens/chat/search";

/**
 * Chat main screen
 */

export const Chat = () => {
  // define open/hide chat redux stater
  const openAddChat = useSelector((state) => state.storeChat.openAddChat);

  // define navigator
  const navigation = useNavigation();

  // define socket server
  const socket = useSocket();

  // define search state
  const [search, setSearch] = useState("");

  return (
    <Animated.View
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
      }}
    >
      {openAddChat && <AddChat navigation={navigation} />}
      <Search search={search} setSearch={setSearch} />
      <Rooms navigation={navigation} search={search} socket={socket} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({});
