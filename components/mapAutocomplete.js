import React, { useRef, useState } from "react";
import { View, Animated } from "react-native";
import { StyleSheet, Dimensions } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Language } from "../context/language";

/**
 * Address autocomplete component
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GoogleAutocomplete = ({ address, setAddress, currentTheme }) => {
  const language = Language();
  const heightAnim = useRef(new Animated.Value(45)).current; // Initial height for animated value

  const handleChangeText = (text) => {
    Animated.timing(heightAnim, {
      toValue: text.length > 1 ? 350 : 45,
      duration: 200, // Duration of the animation
      useNativeDriver: false, // Add this line
    }).start();
  };
  const handleChangeText2 = (text) => {
    Animated.timing(heightAnim, {
      toValue: 45,
      duration: 200, // Duration of the animation
      useNativeDriver: false, // Add this line
    }).start();
  };

  // this state used to show/hide password when input
  const [addressFocused, setAddressFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      width: SCREEN_WIDTH * 0.9,
      height: 200,

      // height: 100,
    },
    listView: {
      borderRadius: 5,
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
      borderColor: addressFocused ? currentTheme.pink : currentTheme.line,
      backgroundColor: currentTheme.background, // Add this line
    },
    description: {
      // Add this block
      color: "#111",
      fontWeight: "normal",
    },
    textInputClearButton: {
      tintColor: "red",
    },
  });

  return (
    <Animated.View style={{ zIndex: 20000, height: heightAnim }}>
      <GooglePlacesAutocomplete
        placeholder={language?.language?.Auth?.auth?.findLocation}
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
          handleChangeText2();
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
          onFocus: () => {
            setAddressFocused(true);
          },
          onBlur: () => {
            setAddressFocused(false);
          },
        }}
        styles={styles}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={200}
        // requestUrl={{
        //   url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
        //   useOnPlatform: "web",
        // }}
      />
    </Animated.View>
  );
};

export default GoogleAutocomplete;
