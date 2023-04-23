import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

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
    <View style={[styles.mapContainer, { height: height }]}>
      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
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
      {selectedCoordinate && (
        <Text style={styles.coordinates}>
          Latitude: {selectedCoordinate.latitude.toFixed(6)}
          {"\n"}
          Longitude: {selectedCoordinate.longitude.toFixed(6)}
        </Text>
      )}
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
  coordinates: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default Map;
