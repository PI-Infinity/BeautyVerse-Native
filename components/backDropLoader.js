import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../context/theme";

// sticky loader with overlay background

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
