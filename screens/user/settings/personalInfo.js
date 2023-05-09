import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import { setCurrentUser } from "../../../redux/user";
import axios from "axios";
import CountryCodePicker from "../../../components/countryCodes";
import { Language } from "../../../context/language";
import { lightTheme, darkTheme } from "../../../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const PersonalInfo = ({ user, onSave }) => {
  const language = Language();
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState({ ...currentUser });

  const handleSave = async () => {
    const User = {
      ...currentUser,
      name: editableUser?.name,
      username: editableUser?.username,
      phone: editableUser?.phone,
      about: editableUser?.about,
      media: {
        web: editableUser?.media?.web,
        facebook: editableUser?.media?.facebook,
        instagram: editableUser?.media?.instagram,
        youtube: editableUser?.media?.youtube,
        tiktok: editableUser?.media?.tiktok,
        whatsapp: editableUser?.media?.whatsapp,
        telegram: editableUser?.media?.telegram,
      },
    };
    setIsEditing(false);
    dispatch(setCurrentUser(User));
    try {
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" + currentUser._id,
        {
          name: editableUser?.name,
          username: editableUser?.username,
          phone: editableUser?.phone,
          about: editableUser?.about,
          media: {
            web: editableUser?.media?.web,
            facebook: editableUser?.media?.facebook,
            instagram: editableUser?.media?.instagram,
            youtube: editableUser?.media?.youtube,
            tiktok: editableUser?.media?.tiktok,
            whatsapp: editableUser?.media?.whatsapp,
            telegram: editableUser?.media?.telegram,
          },
        }
      );
      dispatch(setRerenderCurrentUser());
    } catch (error) {
      Alert.alert(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const type = capitalizeFirstLetter(currentUser?.type);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        zIndex: 100,
        paddingBottom: 30,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ gap: 7.5 }}>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            {language?.language?.User.userPage.userType}:
          </Text>
          <Text style={[styles.value, { color: currentTheme.font }]}>
            {type}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            {language?.language?.Auth.auth.email}:
          </Text>
          <Text style={[styles.value, { color: currentTheme.font }]}>
            {currentUser?.email}
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            {language?.language?.Auth.auth.name}:
          </Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              style={styles.input}
              value={editableUser.name}
              onChangeText={(text) =>
                setEditableUser({ ...editableUser, name: text })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser?.name}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            {language?.language?.User.userPage.username}:
          </Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              style={styles.input}
              value={editableUser.username}
              onChangeText={(text) =>
                setEditableUser({ ...editableUser, username: text })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser?.username}
            </Text>
          )}
        </View>
        <View style={[styles.itemContainer, { height: "auto" }]}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            {language?.language?.User.userPage.about}:
          </Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              style={styles.input}
              value={editableUser.about}
              multiline
              numberOfLines={15}
              onChangeText={(text) =>
                setEditableUser({ ...editableUser, about: text })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser?.about}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            {language?.language?.Auth.auth.phone}:
          </Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              placeholder="ex: +00000000000"
              style={styles.input}
              value={editableUser.phone}
              onChangeText={(text) =>
                setEditableUser({
                  ...editableUser,
                  phone: text,
                })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser.phone}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>Web:</Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              placeholder="ex: web.com"
              style={styles.input}
              value={editableUser?.media?.web}
              onChangeText={(text) =>
                setEditableUser({
                  ...editableUser,
                  media: {
                    ...editableUser?.media,
                    web: text,
                  },
                })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser.media?.web}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            Facebook:
          </Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              placeholder="ex: 917823612"
              style={styles.input}
              value={editableUser?.media?.facebook}
              onChangeText={(text) =>
                setEditableUser({
                  ...editableUser,
                  media: {
                    ...editableUser?.media,
                    facebook: text,
                  },
                })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser.media?.facebook}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            Instagram:
          </Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              placeholder="ex: @username"
              style={styles.input}
              value={editableUser?.media?.instagram}
              onChangeText={(text) =>
                setEditableUser({
                  ...editableUser,
                  media: {
                    ...editableUser?.media,
                    instagram: text,
                  },
                })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser.media?.instagram}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            Youtube:
          </Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              placeholder="ex: @username"
              style={styles.input}
              value={editableUser?.media?.youtube}
              onChangeText={(text) =>
                setEditableUser({
                  ...editableUser,
                  media: {
                    ...editableUser?.media,
                    youtube: text,
                  },
                })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser.media?.youtube}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            Tiktok:
          </Text>
          {isEditing ? (
            <TextInput
              placeholderTextColor="#888"
              placeholder="ex: @username"
              style={styles.input}
              value={editableUser?.media?.tiktok}
              onChangeText={(text) =>
                setEditableUser({
                  ...editableUser,
                  media: {
                    ...editableUser?.media,
                    tiktok: text,
                  },
                })
              }
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser.media?.tiktok}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            whatsapp:
          </Text>
          {isEditing ? (
            <Switch
              trackColor={{ false: "#e5e5e5", true: "#F866B1" }}
              thumbColor={editableUser?.media?.whatsapp ? "#e5e5e5" : "#F866B1"}
              value={editableUser?.media?.whatsapp}
              onValueChange={() =>
                setEditableUser({
                  ...editableUser,
                  media: {
                    ...editableUser?.media,
                    whatsapp: !editableUser?.media?.whatsapp,
                  },
                })
              }
              style={styles.switch}
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser?.media?.whatsapp ? "Active" : "Disabled"}
            </Text>
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.label, { color: currentTheme.font }]}>
            Telegram:
          </Text>
          {isEditing ? (
            <Switch
              trackColor={{ false: "#e5e5e5", true: "#F866B1" }}
              thumbColor={editableUser?.media?.telegram ? "#e5e5e5" : "#F866B1"}
              value={editableUser?.media?.telegram}
              onValueChange={() =>
                setEditableUser({
                  ...editableUser,
                  media: {
                    ...editableUser?.media,
                    telegram: !editableUser?.media?.telegram,
                  },
                })
              }
              style={styles.switch}
            />
          ) : (
            <Text style={[styles.value, { color: currentTheme.font }]}>
              {currentUser?.media?.telegram ? "Active" : "Disabled"}
            </Text>
          )}
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {isEditing ? (
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>
                {language?.language?.Main.filter.save}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
            >
              <Text style={styles.buttonText}>
                {language?.language?.Main.filter.edit}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingTop: 20,
    width: SCREEN_WIDTH,
  },
  itemContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 8,
    height: 30,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#e5e5e5",
  },
  value: {
    fontSize: 14,
    color: "#e5e5e5",
    padding: 5,
    flex: 1,
  },
  input: {
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 50,
    padding: 5,
    paddingLeft: 15,
    fontSize: 14,
    color: "#e5e5e5",
    flex: 1,
    height: 30,
  },
  editButton: {
    backgroundColor: "#F866B1",
    borderRadius: 50,
    padding: 10,
    marginTop: 15,
    width: "45%",
  },
  saveButton: {
    backgroundColor: "#F866B1",
    borderRadius: 50,
    padding: 10,
    marginTop: 15,
    width: "45%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
