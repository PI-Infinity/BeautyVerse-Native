import React, { useState, useEffect, useRef } from "react";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { View, Pressable, Text, StyleSheet } from "react-native";

export const CacheableVideo = (props) => {
  const [source, setSource] = useState(null);

  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = async () => {
    if (isPlaying) {
      await props.videoRef.current.pauseAsync();
    } else {
      await props.videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const cacheVideo = async () => {
      try {
        const url = props?.source.uri;
        if (!url) {
          console.warn("No URI provided for video");
          return;
        }

        // Validate the URL
        let isValidURL = true;
        try {
          new URL(url);
        } catch (_) {
          isValidURL = false;
        }

        if (!isValidURL) {
          console.warn("Invalid URL:", url);
          return;
        }

        const hashedName = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.MD5,
          url
        );
        const path = `${FileSystem.cacheDirectory}${hashedName}.mp4`;

        const { exists } = await FileSystem.getInfoAsync(path);
        if (exists) {
          setSource({ uri: path });
        } else {
          const { uri } = await FileSystem.downloadAsync(url, path);
          setSource({ uri });
        }
      } catch (error) {
        console.error("Error loading cached video:", error);
      }
    };
    if (props.source.uri) {
      cacheVideo();
    }
  }, [props.source.uri]);

  return (
    <>
      {props.type === "userGallery" ? (
        // <View>
        <Video
          ref={props.videoRef}
          {...props}
          source={source}
          onLoad={props.onLoad}
          onError={props.onError}
          style={props.style}
        />
      ) : (
        // </View>
        <Pressable
          onPress={props.from !== "feedCard" ? togglePlay : props.onPress}
          onLongPress={props.onLongPress}
          delayLongPress={props.delayLongPress}
        >
          <Video
            ref={props.videoRef}
            {...props}
            source={source}
            onLoad={props.onLoad}
            onError={props.onError}
            style={props.style}
          />
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    width: "100%",
    height: 300,
  },
  playButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: -50,
  },
  playButtonText: {
    color: "white",
    fontSize: 16,
  },
});
