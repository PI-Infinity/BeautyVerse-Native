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
} from "react-native";
import { SectionList } from "react-native";
import Collapsible from "react-native-collapsible";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import { setLanguage, setTheme } from "../../../redux/app";
import { useDispatch, useSelector } from "react-redux";
import { PersonalInfo } from "../../../screens/user/settings/personalInfo";
import { Procedures } from "../../../screens/user/settings/procedures";
import { Security } from "../../../screens/user/settings/security";
import axios from "axios";
import { setCurrentUser } from "../../../redux/user";
import { WorkingInfo } from "../../../screens/user/settings/workingInfo";
import { Addresses } from "../../../screens/user/settings/addresses";
import { ListItem, Icon, Button } from "react-native-elements";
import { Language } from "../../../context/language";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Settings = ({ navigation }) => {
  const language = Language();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [status, setStatus] = useState(true);

  const dispatch = useDispatch();

  const [openTeam, setOpenTeam] = useState(true);
  const [openSecurity, setOpenSecurity] = useState(true);
  const [openLanguages, setOpenLanguages] = useState(true);

  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const activeLanguage = useSelector((state) => state.storeApp.language);
  const theme = useSelector((state) => state.storeApp.theme);

  const Logout = async () => {
    await AsyncStorage.removeItem("Beautyverse:currentUser");
    dispatch(setRerenderCurrentUser());
  };

  const ControlActivity = async () => {
    try {
      dispatch(setCurrentUser({ ...currentUser, active: !currentUser.active }));
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
        {
          active: !currentUser?.active,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      style={{ width: "100%", paddingTop: 20 }}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("Personal info")}
        style={styles.item}
      >
        <Text style={styles.sectionTitle}>
          {language?.language?.User?.userPage?.personalInfo}
        </Text>
        <MaterialIcons name={"arrow-right"} color="#fff" size={18} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("Addresses")}
        style={styles.item}
      >
        <Text style={styles.sectionTitle}>
          {language?.language?.User?.userPage?.addresses}
        </Text>
        <MaterialIcons name={"arrow-right"} color="#fff" size={18} />
      </TouchableOpacity>
      {currentUser.type !== "user" && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Procedures")}
          style={styles.item}
        >
          <Text style={styles.sectionTitle}>
            {language?.language?.User?.userPage?.procedures}
          </Text>
          <MaterialIcons name={"arrow-right"} color="#fff" size={18} />
        </TouchableOpacity>
      )}
      {currentUser.type !== "user" && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Working info")}
          style={styles.item}
        >
          <Text style={styles.sectionTitle}>
            {language?.language?.User?.userPage?.workingInfo}
          </Text>
          <MaterialIcons name={"arrow-right"} color="#fff" size={18} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => setOpenSecurity(!openSecurity)}
        style={styles.item}
      >
        <Text style={styles.sectionTitle}>
          {language?.language?.User?.userPage?.security}
        </Text>
        <MaterialIcons
          name={openSecurity ? "arrow-drop-up" : "arrow-drop-down"}
          color="#fff"
          size={18}
        />
      </TouchableOpacity>
      <Collapsible collapsed={openSecurity}>
        <Security />
      </Collapsible>
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.item, { marginBottom: 20 }]}
        onPress={() => setOpenLanguages(!openLanguages)}
      >
        <Text style={styles.sectionTitle}>
          {language?.language?.User?.userPage?.languages}
        </Text>
        <MaterialIcons
          name={openLanguages ? "arrow-drop-up" : "arrow-drop-down"}
          color="#fff"
          size={18}
        />
      </TouchableOpacity>
      <Collapsible collapsed={openLanguages}>
        <View
          style={{ width: SCREEN_WIDTH - 60, backgroundColor: "Red", gap: 10 }}
        >
          <Pressable
            style={{
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
            onPress={() => dispatch(setLanguage("ka"))}
          >
            <Text
              style={{ color: activeLanguage === "ka" ? "orange" : "#e5e5e5" }}
            >
              {language?.language?.Auth?.auth?.georgian}
            </Text>
          </Pressable>
          <Pressable
            style={{
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
            onPress={() => dispatch(setLanguage("en"))}
          >
            <Text
              style={{ color: activeLanguage === "en" ? "orange" : "#e5e5e5" }}
            >
              {language?.language?.Auth?.auth?.english}
            </Text>
          </Pressable>
          <Pressable
            style={{
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
            onPress={() => dispatch(setLanguage("ru"))}
          >
            <Text
              style={{ color: activeLanguage === "ru" ? "orange" : "#e5e5e5" }}
            >
              {language?.language?.Auth?.auth?.russian}
            </Text>
          </Pressable>
        </View>
      </Collapsible>
      {currentUser.type !== "user" && (
        <View
          style={[
            styles.item,
            {
              backgroundColor: "rgba(0,0,0,0)",
              marginTop: 5,
              marginBottom: 10,
            },
          ]}
        >
          <View style={{ alignItems: "center", gap: 7, flexDirection: "row" }}>
            <MaterialIcons name="verified" size={16} color="#1DA1F2" />
            <Text style={styles.sectionTitle}>
              {language?.language?.User?.userPage?.verification}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              gap: 0,
              flexDirection: "row",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: 50,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={styles.sectionTitle}>
              {language?.language?.Auth?.auth?.cancel}
            </Text>
            {/* <MaterialIcons name="attach-money" size={18} color="#fff" /> */}
          </View>
        </View>
      )}
      <View style={[styles.item, { backgroundColor: "rgba(0,0,0,0)" }]}>
        <Text style={styles.sectionTitle}>
          {language?.language?.User?.userPage?.notifications}
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          style={styles.switch}
        />
      </View>
      <View style={[styles.item, { backgroundColor: "rgba(0,0,0,0)" }]}>
        <Text style={styles.sectionTitle}>
          {language?.language?.User?.userPage?.darkMode}
        </Text>
        <Switch
          value={theme}
          onValueChange={() => dispatch(setTheme(!theme))}
          style={styles.switch}
        />
      </View>
      <View style={[styles.item, { backgroundColor: "rgba(0,0,0,0)" }]}>
        <Text style={styles.sectionTitle}>
          {language?.language?.User?.userPage?.activation}
        </Text>
        <Switch
          value={currentUser.active}
          onValueChange={ControlActivity}
          style={styles.switch}
        />
      </View>

      <TouchableOpacity
        onPress={Logout}
        activeOpacity={0.5}
        style={[styles.item, { marginTop: 50, marginBottom: 20 }]}
      >
        <Text style={styles.sectionTitle}>
          {language?.language?.User?.userPage?.logout}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "90%",
    padding: 15,
    // borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.02)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
});
