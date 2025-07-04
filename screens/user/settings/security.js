import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DeleteUserPopup from "../../../components/confirmDialog";
import { Language } from "../../../context/language";
import { darkTheme, lightTheme } from "../../../context/theme";
import { setLoading, setLogoutLoading } from "../../../redux/app";
import { setCurrentUser } from "../../../redux/user";

/**
 * Define security screen in settings
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Security = () => {
  // define language
  const language = Language();
  // define dispatch
  const dispatch = useDispatch();

  // define passwords states
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [openChangePassword, setOpenChangePassword] = useState(true);

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * password change function
   *  */
  const Changing = async () => {
    try {
      await axios.patch(
        backendUrl + "/api/v1/changePassword/" + currentUser._id,
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

  // open remove account confirm popup state
  const [openDelete, setOpenDelete] = useState(false);

  /**
   * Delete account function
   */

  const Delete = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setCurrentUser(null));
      await AsyncStorage.removeItem("Beautyverse:currentUser");
      await axios.delete(backendUrl + "/api/v1/users/" + currentUser?._id);
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 1000);
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
