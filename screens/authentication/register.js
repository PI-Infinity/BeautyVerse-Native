import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setType } from "../../redux/auth";
import { Language } from "../../context/language";
import { lightTheme, darkTheme } from "../../context/theme";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
const Register = ({ navigation }) => {
  const language = Language();
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: currentTheme.font,
          marginBottom: 20,
          letterSpacing: 0.3,
        }}
      >
        Choice type:
      </Text>
      <TouchableOpacity
        style={[
          styles.box,
          { backgroundColor: currentTheme.background2, gap: 10 },
        ]}
        onPress={() => {
          dispatch(setType("user"));
          navigation.navigate("Identify");
        }}
      >
        <FontAwesome name="user" size={24} color={currentTheme.pink} />
        <Text style={[styles.boxText, { color: currentTheme.font }]}>
          {language?.language?.Auth?.auth?.user}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.box,
          { backgroundColor: currentTheme.background2, gap: 10 },
        ]}
        onPress={() => {
          dispatch(setType("specialist"));
          navigation.navigate("Identify");
        }}
      >
        <Entypo name="brush" size={22} color={currentTheme.pink} />
        <Text style={[styles.boxText, { color: currentTheme.font }]}>
          {language?.language?.Auth?.auth?.specialist}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.box,
          { backgroundColor: currentTheme.background2, gap: 10 },
        ]}
        onPress={() => {
          dispatch(setType("beautyCenter"));
          navigation.navigate("Identify");
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
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginTop: 10,
        }}
      >
        <Text style={[styles.loginQuestion, { color: currentTheme.font }]}>
          {language?.language?.Auth?.auth?.havea}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.login, { color: currentTheme.pink }]}>
            {language?.language?.Auth?.auth?.login}
          </Text>
        </TouchableOpacity>
      </View>
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
    height: 120,
    marginBottom: 15,
    flexDirection: "row",
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
  },
  boxText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  loginQuestion: {
    color: "#fff",
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

export default Register;
