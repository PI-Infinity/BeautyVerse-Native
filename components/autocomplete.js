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

const Autocomplete = ({ data, setState }) => {
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
    setSearch("");
    // setFilteredData([]);
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
        {selectedItems.map((item) => (
          <View key={item.value} style={styles.tag}>
            <Text>{item.label}</Text>
            <TouchableOpacity onPress={() => handleRemove(item)}>
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={handleSearch}
        placeholder="Search procedure..."
        placeholderTextColor="#888"
        onFocus={() => setHide(false)}
      />

      <Collapsible collapsed={hide}>
        <View style={styles.scrollView}>
          <TouchableOpacity onPress={() => setHide(true)}>
            <Icon name="remove" type="AntDesign" color="red" size={20} />
          </TouchableOpacity>
          {filteredData.map((item, index) => {
            const include = selectedItems.find((i) => i === item);
            // if (index < 7) {
            return (
              <TouchableOpacity
                key={item.value}
                onPress={
                  !include
                    ? () => handleSelect(item)
                    : () => Alert.alert("Procedure already defined")
                }
                style={styles.listItem}
              >
                <Text style={{ color: "#e5e5e5" }}>{item.label}</Text>
                {include && (
                  <Icon
                    name="done"
                    type="MaterialIcons"
                    color="green"
                    size={20}
                  />
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
    borderColor: "#555",
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    height: 35,
    borderRadius: 5,
    color: "#e5e5e5",
    marginTop: 15,
  },
  scrollView: {
    // height: 300,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "start",
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
  },
});

export default Autocomplete;
