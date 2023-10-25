import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const Map = ({ latitude, longitude, height }) => {
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const mapViewRef = useRef(null);

  const handleMapPress = (event) => {
    setSelectedCoordinate(event.nativeEvent.coordinate);
  };

  useEffect(() => {
    const updateCoordinates = () => {
      if (mapViewRef?.current) {
        mapViewRef.current.animateToRegion(
          {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
      }
    };

    setTimeout(() => {
      updateCoordinates();
    }, 0);
  }, [latitude, longitude, selectedCoordinate]);

  return (
    <View style={{ height: height }}>
      <MapView
        ref={mapViewRef}
        style={[styles.map, { height: height, width: "100%" }]}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.0021,
        }}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title="My Marker"
          description="This is the description of the marker"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  map: {
    borderRadius: 20,
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
