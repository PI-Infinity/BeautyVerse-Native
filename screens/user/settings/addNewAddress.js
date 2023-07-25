import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import GoogleAutocomplete from "../../../components/mapAutocomplete";
import { darkTheme, lightTheme } from "../../../context/theme";
import axios from "axios";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import { useDispatch, useSelector } from "react-redux";
import { BackDrop } from "../../../components/backDropLoader";
import Map from "../../../components/map";

/**
 * Add new address screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const AddNewAddress = ({ navigation }) => {
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // loading state
  const [loading, setLoading] = useState(false);

  // address state
  const [address, setAddress] = useState("");

  // dispatch redux
  const dispatch = useDispatch();

  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // add address
  const Add = async () => {
    setLoading(true);
    try {
      if (address.country?.length > 0) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/address`,
          {
            country: address.country,
            region: address.region,
            city: address.city && address.city,
            district: address.district && address.district,
            street: address.street && address.street,
            number: address.streetNumber && address.streetNumber,
            latitude: address.latitude,
            longitude: address.longitude,
          }
        );

        dispatch(setRerenderCurrentUser());
        setAddress("");
        setTimeout(() => {
          setLoading(false);
          navigation.navigate("Addresses");
        }, 500);
      } else {
        setAddress("");
        setLoading(false);
        Alert.alert("New address not defined!");
      }
    } catch (error) {
      console.log(error.response);
      Alert.alert(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <View style={{ alignItems: "center" }}>
      {loading && <BackDrop loading={loading} setLoading={setLoading} />}
      <View>
        <GoogleAutocomplete
          setAddress={setAddress}
          currentTheme={currentTheme}
        />
        <View style={{ marginBottom: 35 }}>
          <Map
            latitude={
              address !== ""
                ? address?.latitude
                : currentUser.address[0].latitude
            }
            longitude={
              address !== ""
                ? address.longitude
                : currentUser.address[0].longitude
            }
            height={250}
          />
        </View>
      </View>
      <Pressable
        style={{
          padding: 10,
          backgroundColor: currentTheme.pink,
          width: "45%",
          borderRadius: 50,
          alignItems: "center",
        }}
        onPress={Add}
      >
        <Text style={{ color: "#f1f1f1" }}>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});
