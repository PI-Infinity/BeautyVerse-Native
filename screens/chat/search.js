import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SearchBar } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";
import { lightTheme, darkTheme } from "../../context/theme";
import { useSelector } from "react-redux";
import { Language } from "../../context/language";

export const Search = ({ search, setSearch }) => {
  const theme = useSelector((state) => state.storeApp.theme);
  const language = Language();
  const currentTheme = theme ? darkTheme : lightTheme;
  const updateSearch = (search) => {
    setSearch(search);
  };
  return (
    <View
      style={{
        width: "95%",
        backgroundColor: currentTheme.background2,
        borderWidth: 1,
        borderColor: currentTheme.pink,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10,
      }}
    >
      <FontAwesome name="search" size={20} color={currentTheme.font} />
      <TextInput
        placeholder={language?.language?.Main?.filter?.typeHere}
        placeholderTextColor={currentTheme.disabled}
        style={{
          width: "88%",
          padding: 7.5,
          color: currentTheme.font,
          borderRadius: 50,
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
