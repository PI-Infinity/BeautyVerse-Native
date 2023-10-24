import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { terms, privacy, qa, usage } from "../../datas/pageTexts";
import { lightTheme, darkTheme } from "../../context/theme";
import { useSelector } from "react-redux";

export const Terms = () => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 100);
  }, []);
  return (
    <>
      {loader ? (
        <View
          style={{
            height: 500,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      ) : (
        <ScrollView
          bounces={Platform.OS === "ios" ? false : undefined}
          overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 20 }}
        >
          <Text
            style={{
              fontSize: 16,
              color: currentTheme.font,
              textAlign: "center",
              lineHeight: 22,
              letterSpacing: 0.2,
            }}
          >
            {terms}
          </Text>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({});
