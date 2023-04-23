import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { Language } from "../context/language";

const SearchableSelect = ({ data, onItemSelected }) => {
  const language = Language();
  const [search, setSearch] = useState("");
  // const [filteredData, setFilteredData] = useState();
  // const [list, setList] = useState(false);

  const [text, setText] = useState("");

  const lang = useSelector((state) => state.storeApp.language);

  // useEffect(() => {
  //   setFilteredData(data);
  // }, [lang]);

  // const handleChange = (text) => {
  //   setSearch(text);
  //   const filtered = data.filter((item) =>
  //     item.label.toLowerCase().includes(text.toLowerCase())
  //   );
  //   setFilteredData(filtered);
  // };

  const handleItemPress = (item) => {
    setText(item.label);
    onItemSelected(item.value);
    setSearch("");
  };

  const RenderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.item}>
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const Listed = () => {
    return (
      <ScrollView style={{ height: 200 }}>
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
        style={styles.searchInput}
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    color: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 14,
    color: "#e5e5e5",
  },
});

export default SearchableSelect;
