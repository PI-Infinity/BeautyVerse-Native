import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { Language } from "../context/language";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const InputVideo = ({ file, setFile, currentTheme }) => {
  const language = Language();
  const videoRef = useRef();

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFile(result.assets[0]); // Wrap the asset object in an object with an "assets" property
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    const { durationMillis, positionMillis } = status;

    if (positionMillis + durationMillis === durationMillis) {
      videoRef.current?.replayAsync();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickVideo} style={styles.button}>
        <Text style={[styles.buttonText, { color: currentTheme.font }]}>
          {language?.language?.User?.addFeed?.selectVideo}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  preview: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
});

export default InputVideo;
