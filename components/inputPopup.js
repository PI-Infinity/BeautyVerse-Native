import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Language } from "../context/language";

const InputPopup = (props) => {
  const language = Language();
  const [email, setEmail] = useState("");

  const handleSend = () => {
    // Your send logic here
    props.setFunction();
    props.setOpen(false);
  };

  const handleCancel = () => {
    props.setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent visible={props.open}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {language?.language?.Auth?.auth?.verificationCode}
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => props.setCode(text)}
              value={props.code}
              placeholder="Code"
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>
                  {language?.language?.Auth?.auth?.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.sendButton]}
                onPress={handleSend}
              >
                <Text style={styles.buttonText}>
                  {language?.language?.Auth?.auth?.send}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 50,
    padding: 10,
    width: "100%",
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
    backgroundColor: "#F866B1",
  },
  cancelButton: {
    backgroundColor: "gray",
    color: "#e5e5e5",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default InputPopup;
