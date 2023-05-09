import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

export const Post = (props) => {
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
        {props.text}
      </Text>
      {/* {props.numLines > 3 && (
        <Text
          style={{
            color: props.currentTheme.font,
            letterSpacing: 0.3,
            fontSize: 12,
            lineHeight: 18,
            marginHorizontal: 10,
          }}
        >
          Show more..
        </Text>
      )} */}
    </Pressable>
  );
};

const styles = StyleSheet.create({});
