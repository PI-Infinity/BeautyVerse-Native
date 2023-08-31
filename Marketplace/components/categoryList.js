import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";

import { FlatList } from "react-native-gesture-handler";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const CategoryList = ({
  setIsModalVisible,
  isModalVisible,
  setCategories,
  categories,
  categoriesList,
}) => {
  const [loading, setLoading] = useState(true);
  // language state
  const language = Language();
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // search state
  const [search, setSearch] = useState("");

  // add category function
  const handleCategoryPress = (categoryValue) => {
    if (!categories.includes(categoryValue)) {
      setCategories((prevCategories) => [...prevCategories, categoryValue]);
    } else {
      setCategories((prev) => prev?.filter((itm) => itm !== categoryValue));
    }
  };

  // split categoris
  // split procedures value to find label
  const splited = categoriesList.filter(
    (i) => i.value?.split("-")?.length !== 3
  );

  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModalVisible}
      onRequestClose={() => {
        setIsModalVisible(!isModalVisible);
      }}
    >
      <View
        style={{
          backgroundColor: currentTheme.background,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 15,
          paddingHorizontal: 20,
          paddingTop: 80,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={currentTheme.pink} />
        ) : (
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ gap: 15 }}
          >
            <Pressable
              style={{ width: "100%", alignItems: "center" }}
              onPress={() => setIsModalVisible(false)}
            >
              <FontAwesome5
                size={20}
                color={currentTheme.pink}
                name="arrow-down"
              />
            </Pressable>
            <TextInput
              value={search}
              placeholder={language?.language?.Marketplace?.marketplace?.search}
              placeholderTextColor={currentTheme.disabled}
              onChangeText={(value) => setSearch(value)}
              style={{
                padding: 8,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor: currentTheme.line,
                color: currentTheme.pink,
              }}
            />
            {splited

              ?.filter((item) =>
                item.label
                  ?.toLocaleLowerCase()
                  ?.includes(search?.toLocaleLowerCase())
              )
              ?.map((i, x) => {
                let isDefined = categories?.find(
                  (it) =>
                    it?.toLocaleLowerCase() === i.value?.toLocaleLowerCase()
                );

                return (
                  <Pressable
                    key={i.value}
                    style={{}}
                    onPress={() => handleCategoryPress(i.value)}
                  >
                    <Text
                      style={{
                        color: isDefined
                          ? currentTheme.pink
                          : currentTheme.font,
                        fontSize: 16,
                        letterSpacing: 0.3,
                      }}
                    >
                      {i.label}
                    </Text>
                  </Pressable>
                );
              })}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default CategoryList;

const styles = StyleSheet.create({});
