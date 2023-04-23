import React, { useState } from "react";
import { View, Text } from "react-native";
import { SearchBar } from "@rneui/themed";

export const Search = ({ search, setSearch }) => {
  const updateSearch = (search) => {
    setSearch(search);
  };
  return (
    <View style={{ width: "90%" }}>
      <SearchBar
        round={true}
        showCancel={true}
        // showLoading={true}
        // lightTheme={true}
        containerStyle={{
          height: 40,
          elevation: 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 15,
          paddingRight: 0,
          paddingTop: 0,
          backgroundColor: "rgba(0,0,0,0)",
          borderWidth: 0, //no effect
          shadowColor: "white", //no effect
          borderBottomColor: "transparent",
          borderTopColor: "transparent",
          width: "100%",
        }}
        inputContainerStyle={{ height: 30, width: "100%" }}
        placeholder="Type Here..."
        onChangeText={setSearch}
        value={search}
      />
    </View>
  );
};
