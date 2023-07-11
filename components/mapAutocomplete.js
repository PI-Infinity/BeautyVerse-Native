import React, { useState } from "react";
import { View } from "react-native";
import { StyleSheet, Dimensions } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Language } from "../context/language";

/**
 * Address autocomplete component
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GoogleAutocomplete = ({ address, setAddress, currentTheme }) => {
  const language = Language();
  const [h, setH] = useState(45);

  const handleChangeText = (text) => {
    if (text.length > 1) {
      setH(150);
    } else {
      setH(45);
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: SCREEN_WIDTH * 0.8,
      // height: 100,
    },
    listView: {
      borderRadius: 5,
      backgroundColor: currentTheme.background2, // Add this line
    },
    // textInputContainer: {
    //   borderTopWidth: 0,
    //   borderBottomWidth: 0,
    //   // backgroundColor: currentTheme.background2, // Add this line
    //   color: currentTheme.font,
    //   borderRadius: 50,
    // },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 40,
      color: currentTheme.font, // Update this line
      fontSize: 14,
      // borderRadius: 50,
      borderBottomWidth: 1,
      borderColor: currentTheme.line,
      backgroundColor: currentTheme.background, // Add this line
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3, // negative value places shadow on top
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    description: {
      // Add this block
      color: "#111",
      fontWeight: "bold",
    },
    textInputClearButton: {
      tintColor: "red",
    },
  });

  return (
    <View style={{ zIndex: 20000, height: h }}>
      <GooglePlacesAutocomplete
        placeholder="Your location"
        minLength={2}
        autoFocus={false}
        returnKeyType="search"
        listViewDisplayed="auto"
        fetchDetails={true}
        value={address}
        onPress={(data, details = null) => {
          const country = details.address_components.find((component) =>
            component.types.includes("country")
          )?.long_name;
          const region = details.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name;
          const city = details.address_components.find((component) =>
            component.types.includes("locality")
          )?.long_name;
          const district = details.address_components.find((component) =>
            component.types.includes("sublocality_level_1")
          )?.long_name;
          const street = details.address_components.find((component) =>
            component.types.includes("route")
          )?.long_name;
          const streetNumber = details.address_components.find((component) =>
            component.types.includes("street_number")
          )?.long_name;
          const latitude = details.geometry.location.lat;
          const longitude = details.geometry.location.lng;
          setH(45);
          setAddress({
            country,
            region,
            city,
            district,
            street,
            streetNumber,
            latitude,
            longitude,
          });
        }}
        query={{
          key: "AIzaSyBxx8CORlQQBBkbGc-F0yu95DMZaiJkMmo",
          language: "en",
        }}
        textInputProps={{
          onChangeText: handleChangeText,
          placeholderTextColor: currentTheme.disabled, // Add this line
          fontSize: 14,
        }}
        styles={styles}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={200}
        // requestUrl={{
        //   url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
        //   useOnPlatform: "web",
        // }}
      />
    </View>
  );
};

export default GoogleAutocomplete;
