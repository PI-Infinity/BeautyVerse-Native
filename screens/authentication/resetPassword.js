import React from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

import { useSelector } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { BlurView } from "expo-blur";

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
    <View>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        animationType="fadeIn"
        style={styles.modal}
        transparent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <BlurView
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            intensity={60}
            tint="dark"
          >
            <Pressable onPress={onClose} style={[styles.container, {}]}>
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
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                >
                  <Text style={styles.buttonText}>
                    {language?.language?.Auth?.auth?.send}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </BlurView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: { flex: 1 },
  container: {
    borderRadius: 10,
    padding: 20,
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
