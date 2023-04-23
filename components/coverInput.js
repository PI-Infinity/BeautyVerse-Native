import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { ResizeAndCompressImage } from "../functions/compressImg";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { BackDrop } from "../components/backDropLoader";
import { setRerenderCurrentUser, setCleanUp } from "../redux/rerenders";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

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

const InputFile = ({ targetUser, onCoverUpdate }) => {
  const [resizedImg, setResizedImg] = useState(null);
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  //resize image
  const ResizeAndCompressImage = async (uri, originalWidth, originalHeight) => {
    const mobWidth = 300;
    const newMobHeight = (originalHeight / originalWidth) * mobWidth;
    try {
      const cover = await ImageManipulator.manipulateAsync(
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
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const coverImageData = await readImageData(cover.uri);

      setFile({
        cover: { ...cover, base64: coverImageData },
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

  const [loading, setLoading] = useState(false);
  async function FileUpload() {
    /* aadd cover
     */
    if (file == null) return;
    if (file != null) {
      setLoading(true);
      // add in storage
      const imageRef = ref(storage, `images/${targetUser?._id}/cover`);
      const coverBlob = await fetch(file?.cover.base64).then((res) =>
        res.blob()
      );
      await uploadBytes(imageRef, coverBlob).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            const UploadCover = async () => {
              const response = await axios.patch(
                `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
                {
                  cover: url,
                }
              );
            };
            if (url) {
              UploadCover();
            }
            dispatch(setRerenderCurrentUser());
            dispatch(setCleanUp());
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }

  React.useEffect(() => {
    FileUpload();
  }, [file]);

  return (
    <View style={styles.container}>
      <BackDrop loading={loading} setLoading={setLoading} />
      <TouchableOpacity
        onPress={selectImage}
        style={styles.button}
      ></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 110,
    height: 110,
    borderRadius: 100,
  },
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
