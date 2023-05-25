import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { lightTheme, darkTheme } from "../context/theme";
import { useSelector, useDispatch } from "react-redux";

export const UploaderPercentage = ({
  loading,
  setLoading,
  setFile,
  to,
  progress,
  setProgress,
  cancelUpload,
}) => {
  const toggleLoader = () => {
    if (progress < 100) {
      cancelUpload();
      setLoading(!loading);
      setProgress(0);
    }
  };

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <View style={styles.container}>
      <Modal transparent visible={loading} onRequestClose={toggleLoader}>
        <View style={styles.backdrop}>
          <View
            style={[
              styles.loaderContainer,
              { borderWidth: 1, borderColor: currentTheme.line },
            ]}
          >
            {to === "cloud" && (
              <Text style={{ color: "#ccc", letterSpacing: 0.2 }}>
                Uploading...
              </Text>
            )}
            {/* <ActivityIndicator size="large" color={currentTheme.pink} /> */}
            <View
              style={{
                flexDirection: "row",
                width: 35,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#ccc" }}>{progress?.toFixed(0)}</Text>
              <Text style={{ color: "#ccc" }}>%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={{
                  ...styles.progressBarFill,
                  width: `${progress}%`,
                  backgroundColor: currentTheme.pink,
                }}
              />
            </View>
          </View>
          <Pressable
            onPress={toggleLoader}
            style={{
              width: "40%",
              borderRadius: 50,
              padding: 7.5,
              alignItems: "center",
              marginTop: 30,
              backgroundColor: currentTheme.disabled,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3, // negative value places shadow on top
              },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text style={{ color: "#fff" }}>Cancel</Text>
          </Pressable>
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
    backgroundColor: "rgba(1, 1, 1, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    padding: 20,
    width: "60%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  progressBarBackground: {
    width: 140,
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 10,
  },
});
