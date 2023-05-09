import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setCleanUp,
  setRerenderUserFeeds,
  setRerenderCurrentUser,
} from "../../redux/rerenders";
import { lightTheme, darkTheme } from "../../context/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SmoothModal = ({ visible, onClose, onSave, post, feedId, setPost }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  useEffect(() => {
    setText(post);
  }, []);

  const handleSave = () => {
    onSave(text);
    setText("");
    UpdatePost();
  };

  const handleCancel = () => {
    onClose();
    setText("");
  };

  const UpdatePost = async () => {
    try {
      setPost(text);
      await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser._id}/feeds/${feedId}`,
        {
          post: text,
        }
      );
      handleCancel();
      dispatch(setCleanUp());
      dispatch(setRerenderUserFeeds());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={[styles.modalBackground]}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingTop: 150,
          }}
          style={{
            maxHeight: 800,
            width: "100%",
          }}
          extraScrollHeight={Platform.OS === "ios" ? 50 : 0}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: currentTheme.background },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text
                style={{
                  color: currentTheme.font,
                  fontSize: 16,
                  marginVertical: 10,
                  fontWeight: "bold",
                }}
              >
                Edit Post:
              </Text>
              <Text style={{ color: currentTheme.font, fontSize: 12 }}>
                ({text.length})
              </Text>
            </View>
            <TextInput
              style={[
                styles.modalTextInput,
                {
                  color: currentTheme.font,
                  borderColor: currentTheme.background2,
                },
              ]}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={15}
              maxLength={800}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  { backgroundColor: currentTheme.background2 },
                ]}
                onPress={handleCancel}
              >
                <Text
                  style={[styles.modalButtonText, { color: currentTheme.font }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSaveButton,
                  { backgroundColor: currentTheme.pink },
                ]}
                onPress={text?.length < 1501 ? handleSave : undefined}
              >
                <Text style={[styles.modalButtonText, { color: "#e5e5e5" }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  modalCancelButton: {
    backgroundColor: "gray",
    borderRadius: 50,
    padding: 10,
    marginRight: 10,
    width: "45%",
    alignItems: "center",
  },
  modalSaveButton: {
    backgroundColor: "blue",
    borderRadius: 50,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SmoothModal;
