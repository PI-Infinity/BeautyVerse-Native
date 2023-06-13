import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export const Post = (props) => {
  const [defLanguage, setDefLanguage] = useState(null);
  const [txt, setTxt] = useState("");
  const [active, setActive] = useState(false);

  const lang = useSelector((state) => state.storeApp.language);

  useEffect(() => {
    setTxt(props.text);
    DetectLanguage();
  }, [props]);

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

  const GetLanguages = (x) => {
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
          : () => props.setNumLines(15)
      }
      style={{
        // marginTop: 10,
        padding: 5,
        paddingTop: 0,
        paddingBottom: 15,
        // backgroundColor: "#181818",
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
          // marginHorizontal: 10,
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
                  setTxt(props.text);
                  setActive(false);
                }
              : () => {
                  GetLanguages(props.text);
                  setActive(true);
                }
          }
          style={{
            position: "absolute",
            right: 14,
            padding: 5,
            top: -5,
          }}
        >
          <MaterialIcons
            name="g-translate"
            size={16}
            color={
              active ? props.currentTheme.pink : props.currentTheme.disabled
            }
          />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({});
