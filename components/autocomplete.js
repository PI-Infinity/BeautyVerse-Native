import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { ListItem, Icon, Button } from "react-native-elements";
import Collapsible from "react-native-collapsible";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

const Autocomplete = ({ data, setState, currentTheme }) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setFilteredData(data);
  }, []);

  const [hide, setHide] = useState(false);

  const handleSearch = (text) => {
    setSearch(text);
    setFilteredData(
      data.filter((item) =>
        item.label?.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handleSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
    setState([...selectedItems, item]);
  };

  const handleRemove = (item) => {
    const updatedSelectedItems = selectedItems.filter(
      (selectedItem) => selectedItem.value !== item.value
    );
    setSelectedItems(updatedSelectedItems);
    setState(updatedSelectedItems);
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectedItems}>
        {selectedItems.map((item, index) => (
          <View
            key={index}
            style={[styles.tag, { backgroundColor: currentTheme.pink }]}
          >
            <Text style={{ color: "#fff" }}>{item.label}</Text>
            <TouchableOpacity
              onPress={() => handleRemove(item)}
              style={{ padding: 2.5, paddingVertical: 1.5 }}
            >
              <Text style={[styles.removeIcon, { color: "red" }]}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View
        style={[
          styles.searchInput,
          {
            backgroundColor: currentTheme.background2,
            color: currentTheme.font,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: currentTheme.line,
          },
        ]}
      >
        <MaterialIcons color={currentTheme.pink} size={18} name="search" />
        <TextInput
          style={{
            backgroundColor: currentTheme.background2,
            color: currentTheme.font,
            height: "100%",
          }}
          value={search}
          onChangeText={handleSearch}
          placeholder="Search procedure..."
          placeholderTextColor={currentTheme.disabled}
          onFocus={() => setHide(false)}
        />
        {search?.length > 0 && (
          <MaterialIcons
            name="close"
            size={18}
            color="red"
            onPress={() => setSearch("")}
            style={{ marginLeft: "auto" }}
          />
        )}
      </View>

      <Collapsible collapsed={hide}>
        <View style={styles.scrollView}>
          <TouchableOpacity
            onPress={() => setHide(true)}
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRadius: 50,
              padding: 2.5,
            }}
          >
            <Entypo name="select-arrows" color="#F866B1" size={20} />
          </TouchableOpacity>
          {filteredData
            .filter((item) => {
              const hyphenCount = (item.value.match(/-/g) || []).length;
              return item.value && hyphenCount > 1;
            })
            .map((item, index) => {
              const include = selectedItems.find((i) => i === item);
              // if (index < 7) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={
                    !include
                      ? () => handleSelect(item)
                      : () => Alert.alert("Procedure already defined")
                  }
                  style={styles.listItem}
                >
                  <Text style={{ color: currentTheme.font }}>{item.label}</Text>
                  {include && (
                    <MaterialIcons name="done" color="#F866B1" size={20} />
                  )}
                </TouchableOpacity>
              );
            })}
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    width: "90%",
  },
  searchInput: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 35,
    borderRadius: 50,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // negative value places shadow on top
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scrollView: {
    // height: 300,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  listItem: {
    padding: 10,
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
    color: "#e5e5e5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  selectedItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    color: "#e5e5e5",
    // height: 300,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CCC",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    color: "#e5e5e5",
  },
  removeIcon: {
    marginLeft: 5,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Autocomplete;
