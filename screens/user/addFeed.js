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
import React, { useState, useCallback, useRef, useEffect } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome";
import { lightTheme, darkTheme } from "../../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
export const AddFeed = ({ navigation }) => {
  const language = Language();
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

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

  // add file
  const [file, setFile] = useState([]);
  const [blobFile, setBlobFile] = useState(null);

  // console.log(file[0]?.height);

  async function uriToBlob(uri) {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      const response = await fetch(uri);
      return await response.blob();
    } else {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error("uriToBlob failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
    }
  }

  useEffect(() => {
    if (file?.type === "video") {
      (async () => {
        const blob = await uriToBlob(file?.uri);
        setBlobFile(blob);
        // You can now use the 'blob' for uploading.
      })();
    }
  }, [file]);

  // add feed in firebase
  const [urls, setUrls] = useState([]);

  async function FileUpload() {
    setLoading(true);
    //create id

    const AddFileInCloud = async (index, folder) => {
      let imgId = currentUser.name + uuid.v4();
      let fileRef = ref(
        storage,
        `images/${currentUser?._id}/feeds/${folder}/${imgId}/`
      );
      const blb = await fetch(file[index]?.base64).then((res) => res.blob());

      if (fileRef) {
        // add desktop version
        const snapshot = await uploadBytes(fileRef, blb);
        const url = await getDownloadURL(snapshot.ref);
        return { url: url };
      }
    };

    // check file
    if (file[0] && file[0]?.type !== "video") {
      let folderId = currentUser.name + uuid.v4();

      const uploadPromises = file.map((_, index) =>
        AddFileInCloud(index, folderId)
      );

      Promise.all(uploadPromises).then(async (uploadedUrls) => {
        setUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);

        try {
          const newFeed = {
            images: uploadedUrls,
            name: folderId,
            createdAt: new Date().toISOString(),
            post: postText,
            fileFormat: "img",
            fileHeight: file[0]?.height,
            fileWidth: file[0]?.width,
          };
          const feedResponse = await axios.post(
            `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/feeds`,
            newFeed
          );

          const userResponse = await axios.patch(
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
            setFile([]);
            setPostText("");
            setLoading(false);
          }, 2000);
        } catch (error) {
          console.error(error.response.data.message);
          setTimeout(async () => {
            setLoading(false);
          }, 2000);
        }
      });
    } else if (file && file?.type === "video") {
      let videoId = currentUser?.name + "video" + uuid.v4();

      let videosRef = ref(
        storage,
        `videos/${currentUser?._id}/feeds/${videoId}/`
      );

      await uploadBytes(videosRef, blobFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          try {
            const newFeed = {
              video: url,
              name: videoId,
              createdAt: new Date().toISOString(),
              post: postText,
              fileFormat: "video",
              fileHeight: file.height,
              fileWidth: file.width,
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
              setFile([]);
              setPostText("");
              setLoading(false);
            }, 3000);
          } catch (error) {
            console.error(error.response.data.message);
            setTimeout(async () => {
              setLoading(false);
            }, 3000);
          }
        });
      });
    }
  }

  const videoRef = useRef();

  // define file height
  let hght;
  if (file?.type === "video") {
    let originalHeight =
      file?.width >= file?.height ? file?.width : file?.height;
    let originalWidth =
      file?.width >= file?.height ? file?.height : file?.width;

    let wdth = SCREEN_WIDTH;

    let percented = originalWidth / SCREEN_WIDTH;

    hght = originalHeight / percented;
  } else if (file[0]) {
    let originalHeight = file[0]?.height;
    let originalWidth = file[0]?.width;

    let wdth = SCREEN_WIDTH;

    let percented = originalWidth / SCREEN_WIDTH;
    hght = originalHeight / percented;
  }

  return (
    <>
      <BackDrop loading={loading} setLoading={setLoading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? undefined : false}
        contentContainerStyle={{
          alignItems: "center",
          padding: 15,
          width: SCREEN_WIDTH,
        }}
        style={{}}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 50,
            minWidth: "60%",
          }}
        >
          <View activeOpacity={0.5}>
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
                  borderRadius: 100,
                  width: 40,
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <Icon name="user" size={20} color="#e5e5e5" />
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: currentTheme.font,
              letterSpacing: 0.5,
            }}
          >
            {currentUser.name}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            backgroundColor: currentTheme.background2,
            borderRadius: 5,
            height: SCREEN_WIDTH / 2.5,
            marginTop: 20,
            padding: 15,
          }}
        >
          <TextInput
            placeholder={language?.language?.Main?.filter?.typeHere}
            placeholderTextColor={currentTheme.disabled}
            style={{ color: currentTheme.font }}
            multiline
            numberOfLines={15}
            onChangeText={(text) => setPostText(text)}
            value={postText}
            maxLength={800}
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
              backgroundColor: currentTheme.background2,
              paddingHorizontal: 15,
              paddingVertical: 7,
              borderRadius: 50,
            }}
          >
            <MaterialIcons name="image" size={20} color={currentTheme.font} />
            <View style={{ gap: 20 }}>
              <FileInput
                file={file}
                setFile={setFile}
                currentTheme={currentTheme}
              />
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
              backgroundColor: currentTheme.background2,
              paddingHorizontal: 15,
              paddingVertical: 7,
              borderRadius: 50,
            }}
          >
            <MaterialIcons
              name="video-library"
              size={20}
              color={currentTheme.font}
            />
            <View style={{ gap: 20 }}>
              <InputVideo
                file={file}
                setFile={setFile}
                currentTheme={currentTheme}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            height: hght,
            maxHeight: 700,
            width: SCREEN_WIDTH,
            backgroundColor: currentTheme.background2,
          }}
        >
          {file[0] && file?.type !== "video" ? (
            <ScrollView
              horizontal
              pagingEnabled
              contentContainerStyle={{
                height: hght,
                maxHeight: 700,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {file.map((i, x) => {
                let oh = file[x]?.height;
                let ow = file[x]?.width;
                let w = SCREEN_WIDTH;
                let percented = ow / SCREEN_WIDTH;
                h = oh / percented;
                return (
                  <Image
                    key={x}
                    style={{
                      width: SCREEN_WIDTH,
                      height: h,
                      maxHeight: 700,
                      resizeMode: h > 700 ? "cover" : "contain",
                    }}
                    source={{ uri: i.uri }}
                  />
                );
              })}
            </ScrollView>
          ) : (
            <>
              {file && file?.type === "video" && (
                <Video
                  ref={videoRef}
                  source={{ uri: file?.uri }}
                  useNativeControls
                  isMuted={false}
                  resizeMode={hght > 700 ? "cover" : "contain"}
                  style={[
                    styles.preview2,
                    {
                      height: hght,
                      maxHeight: 700,
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
            width: "45%",
            padding: 10,
            backgroundColor: "#F866B1",
            marginTop: 25,
            justifyContent: "center",
            borderRadius: 50,
          }}
          onPress={file && postText.length < 1501 ? FileUpload : undefined}
        >
          <Text style={{ textAlign: "center", color: "#eee" }}>
            {language?.language?.User?.addFeed?.upload}
          </Text>
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
