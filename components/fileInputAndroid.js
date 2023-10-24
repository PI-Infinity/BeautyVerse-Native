import { MaterialIcons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

/**
 * File input on android
 */

export default function ImagePickerExample({
  setFile,
  file,
  currentTheme,
  from,
  title,
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
      allowsMultipleSelection: from === "chat" ? false : true,
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
        {title}
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
