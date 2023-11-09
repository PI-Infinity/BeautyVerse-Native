import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  ImageBackground,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { terms, privacy, qa, usage } from "../../datas/pageTexts";
import { lightTheme, darkTheme } from "../../context/theme";
import { useSelector } from "react-redux";
import { Header } from "./settings/header";
import { BlurView } from "expo-blur";
import { Language } from "../../context/language";

export const QA = ({ hideModal }) => {
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const [loader, setLoader] = useState(true);
  const language = Language();

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 100);
  }, []);
  return (
    <>
      {!currentUser ? (
        <ImageBackground
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
          }}
          source={theme ? require("../../assets/background.jpg") : null}
        >
          <BlurView
            intensity={30}
            tint="dark"
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(1,2,0,0.5)",
            }}
          >
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
                contentContainerStyle={{
                  paddingVertical: 20,
                  paddingHorizontal: 20,
                }}
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
          </BlurView>
        </ImageBackground>
      ) : (
        <>
          <Header
            onBack={hideModal}
            title={language?.language?.Pages?.pages?.qa}
          />
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
              contentContainerStyle={{
                paddingVertical: 20,
                paddingHorizontal: 20,
              }}
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
                {qa}
              </Text>
            </ScrollView>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({});
