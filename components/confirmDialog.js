// DeleteFeedPopup.js
import React, { useState, useEffect } from "react";
import {
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
} from "react-native";

const DeleteFeedPopup = ({
  isVisible,
  onClose,
  onDelete,
  title,
  delet,
  cancel,
}) => {
  const [animation] = useState(new Animated.Value(0));

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
    outputRange: [0, 0.5],
  });

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
          },
        ]}
      >
        <Text style={styles.text}>{title}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{cancel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onDelete();
              onClose();
            }}
          >
            <Text style={styles.buttonText}>{delet}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default DeleteFeedPopup;
