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
import { Icon } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { Language } from "../context/language";

const SearchableSelect = ({ data, onItemSelected, currentTheme }) => {
  const language = Language();
  const [search, setSearch] = useState("");
  // const [filteredData, setFilteredData] = useState();
  // const [list, setList] = useState(false);

  const [text, setText] = useState("");

  const lang = useSelector((state) => state.storeApp.language);

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
      <TextInput
        style={[
          styles.searchInput,
          {
            color: currentTheme.font,
            backgroundColor: currentTheme.background2,
          },
        ]}
        onChangeText={(text) => setText(text)}
        value={text}
        placeholder={language?.language?.Main.filter.search}
        placeholderTextColor="#e5e5e5"
      />
      {Listed()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 5,
    color: "#fff",
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
