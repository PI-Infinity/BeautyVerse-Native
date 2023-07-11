import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";

/**
 * Search chat list
 */

export const Search = ({ search, setSearch }) => {
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define language
  const language = Language();

  // define focused or not
  const [active, setActive] = useState(false);

  return (
    <View
      style={{
        width: "95%",
        backgroundColor: currentTheme.background2,
        borderWidth: 1.5,
        borderColor: active ? currentTheme.pink : currentTheme.line,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10,
      }}
    >
      <FontAwesome
        name="search"
        size={20}
        color={active ? currentTheme.font : currentTheme.pink}
      />
      <TextInput
        placeholder={language?.language?.Main?.filter?.typeHere}
        placeholderTextColor={currentTheme.disabled}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        style={{
          width: "88%",
          padding: 7.5,
          color: currentTheme.font,
          borderRadius: 50,
          letterSpacing: 0.3,
        }}
        onChangeText={setSearch}
        value={search}
      />
      {search?.length > 0 && (
        <Pressable
          onPress={() => {
            setSearch("");
          }}
        >
          <FontAwesome name="close" size={20} color="red" />
        </Pressable>
      )}
    </View>
  );
};
