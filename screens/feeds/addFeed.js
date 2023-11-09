import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { Video } from "expo-av";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { BackDrop } from "../../components/backDropLoader";
import { CacheableImage } from "../../components/cacheableImage";
import FileInput from "../../components/fileInput";
import ImagePickerExample from "../../components/fileInputAndroid";
import { UploaderPercentage } from "../../components/uploaderPercentage";
import InputVideo from "../../components/videoInput";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { storage } from "../../firebase";
import { setRerenderUserFeeds } from "../../redux/rerenders";
import DraggableItem, { DragableList } from "./draggableList";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../../components/header";

/**
 * Add new feed screen
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const AddFeed = ({ hideModal }) => {
  // navigation
  const navigation = useNavigation();
  // define language
  const language = Language();

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // app language
  const lang = useSelector((state) => state.storeApp.language);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define redux dispatch
  const dispatch = useDispatch();

  // define loading state
  const [loading, setLoading] = useState(false);

  // define feed text state
  const [postText, setPostText] = useState("");

  /**
   * Add file
   */

  // upload porgress state
  const [uploadProgress, setUploadProgress] = useState(0);
  // picked file state
  const [file, setFile] = useState([]);
  // blob file converting state
  const [blobFile, setBlobFile] = useState(null);

  // convert file to blob

  async function uriToBlob(uri) {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      const response = await fetch(uri);
      return await response.blob();
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

  // cancel uploading
  const uploadTaskRef = useRef(null);

  const cancelUpload = () => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
    }
  };

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * File upload function
   */

  async function FileUpload() {
    if (file?.length < 1) {
      return Alert.alert("File not include!");
    }
    if (postText.length > 1500) {
      return Alert.alert("Text must include maximum 1500 characters!");
    }
    setLoading(true);

    const AddFileInCloud = async (index, folder, uri) => {
      let imgId = currentUser.name + uuid.v4();
      let fileRef = ref(
        storage,
        `images/${currentUser?._id}/feeds/${folder}/${imgId}/`
      );
      const blb = await uriToBlob(uri);

      if (fileRef) {
        // add desktop version
        const snapshot = await uploadBytesResumable(fileRef, blb);
        const url = await getDownloadURL(snapshot.ref);
        return { url: url };
      }
    };

    // check file
    if (file[0] && file[0]?.type !== "video") {
      let folderId = currentUser.name + uuid.v4();

      const uploadPromises = file.map((_, index) =>
        AddFileInCloud(index, folderId, file[index].uri)
      );

      Promise.all(uploadPromises).then(async (uploadedUrls) => {
        try {
          const newFeed = {
            images: uploadedUrls,
            name: folderId,
            createdAt: new Date().toISOString(),
            post: postText,
            fileFormat: "img",
            fileHeight: file[0]?.height,
            fileWidth: file[0]?.width,
            owner: currentUser._id,
          };
          await axios.post(backendUrl + `/api/v1/feeds`, newFeed);
          await axios.patch(backendUrl + `/api/v1/users/${currentUser?._id}`, {
            lastPostCreatedAt: new Date(),
          });
          setTimeout(() => {
            dispatch(setRerenderUserFeeds());
          }, 1000);
          setTimeout(async () => {
            hideModal();
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

      const uploadTask = uploadBytesResumable(videosRef, blobFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          try {
            const newFeed = {
              video: url,
              name: videoId,
              createdAt: new Date().toISOString(),
              post: postText,
              fileFormat: "video",
              fileHeight: file.height,
              fileWidth: file.width,
              owner: currentUser._id,
            };

            const response = await axios.post(
              backendUrl + `/api/v1/feeds`,
              newFeed
            );

            await axios.patch(
              backendUrl + `/api/v1/users/${currentUser?._id}`,
              {
                lastPostCreatedAt: new Date(),
              }
            );

            setTimeout(() => {
              dispatch(setRerenderUserFeeds());
            }, 1000);

            setTimeout(async () => {
              hideModal();
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
        }
      );
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

    let wdth = SCREEN_WIDTH - 20;

    let percented = originalWidth / wdth;

    hght = originalHeight / percented;
  } else if (file[0]) {
    let highestItem = file.sort((a, b) => b.height - a.height)[0];
    let originalHeight = highestItem?.height;
    let originalWidth = highestItem?.width;

    let percented = originalWidth / (SCREEN_WIDTH - 20);
    hght = originalHeight / percented;
    wdth = originalWidth / percented;
  }

  return (
    <>
      {loading && file?.type === "video" ? (
        <UploaderPercentage
          loading={loading}
          setLoading={setLoading}
          setFile={setFile}
          to="cloud"
          progress={uploadProgress}
          setProgress={setUploadProgress}
          cancelUpload={cancelUpload}
        />
      ) : (
        loading && <BackDrop loading={loading} setLoading={setLoading} />
      )}
      <Header
        title={language?.language?.User?.userPage?.addFeed}
        onBack={hideModal}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
        contentContainerStyle={{
          alignItems: "center",
          padding: 15,
          width: SCREEN_WIDTH,
          paddingBottom: 120,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderWidth: 1,
            borderColor: currentTheme.line,
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
                <FontAwesome name="user" size={20} color="#e5e5e5" />
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
            // backgroundColor: currentTheme.background2,
            borderRadius: 5,
            height: SCREEN_WIDTH / 2.5,
            marginTop: 20,
            padding: 15,
            borderWidth: 1.5,
            borderColor: currentTheme.line,
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
            gap: SCREEN_WIDTH / 10,
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
              borderWidth: 1,
              borderColor: currentTheme.line,

              borderRadius: 50,
            }}
          >
            <View style={{ gap: 20 }}>
              {Platform.OS === "android" ? (
                <ImagePickerExample
                  setFile={setFile}
                  file={file}
                  currentTheme={currentTheme}
                  language={language}
                  title={language?.language?.User?.addFeed?.selectImage}
                />
              ) : (
                <FileInput
                  file={file}
                  setFile={setFile}
                  currentTheme={currentTheme}
                  title={language?.language?.User?.addFeed?.selectImage}
                />
              )}
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
              borderWidth: 1,
              borderColor: currentTheme.line,
              borderRadius: 50,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 15,
                paddingVertical: 7.5,
              }}
            >
              <InputVideo
                file={file}
                setFile={setFile}
                currentTheme={currentTheme}
                title={language?.language?.User?.addFeed?.selectVideo}
              />
            </View>
          </View>
        </View>

        {file?.length > 0 && file?.type !== "video" && (
          <Text
            style={{
              color: "#ccc",
              marginBottom: 10,
            }}
          >
            {file?.length} Images
          </Text>
        )}
        <View
          style={{
            height: hght > 640 ? 640 : hght,
            maxHeight: 640,
            overflow: "hidden",
            width: SCREEN_WIDTH,

            justifyContent: "center",
          }}
        >
          {file[0] && file?.type !== "video" ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                contentContainerStyle={{
                  height: hght > 640 ? 640 : hght,
                  maxHeight: 640,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                style={{
                  width: SCREEN_WIDTH - 20,
                  marginLeft: 10,
                  borderRadius: 20,
                }}
              >
                {file.map((i, x) => {
                  let oh = i?.height;
                  let ow = i?.width;
                  let percented = ow / (SCREEN_WIDTH - 20);
                  let h = oh / percented;
                  let w = ow / percented;

                  return (
                    <View
                      key={x}
                      style={{
                        width: SCREEN_WIDTH - 20,
                        alignItems: "center",
                        justifyContent: "center",
                        height: hght,
                        backgroundColor: currentTheme.line,
                      }}
                    >
                      <Image
                        style={{
                          aspectRatio: 1,
                          height: h,
                          maxHeight: 640,
                          resizeMode: "contain",
                        }}
                        source={{ uri: i.uri }}
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <>
              {file && file?.type === "video" && (
                <Video
                  ref={videoRef}
                  source={{ uri: file?.uri }}
                  useNativeControls
                  isMuted={false}
                  resizeMode="contain"
                  style={[
                    styles.preview2,
                    {
                      height: file?.height > file?.width ? hght : file?.width,
                      width: SCREEN_WIDTH,
                    },
                  ]}
                />
              )}
            </>
          )}
        </View>
        <DragableList currentTheme={currentTheme} file={file} />

        {/* <View
          style={{
            backgroundColor: currentTheme.background2,
            overflow: "hidden",
            width: SCREEN_WIDTH - 20,
            justifyContent: "center",
            marginVertical: 15,
            paddingVertical: 15,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: currentTheme.line,
          }}
        >
          {file[0] && file?.type !== "video" && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 15,
                  width: SCREEN_WIDTH - 20,
                  borderRadius: 20,
                }}
              >
                {file.map((i, x) => {
                  return (
                    <View
                      key={x}
                      style={{
                        width: SCREEN_WIDTH / 4,
                        aspectRatio: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: currentTheme.line,
                        borderRadius: 10,
                        overflow: "hidden",
                        borderWidth: 2,
                        borderColor: currentTheme.line,
                      }}
                    >
                      <View
                        style={{
                          position: "absolute",
                          zIndex: 10,
                          top: 4,
                          right: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: currentTheme.pink,
                            fontWeight: "bold",
                          }}
                        >
                          {x + 1}
                        </Text>
                      </View>

                      <Image
                        style={{
                          width: SCREEN_WIDTH / 4,
                          aspectRatio: 1,
                          resizeMode: "cover",
                        }}
                        source={{ uri: i.uri }}
                      />
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View> */}

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
          onPress={FileUpload}
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
  preview: {
    marginBottom: 10,
    borderRadius: 5,
  },
  preview2: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
});
