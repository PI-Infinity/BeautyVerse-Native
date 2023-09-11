import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AnimatedButton from "../components/animatedButton";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { setLanguage, setTheme } from "../redux/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CacheableImage } from "../components/cacheableImage";

/**
 * Welcome screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Welcome = ({ navigation }) => {
  // defines redux dispatch
  const dispatch = useDispatch();

  // theme state, from redux
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // language state
  const language = Language();
  const activeLanguage = useSelector((state) => state.storeApp.language);

  return (
    <ScrollView
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
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
            color: currentTheme.pink,
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
          Verse
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
          {language?.language?.Auth?.auth?.slogan}
        </Text>
      </View>
      <View style={{ position: "relative", bottom: 30 }}>
        <Image
          style={{
            width: SCREEN_WIDTH + 10,
            height: SCREEN_WIDTH + 10,
          }}
          source={require("../assets/logo.png")}
        />
      </View>
      <AnimatedButton
        navigation={navigation}
        currentTheme={currentTheme}
        title={language?.language?.Auth?.auth?.authentication}
      />
      <View style={{ width: "100%", position: "relative", bottom: 15 }}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: currentTheme.font,
            },
          ]}
        >
          {language?.language?.Auth?.auth?.selectTheme}
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
            {theme && (
              <MaterialIcons name="done" color={currentTheme.pink} size={18} />
            )}
            <Text style={{ color: "#fff" }}>
              {language?.language?.Auth?.auth?.dark}
            </Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              await AsyncStorage.setItem(
                "Beautyverse:themeMode",
                JSON.stringify({ theme: false })
              );
              dispatch(setTheme(false));
            }}
            style={[
              styles.themeModeButton2,
              {
                backgroundColor: "#F3EEF9",
              },
            ]}
          >
            <Text>{language?.language?.Auth?.auth?.light}</Text>
            {!theme && (
              <MaterialIcons name="done" color={currentTheme.pink} size={18} />
            )}
          </Pressable>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          gap: 8,
          marginBottom: 50,
        }}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: currentTheme.font,
              marginBottom: 10,
            },
          ]}
        >
          {language?.language?.Auth?.auth?.selectLanguage}
        </Text>
        <Pressable
          style={[
            styles.languageBtn,
            {
              borderWidth: 1,
              borderColor: currentTheme.line,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: currentTheme.background,
            },
          ]}
          onPress={() => dispatch(setLanguage("en"))}
        >
          <Text
            style={{
              color: currentTheme.font,
            }}
          >
            {language?.language?.Auth?.auth?.english}
          </Text>
          {activeLanguage === "en" && (
            <MaterialIcons name="done" size={20} color={currentTheme.pink} />
          )}
        </Pressable>
        <Pressable
          style={[
            styles.languageBtn,
            {
              borderWidth: 1,
              borderColor: currentTheme.line,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: currentTheme.background,
            },
          ]}
          onPress={() => dispatch(setLanguage("ka"))}
        >
          <Text
            style={{
              color: currentTheme.font,
            }}
          >
            {language?.language?.Auth?.auth?.georgian}
          </Text>
          {activeLanguage === "ka" && (
            <MaterialIcons name="done" size={20} color={currentTheme.pink} />
          )}
        </Pressable>
        <Pressable
          style={[
            styles.languageBtn,
            {
              borderWidth: 1,
              borderColor: currentTheme.line,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: currentTheme.background,
            },
          ]}
          onPress={() => dispatch(setLanguage("ru"))}
        >
          <Text
            style={{
              color: currentTheme.font,
            }}
          >
            {language?.language?.Auth?.auth?.russian}
          </Text>
          {activeLanguage === "ru" && (
            <MaterialIcons name="done" size={20} color={currentTheme.pink} />
          )}
        </Pressable>
      </View>
      <View style={{ width: "90%", marginTop: 15 }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Terms")}
          style={[styles.item, { backgroundColor: currentTheme.background }]}
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
    letterSpacing: 0.2,
    marginTop: 50,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "bold",
  },
  themeModeButton1: {
    width: "40%",
    padding: 7.5,
    backgroundColor: "#050505",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  themeModeButton2: {
    width: "40%",
    padding: 7.5,
    backgroundColor: "#050505",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
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
