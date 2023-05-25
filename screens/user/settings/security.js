import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Pressable,
  Dimensions,
  TextInput,
  Alert,
  Vibration,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ListItem, Icon, Button } from "react-native-elements";
import { Language } from "../../../context/language";
import DeleteUserPopup from "../../../components/confirmDialog";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { ref, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../../firebase";
import { lightTheme, darkTheme } from "../../../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Security = () => {
  const language = Language();
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [openChangePassword, setOpenChangePassword] = useState(true);

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const Changing = async () => {
    try {
      const response = await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/changePassword/" +
          currentUser._id,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Password changed successfully!");
    } catch (error) {
      if (
        oldPassword?.length > 0 ||
        newPassword?.length > 0 ||
        confirmPassword?.length > 0
      ) {
        Alert.alert(error.response.data.message);
      }
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // open remove account confirm popup
  const [openDelete, setOpenDelete] = useState(false);

  const Delete = async () => {
    let videofileRef = ref(storage, `videos/${currentUser?._id}`);
    let imagefileRef = ref(storage, `images/${currentUser?._id}`);
    try {
      await AsyncStorage.removeItem("Beautyverse:currentUser");
      await dispatch(setRerenderCurrentUser());
      const response = await axios.delete(
        "https://beautyverse.herokuapp.com/api/v1/users/" + currentUser?._id
      );
      if (response.status === 204) {
        deleteObject(videofileRef).then(() => {
          console.log("object deleted");
        });
        deleteObject(imagefileRef).then(() => {
          console.log("object deleted");
        });
        console.log("User deleted successfully");
      } else {
        console.log("Something went wrong while deleting the user");
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        paddingHorizontal: 30,
        paddingVertical: 20,
        alignItems: "center",
        gap: 20,
      }}
    >
      {!openChangePassword && (
        <View style={{ gap: 10, width: "80%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              width: "100%",
              borderRadius: 50,
              borderColor: "#555",
              borderWidth: 1,
            }}
          >
            <TextInput
              secureTextEntry={!showOldPassword}
              placeholderTextColor={currentTheme.disabled}
              placeholder={language?.language?.User?.userPage?.oldPassword}
              onChangeText={setOldPassword}
              style={{
                padding: 10,
                color: currentTheme.font,
                width: "90%",
                borderWidth: 0,
              }}
            />
            <TouchableOpacity
              style={{ padding: 5, paddingLeft: 0 }}
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <MaterialIcons
                  name="remove-red-eye"
                  color="#e5e5e5"
                  size={16}
                />
              ) : (
                <MaterialIcons
                  name="panorama-fisheye"
                  color="#e5e5e5"
                  size={16}
                />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              width: "100%",
              borderRadius: 50,
              borderColor: "#555",
              borderWidth: 1,
            }}
          >
            <TextInput
              secureTextEntry={!showPassword}
              placeholderTextColor={currentTheme.disabled}
              placeholder={language?.language?.User?.userPage?.newPassword}
              onChangeText={setNewPassword}
              style={{
                padding: 10,
                color: currentTheme.font,
                width: "90%",
                borderWidth: 0,
              }}
            />
            <TouchableOpacity
              style={{ padding: 5, paddingLeft: 0 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <MaterialIcons
                  name="remove-red-eye"
                  color="#e5e5e5"
                  size={16}
                />
              ) : (
                <MaterialIcons
                  name="panorama-fisheye"
                  color="#e5e5e5"
                  size={16}
                />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              width: "100%",
              borderRadius: 50,
              borderColor: "#555",
              borderWidth: 1,
            }}
          >
            <TextInput
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor={currentTheme.disabled}
              placeholder={language?.language?.User?.userPage?.confirmPassword}
              style={{
                padding: 10,
                width: "90%",
                color: currentTheme.font,
              }}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={{ padding: 5, paddingLeft: 0 }}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <MaterialIcons
                  name="remove-red-eye"
                  color="#e5e5e5"
                  size={16}
                />
              ) : (
                <MaterialIcons
                  name="panorama-fisheye"
                  color="#e5e5e5"
                  size={16}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
      {openChangePassword ? (
        <TouchableOpacity
          style={{ padding: 5, paddingLeft: 0 }}
          activeOpacity={0.5}
          style={{
            backgroundColor: currentTheme.background2,
            borderRadius: 50,
            padding: 10,
            paddingVertical: 12.5,
            width: "80%",
            alignItems: "center",
          }}
          onPress={() => setOpenChangePassword(false)}
        >
          <Text style={{ color: "#e5e5e5" }}>
            {language?.language?.User?.userPage?.changePassword}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            borderRadius: 50,
            padding: 10,
            width: "80%",
            alignItems: "center",
            backgroundColor: currentTheme.pink,
          }}
          onPress={() => {
            Changing();
            setOpenChangePassword(true);
          }}
        >
          <Text style={{ color: "#e5e5e5" }}>
            {language?.language?.Main?.filter?.save}
          </Text>
        </TouchableOpacity>
      )}
      {openDelete && (
        <DeleteUserPopup
          isVisible={openDelete}
          onClose={() => setOpenDelete(false)}
          onDelete={Delete}
          title="Are you sure to want to delete this account?"
          cancel={language?.language?.Auth?.auth?.cancel}
          delet={language?.language?.Auth?.auth?.delete}
        />
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 10,
          borderRadius: 50,
          width: "45%",
          alignItems: "center",
        }}
        onPress={() => {
          Vibration.vibrate();
          setOpenDelete(true);
        }}
      >
        <Text style={{ color: "#e5e5e5" }}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});
