import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import GoogleAutocomplete from "../../../components/mapAutocomplete";
import { darkTheme, lightTheme } from "../../../context/theme";
import axios from "axios";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import { useDispatch, useSelector } from "react-redux";
import { BackDrop } from "../../../components/backDropLoader";
import Map from "../../../components/map";
import { Language } from "../../../context/language";
import AlertMessage from "../../../components/alertMessage";
import { BlurView } from "expo-blur";

/**
 * Add new address screen
 */

export const EditAddress = ({ target, setOpenModal, openModal }) => {
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines language
  const language = Language();

  // loading state
  const [loading, setLoading] = useState(false);

  // address state
  const [address, setAddress] = useState("");

  // dispatch redux
  const dispatch = useDispatch();

  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // add address
  const Edit = async () => {
    if (!address.street) {
      setOpenModal({ active: false, target: {} });
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.wrongAddress,
        type: "error",
      });
    }
    setLoading(true);
    try {
      await axios.patch(
        `${backendUrl}/api/v1/users/${currentUser?._id}/address/${target.address._id}`,
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
        setOpenModal({ active: false, target: {} });
      }, 500);
    } catch (error) {
      console.log(error.response);
      Alert.alert(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ alignItems: "center", flex: 1 }}>
      {loading && <BackDrop loading={loading} setLoading={setLoading} />}
      <BlurView
        style={{ flex: 1, width: "100%", alignItems: "center", paddingTop: 30 }}
        intensity={60}
        tint="dark"
      >
        <View style={{ gap: 10 }}>
          <GoogleAutocomplete
            setAddress={setAddress}
            currentTheme={currentTheme}
          />
          <View style={{ marginBottom: 35 }}>
            <Map
              latitude={
                address !== "" ? address?.latitude : target.address.latitude
              }
              longitude={
                address !== "" ? address.longitude : target.address.longitude
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
          onPress={Edit}
        >
          <Text style={{ color: "#f1f1f1" }}>Save</Text>
        </Pressable>
        <View style={{ position: "absolute", zIndex: 19000 }}>
          <AlertMessage
            isVisible={alert.active}
            type={alert.type}
            text={alert.text}
            onClose={() => setAlert({ active: false, text: "" })}
            Press={() => setAlert({ active: false, text: "" })}
          />
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
