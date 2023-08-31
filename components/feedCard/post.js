import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setFeedPost } from "../../redux/feed";
import { Language } from "../../context/language";

/**
 * Post component
 */

export const Post = (props) => {
  const [loading, setLoading] = useState(true);

  const language = Language();

  const [post, setPost] = useState(null);
  const [original, setOriginal] = useState(false);

  useEffect(() => {
    setPost(props.postItem);
  }, [props.postItem]);

  // define current user's active language
  const lang = useSelector((state) => state.storeApp.language);

  let text;
  if (original) {
    text = post?.original;
  } else {
    if (lang === "en") {
      text = post?.en;
    } else if (lang === "ru") {
      text = post?.ru;
    } else {
      text = post?.ka;
    }
  }

  return (
    <View
      style={{
        padding: post?.original?.length > 0 ? 5 : 0,
        paddingRight: 20,
        paddingTop: 0,
        paddingBottom: post?.original?.length > 0 ? 15 : 0,
        borderRadius: 10,
        width: "auto",
      }}
    >
      {/* {loading ? (
        <Text style={{ color: "pink" }}>Loading...</Text>
      ) : ( */}
      <Pressable
        onPress={
          props.numLines > 5
            ? () => props.setNumLines(5)
            : () => props.setNumLines(50)
        }
      >
        <Text
          multiline
          numberOfLines={props.numLines}
          style={{
            height: post?.original?.length > 0 ? "auto" : 0,
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
          <>{text}</>
        </Text>

        {post && post?.originalLanguage !== lang && (
          <Pressable
            onPress={
              !original
                ? () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setOriginal(true);
                  }
                : () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setOriginal(false);
                  }
            }
            style={{
              // position: "absolute",
              paddingTop: post?.original?.length > 0 ? 10 : 0,
              marginLeft: 10,
              flexDirection: "row",
              alignItems: "center",
              width: 180,
              gap: 8,
              padding: post?.original?.length > 0 ? 5 : 0,
            }}
          >
            <MaterialIcons
              name="g-translate"
              size={14}
              color={
                original ? props.currentTheme.pink : props.currentTheme.disabled
              }
            />
            <Text
              style={{
                fontSize: 14,
                color: original
                  ? props.currentTheme.pink
                  : props.currentTheme.disabled,
              }}
            >
              {language?.language.Main.feedCard.seeOriginal}
            </Text>
          </Pressable>
        )}
      </Pressable>
      {/* )} */}
    </View>
  );
};
