import { StyleSheet, Text, Dimensions, Animated } from "react-native";
import { Search } from "../../screens/chat/search";
import { Rooms } from "../../screens/chat/rooms";
import { AddChat } from "../../screens/chat/addChat";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Chat = ({ socket }) => {
  const openAddChat = useSelector((state) => state.storeChat.openAddChat);
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  return (
    <Animated.View
      style={{
        // transform: [{ translateX: slideAnim }],
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    width: "100%",
    alignItems: "center",
  },
});
