import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { ResizeAndCompressImage } from "../functions/compressImg";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { Language } from "../context/language";

async function readImageData(uri) {
  try {
    const binaryData = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const base64Data = `data:image/jpeg;base64,${binaryData}`;
    return base64Data;
  } catch (err) {
    console.error("Failed to read image data:", err);
    return null;
  }
}

const InputFile = ({ setFile, Cover }) => {
  const language = Language();
  const [resizedImg, setResizedImg] = useState(null);
  //resize image
  const ResizeAndCompressImage = async (uri, originalWidth, originalHeight) => {
    const mobWidth = 640;
    const newMobHeight = (originalHeight / originalWidth) * mobWidth;
    try {
      const mobile = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: mobWidth,
              height: newMobHeight,
            },
          },
        ],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      const desktopWidth = 1080;
      const newDesktopHeight = (originalHeight / originalWidth) * desktopWidth;
      const desktop = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: desktopWidth,
              height: newDesktopHeight,
            },
          },
        ],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      const desktopImageData = await readImageData(desktop.uri);
      const mobileImageData = await readImageData(mobile.uri);

      setFile({
        desktop: { ...desktop, base64: desktopImageData },
        mobile: { ...mobile, base64: mobileImageData },
      });
    } catch (err) {
      console.error("Failed to resize image:", err);
      return uri;
    }
  };
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      await ResizeAndCompressImage(
        result.assets[0].uri,
        result.assets[0].width,
        result.assets[0].height
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={styles.button}>
        <Text style={styles.buttonText}>
          {language?.language?.User?.addFeed?.selectImage}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {},
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  preview: {
    width: 300,
    height: 300,
  },
});

export default InputFile;
