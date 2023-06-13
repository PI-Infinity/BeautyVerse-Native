import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ImagePickerExample({
  setFile,
  file,
  currentTheme,
  language,
}) {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true,
      base64: true, // This option will return base64 data
    });

    if (result.assets) {
      // handle each asset separately
      result.assets.forEach(async (asset) => {
        if (asset.uri && file.length < 10) {
          let newWidth = 640;
          let newHeight = (newWidth / asset.width) * asset.height;

          const resizedImage = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: newWidth, height: newHeight } }],
            { format: ImageManipulator.SaveFormat.JPEG, base64: true }
          );

          setFile((prevImages) => [
            ...prevImages,
            {
              uri: resizedImage.uri,
              width: resizedImage?.width,
              height: resizedImage?.height,
              base64: asset.base64,
            },
          ]);
        }
      });

      if (file.length >= 10) {
        Alert.alert("You can only select 10 images");
      }
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.button}>
      <MaterialIcons name="image" size={20} color={currentTheme.font} />
      <Text style={[styles.buttonText, { color: currentTheme.font }]}>
        {language?.language?.User?.addFeed?.selectImage}
      </Text>
    </TouchableOpacity>
  );
}

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
