import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { BackDrop } from "../../../components/backDropLoader";
import Map from "../../../components/map";
import GoogleAutocomplete from "../../../components/mapAutocomplete";
import { Language } from "../../../context/language";
import { darkTheme, lightTheme } from "../../../context/theme";
import { setRerenderCurrentUser } from "../../../redux/rerenders";

/**
 * Addreses screen in settings
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Addresses = () => {
  // define language
  const language = Language();
  //define redux dispatch
  const dispatch = useDispatch();

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define adding open/hide state
  const [add, setAdd] = useState(false);

  // define loadings
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);

  const [address, setAddress] = useState("");

  // add address
  const Add = async () => {
    setLoading(true);
    try {
      if (address.country?.length > 0) {
        const response = await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/address`,
          {
            country: address.country,
            region: address.region,
            city: address.city,
            district: address.district,
            street: address.street,
            number: address.streetNumber,
            latitude: address.latitude,
            longitude: address.longitude,
          }
        );
        const data = await response.data;
        dispatch(setRerenderCurrentUser());
        setAddress("");
        setLoading(false);
      } else {
        setAddress("");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
      setLoading(false);
    }
  };

  // delete address
  const DeleteAddress = async (itemId) => {
    setLoading(true);
    Vibration.vibrate();
    if (currentUser?.address?.length > 1) {
      try {
        const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser._id}/address/${itemId}`;
        const response = await axios.delete(url);
        dispatch(setRerenderCurrentUser());
        setLoading(false);
      } catch (error) {
        console.log("Error fetching data:", error);
        setLoading(false);
      }
    } else {
      Alert.alert("Cant delete last address");
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 300);
  }, []);

  return (
    <>
      {loader ? (
        <View
          style={{
            height: 500,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      ) : (
        <View
          style={{ width: SCREEN_WIDTH, alignItems: "center", marginTop: 20 }}
        >
          {!add ? (
            <Pressable onPress={() => setAdd(true)} style={{ padding: 10 }}>
              <MaterialIcons name="add" color="#F866B1" size={24} />
            </Pressable>
          ) : (
            <Pressable onPress={() => setAdd(false)} style={{ padding: 10 }}>
              <FontAwesome5 name="times" color="red" size={24} />
            </Pressable>
          )}

          {add && (
            <GoogleAutocomplete
              setAddress={setAddress}
              currentTheme={currentTheme}
            />
          )}
          {loading && <BackDrop loading={loading} setLoading={setLoading} />}
          {address?.city?.length > 0 && (
            <Pressable
              style={{
                alignItems: "center",
                padding: 10,
                borderRadius: 5,
                backgroundColor: "#F866B1",
                marginTop: 5,
                marginBottom: 10,
              }}
              onPress={() => Add()}
            >
              <Text style={{ color: currentTheme.font }}>
                {language?.language?.Main.filter.save}
              </Text>
            </Pressable>
          )}
          <ScrollView
            bounces={Platform.OS === "ios" ? false : undefined}
            overScrollMode={Platform.OS === "ios" ? "never" : "always"}
            style={{ height: add ? SCREEN_HEIGHT / 1.7 : SCREEN_HEIGHT / 1.4 }}
          >
            {currentUser?.address.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={index}
                  onLongPress={
                    currentUser?.address.length > 1
                      ? () => {
                          DeleteAddress(item._id);
                        }
                      : undefined
                  }
                  delayLongPress={300}
                  style={{
                    padding: 10,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 10,
                    margin: 2.5,
                    flexDirection: "row",
                    width: SCREEN_WIDTH - 30,
                    gap: 30,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 3, // negative value places shadow on top
                    },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                >
                  <View style={{ gap: 10 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Entypo
                        name="location-pin"
                        color={currentTheme.pink}
                        size={20}
                      />
                      <Text
                        style={{ color: currentTheme.font, fontWeight: "bold" }}
                      >
                        {language?.language?.User.userPage.address}: N
                        <Text style={{ fontWeight: "normal" }}>
                          {index + 1}
                        </Text>
                      </Text>
                    </View>
                    <Map
                      latitude={item?.latitude}
                      longitude={item.longitude}
                      height={100}
                    />
                  </View>
                  <View style={{ gap: 5 }}>
                    <Text
                      style={{ color: currentTheme.font, fontWeight: "bold" }}
                    >
                      {language?.language?.Main.filter.country}:{"  "}
                      <Text style={{ fontWeight: "normal" }}>
                        {item?.country}
                      </Text>
                    </Text>
                    <Text
                      style={{ color: currentTheme.font, fontWeight: "bold" }}
                    >
                      {language?.language?.Main.filter.region}:{"  "}
                      <Text style={{ fontWeight: "normal" }}>
                        {item?.region}
                      </Text>
                    </Text>
                    <Text
                      style={{ color: currentTheme.font, fontWeight: "bold" }}
                    >
                      {language?.language?.Main.filter.city}:{"  "}
                      <Text style={{ fontWeight: "normal" }}>{item?.city}</Text>
                    </Text>
                    <Text
                      style={{ color: currentTheme.font, fontWeight: "bold" }}
                    >
                      {language?.language?.Main.filter.district}:{"  "}
                      <Text style={{ fontWeight: "normal" }}>
                        {item?.district}
                      </Text>
                    </Text>
                    <Text
                      style={{ color: currentTheme.font, fontWeight: "bold" }}
                    >
                      {language?.language?.Main.filter.street}:{"  "}
                      <Text style={{ fontWeight: "normal" }}>
                        {item?.street}
                      </Text>
                    </Text>
                    <Text
                      style={{ color: currentTheme.font, fontWeight: "bold" }}
                    >
                      {language?.language?.Main.filter.streetNumber}:{"  "}
                      <Text style={{ fontWeight: "normal" }}>
                        {item?.number}
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
};
