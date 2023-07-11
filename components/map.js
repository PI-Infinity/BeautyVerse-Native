import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

/**
 * Apple map component
 */

const Map = ({ latitude, longitude, mapViewRef, height }) => {
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const handleMapPress = (event) => {
    setSelectedCoordinate(event.nativeEvent.coordinate);
  };
  useEffect(() => {
    const updateCoordinates = (newLatitude, newLongitude) => {
      if (mapViewRef?.current) {
        mapViewRef?.current.animateToRegion(
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
  }, [latitude, selectedCoordinate]);
  return (
    <View
      style={{
        height: height,
      }}
    >
      <MapView
        ref={mapViewRef}
        // provider={PROVIDER_GOOGLE}
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
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  map: {
    borderRadius: 5,
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
