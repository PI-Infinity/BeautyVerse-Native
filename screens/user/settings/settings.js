import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../../../context/language";
import { darkTheme, lightTheme } from "../../../context/theme";
import {
  setLanguage,
  setLoading,
  setLogoutLoading,
  setTheme,
} from "../../../redux/app";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import { setCurrentUser } from "../../../redux/user";
import { Security } from "../../../screens/user/settings/security";

/**
 * Settings screen in user
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Settings = ({ navigation }) => {
  // define language
  const language = Language();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [status, setStatus] = useState(true);

  const dispatch = useDispatch();

  // define some open states
  const [openTeam, setOpenTeam] = useState(true);
  const [openSecurity, setOpenSecurity] = useState(true);
  const [openLanguages, setOpenLanguages] = useState(true);

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define active language
  const activeLanguage = useSelector((state) => state.storeApp.language);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  /**
   * Logout function
   */
  const Logout = async () => {
    dispatch(setLogoutLoading(true));
    await AsyncStorage.removeItem("Beautyverse:currentUser");
    dispatch(setCurrentUser(null));
    dispatch(setRerenderCurrentUser());
    setTimeout(() => {
      dispatch(setLogoutLoading(false));
    }, 1000);
  };

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * change user active in feeds and cards or not
   */
  const ControlActivity = async () => {
    try {
      dispatch(setCurrentUser({ ...currentUser, active: !currentUser.active }));
      await axios.patch(`${backendUrl}/api/v1/users/${currentUser?._id}`, {
        active: !currentUser?.active,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // define new sent orders
  const newSentOrders = useSelector((state) => state.storeSentOrders.new);

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: 30,
        gap: 6,
      }}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      style={{
        width: "100%",
        paddingTop: 20,
        backgroundColor: currentTheme.background,
      }}
    >
      {currentUser?.type.toLowerCase() === "specialist" && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Sent Orders")}
          style={[
            styles.item,
            {
              borderWidth: 1,
              borderColor: currentTheme.line,
              borderRadius: 10,
            },
          ]}
        >
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <Text
              style={[
                styles.sectionTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              {language?.language?.User?.userPage?.sentBookings}
            </Text>
            {newSentOrders > 0 && (
              <View
                style={{
                  width: "auto",
                  minWidth: 16,
                  height: 16,
                  backgroundColor: "green",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10 }}>
                  {newSentOrders}
                </Text>
              </View>
            )}
          </View>
          <MaterialIcons
            name={"arrow-right"}
            color={currentTheme.pink}
            size={18}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("Personal info")}
        style={[
          styles.item,
          {
            borderWidth: 1,
            borderColor: currentTheme.line,
            borderRadius: 10,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.User?.userPage?.personalInfo}
        </Text>
        <MaterialIcons
          name={"arrow-right"}
          color={currentTheme.pink}
          size={18}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("Addresses")}
        style={[
          styles.item,
          {
            borderWidth: 1,
            borderColor: currentTheme.line,
            borderRadius: 10,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.User?.userPage?.addresses}
        </Text>
        <MaterialIcons
          name={"arrow-right"}
          color={currentTheme.pink}
          size={18}
        />
      </TouchableOpacity>
      {currentUser.type?.toLowerCase() === "specialist" ||
      currentUser.type?.toLowerCase() === "beautycenter" ? (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Procedures")}
          style={[
            styles.item,
            {
              borderWidth: 1,
              borderColor: currentTheme.line,
              borderRadius: 10,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            {language?.language?.User?.userPage?.procedures}
          </Text>
          <MaterialIcons
            name={"arrow-right"}
            color={currentTheme.pink}
            size={18}
          />
        </TouchableOpacity>
      ) : currentUser.type === "shop" ? (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Products")}
          style={[
            styles.item,
            {
              borderWidth: 1,
              borderColor: currentTheme.line,
              borderRadius: 10,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            {language?.language?.User?.userPage?.products}
          </Text>
          <MaterialIcons
            name={"arrow-right"}
            color={currentTheme.pink}
            size={18}
          />
        </TouchableOpacity>
      ) : null}
      {currentUser.type !== "user" && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Working info")}
          style={[
            styles.item,
            {
              borderWidth: 1,
              borderColor: currentTheme.line,
              borderRadius: 10,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            {language?.language?.User?.userPage?.workingInfo}
          </Text>
          <MaterialIcons
            name={"arrow-right"}
            color={currentTheme.pink}
            size={18}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => setOpenSecurity(!openSecurity)}
        style={[
          styles.item,
          {
            borderWidth: 1,
            borderColor: currentTheme.line,
            borderRadius: 10,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.User?.userPage?.security}
        </Text>
        <MaterialIcons
          name={openSecurity ? "arrow-drop-up" : "arrow-drop-down"}
          color={currentTheme.pink}
          size={18}
        />
      </TouchableOpacity>
      <Collapsible collapsed={openSecurity}>
        <Security />
      </Collapsible>
      <TouchableOpacity
        activeOpacity={0.5}
        style={[
          styles.item,
          {
            // marginBottom: 20,
            borderWidth: 1,
            position: "relative",
            bottom: 6,
            borderColor: currentTheme.line,
            borderRadius: 10,
          },
        ]}
        onPress={() => setOpenLanguages(!openLanguages)}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.User?.userPage?.languages}
        </Text>
        <MaterialIcons
          name={openLanguages ? "arrow-drop-up" : "arrow-drop-down"}
          color={currentTheme.pink}
          size={18}
        />
      </TouchableOpacity>
      <Collapsible collapsed={openLanguages}>
        <View style={{ width: SCREEN_WIDTH - 60, gap: 10 }}>
          <Pressable
            style={{
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 50,
              backgroundColor:
                activeLanguage === "en"
                  ? currentTheme.pink
                  : currentTheme.background2,
            }}
            onPress={async () => {
              await AsyncStorage.setItem(
                "Beautyverse:language",
                JSON.stringify({ language: "en" })
              );
              dispatch(setLanguage("en"));
            }}
          >
            <Text
              style={{
                color: activeLanguage === "en" ? "#e5e5e5" : currentTheme.font,
              }}
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
              backgroundColor:
                activeLanguage === "ka"
                  ? currentTheme.pink
                  : currentTheme.background2,
            }}
            onPress={async () => {
              await AsyncStorage.setItem(
                "Beautyverse:language",
                JSON.stringify({ language: "ka" })
              );
              dispatch(setLanguage("ka"));
            }}
          >
            <Text
              style={{
                color: activeLanguage === "ka" ? "#e5e5e5" : currentTheme.font,
              }}
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
              backgroundColor:
                activeLanguage === "ru"
                  ? currentTheme.pink
                  : currentTheme.background2,
            }}
            onPress={async () => {
              await AsyncStorage.setItem(
                "Beautyverse:language",
                JSON.stringify({ language: "ru" })
              );
              dispatch(setLanguage("ru"));
            }}
          >
            <Text
              style={{
                color: activeLanguage === "ru" ? "#e5e5e5" : currentTheme.font,
              }}
            >
              {language?.language?.Auth?.auth?.russian}
            </Text>
          </Pressable>
        </View>
      </Collapsible>
      {/* {currentUser.type !== "user" && (
        <View
          style={[
            styles.item,
            {
              backgroundColor: "rgba(0,0,0,0)",
              marginTop: 5,
              marginBottom: 10,
            },
          ]}
        > */}
      {/* <View style={{ alignItems: "center", gap: 7, flexDirection: "row" }}>
            <MaterialIcons
              name="verified"
              size={16}
              color={
                currentUser?.subscription.status === "active"
                  ? "#F866B1"
                  : currentTheme.disabled
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              {language?.language?.User?.userPage?.verification}
            </Text>
          </View> */}

      {/* <Pressable
            onPress={() => navigation.navigate("Prices", { from: "Settings" })}
            style={{
              alignItems: "center",
              gap: 0,
              flexDirection: "row",
              borderWidth: 1, borderColor: currentTheme.line, borderRadius: 10,
              borderRadius: 50,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              {currentUser?.subscription.status === "active"
                ? "Cancel"
                : "Activation"}
            </Text>
          </Pressable> */}
      {/* </View>
      )} */}
      {/* <View style={[styles.item, { backgroundColor: "rgba(0,0,0,0)" }]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.User?.userPage?.notifications}
        </Text>
        <Switch
          trackColor={{ false: "#e5e5e5", true: "#F866B1" }}
          thumbColor={notificationsEnabled ? "#e5e5e5" : "#F866B1"}
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          style={styles.switch}
        />
      </View> */}
      <View style={[styles.item, { backgroundColor: "rgba(0,0,0,0)" }]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.User?.userPage?.darkMode}
        </Text>
        <Switch
          trackColor={{ false: "#e5e5e5", true: "#F866B1" }}
          thumbColor={theme ? "#e5e5e5" : "#F866B1"}
          value={theme}
          onValueChange={async () => {
            dispatch(setTheme(!theme));
            await AsyncStorage.setItem(
              "Beautyverse:themeMode",
              JSON.stringify({ theme: !theme })
            );
          }}
          style={styles.switch}
        />
      </View>
      {currentUser?.type !== "user" && (
        <View
          style={[
            styles.item,
            { backgroundColor: "rgba(0,0,0,0)", marginBottom: 15 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            {language?.language?.User?.userPage?.activation}
          </Text>
          <Switch
            trackColor={{ false: "#e5e5e5", true: "#F866B1" }}
            thumbColor={currentUser.active ? "#e5e5e5" : "#F866B1"}
            value={currentUser.active}
            onValueChange={ControlActivity}
            style={styles.switch}
          />
        </View>
      )}
      {/* {currentUser?.type !== "user" && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Prices", { from: "Settings" })}
          style={[
            styles.item,
            { borderWidth: 1, borderColor: currentTheme.line, borderRadius: 10, marginTop: 20 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            {language?.language?.User?.userPage?.prices}
          </Text>
          <MaterialIcons
            name={"arrow-right"}
            color={currentTheme.pink}
            size={18}
          />
        </TouchableOpacity>
      )} */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("Terms")}
        style={[
          styles.item,
          {
            borderWidth: 1,
            borderColor: currentTheme.line,
            marginTop: currentUser?.type === "user" ? 20 : 0,
            borderRadius: 10,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.Pages?.pages?.terms}
        </Text>
        <MaterialIcons
          name={"arrow-right"}
          color={currentTheme.pink}
          size={18}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("QA")}
        style={[
          styles.item,
          {
            borderWidth: 1,
            borderColor: currentTheme.line,
            borderRadius: 10,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.Pages?.pages?.qa}
        </Text>
        <MaterialIcons
          name={"arrow-right"}
          color={currentTheme.pink}
          size={18}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("Privacy")}
        style={[
          styles.item,
          {
            borderWidth: 1,
            borderColor: currentTheme.line,
            borderRadius: 10,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.Pages?.pages?.privacy}
        </Text>
        <MaterialIcons
          name={"arrow-right"}
          color={currentTheme.pink}
          size={18}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("Usage")}
        style={[
          styles.item,
          {
            borderWidth: 1,
            borderColor: currentTheme.line,
            borderRadius: 10,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.font, letterSpacing: 0.2 },
          ]}
        >
          {language?.language?.Pages?.pages?.usage}
        </Text>
        <MaterialIcons
          name={"arrow-right"}
          color={currentTheme.pink}
          size={18}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={Logout}
        activeOpacity={0.5}
        style={[
          styles.item,
          {
            marginTop: 50,
            marginBottom: 40,
            borderRadius: 50,
            justifyContent: "center",
            // borderWidth: 1,
            // borderColor: currentTheme.line,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: currentTheme.pink, letterSpacing: 0.2 },
          ]}
        >
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e5e5e5",
    textAlign: "center",
  },
});
