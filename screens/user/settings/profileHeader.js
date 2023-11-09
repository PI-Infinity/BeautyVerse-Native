import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { darkTheme, lightTheme } from "../../../context/theme";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setScreenModal } from "../../../redux/app";
import { RouteNameContext } from "../../../context/routName";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Header = ({ title, onBack, subScreen }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const newBookings = useSelector((state) => state.storeBookings.new);
  const newSentBookings = useSelector((state) => state.storeSentBookings.new);
  const unreadNotifications = useSelector(
    (state) => state.storeNotifications.unreadNotifications
  );

  const route = useRoute();

  return (
    <View
      style={{
        height: 50,
        width: SCREEN_WIDTH,
        flexDirection: "row",
        justifyContent: "space-between",

        // alignItems: "center",
        // backgroundColor: !theme ? currentTheme.background : "rgba(0,0,0,0.5)",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginLeft: 15,
          width: SCREEN_WIDTH * 0.6,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            letterSpacing: 0.5,
            color: currentTheme.font,
            fontWeight: "bold",
          }}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {currentUser?.name} {/* current user name un screen header */}
        </Text>
        {currentUser.subscription.status === "active" && (
          <MaterialIcons
            name="verified"
            size={14}
            color="#F866B1"
            style={{ marginTop: 2 }}
          />
        )}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* add feed icon in header of screen */}
        {currentUser.type !== "user" && (
          <>
            <Pressable
              onPress={() =>
                dispatch(
                  setScreenModal({
                    active: true,
                    screen: "Add Feed",
                    route: route.name,
                  })
                )
              }
              // onPress={() => navigation.navigate("AddFeed")}
              style={{ marginRight: 12, padding: 5, paddingRight: 0 }}
            >
              <MaterialIcons
                name="library-add"
                size={22}
                color={currentTheme.pink}
              />
            </Pressable>

            {/* <Pressable
                    acitveOpacity={0.3}
                    style={{
                      marginRight: 10,
                      marginLeft: 4,
                      flexDirection: "row",
                      opacity: 1,
                      alignItems: "center",
                      backgroundColor: currentTheme.line,
                      borderRadius: 50,
                      padding: 5,
                      paddingVertical: 2.5,
                    }}
                    onPress={() => navigation.navigate("Bookings")}
                  >
                    {newBookings > 0 && (
                      <View
                        style={{
                          width: "auto",
                          minWidth: 13,
                          height: 13,
                          backgroundColor: currentTheme.pink,
                          borderRadius: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          zIndex: 2,
                          right: -2,
                          top: -2,
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 10 }}>
                          {newBookings}
                        </Text>
                      </View>
                    )}
                    <Entypo
                      name="list"
                      size={24}
                      color={currentTheme.disabled}
                    />
                    <Text
                      style={{
                        color:
                          currentUser.subscription.status === "active"
                            ? currentTheme.pink
                            : currentTheme.disabled,
                        fontWeight: "bold",
                        letterSpacing: -1,
                        fontSize: 16,
                      }}
                    >
                      BMS
                    </Text>
                  </Pressable> */}
          </>
        )}
        <View>
          {unreadNotifications?.length > 0 && (
            <View
              style={{
                width: "auto",
                minWidth: 18,
                height: 18,
                backgroundColor: currentTheme.pink,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                zIndex: 2,
                right: 2,
                top: -3,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                {unreadNotifications?.length}
              </Text>
            </View>
          )}
          <Pressable
            onPress={() =>
              dispatch(
                setScreenModal({
                  active: true,
                  screen: "Notifications",
                  route: route.name,
                })
              )
            }
            style={{ marginRight: 5, padding: 5 }}
          >
            {/* settings button*/}
            <Ionicons
              name="notifications"
              size={20.5}
              color={currentTheme.disabled}
            />
          </Pressable>
        </View>
        <Pressable
          // onPress={() => navigation.navigate("Settings")}
          onPress={() =>
            dispatch(
              setScreenModal({
                active: true,
                screen: "Settings",
                route: route.name,
              })
            )
          }
          style={{ marginRight: 15, padding: 5 }}
        >
          {currentUser?.type === "specialist" && newSentBookings > 0 && (
            <View
              style={{
                width: "auto",
                minWidth: 13,
                height: 13,
                backgroundColor: currentTheme.pink,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                zIndex: 2,
                right: -2,
                top: 0,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                {newSentBookings}
              </Text>
            </View>
          )}
          <Ionicons
            name="settings"
            size={20}
            color={currentTheme.disabled}
            style={{ marginBottom: 0.5 }}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
