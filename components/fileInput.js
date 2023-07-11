import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Language } from "../context/language";

/**
 * Image input on ios
 */

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

const InputFile = ({ setFile, Cover, currentTheme, title, from }) => {
  const language = Language();
  const maxImageCount = 10;

  //resize image
  const ResizeAndCompressImage = async (uri, originalWidth, originalHeight) => {
    const wdth = originalWidth;
    const hght = (originalHeight / originalWidth) * wdth;
    try {
      const mobile = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: wdth,
              height: hght,
            },
          },
        ],
        {
          // compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      const mobileImageData = await readImageData(mobile.uri);

      let m = { ...mobile, base64: mobileImageData };

      setFile((prevFiles) => [...prevFiles, m]);
    } catch (err) {
      console.error("Failed to resize image:", err);
      return uri;
    }
  };
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: from === "chat" ? false : true, // Allow multiple selection
    });
    setFile([]);
    if (result.assets?.length > 0 && result.assets?.length < 11) {
      for (const asset of result.assets) {
        const resizedImage = await ResizeAndCompressImage(
          asset?.uri,
          asset?.width,
          asset?.height
        );
      }
    } else if (result.assets?.length > 10) {
      Alert.alert("You can upload only 10 images at once time");
    }
  };

  return (
    // <View style={styles.container}>
    <TouchableOpacity onPress={selectImage} style={styles.button}>
      <MaterialIcons name="image" size={20} color={currentTheme.font} />
      <Text style={[styles.buttonText, { color: currentTheme.font }]}>
        {title}
      </Text>
    </TouchableOpacity>
    // </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 7.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  preview: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  imagePreviewContainer: {
    marginTop: 20,
  },
});

export default InputFile;
