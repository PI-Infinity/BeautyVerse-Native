import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
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
import DeleteDialog from "../../../components/confirmDialog";
import { setCurrentUser } from "../../../redux/user";
import { useNavigation } from "@react-navigation/native";

/**
 * Addreses screen in settings
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Addresses = () => {
  // define language
  const language = Language();
  //define redux dispatch
  const dispatch = useDispatch();

  // defines navigation
  const navigation = useNavigation();

  // define current user
  const [addresses, setAddresses] = useState([]);

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  useEffect(() => {
    setAddresses(currentUser.address);
  }, [currentUser]);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define adding open/hide state
  const [add, setAdd] = useState(false);

  // define loadings
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);

  // delete dialog state
  const [deleteDialog, setDeleteDialog] = useState(false);
  // new state to store the ID of the item to be deleted
  const [toDelete, setToDelete] = useState(null);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // delete address

  const DeleteAddress = async () => {
    setLoading(true);

    try {
      const updatedAddresses = addresses.filter(
        (address) => address._id !== toDelete
      );

      setAddresses(updatedAddresses);

      const url = `${backendUrl}/api/v1/users/${currentUser._id}/address/${toDelete}`;
      await axios.delete(url);

      dispatch(setRerenderCurrentUser());
      setLoading(false);
      setToDelete(null); // clear the toDelete state after deleting
    } catch (error) {
      console.log("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setLoader(false);
    }, 300);
  }, [addresses]);

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
          style={{
            width: SCREEN_WIDTH,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {loading && <BackDrop loading={loading} setLoading={setLoading} />}
          {deleteDialog && (
            <DeleteDialog
              isVisible={deleteDialog}
              onClose={() => {
                setDeleteDialog(false);
                setToDelete(null); // clear the toDelete state when the dialog is closed
              }}
              onDelete={DeleteAddress}
              title="Are you sure to delete this address?"
              delet="Delete"
              cancel="Cancel"
            />
          )}
          <ScrollView
            bounces={Platform.OS === "ios" ? false : undefined}
            overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          >
            {addresses.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditAddress", { address: item })
                  }
                  activeOpacity={0.5}
                  key={index}
                  style={{
                    padding: 10,
                    // backgroundColor: currentTheme.background2,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: currentTheme.line,
                    margin: 2.5,
                    paddingRight: 8,
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
                    overflow: "hidden",
                  }}
                >
                  {addresses?.length > 1 && (
                    <Ionicons
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        zIndex: 999,
                      }}
                      name="remove"
                      size={20}
                      color="red"
                      onPress={() => {
                        Vibration.vibrate();
                        setToDelete(item._id); // set the ID of the item to delete
                        setDeleteDialog(true);
                      }}
                    />
                  )}
                  <View style={{ gap: 10 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "flex-end" }}
                    >
                      <Entypo
                        name="location-pin"
                        color={currentTheme.pink}
                        size={20}
                      />
                      <Text
                        style={{
                          color: currentTheme.font,
                          fontWeight: "bold",
                          letterSpacing: 0.3,
                        }}
                      >
                        {index === 0
                          ? "Main address"
                          : language?.language?.User.userPage.address}
                        {index !== 0 && (
                          <Text
                            style={{
                              fontWeight: "bold",
                              letterSpacing: 0.3,
                            }}
                          >
                            : N
                          </Text>
                        )}
                        {index !== 0 && (
                          <Text
                            style={{
                              fontWeight: "bold",
                              letterSpacing: 0.3,
                            }}
                          >
                            {index + 1}
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View style={{ height: 100, width: SCREEN_WIDTH / 3 }}>
                      <Map
                        latitude={item?.latitude}
                        longitude={item.longitude}
                        height={100}
                      />
                    </View>
                  </View>
                  <View style={{ gap: 5, marginTop: 3 }}>
                    <Text
                      style={{
                        color: currentTheme.font,
                        fontWeight: "bold",
                        letterSpacing: 0.3,
                      }}
                    >
                      {language?.language?.Main.filter.country}:{"  "}
                      <Text
                        style={{
                          fontWeight: "normal",
                          color: currentTheme.pink,
                          letterSpacing: 0.3,
                        }}
                      >
                        {item?.country}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        color: currentTheme.font,
                        fontWeight: "bold",
                        width: "95%",
                        flexWrap: "nowrap",
                      }}
                    >
                      {language?.language?.Main.filter.region}:{"  "}
                      <Text
                        style={{
                          fontWeight: "normal",
                          color: currentTheme.pink,
                          letterSpacing: 0.3,
                        }}
                      >
                        {item?.region}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        color: currentTheme.font,
                        fontWeight: "bold",
                        letterSpacing: 0.3,
                      }}
                    >
                      {language?.language?.Main.filter.city}:{"  "}
                      <Text
                        style={{
                          fontWeight: "normal",
                          color: currentTheme.pink,
                          letterSpacing: 0.3,
                        }}
                      >
                        {item?.city}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        color: currentTheme.font,
                        fontWeight: "bold",
                        letterSpacing: 0.3,
                      }}
                    >
                      {language?.language?.Main.filter.district}:{"  "}
                      <Text
                        style={{
                          fontWeight: "normal",
                          color: currentTheme.pink,
                          letterSpacing: 0.3,
                        }}
                      >
                        {item?.district}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        color: currentTheme.font,
                        fontWeight: "bold",
                        letterSpacing: 0.3,
                      }}
                    >
                      {language?.language?.Main.filter.street}:{"  "}
                      <Text
                        style={{
                          fontWeight: "normal",
                          color: currentTheme.pink,
                          letterSpacing: 0.3,
                        }}
                      >
                        {item?.street}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        color: currentTheme.font,
                        fontWeight: "bold",
                        letterSpacing: 0.3,
                      }}
                    >
                      {language?.language?.Main.filter.streetNumber}:{"  "}
                      <Text
                        style={{
                          fontWeight: "normal",
                          color: currentTheme.pink,
                          letterSpacing: 0.3,
                        }}
                      >
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
