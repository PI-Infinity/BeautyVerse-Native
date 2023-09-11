import React, { useRef, useState, useEffect } from "react";
import { View, Button, Image, Text } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); // Initialize with back camera

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const captureImage = async () => {
    if (cameraRef.current) {
      const image = await cameraRef.current.takePictureAsync();
      setCapturedImage(image.uri);
    }
  };

  const toggleCameraType = () => {
    if (cameraType === Camera.Constants.Type.back) {
      setCameraType(Camera.Constants.Type.front);
    } else {
      setCameraType(Camera.Constants.Type.back);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {capturedImage ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: capturedImage }} style={{ flex: 1 }} />
          <Button
            title="Take New Picture"
            onPress={() => setCapturedImage(null)}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Camera ref={cameraRef} style={{ flex: 1 }} type={cameraType} />
          <Button title="Capture" onPress={captureImage} />
          <Button title="Toggle Camera" onPress={toggleCameraType} />
        </View>
      )}
    </View>
  );
}
