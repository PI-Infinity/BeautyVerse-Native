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
  setRerenderUserList,
} from "../../redux/rerenders";
import { lightTheme, darkTheme } from "../../context/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from "@expo/vector-icons";
import { ref, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../firebase";
import { BackDrop } from "../../components/backDropLoader";

const SmoothModal = ({
  visible,
  onClose,
  onSave,
  post,
  itemId,
  fileFormat,
  itemName,
  setPost,
  navigation,
}) => {
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
      console.log(text);
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

  const [loading, setLoading] = useState(false);

  const Deleting = async () => {
    setLoading(true);
    // props.setFeeds((prev) => prev.filter((item) => item._id !== itemId));

    const values = [];
    /** delete from mongodb
     */

    /** delete from cloude
     */
    // Create a reference to the file to delete
    let fileRef;
    if (fileFormat === "video") {
      fileRef = ref(storage, `videos/${currentUser?._id}/feeds/${itemName}/`);
    } else {
      fileRef = ref(storage, `images/${currentUser?._id}/feeds/${itemName}`);
    }

    // remove feed
    const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/feeds/${itemId}`;
    const response = await fetch(url, { method: "DELETE" })
      .then((response) => response.json())
      .then(async (data) => {
        // Delete the file
        if (fileFormat === "video") {
          deleteObject(fileRef).then(() => {
            console.log("delete video running..");
            handleCancel();
            setTimeout(() => {
              dispatch(setRerenderUserFeeds());
              dispatch(setRerenderUserList());
              setLoading(false);
              navigation.navigate("UserProfile");
            }, 500);
          });
        } else {
          listAll(fileRef)
            .then((res) => {
              res.items.forEach((itemRef) => {
                deleteObject(itemRef).then(() => {
                  handleCancel();
                  setTimeout(() => {
                    dispatch(setRerenderUserFeeds());
                    dispatch(setRerenderUserList());
                    setLoading(false);
                    navigation.navigate("UserProfile");
                  }, 500);
                });
              });
            })
            .catch((error) => {
              console.log("error : " + error);
            });
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      {loading && <BackDrop />}
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
                  letterSpacing: 0.3,
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
                  borderWidth: 1,
                  borderColor: currentTheme.line,
                  marginTop: 10,
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

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  color: currentTheme.font,
                  fontSize: 16,
                  marginVertical: 10,
                  fontWeight: "bold",

                  letterSpacing: 0.3,
                }}
              >
                Delete Post:
              </Text>
              <TouchableOpacity
                style={{
                  marginRight: 10,
                  padding: 10,
                  borderRadius: 50,
                  backgroundColor: currentTheme.background2,
                  borderWidth: 1,
                  borderColor: currentTheme.line,
                }}
                onPress={() => Deleting()}
              >
                <MaterialIcons name="delete" size={24} color="red" />
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
    width: "90%",
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
    marginTop: 10,
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
