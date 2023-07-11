import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { Language } from "../context/language";

/**
 * Select component with search
 */

const SearchableSelect = ({ data, onItemSelected, currentTheme }) => {
  const language = Language();
  const [search, setSearch] = useState("");

  const [text, setText] = useState("");

  const handleItemPress = (item) => {
    setText(item.label);
    onItemSelected(item.value);
    setSearch("");
  };

  const RenderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.item}>
      <Text
        style={[
          styles.itemText,
          {
            color: currentTheme.font,
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const Listed = () => {
    return (
      <ScrollView
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
        style={{
          height: 200,
          backgroundColor: currentTheme.background2,
          borderRadius: 10,
        }}
      >
        {data
          ?.filter((item) =>
            item.label.toLowerCase().includes(text.toLowerCase())
          )
          .map((item, index) => {
            return <RenderItem key={index} item={item} />;
          })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          borderRadius: 50,
          backgroundColor: currentTheme.background2,
          paddingHorizontal: 15,
          paddingVertical: 5,
          marginBottom: 5,
          borderWidth: 1,
          borderColor: currentTheme.line,
        }}
      >
        <MaterialIcons name="search" color={currentTheme.pink} size={22} />
        <TextInput
          style={{
            color: currentTheme.font,
            backgroundColor: currentTheme.background2,
          }}
          onChangeText={(text) => setText(text)}
          value={text}
          placeholder={language?.language?.Main.filter.search}
          placeholderTextColor={currentTheme.disabled}
        />
        {text?.length > 0 && (
          <MaterialIcons
            onPress={() => setText("")}
            color="red"
            name="close"
            size={18}
            style={{ marginLeft: "auto" }}
          />
        )}
      </View>
      {Listed()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  itemText: {
    fontSize: 14,
    color: "#e5e5e5",
  },
});

export default SearchableSelect;
