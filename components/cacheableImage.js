import React, { useState, useEffect } from "react";
import { Animated } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

export const CacheableImage = (props) => {
  const [source, setSource] = useState(null);

  useEffect(() => {
    const cacheImage = async () => {
      try {
        const url = props?.source.uri;
        if (!url) {
          console.warn("No URI provided for image");
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
        const path = `${FileSystem.cacheDirectory}${hashedName}.jpg`;

        const { exists } = await FileSystem.getInfoAsync(path);
        if (exists) {
          setSource({ uri: path });
        } else {
          const { uri } = await FileSystem.downloadAsync(url, path);
          setSource({ uri });
        }
      } catch (error) {
        console.error("Error loading cached image:", error);
      }
    };
    if (props.source.uri) {
      cacheImage();
    }
  }, [props.source.uri]);

  return (
    <Animated.Image
      onLoad={props.onLoad}
      {...props}
      // style={{ height: props.style.height, width: props.style.width }}
      source={source}
    />
  );
};
