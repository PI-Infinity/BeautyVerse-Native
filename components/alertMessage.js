// DeleteFeedPopup.js
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../context/theme";

/**
 * Alert component
 */

const AlertMessage = ({ isVisible, onClose, type, text, Press }) => {
  const [animation] = useState(new Animated.Value(0));
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7],
  });

  // define type color
  let color;
  let btn;
  if (type === "success") {
    color = currentTheme.pink;
    btn = (
      <MaterialIcons name="done" size={22} color="#f1f1f1" onPress={Press} />
    );
  } else if (type === "error") {
    color = "#d32f2f";
    btn = <MaterialIcons name="close" size={23} color="#000" onPress={Press} />;
  }

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <Animated.View style={[styles.background, { opacity }]}>
        <TouchableOpacity style={styles.fill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            backgroundColor: "rgba(0,0,0,0)",
          },
        ]}
      >
        <View
          style={{
            width: "100%",
            paddingVertical: 5,
            paddingHorizontal: 7.5,
            alignItems: "center",
            backgroundColor: color,
            borderRadius: 50,
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
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              // padding: ,
              alignItems: "center",
              backgroundColor: color,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: currentTheme.line,
            }}
          >
            {btn}
            <View style={{ width: "80%", alignItems: "center" }}>
              <Text
                style={{ color: "#f1f1f1", padding: 5, fontWeight: "bold" }}
              >
                {text}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onClose();
              }}
            >
              <MaterialIcons
                name="close"
                size={22}
                style={{ color: type === "success" ? "red" : "#f1f1f1" }}
                onPress={Press}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default AlertMessage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    position: "absolute",
    width: "100%",
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 5,
  },
  buttonText: {
    color: "red",
  },
});
