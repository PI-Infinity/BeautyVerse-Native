import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Language } from "../../context/language";

const EmailPopup = ({ isVisible, onClose, onSend, setEmail, email }) => {
  const language = Language();

  const handleSend = () => {
    onSend(email);
    setEmail("");
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          {language?.language?.Auth?.auth?.randomPasswordText}
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder={language?.language?.Auth?.auth?.enterEmail}
          keyboardType="email-address"
          placeholderTextColor="#111"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>
              {language?.language?.Auth?.auth?.cancel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.buttonText}>
              {language?.language?.Auth?.auth?.send}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  sendButton: {
    backgroundColor: "#4285f4",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EmailPopup;
