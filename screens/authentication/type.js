import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setType } from "../../redux/auth";
import { Language } from "../../context/language";
import { lightTheme, darkTheme } from "../../context/theme";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";

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
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.box,
          { backgroundColor: currentTheme.background2, gap: 10 },
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
          Simple user, to find services, book them and comunicate with beauty
          experts and businesses!
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.box,
          { backgroundColor: currentTheme.background2, gap: 10 },
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
          Specialist profile, to book & recieve services!
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.box,
          { backgroundColor: currentTheme.background2, gap: 10 },
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
          Phisycal beauty enviroment!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  box: {
    width: "80%",
    height: 180,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // negative value places shadow on top
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
