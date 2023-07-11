import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../context/language";
import { setSearch, setSearchInput } from "../redux/filter";

/**
 * Search universal component
 */

export const Search = ({ navigation, currentTheme }) => {
  const language = Language();
  const dispatch = useDispatch();

  const search = useSelector((state) => state.storeFilter.searchInput);

  return (
    <Pressable style={{ width: "100%", alignItems: "center" }}>
      <View
        style={{
          width: "95%",
          backgroundColor: currentTheme.background2,
          borderWidth: 1.5,
          borderColor: currentTheme.line,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingHorizontal: 10,
        }}
      >
        <FontAwesome name="search" size={20} color={currentTheme.pink} />
        <TextInput
          placeholder={language?.language?.Main?.filter?.typeHere}
          placeholderTextColor={currentTheme.disabled}
          style={{
            width: "88%",
            padding: 7.5,
            color: currentTheme.font,
            borderRadius: 50,
            letterSpacing: 0.3,
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
            <FontAwesome name="close" size={20} color="red" />
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
