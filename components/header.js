import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { darkTheme, lightTheme } from "../context/theme";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { CacheableImage } from "./cacheableImage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Header = ({ title, onBack, subScreen, room, data, hideModal }) => {
  const navigation = useNavigation();
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  return (
    <View
      style={{
        height: 50,
        width: SCREEN_WIDTH,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: !theme ? currentTheme.background : "rgba(0,0,0,0.5)",
      }}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onBack}>
        <MaterialIcons
          name="arrow-drop-down"
          color={currentTheme.pink}
          size={40}
        />
      </TouchableOpacity>
      <Pressable
        onPress={() => {
          hideModal();
          navigation.navigate("UserVisit", { user: data });
        }}
        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      >
        {room && (
          <View style={{}}>
            <CacheableImage
              key={data?.cover}
              source={{ uri: data?.cover }}
              style={{ width: 35, height: 35, borderRadius: 50 }}
            />
          </View>
        )}
        <Text
          style={{
            color: currentTheme.font,
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Text>
      </Pressable>

      <View style={{ width: 35, height: "100%", justifyContent: "center" }}>
        {subScreen && (
          <Pressable onPress={subScreen?.onPress}>{subScreen?.icon}</Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
