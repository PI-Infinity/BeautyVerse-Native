import { FontAwesome } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../context/language";
import { setSearch, setSearchInput } from "../redux/filter";
import { RouteNameContext } from "../context/routName";

/**
 * Search universal component
 */

export const Search = ({ onPress, currentTheme, scrollRef }) => {
  const language = Language();
  const dispatch = useDispatch();

  const search = useSelector((state) => state.storeFilter.searchInput);

  return (
    <Pressable style={{ width: "100%", alignItems: "center" }}>
      <View
        style={{
          width: "95%",
          height: 40,
          borderWidth: 1.5,
          borderColor: currentTheme.line,
          borderRadius: 50,
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
          onFocus={onPress}
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
    </Pressable>
  );
};
