import React, { useState, useEffect } from "react";
import { Animated } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

export const CacheableImage = (props) => {
  const [source, setSource] = useState(null);

  useEffect(() => {
    const cacheImage = async () => {
      try {
        const hashedName = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.MD5,
          props.source.uri
        );
        const path = `${FileSystem.cacheDirectory}${hashedName}.jpg`;

        const { exists } = await FileSystem.getInfoAsync(path);
        if (exists) {
          setSource({ uri: path });
        } else {
          const { uri } = await FileSystem.downloadAsync(
            props.source.uri,
            path
          );
          setSource({ uri });
        }
      } catch (error) {
        console.error("Error loading cached image:", error);
      }
    };

    cacheImage();
  }, [props.source.uri]);

  return (
    <Animated.Image
      {...props}
      // style={{ height: props.style.height, width: props.style.width }}
      source={source}
    />
  );
};
