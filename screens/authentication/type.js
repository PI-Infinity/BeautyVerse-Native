import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setType } from "../../redux/auth";
import { Language } from "../../context/language";
import { lightTheme, darkTheme } from "../../context/theme";
import {
  MaterialIcons,
  FontAwesome,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";

/*
  Register Screen,
  in this screen user choice type of user and navigates to identify screen
*/

export const Type = ({ navigation }) => {
  //language context
  const language = Language();
  // redux tpplkit dispatch
  const dispatch = useDispatch();
  // theme state and context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
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
        style={{ flex: 1, backgroundColor: "rgba(1,2,0,0.5)" }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.box,
              {
                borderWidth: 1,
                borderColor: currentTheme.line,
                gap: 10,
              },
            ]}
            onPress={() => {
              dispatch(setType("user"));
              navigation.navigate("Accept");
            }}
          >
            <FontAwesome name="user" size={24} color={currentTheme.pink} />
            <Text style={[styles.boxText, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.user}
            </Text>
            <Text
              style={[
                styles.boxText,
                {
                  color: currentTheme.font,
                  textAlign: "center",
                  fontWeight: "normal",
                  color: currentTheme.disabled,
                  lineHeight: 20,
                  fontSize: 14,
                },
              ]}
            >
              {language?.language?.Auth?.auth?.userText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.box,
              {
                borderWidth: 1,
                borderColor: currentTheme.line,
                gap: 10,
              },
            ]}
            onPress={() => {
              dispatch(setType("specialist"));
              navigation.navigate("Business");
            }}
          >
            <Entypo name="brush" size={22} color={currentTheme.pink} />
            <Text style={[styles.boxText, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.specialist}
            </Text>
            <Text
              style={[
                styles.boxText,
                {
                  color: currentTheme.font,
                  textAlign: "center",
                  fontWeight: "normal",
                  color: currentTheme.disabled,
                  lineHeight: 20,
                  fontSize: 14,
                },
              ]}
            >
              {language?.language?.Auth?.auth?.specText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.box,
              {
                borderWidth: 1,
                borderColor: currentTheme.line,
                gap: 10,
              },
            ]}
            onPress={() => {
              dispatch(setType("beautyCenter"));
              navigation.navigate("Business");
            }}
          >
            <MaterialIcons
              name="add-business"
              size={26}
              color={currentTheme.pink}
            />
            <Text style={[styles.boxText, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.beautySalon}
            </Text>
            <Text
              style={[
                styles.boxText,
                {
                  color: currentTheme.font,
                  textAlign: "center",
                  fontWeight: "normal",
                  color: currentTheme.disabled,
                  lineHeight: 20,
                  fontSize: 14,
                },
              ]}
            >
              {language?.language?.Auth?.auth?.salonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.box,
              {
                borderWidth: 1,
                borderColor: currentTheme.line,
                gap: 10,
              },
            ]}
            onPress={() => {
              dispatch(setType("shop"));
              navigation.navigate("Accept");
            }}
          >
            <Fontisto
              name="shopping-bag-1"
              size={25}
              color={currentTheme.pink}
            />
            <Text style={[styles.boxText, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.shop}
            </Text>
            <Text
              style={[
                styles.boxText,
                {
                  color: currentTheme.font,
                  textAlign: "center",
                  fontWeight: "normal",
                  color: currentTheme.disabled,
                  lineHeight: 20,
                  fontSize: 14,
                },
              ]}
            >
              {language?.language?.Auth?.auth?.shopText}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 30,

    // marginBottom: 50,
  },
  box: {
    width: "80%",
    height: 160,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,

    padding: 20,
  },
  boxText: {
    fontWeight: "bold",
    letterSpacing: 0.3,
    fontSize: 16,
  },
  loginQuestion: {
    textAlign: "center",
    marginTop: 15,
    letterSpacing: 0.2,
  },
  login: {
    color: "#F866B1",
    textAlign: "center",
    marginTop: 15,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
});
