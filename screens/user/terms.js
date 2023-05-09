import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { terms, privacy, qa, usage } from "../../datas/pageTexts";
import { lightTheme, darkTheme } from "../../context/theme";
import { useSelector } from "react-redux";

export const Terms = () => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 20 }}
    >
      <Text
        style={{
          fontSize: 16,
          color: currentTheme.font,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        {terms}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});
