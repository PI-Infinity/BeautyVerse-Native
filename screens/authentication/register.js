import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setType } from "../../redux/auth";
import { Language } from "../../context/language";

const Register = ({ navigation }) => {
  const language = Language();
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.box}
        onPress={() => {
          dispatch(setType("user"));
          navigation.navigate("Identify");
        }}
      >
        <Text style={styles.boxText}>
          {language?.language?.Auth?.auth?.user}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.box}
        onPress={() => {
          dispatch(setType("specialist"));
          navigation.navigate("Identify");
        }}
      >
        <Text style={styles.boxText}>
          {language?.language?.Auth?.auth?.specialist}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.box}
        onPress={() => {
          dispatch(setType("beautyCenter"));
          navigation.navigate("Identify");
        }}
      >
        <Text style={styles.boxText}>
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
        <Text style={styles.loginQuestion}>
          {language?.language?.Auth?.auth?.havea}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.login}>
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
  },
  box: {
    backgroundColor: "rgba(255,255,255, 0.05)",
    width: "70%",
    height: 110,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  boxText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loginQuestion: {
    color: "#fff",
    textAlign: "center",
    marginTop: 15,
  },
  login: {
    color: "#F866B1",
    textAlign: "center",
    marginTop: 15,
  },
});

export default Register;
