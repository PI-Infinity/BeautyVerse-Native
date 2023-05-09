import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { lightTheme, darkTheme } from "../context/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLanguage, setTheme } from "../redux/app";
import { Language } from "../context/language";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Welcome = ({ navigation }) => {
  const dispatch = useDispatch();
  // theme state, from redux
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // language state
  const language = Language();
  const activeLanguage = useSelector((state) => state.storeApp.language);

  return (
    <ScrollView
      style={{
        backgroundColor: currentTheme.background,
      }}
      contentContainerStyle={{
        alignItems: "center",
        minHeight: SCREEN_HEIGHT,
        paddingTop: 50,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#F866B1",
            letterSpacing: 1,
          }}
        >
          Beauty
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: currentTheme.font,
            letterSpacing: 1,
          }}
        >
          verse
        </Text>
      </View>

      <View style={{ width: SCREEN_WIDTH - 40, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 16,
            letterSpacing: 0.5,
            color: currentTheme.font,
            marginTop: 20,
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          "Discover your beauty universe with Beautyverse - where beauty meets
          diversity"
        </Text>
      </View>
      <View style={{ position: "relative", bottom: 30 }}>
        <Image
          source={require("../assets/beautyverse.png")}
          style={{
            width: SCREEN_WIDTH / 1.1,
            height: SCREEN_WIDTH / 1.1,
            marginRight: 20,
          }}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() => navigation.navigate("Login")}
        style={{
          width: "50%",
          padding: 15,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          backgroundColor: "#F866B1",
        }}
      >
        <Text
          style={{ color: "#e5e5e5", fontWeight: "bold", letterSpacing: 0.5 }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <View style={{ width: "100%" }}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: currentTheme.font,
            },
          ]}
        >
          Select theme:
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Pressable
            onPress={async () => {
              await AsyncStorage.setItem(
                "Beautyverse:themeMode",
                JSON.stringify({ theme: true })
              );
              dispatch(setTheme(true));
            }}
            style={styles.themeModeButton1}
          >
            <Text style={{ color: "#fff" }}>Dark</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              await AsyncStorage.setItem(
                "Beautyverse:themeMode",
                JSON.stringify({ theme: false })
              );
              dispatch(setTheme(false));
            }}
            style={styles.themeModeButton2}
          >
            <Text>Light</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ width: "100%", alignItems: "center", gap: 5 }}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: currentTheme.font,
              marginBottom: 10,
            },
          ]}
        >
          Select language:
        </Text>
        <Pressable
          style={[
            styles.languageBtn,
            {
              backgroundColor:
                activeLanguage === "en"
                  ? currentTheme.pink
                  : currentTheme.background2,
            },
          ]}
          onPress={() => dispatch(setLanguage("en"))}
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
          style={[
            styles.languageBtn,
            {
              backgroundColor:
                activeLanguage === "ka"
                  ? currentTheme.pink
                  : currentTheme.background2,
            },
          ]}
          onPress={() => dispatch(setLanguage("ka"))}
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
          style={[
            styles.languageBtn,
            {
              backgroundColor:
                activeLanguage === "ru"
                  ? currentTheme.pink
                  : currentTheme.background2,
            },
          ]}
          onPress={() => dispatch(setLanguage("ru"))}
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
      <View style={{ width: "90%" }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Terms")}
          style={[
            styles.item,
            { backgroundColor: currentTheme.background, marginTop: 30 },
          ]}
        >
          <Text style={[styles.BsectionTitle, { color: currentTheme.font }]}>
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
          style={[styles.item, { backgroundColor: currentTheme.background }]}
        >
          <Text style={[styles.BsectionTitle, { color: currentTheme.font }]}>
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
          style={[styles.item, { backgroundColor: currentTheme.background }]}
        >
          <Text style={[styles.BsectionTitle, { color: currentTheme.font }]}>
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
          style={[styles.item, { backgroundColor: currentTheme.background }]}
        >
          <Text style={[styles.BsectionTitle, { color: currentTheme.font }]}>
            {language?.language?.Pages?.pages?.usage}
          </Text>
          <MaterialIcons
            name={"arrow-right"}
            color={currentTheme.pink}
            size={18}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    letterSpacing: 0.5,
    marginTop: 50,
    textAlign: "center",
    lineHeight: 24,
  },
  themeModeButton1: {
    width: "40%",
    borderWidth: 2,
    borderColor: "#222",
    padding: 7.5,
    backgroundColor: "#111",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    alignItems: "center",
  },
  themeModeButton2: {
    width: "40%",
    borderWidth: 2,
    borderColor: "#fff",
    padding: 7.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
  },
  languageBtn: {
    width: "70%",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50,
    alignItems: "center",
  },
  item: {
    width: "100%",
    padding: 15,
    // height: 60,
    // borderRadius: 5,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  BsectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e5e5e5",
    textAlign: "center",
  },
});
