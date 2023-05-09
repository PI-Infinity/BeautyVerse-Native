import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { SearchBar } from "@rneui/themed";
import { Language } from "../context/language";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { setSearchInput, setSearch } from "../redux/filter";

export const Search = ({ navigation, currentTheme }) => {
  const language = Language();
  const dispatch = useDispatch();
  // const [search, setSearchInput] = useState("");
  const search = useSelector((state) => state.storeFilter.searchInput);
  // const updateSearch = (search) => {
  //   setSearchInput(search);
  // };
  return (
    <Pressable style={{ width: "100%", alignItems: "center" }}>
      <View
        style={{
          width: "95%",
          backgroundColor: currentTheme.background2,
          borderWidth: 1.5,
          borderColor: currentTheme.pink,
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingHorizontal: 10,
        }}
      >
        <Icon name="search" size={20} color={currentTheme.font} />
        <TextInput
          placeholder={language?.language?.Main?.filter?.typeHere}
          placeholderTextColor={currentTheme.disabled}
          style={{
            width: "88%",
            padding: 7.5,
            color: currentTheme.font,
            borderRadius: 50,
          }}
          onFocus={() => navigation.navigate("Search")}
          showSoftInputOnFocus={false}
          // onChangeText={updateSearch}
          value={search}
        />
        {search?.length > 0 && (
          <Pressable
            onPress={() => {
              dispatch(setSearch(""));
              dispatch(setSearchInput(""));
            }}
          >
            <Icon name="close" size={20} color="red" />
          </Pressable>
        )}
      </View>
      {/* <SearchBar
        // round={true}
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
          // paddingLeft: 15,
          // paddingRight: 15,
          paddingTop: 0,
          backgroundColor: currentTheme.background,
          borderWidth: 0, //no effect
          shadowColor: "white", //no effect
          borderBottomColor: "transparent",
          borderTopColor: "transparent",
        }}
        inputContainerStyle={{
          height: 35,
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
        placeholder={language?.language?.Main?.filter?.typeHere}
        onChangeText={updateSearch}
        value={search}
      /> */}
    </Pressable>
  );
};
