import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import { ProceduresOptions } from "../datas/registerDatas";
import { useSelector, useDispatch } from "react-redux";
import { setSearchInput, setSearch } from "../redux/filter";
import { ListItem, Icon, Button } from "react-native-elements";
import { Language } from "../context/language";
import { lightTheme, darkTheme } from "../context/theme";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { setCleanUp, setRerenderUserList } from "../redux/rerenders";

export const Search = ({ navigation }) => {
  // const [Search, setSearchInput] = useState("");
  const language = Language();
  const proceduresOptions = ProceduresOptions();

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const dispatch = useDispatch();
  const search = useSelector((state) => state.storeFilter.searchInput);

  const [qnt, setQnt] = useState(20);

  const filteredProcedures = useMemo(() => {
    return proceduresOptions?.filter((item) =>
      item.label?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [proceduresOptions, search]);

  const handleItemPress = useCallback(
    (value) => {
      let opt = proceduresOptions.find((it) => it.value === value?.value);
      let lab = opt.label.split("-");
      // console.log(value.splite("/"));
      dispatch(setSearchInput(lab[lab?.length - 1]));
      dispatch(setSearch(value?.value?.toLowerCase()));
      dispatch(setCleanUp());
      // setTimeout(() => {
      //   navigation.navigate("Feeds");
      // }, 50);
    },
    [dispatch]
  );

  return (
    <View style={{ width: "100%", alignItems: "center", paddingTop: 10 }}>
      <View
        style={{
          width: "95%",
          backgroundColor: currentTheme.background2,
          borderWidth: 1.5,
          borderColor: currentTheme.pink,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingHorizontal: 10,
        }}
      >
        <FontAwesome name="search" size={20} color={currentTheme.font} />
        <TextInput
          placeholderTextColor={currentTheme.disabled}
          style={{
            width: "88%",
            padding: 7.5,
            color: currentTheme.font,
            borderRadius: 50,
            letterSpacing: 0.5,
          }}
          autoFocus
          placeholder={language?.language?.Main?.filter?.typeHere}
          onChangeText={(value) => dispatch(setSearchInput(value))}
          value={search}
        />
        <Pressable
          onPress={() => {
            dispatch(setSearchInput(""));
            dispatch(setSearch(""));
            dispatch(setRerenderUserList());
          }}
        >
          {search?.length > 0 && (
            <FontAwesome name="close" size={20} color="red" />
          )}
        </Pressable>
      </View>
      {/* <SearchBar
        // round={true}
        showCancel={true}
        autoFocus
        // showLoading={true}
        // lightTheme={true}
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
        onChangeText={setSearchInput}
        value={Search}
      /> */}

      <ScrollView
        contentContainerStyle={{ gap: 5, marginTop: 10 }}
        style={{ width: "90%" }}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      >
        {filteredProcedures.map((item, index) => {
          if (index < qnt) {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                style={{
                  backgroundColor: currentTheme.background,
                  borderRadius: 50,
                  padding: 5,
                  paddingBottom: 10,
                  borderBottomColor: currentTheme.background2,
                  borderBottomWidth: 1,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onPress={
                  search === item.value
                    ? () => handleItemPress("")
                    : () => handleItemPress(item)
                  //   navigation.navigate("Feeds");
                }
              >
                <Text style={{ color: currentTheme.font }}>{item.label}</Text>
                {search === item.value && (
                  <MaterialIcons name="done" color="#F866B1" size={16} />
                )}
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    </View>
  );
};
