import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text } from "react-native";
import { useSelector } from "react-redux";
/**
 * Post component
 */

export const Post = (props) => {
  // define text state
  const [txt, setTxt] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // define route
  const route = useRoute();
  // console.log(route);

  // define text's language
  const [defLanguage, setDefLanguage] = useState(null);

  // define current user's active language
  const lang = useSelector((state) => state.storeApp.language);

  // define translate active or not
  const [active, setActive] = useState(false);

  // if translate active shows translated, if not shows default
  useEffect(() => {
    TranslateText(props.text);
    console.log("run");
    DetectLanguage();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200, // This can be set to whatever feels right
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [props.text, lang, route]);

  // detect text language

  const DetectLanguage = () => {
    const API_KEY = "AIzaSyAuSnUmGlptL0E4m4wP-1XzlqL_iv_y3g8";

    let url = `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        q: props.text,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.data.detections[0][0].language !== "und") {
          setDefLanguage(response.data.detections[0][0].language);
        }
      })
      .catch((error) => {
        console.log(
          "There was an error with the language detection request: ",
          error
        );
      });
  };

  // translate text

  const TranslateText = (x) => {
    const API_KEY = "AIzaSyAuSnUmGlptL0E4m4wP-1XzlqL_iv_y3g8";

    // replace line breaks with a unique character sequence
    let modifiedText = x.replace(/\n/g, "<br>");

    let url = `https://translation.googleapis.com/language/translate/v2?q=${modifiedText}&target=${lang}&key=${API_KEY}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        // replace the unique character sequence with line breaks
        let translatedText =
          response.data.translations[0].translatedText.replace(/<br>/g, "\n");
        setTxt(translatedText);
        setActive(true);
      })
      .catch((error) => {
        console.log("There was an error with the translation request: ", error);
      });
  };

  return (
    <Animated.View
      style={{
        padding: 5,
        paddingRight: 20,
        paddingTop: 0,
        paddingBottom: 15,
        borderRadius: 10,
        width: "auto",
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      <Pressable
        onPress={
          props.numLines > 3
            ? () => props.setNumLines(3)
            : () => props.setNumLines(50)
        }
      >
        <Text
          multiline
          numberOfLines={props.numLines}
          style={{
            color:
              props.fileFormat === "video" ? "#ddd" : props.currentTheme.font,
            letterSpacing: 0.3,
            fontSize: 14,
            lineHeight: 18,
            textShadowColor:
              props.fileFormat === "video"
                ? "rgba(0,0,0,0.2)"
                : props.currentTheme.shadow,
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 1,
          }}
        >
          {txt}
        </Text>
        {defLanguage && defLanguage !== lang && (
          <Pressable
            onPress={
              active
                ? () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTxt(props.text);
                    setActive(false);
                  }
                : () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    TranslateText(props.text);
                  }
            }
            style={{
              marginTop: 10,
              marginLeft: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              padding: 5,
            }}
          >
            <MaterialIcons
              name="g-translate"
              size={14}
              color={
                active ? props.currentTheme.disabled : props.currentTheme.pink
              }
            />
            <Text
              style={{
                fontSize: 14,
                color: active
                  ? props.currentTheme.disabled
                  : props.currentTheme.pink,
              }}
            >
              See original
            </Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
};
