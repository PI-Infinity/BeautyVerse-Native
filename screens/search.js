import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SearchBar } from "@rneui/themed";
import { ProceduresOptions } from "../datas/registerDatas";
import { useSelector, useDispatch } from "react-redux";
import { setSearch } from "../redux/filter";
import { ListItem, Icon, Button } from "react-native-elements";
import { Language } from "../context/language";

export const Search = ({ navigation }) => {
  const [Search, SetSearch] = useState("");
  const language = Language();
  const proceduresOptions = ProceduresOptions();

  const dispatch = useDispatch();
  const search = useSelector((state) => state.storeFilter.search);

  const [qnt, setQnt] = useState(20);

  const filteredProcedures = useMemo(() => {
    return proceduresOptions?.filter((item) =>
      item.label?.toLowerCase().includes(Search?.toLowerCase())
    );
  }, [proceduresOptions, Search]);

  const handleItemPress = useCallback(
    (value) => {
      dispatch(setSearch(value));
    },
    [dispatch]
  );

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <SearchBar
        round={true}
        showCancel={true}
        autoFocus
        // showLoading={true}
        // lightTheme={true}
        containerStyle={{
          height: 40,
          elevation: 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 0,
          backgroundColor: "#111",
          borderWidth: 0, //no effect
          shadowColor: "white", //no effect
          borderBottomColor: "transparent",
          borderTopColor: "transparent",
        }}
        inputContainerStyle={{ height: 30, width: "100%" }}
        placeholder={language?.language?.Main?.filter?.typeHere}
        onChangeText={SetSearch}
        value={Search}
      />

      <ScrollView contentContainerStyle={{ gap: 5 }} style={{ width: "90%" }}>
        {filteredProcedures.map((item, index) => {
          if (index < qnt) {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                style={{
                  backgroundColor: "#111",
                  borderRadius: 50,
                  padding: 5,
                  paddingBottom: 10,
                  borderBottomColor: "#151515",
                  borderBottomWidth: 1,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onPress={
                  search === item.value
                    ? () => handleItemPress("")
                    : () => handleItemPress(item.value)
                  //   navigation.navigate("Feeds");
                }
              >
                <Text style={{ color: "#e5e5e5" }}>{item.label}</Text>
                {search === item.value && (
                  <Icon
                    name="done"
                    type="MaterialIcons"
                    color="green"
                    size={16}
                  />
                )}
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    </View>
  );
};
