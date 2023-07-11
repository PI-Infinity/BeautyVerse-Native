import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { useSelector } from "react-redux";

/**
 * Post component
 */

export const Post = (props) => {
  // define text state
  const [txt, setTxt] = useState("");

  // define text's language
  const [defLanguage, setDefLanguage] = useState(null);

  // define current user's active language
  const lang = useSelector((state) => state.storeApp.language);

  // define translate active or not
  const [active, setActive] = useState(false);

  // if translate active shows translated, if not shows default
  useEffect(() => {
    if (active) {
      setTxt(txt);
    } else {
      setTxt(props.text);
    }
    DetectLanguage();
  }, [props.text]);

  // detect text language

  const DetectLanguage = (text) => {
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
        setDefLanguage(response.data.detections[0][0].language);
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

    let url = `https://translation.googleapis.com/language/translate/v2?q=${x}&target=${lang}&key=${API_KEY}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setTxt(response.data.translations[0].translatedText);
        setActive(true);
      })
      .catch((error) => {
        console.log("There was an error with the translation request: ", error);
      });
  };
  return (
    <Pressable
      onPress={
        props.numLines > 3
          ? () => props.setNumLines(3)
          : () => props.setNumLines(50)
      }
      style={{
        padding: 5,
        paddingRight: 20,
        paddingTop: 0,
        paddingBottom: 15,
        borderRadius: 10,
        width: "auto",
      }}
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
      {defLanguage !== lang && (
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
            gap: 4,
          }}
        >
          <MaterialIcons
            name="g-translate"
            size={14}
            color={
              active ? props.currentTheme.pink : props.currentTheme.disabled
            }
          />
          <Text
            style={{
              fontSize: 14,
              color: active
                ? props.currentTheme.pink
                : props.currentTheme.disabled,
            }}
          >
            Translate
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};
