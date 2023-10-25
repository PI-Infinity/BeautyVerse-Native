import { FontAwesome } from "@expo/vector-icons";
import { Video } from "expo-av";
import React, { useEffect } from "react";
import { Dimensions, Image, Platform, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { BackDrop } from "../../components/backDropLoader";
import FileInput from "../../components/fileInput";
import ImagePicker from "../../components/fileInputAndroid";
import { UploaderPercentage } from "../../components/uploaderPercentage";
import InputVideo from "../../components/videoInput";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";

/**
 * chat file component for sending to user
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const File = ({
  flatListRef,
  loading,
  setLoading,
  videoRef,
  file,
  setFile,
  uploadProgress,
  setUploadProgress,
  cancelUpload,
}) => {
  // define language
  const language = Language();

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // scrolling to bottom when room loads and when file changes
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current.scrollToEnd({ animated: true });
    }, 100);
  }, [file]);

  return (
    <View style={{ flexDirection: "row" }}>
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
      {file.length < 1 ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{}}>
            {Platform.OS === "android" ? (
              <ImagePicker
                setFile={setFile}
                file={file}
                currentTheme={currentTheme}
                language={language}
                title=""
                from="chat"
              />
            ) : (
              <FileInput
                file={file}
                setFile={setFile}
                currentTheme={currentTheme}
                title=""
                from="chat"
              />
            )}
          </View>

          <View style={{ justifyContent: "center" }}>
            <InputVideo
              file={file}
              setFile={setFile}
              currentTheme={currentTheme}
              title=""
              from="chat"
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: 8,
          }}
        >
          {file[0] && file?.type !== "video" ? (
            <View style={{}}>
              <FontAwesome
                name="close"
                size={18}
                color="red"
                style={{ position: "absolute", right: 0, top: 0, zIndex: 100 }}
                onPress={() => setFile([])}
              />
              <Image
                style={{
                  width: 40,
                  height: 45,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: currentTheme.line,
                  resizeMode: "cover",
                }}
                source={{ uri: file[0].uri }}
              />
            </View>
          ) : (
            <>
              {file && file?.type === "video" && (
                <>
                  <FontAwesome
                    name="close"
                    size={18}
                    color="red"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      zIndex: 100,
                    }}
                    onPress={() => setFile([])}
                  />
                  <Video
                    ref={videoRef}
                    source={{ uri: file?.uri }}
                    useNativeControls
                    isMuted={false}
                    resizeMode="cover"
                    style={[
                      styles.preview2,
                      {
                        height: 45,
                        width: 40,
                        borderRadius: 2,
                      },
                    ]}
                  />
                </>
              )}
            </>
          )}
        </View>
      )}
    </View>
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
