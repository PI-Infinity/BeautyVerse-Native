import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SearchBar } from "@rneui/themed";
import { Language } from "../context/language";

export const Search = ({ navigation }) => {
  const language = Language();

  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
  };
  return (
    <Pressable style={{ width: "100%" }}>
      <SearchBar
        round={true}
        showCancel={true}
        // showLoading={true}
        // lightTheme={true}
        onFocus={() => navigation.navigate("Search")}
        showSoftInputOnFocus={false}
        containerStyle={{
          height: 45,
          elevation: 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 0,
          backgroundColor: "#111",
          borderWidth: 0, //no effect
          shadowColor: "white", //no effect
          borderBottomColor: "transparent",
          borderTopColor: "transparent",
        }}
        inputContainerStyle={{ height: 30, width: "100%" }}
        placeholder={language?.language?.Main?.filter?.typeHere}
        onChangeText={updateSearch}
        value={search}
      />
    </Pressable>
  );
};
