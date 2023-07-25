import { Linking, Text, View, Dimensions, Image } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "../context/theme";
import { TouchableOpacity } from "react-native-gesture-handler";

/**
 * component defines update app screen if user doesnt have new version of app
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Update = (props) => {
  // theme state, from redux
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const handlePress = () => {
    const url = "https://apps.apple.com/app/6448795980";
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log(`Don't know how to open this URL: ${url}`);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };
  return (
    <View
      style={{
        backgroundColor: currentTheme.background,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignItems: "center",
        position: "absolute",
        top: 0,
        zIndex: 100000,
      }}
    >
      <View style={{ marginTop: SCREEN_HEIGHT / 4, alignItems: "center" }}>
        <Image
          style={{
            width: SCREEN_WIDTH / 4,
            height: SCREEN_WIDTH / 4,
          }}
          source={require("../assets/logo.png")}
        />
        <View
          style={{
            backgroundColor: currentTheme.background,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "#F866B1",
              fontSize: 28,
              fontWeight: "bold",
              letterSpacing: 0.5,
            }}
          >
            Beauty
          </Text>
          <Text
            style={{
              color: currentTheme.font,
              fontSize: 28,
              fontWeight: "bold",
              letterSpacing: 0.5,
            }}
          >
            Verse
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "85%",
          height: 80,
          borderRadius: 15,
          backgroundColor: currentTheme.background2,
          borderWidth: 3,
          borderColor: currentTheme.pink,
          marginVertical: 50,
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
          You are using old ({props.currentVersion}) version of the App!
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: currentTheme.pink,
          borderWidth: 2,
          borderColor: currentTheme.lightPink,
          width: 200,
          padding: 10,
          alignItems: "center",
          borderRadius: 50,
        }}
        onPress={handlePress}
      >
        <Text
          style={{
            color: currentTheme.font,
            fontWeight: "bold",
            letterSpacing: 0.3,
          }}
        >
          Update now ({props.appVersion})
        </Text>
      </TouchableOpacity>
    </View>
  );
};
