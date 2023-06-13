import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { lightTheme, darkTheme } from "../context/theme";
import { useSelector, useDispatch } from "react-redux";

export const BackDrop = ({ loading, setLoading }) => {
  const toggleLoader = () => {
    setLoading(!loading);
  };
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <View style={styles.container}>
      <Modal transparent visible={loading} onRequestClose={toggleLoader}>
        <View style={styles.backdrop}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={currentTheme.pink} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 10000,
  },
  button: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
  },
});
