import React, { useState } from "react";
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
import { setCity, setDistrict } from "../redux/filter"; // Import the setCity action from your actions file
import { MaterialIcons } from "@expo/vector-icons";
import { setCleanUp } from "../redux/rerenders";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Cities = ({ cities, currentTheme }) => {
  const dispatch = useDispatch();
  const selectedCity = useSelector((state) => state.storeFilter.city);

  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);

  const handleSearch = (text) => {
    setSearch(text);
    setFilteredCities(
      cities.filter((city) => city.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const handlePress = (city) => {
    dispatch(setCity(city));
    dispatch(setCleanUp());
    if (city === "") {
      dispatch(setDistrict(""));
    }
  };

  const RenderedItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.cityItem, { color: currentTheme.font }]}
      activeOpacity={0.5}
      onPress={() => handlePress(selectedCity === item ? "" : item)}
    >
      <Text style={{ color: currentTheme.font }}>{item}</Text>
      {selectedCity === item && (
        <MaterialIcons name="done" color="#F866b1" size={16} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {cities?.length > 10 && (
        <TextInput
          style={styles.searchInput}
          onChangeText={handleSearch}
          value={search}
          placeholder="Search city"
          placeholderTextColor="#ccc"
        />
      )}

      <View style={{ width: "100%" }}>
        {filteredCities?.map((item, index) => {
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
    flexDirection: "row",
    alignItems: "center",
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
