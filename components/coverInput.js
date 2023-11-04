import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { BackDrop } from "../components/backDropLoader";
import { storage } from "../firebase";
import { setCleanUp, setRerenderCurrentUser } from "../redux/rerenders";

/**
 * input cover image component on ios
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

const InputFile = ({ targetUser, setOpenPopup, editPopup, setEditPopup }) => {
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  //resize image
  const ResizeAndCompressImage = async (uri, originalWidth, originalHeight) => {
    const wdth = 300;
    const newMobHeight = (originalHeight / originalWidth) * wdth;
    try {
      const cover = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: wdth,
              height: newMobHeight,
            },
          },
        ],
        {
          compress: 0.8,
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

  async function uriToBlob(uri) {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      const response = await fetch(uri);
      return await response.blob();
    }
  }

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  async function FileUpload() {
    /* aadd cover
     */
    if (file == null) return;
    if (file != null) {
      setLoading(true);
      // add in storage
      const imageRef = ref(storage, `images/${targetUser?._id}/cover`);

      const coverBlob = await uriToBlob(file?.cover.base64);
      await uploadBytes(imageRef, coverBlob).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            const UploadCover = async () => {
              const response = await axios.patch(
                `${backendUrl}/api/v1/users/${targetUser?._id}`,
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

  const avoidFirstRender = useRef(true);
  React.useEffect(() => {
    if (avoidFirstRender.current) {
      avoidFirstRender.current = false;
      return;
    }
    // setEditPopup(true);
    FileUpload();
  }, [file]);

  return (
    <View style={styles.container}>
      <BackDrop loading={loading} setLoading={setLoading} />
      <TouchableOpacity
        onLongPress={
          targetUser.cover?.length > 0 ? () => setOpenPopup(true) : undefined
        }
        delayLongPress={200}
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
