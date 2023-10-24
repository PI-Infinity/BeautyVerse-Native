import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Language } from "../../context/language";

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

const getCameraPermissions = async () => {
  try {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!response.granted) {
        alert("Sorry, we need camera roll permissions to make this work!");
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Failed to get permissions:", error);
    return false;
  }
};

const InputFile = ({ setFiles, files, currentTheme, title, from }) => {
  const language = Language();
  const maxImageCount = 10;

  const ResizeAndCompressImage = async (uri, originalWidth, originalHeight) => {
    const wdth = 640;
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
          base64: true, // Add this line
        }
      );

      if (mobile.base64) {
        let m = {
          ...mobile,
          base64: `data:image/jpeg;base64,${mobile.base64}`,
        };
        setFiles((prevFiles) => [...prevFiles, m]);
      } else {
        console.error("Failed to obtain base64 data");
      }
    } catch (err) {
      console.error("Failed to resize image:", err);
    }
  };

  const selectImage = async () => {
    const hasPermission = await getCameraPermissions();
    if (!hasPermission) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: from === "chat" ? false : true,
    });

    if (result.canceled) {
      return;
    }

    if (result.assets?.length > 0 && result.assets?.length < 11) {
      for (const asset of result.assets) {
        await ResizeAndCompressImage(asset?.uri, asset?.width, asset?.height);
      }
    } else if (result.assets?.length > 10) {
      Alert.alert("You can upload only 10 images at once time");
    }
  };

  return (
    <TouchableOpacity onPress={selectImage} style={styles.button}>
      <MaterialIcons name="image" size={50} color={currentTheme.font} />
      <Text style={[styles.buttonText, { color: currentTheme.font }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
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
