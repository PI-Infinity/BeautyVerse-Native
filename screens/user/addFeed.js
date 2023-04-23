import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import DocumentPicker from "react-native-document-picker";
import FileInput from "../../components/fileInput";
import InputVideo from "../../components/videoInput";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import uuid from "react-native-uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import axios from "axios";
import { BackDrop } from "../../components/backDropLoader";
import { setCleanUp, setRerenderUserFeeds } from "../../redux/rerenders";
import { Language } from "../../context/language";
import { CacheableImage } from "../../components/cacheableImage";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import base64js from "base64-js";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
export const AddFeed = ({ navigation }) => {
  const language = Language();
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [postText, setPostText] = useState("");

  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      Alert.alert(
        "File Selected",
        `Name: ${result.name}\nType: ${result.type}\nURI: ${result.uri}\nSize: ${result.size}`
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  }, []);

  // const add file
  const [file, setFile] = useState(null);

  // add feed in firebase
  async function FileUpload() {
    setLoading(true);
    //create id
    let folderId = currentUser.name + uuid.v4();
    let imageId = currentUser.name + uuid.v4();
    let imageId2 = currentUser.name + uuid.v4();
    // check file
    if (file && file?.type !== "video") {
      let desktopRefs = ref(
        storage,
        `images/${currentUser?._id}/feeds/${folderId}/${imageId}/`
      );
      let mobileRef = ref(
        storage,
        `images/${currentUser?._id}/feeds/${folderId}/${imageId2}/`
      );
      const desktopBlob = await fetch(file?.desktop.base64).then((res) =>
        res.blob()
      );
      const mobileBlob = await fetch(file?.mobile.base64).then((res) =>
        res.blob()
      );
      if (desktopRefs) {
        // add desktop version
        await uploadBytes(desktopRefs, desktopBlob).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            await uploadBytes(mobileRef, mobileBlob).then((snapshot2) => {
              getDownloadURL(snapshot2.ref).then(async (url2) => {
                try {
                  const newFeed = {
                    desktop: url,
                    mobile: url2,
                    name: folderId,
                    createdAt: new Date().toISOString(),
                    post: postText,
                    fileFormat: "img",
                  };

                  const response = await axios.post(
                    `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/feeds`,
                    newFeed
                  );
                  await axios.patch(
                    `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
                    {
                      lastPostCreatedAt: new Date(),
                    }
                  );
                  setTimeout(() => {
                    dispatch(setRerenderUserFeeds());
                  }, 1000);
                  setTimeout(async () => {
                    navigation.goBack();
                    setFile(null);
                    setPostText("");
                    setLoading(false);
                  }, 2000);
                } catch (error) {
                  console.error(error);
                  setTimeout(async () => {
                    setLoading(false);
                  }, 2000);
                }
              });
            });
          });
        });
      }
    } else if (file && file?.type === "video") {
      let videoId = file?.fileName + uuid.v4();

      console.log("start");
      // Read the video file as a base64 string
      const videoBase64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Decode the Base64 string into a Uint8Array
      console.log(videoBase64);
      // const videoUint8Array = base64js.toByteArray(videoBase64);

      // Create a Blob object from the buffer
      // const videoBlob = new Blob([videoUint8Array], { type: "video/mp4" });
      let videoBlob;
      // console.log("here");
      // console.log(videoUint8Array);
      let videosRef = ref(
        storage,
        `videos/${currentUser?._id}/feeds/${videoId}/`
      );
      await uploadBytes(videosRef, videoBlob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          try {
            const newFeed = {
              videoUrl: url,
              name: videoId,
              createdAt: new Date().toISOString(),
              post: postText,
              fileFormat: "video",
            };
            const response = await axios.post(
              `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/feeds`,
              newFeed
            );
            await axios.patch(
              `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
              {
                lastPostCreatedAt: new Date(),
              }
            );
            setTimeout(() => {
              dispatch(setRerenderUserFeeds());
            }, 1000);
            setTimeout(async () => {
              navigation.goBack();
              setFile(null);
              setPostText("");
              setLoading(false);
            }, 2000);
          } catch (error) {
            console.error(error);
            setTimeout(async () => {
              setLoading(false);
            }, 2000);
          }
        });
      });
    }
  }

  const videoRef = useRef();

  return (
    <>
      <BackDrop loading={loading} setLoading={setLoading} />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "start",
          padding: 15,
          width: SCREEN_WIDTH,
        }}
        style={{}}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            gap: 10,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 50,
            minWidth: "60%",
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            {currentUser?.cover?.length > 0 ? (
              <CacheableImage
                style={{
                  height: 40,
                  width: 40,
                  resizeMode: "cover",
                  borderRadius: 100,
                }}
                source={{
                  uri: currentUser?.cover,
                }}
                manipulationOptions={[
                  { resize: { width: 40, height: 40 } },
                  { rotate: 90 },
                ]}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  backgroundColor: "#ccc",
                }}
              ></View>
            )}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#e5e5e5",
              letterSpacing: 0.5,
            }}
          >
            {currentUser.name}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 5,
            height: SCREEN_WIDTH / 2.5,
            marginTop: 20,
            padding: 15,
          }}
        >
          <TextInput
            placeholder={language?.language?.Main?.filter?.typeHere}
            placeholderTextColor="#ddd"
            style={{ color: "#fff" }}
            multiline
            numberOfLines={15}
            onChangeText={(text) => setPostText(text)}
            value={postText}
          />
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: "10%",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              marginTop: 15,

              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 15,
              backgroundColor: "rgba(255,255,255,0.05)",
              paddingHorizontal: 15,
              paddingVertical: 7,
              borderRadius: 50,
            }}
          >
            <MaterialIcons name="image" size={20} color="#e5e5e5" />
            <View style={{ gap: 20 }}>
              <FileInput file={file} setFile={setFile} />
            </View>
          </View>
          <View
            style={{
              marginTop: 15,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 15,
              backgroundColor: "rgba(255,255,255,0.05)",
              paddingHorizontal: 15,
              paddingVertical: 7,
              borderRadius: 50,
            }}
          >
            <MaterialIcons name="video-library" size={20} color="#e5e5e5" />
            <View style={{ gap: 20 }}>
              <InputVideo file={file} setFile={setFile} />
            </View>
          </View>
        </View>
        <View style={{ height: "auto" }}>
          {file && file?.type !== "video" ? (
            <Image
              style={{
                width: SCREEN_WIDTH,
                height: file?.mobile?.height - 100,
                maxHeight: 600,
                resizeMode: file?.mobile?.height > 600 ? "cover" : "contain",
              }}
              source={{ uri: file?.mobile?.uri }}
            />
          ) : (
            <>
              {file && file?.type === "video" && (
                <Video
                  ref={videoRef}
                  source={{ uri: file?.uri }}
                  useNativeControls
                  isMuted={false}
                  style={[
                    styles.preview2,
                    {
                      height:
                        file?.height > 600 ? file?.height / 2 : file?.height,
                      width: SCREEN_WIDTH,
                    },
                  ]}
                  // onPlaybackStatusUpdate={(status) => console.log(status)}
                />
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            width: "60%",
            borderRadius: 50,
            backgroundColor: "rgba(255,255,255,0.9)",
            margin: 15,
            marginTop: 30,
            padding: 10,
            alignItems: "center",
          }}
          onPress={FileUpload}
        >
          <Text>{language?.language?.User?.addFeed?.upload}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  // container: { flex: 1 },
  preview: {
    marginBottom: 10,
    borderRadius: 5,
  },
  preview2: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
});
