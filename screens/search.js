import React, { useCallback, useMemo, useState, useContext } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ProceduresOptions } from "../datas/registerDatas";

// Import necessary Redux actions
import { setSearch, setSearchInput } from "../redux/filter";
import { setCleanUp, setRerenderUserList } from "../redux/rerenders";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { useNavigation } from "@react-navigation/native";

import { RouteNameContext } from "../context/routName";
import { Header } from "./user/settings/header";
import { setScreenModal } from "../redux/app";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Search = ({ onBack, hideModal, inputRef }) => {
  // Initialize state variables
  const [qnt, setQnt] = useState(20);

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    if (x > 0) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  };

  // defines navigation
  const navigation = useNavigation();

  // Get current language, theme, and search input from Redux state
  const language = Language();
  const proceduresOptions = ProceduresOptions();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const dispatch = useDispatch();
  const search = useSelector((state) => state.storeFilter.searchInput);

  // Filter procedures options based on search input
  const filteredProcedures = useMemo(() => {
    return proceduresOptions?.filter((item) =>
      item.label?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [proceduresOptions, search]);

  // Handler for when a user selects a procedure option
  const handleItemPress = useCallback(
    (value) => {
      let opt = proceduresOptions.find((it) => it.value === value?.value);
      let lab = opt.label.split("-");
      dispatch(setSearchInput(lab[lab?.length - 1]));
      dispatch(setSearch(value?.value?.toLowerCase()));

      hideModal();
    },
    [dispatch, proceduresOptions]
  );

  const routeName = useContext(RouteNameContext);

  const handleGo = (value) => {
    dispatch(setSearch(search));
    hideModal();

    setTimeout(() => {
      hideModal();
    }, 500);
  };

  return (
    <View style={{ width: SCREEN_WIDTH, alignItems: "center", paddingTop: 0 }}>
      <Header onBack={onBack} title="Add New Address" />
      <View
        style={{
          width: "95%",
          // backgroundColor: currentTheme.background2,
          borderWidth: 1.5,
          borderColor: currentTheme.pink,
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingHorizontal: 10,
          height: 40,
        }}
      >
        <FontAwesome name="search" size={20} color={currentTheme.font} />
        <TextInput
          ref={inputRef}
          placeholderTextColor={currentTheme.disabled}
          style={{
            width: "88%",
            padding: 7.5,
            color: currentTheme.font,
            borderRadius: 50,
            letterSpacing: 0.5,
          }}
          // autoFocus
          placeholder={language?.language?.Main?.filter?.typeHere}
          onChangeText={(value) => dispatch(setSearchInput(value))}
          value={search}
          returnKeyType="search"
          onSubmitEditing={() => handleGo()}
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

      {/* Procedure options list */}
      <ScrollView
        contentContainerStyle={{ gap: 5, marginTop: 10 }}
        style={{ width: "90%" }}
      >
        {filteredProcedures.map((item, index) => {
          if (index < qnt) {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                style={{
                  // backgroundColor: currentTheme.background,
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
                }
              >
                <Text style={{ color: currentTheme.font }}>{item.label}</Text>
                {/* {search === item.value && (
                  <MaterialIcons name="done" color="#F866B1" size={16} />
                )} */}
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    </View>
  );
};
