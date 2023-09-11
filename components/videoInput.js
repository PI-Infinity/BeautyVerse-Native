import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 *  Video input component
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const InputVideo = ({ title, setFile, currentTheme, from }) => {
  const videoRef = useRef();

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log(result.assets[0]);
      setFile(result.assets[0]); // Wrap the asset object in an object with an "assets" property
      // setTimeout(() => {
      //   setLoading(false);
      // }, 7000);
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
      <TouchableOpacity
        onPress={pickVideo}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: from === "chat" ? 0 : 15,
        }}
      >
        <MaterialIcons
          name="video-library"
          size={20}
          color={currentTheme.font}
        />
        <Text style={[styles.buttonText, { color: currentTheme.font }]}>
          {title}
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
