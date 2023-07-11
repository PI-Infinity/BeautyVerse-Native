import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";

/**
 * authentication email Verification code input popup
 */

const InputPopup = (props) => {
  const language = Language();

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const handleSend = () => {
    props.setFunction();
  };

  const handleCancel = () => {
    props.setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent visible={props.open}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: currentTheme.background2 },
              ]}
            >
              {props.registerMessages && (
                <Text
                  style={[
                    styles.modalText,
                    {
                      fontSize: 16,
                      color: currentTheme.font,
                      fontWeight: "bold",
                      letterSpacing: 0.3,
                    },
                  ]}
                >
                  {language?.language?.Auth?.auth?.successRegister}
                </Text>
              )}
              <Text
                style={[
                  styles.modalText,
                  {
                    fontSize: 16,
                    color: currentTheme.font,
                    letterSpacing: 0.3,
                  },
                ]}
              >
                Verification code has been sent to email!
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: currentTheme.background,
                    color: currentTheme.font,
                  },
                ]}
                onChangeText={(text) => props.setCode(text)}
                value={props.code}
                placeholder={language?.language?.Auth?.auth?.verificationCode}
                placeholderTextColor="#888"
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    { backgroundColor: currentTheme.disabled },
                  ]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>
                    {language?.language?.Auth?.auth?.cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.sendButton,
                    { backgroundColor: currentTheme.pink },
                  ]}
                  onPress={handleSend}
                >
                  <Text style={styles.buttonText}>
                    {language?.language?.Auth?.auth?.send}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  input: {
    borderRadius: 50,
    padding: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // negative value places shadow on top
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    borderRadius: 50,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  sendButton: {
    color: "#e5e5e5",
  },
  cancelButton: {
    color: "#e5e5e5",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default InputPopup;
