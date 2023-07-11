import React from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";

/**
 * reset password popup to input email and get link
 */

const EmailPopup = ({ isVisible, onClose, onSend, setEmail, email }) => {
  // language context
  const language = Language();
  // theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // send function includes some functions from parent components
  const handleSend = () => {
    // send to email
    onSend(email);
    // clear email input
    setEmail("");
    // close popup
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Pressable
          onPress={onClose}
          style={[
            styles.container,
            { backgroundColor: currentTheme.background2 },
          ]}
        >
          <Text style={[styles.title, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.randomPasswordText}
          </Text>
          <TextInput
            autoFocus
            style={[
              styles.input,
              {
                color: currentTheme.font,
                borderColor: currentTheme.disabled,
                backgroundColor: currentTheme.background,
              },
            ]}
            onChangeText={setEmail}
            value={email}
            placeholder={language?.language?.Auth?.auth?.enterEmail}
            keyboardType="email-address"
            placeholderTextColor={currentTheme.disabled}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                { backgroundColor: currentTheme.disabled },
              ]}
              onPress={onClose}
            >
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
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {},
  container: {
    borderRadius: 10,
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "bold",
    marginBottom: 15,
    letterSpacing: 0.3,
  },
  input: {
    borderRadius: 50,
    paddingLeft: 10,
    marginBottom: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2, // negative value places shadow on top
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    width: "45%",
    marginTop: 10,
    justifyContent: "center",
    borderRadius: 50,
  },
  sendButton: {
    width: "45%",
    padding: 10,
    backgroundColor: "#F866B1",
    marginTop: 10,
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EmailPopup;
