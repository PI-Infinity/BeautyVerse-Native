import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setDistrict } from "../redux/filter"; // Import the setCity action from your actions file
import { ListItem, Icon, Button } from "react-native-elements";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Districts = ({ districts }) => {
  const dispatch = useDispatch();
  const selectedDistrict = useSelector((state) => state.storeFilter.district);

  const [search, setSearch] = useState("");

  const handleSearch = (text) => {
    setSearch(text);
    setFilteredDistricts(
      districts.filter((district) =>
        district.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handlePress = (district) => {
    dispatch(setDistrict(district));
  };

  const RenderedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cityItem}
      activeOpacity={0.5}
      onPress={() => handlePress(item)}
    >
      <Text style={{ color: "#e5e5e5" }}>{item}</Text>

      {selectedDistrict === item && (
        <Icon name="done" type="MaterialIcons" color="green" size={16} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {districts?.length > 10 && (
        <TextInput
          style={styles.searchInput}
          onChangeText={handleSearch}
          value={search}
          placeholder="Search district"
          placeholderTextColor="#e5e5e5"
        />
      )}

      <View style={{ width: "100%" }}>
        {districts?.map((item, index) => {
          return <RenderedItem key={index} item={item} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 20,
    width: SCREEN_WIDTH - 60,
    marginTop: 30,
  },
  cityItem: {
    width: "100%",
    paddingVertical: 7.5,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.02)",
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  searchInput: {
    width: "90%",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 7.5,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
});
