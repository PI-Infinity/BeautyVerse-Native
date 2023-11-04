import { Entypo, FontAwesome, Fontisto } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../../components/cacheableImage";
import { Reports } from "../../../screens/feeds/feedCard/reports";
import GetTimesAgo from "../../../functions/getTimesAgo";
import { setSendReport } from "../../../redux/alerts";
import { setBlur } from "../../../redux/app";
import { Circle } from "../../../components/skeltons";

/**
 * Top section of feed card
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const TopSection = (props) => {
  // define redux dispatch
  const dispatch = useDispatch();
  // define navigation
  const navigation = useNavigation();
  // define route
  const route = useRoute();
  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // capitalize first letter for texts
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // capitalize user type
  const t = capitalizeFirstLetter(props?.user.type);

  let type;
  if (props.user.type === "specialist") {
    type = props.language?.language?.Main?.feedCard?.specialist;
  } else if (props.user.type === "shop") {
    type = props.language?.language?.Marketplace?.marketplace?.shop;
  } else {
    type = props.language?.language?.Auth?.auth?.beautySalon;
  }

  // define current post time
  const currentPostTime = GetTimesAgo(new Date(props.createdAt).getTime());

  let definedTime;
  if (currentPostTime?.includes("min")) {
    definedTime =
      currentPostTime?.slice(0, -3) +
      props.language?.language.Main.feedCard.min;
  } else if (currentPostTime?.includes("h")) {
    definedTime =
      currentPostTime?.slice(0, -1) + props.language?.language.Main.feedCard.h;
  } else if (currentPostTime?.includes("d")) {
    definedTime =
      currentPostTime?.slice(0, -1) + props.language?.language.Main.feedCard.d;
  } else if (currentPostTime?.includes("j")) {
    definedTime =
      currentPostTime?.slice(0, -1) +
      props.language?.language.Main.feedCard.justNow;
  } else if (currentPostTime?.includes("w")) {
    definedTime =
      currentPostTime?.slice(0, -1) + props.language?.language.Main.feedCard.w;
  } else if (currentPostTime?.includes("mo")) {
    definedTime =
      currentPostTime?.slice(0, -2) + props.language?.language.Main.feedCard.mo;
  } else if (currentPostTime?.includes("y")) {
    definedTime =
      currentPostTime?.slice(0, -1) + props.language?.language.Main.feedCard.y;
  }

  /**
   * reports
   */
  const [openReports, setOpenReports] = useState(false);

  // loading cover state
  const [loading, setLoading] = useState(true);

  return (
    <>
      <View
        style={{
          zIndex: 100,
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          width: "100%",
        }}
      >
        <View>
          {props?.user.online && (
            <View
              style={{
                width: 14,
                height: 14,
                backgroundColor: "#3bd16f",
                borderRadius: 50,
                position: "absolute",
                zIndex: 10000,
                right: 0,
                bottom: 3,
                borderWidth: 3,
                borderColor: props.currentTheme.background,
              }}
            ></View>
          )}
          <View
            style={[
              styles.coverContainer,
              { borderColor: props.currentTheme.pink },
            ]}
          >
            {props.user?.cover?.length > 0 ? (
              <TouchableOpacity
                activeOpacity={route.name === "Feeds" ? 0.8 : 1}
                onPress={
                  props?.setActiveGallery
                    ? () => {
                        props?.setActiveGallery(false);
                        dispatch(setBlur(false));
                        navigation.navigate("User", {
                          user: props.user,
                        });
                      }
                    : () =>
                        navigation.navigate("User", {
                          user: props.user,
                        })
                }
                style={{
                  width: 40,
                  height: 40,
                  overflow: "hidden",
                  alignItems: "center",

                  borderRadius: 50,
                }}
              >
                {loading && (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      position: "absolute",
                      zIndex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Circle />
                  </View>
                )}
                <CacheableImage
                  key={props.user?.cover}
                  style={{
                    width: "100%",
                    aspectRatio: 0.95,
                    resizeMode: "cover",
                  }}
                  source={{
                    uri: props.user?.cover,
                  }}
                  manipulationOptions={[
                    {
                      resize: {
                        width: "100%",
                        aspectRatio: 0.95,
                        resizeMode: "cover",
                      },
                    },
                    { rotate: 90 },
                  ]}
                  onLoad={
                    () =>
                      // setTimeout(() => {
                      setLoading(false)
                    // }, 200)
                  }
                />
              </TouchableOpacity>
            ) : (
              <Pressable
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={
                  route.name === "Feeds"
                    ? () =>
                        navigation.navigate("User", {
                          user: props.user,
                        })
                    : undefined
                }
              >
                <FontAwesome
                  name="user"
                  size={24}
                  color={props.currentTheme.disabled}
                />
              </Pressable>
            )}
          </View>
        </View>

        <View
          style={{
            gap: 2.5,
            width: SCREEN_WIDTH - 90,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 7.5,
              alignItems: "center",
              // marginBottom: 2,
            }}
          >
            <TouchableOpacity
              activeOpacity={route.name === "Feeds" ? 0.8 : 1}
              onPress={
                route.name === "Feeds"
                  ? () =>
                      navigation.navigate("User", {
                        user: props.user,
                      })
                  : undefined
              }
            >
              <Text
                style={[
                  styles.name,
                  {
                    color:
                      props.fileFormat === "video"
                        ? "#f7f7f7"
                        : props.currentTheme.font,
                    textShadowColor:
                      props.fileFormat === "video"
                        ? "rgba(0,0,0,0.2)"
                        : "rgba(0,0,0,0)",
                    textShadowOffset: { width: -0.5, height: 0.5 },
                    textShadowRadius: 0.5,
                  },
                ]}
              >
                {props.user?.name}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 10,
                color:
                  props.fileFormat === "video"
                    ? "#f7f7f7"
                    : props.currentTheme.font,
                textShadowColor:
                  props.fileFormat === "video"
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(0,0,0,0)",
                textShadowOffset: { width: -0.5, height: 0.5 },
                textShadowRadius: 0.5,
              }}
            >
              ✦
            </Text>
            <Fontisto
              name="earth"
              size={9}
              color={
                props.fileFormat === "video"
                  ? "#f7f7f7"
                  : props.currentTheme.font
              }
              style={{
                marginLeft: 0,
                textShadowColor:
                  props.fileFormat === "video"
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(0,0,0,0)",
                textShadowOffset: { width: -0.5, height: 0.5 },
                textShadowRadius: 0.5,
              }}
            />
            <Text
              style={[
                styles.bottomText,
                {
                  fontSize: 12,
                  position: "relative",
                  marginTop: 1,
                  right: 4,
                  color:
                    props.fileFormat === "video"
                      ? "#f7f7f7"
                      : props.currentTheme.font,
                  textShadowColor:
                    props.fileFormat === "video"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(0,0,0,0)",
                  textShadowOffset: { width: -0.5, height: 0.5 },
                  textShadowRadius: 0.5,
                },
              ]}
            >
              {definedTime}
            </Text>
            <Text
              style={{
                position: "relative",
                right: 5,
                fontSize: 10,
                color:
                  props.fileFormat === "video"
                    ? "#f7f7f7"
                    : props.currentTheme.font,
                textShadowColor:
                  props.fileFormat === "video"
                    ? "rgba(0,0,0,0.2)"
                    : props.currentTheme.shadow,
                textShadowOffset: { width: -0.5, height: 0.5 },
                textShadowRadius: 0.5,
              }}
            >
              ✦
            </Text>
            {(route.name === "Feeds" || route.name === "SavedItems") &&
            currentUser._id !== props.user._id ? (
              <Pressable
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 10,
                  paddingRight: 5,
                  zIndex: 1000,
                }}
                onPress={
                  props.user._id === currentUser._id && route.name !== "Feeds"
                    ? props?.DotsFunction
                    : () => {
                        setOpenReports(!openReports);
                        dispatch(setBlur(true));
                      }
                }
              >
                <Entypo
                  name="dots-three-horizontal"
                  size={18}
                  color={props.currentTheme.font}
                />
              </Pressable>
            ) : route.name !== "Feeds" && route.name !== "SavedItems" ? (
              <Pressable
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 10,
                  paddingRight: 5,
                  zIndex: 1000,
                }}
                onPress={
                  props.user._id === currentUser._id && route.name !== "Feeds"
                    ? () => {
                        props?.DotsFunction();
                        dispatch(setBlur(true));
                      }
                    : () => {
                        dispatch(setBlur(true));
                        setOpenReports(!openReports);
                      }
                }
              >
                <Entypo
                  name="dots-three-horizontal"
                  size={18}
                  color={props.currentTheme.font}
                />
              </Pressable>
            ) : undefined}
          </View>

          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Text
              style={[
                styles.bottomText,
                {
                  fontSize: 12,
                  letterSpacing: 0.2,
                  color:
                    props.fileFormat === "video"
                      ? "#e5e5e5"
                      : props.currentTheme.font,
                  textShadowColor:
                    props.fileFormat === "video"
                      ? "rgba(0,0,0,0.2)"
                      : props.currentTheme.shadow,
                  textShadowOffset: { width: -0.5, height: 0.5 },
                  textShadowRadius: 0.5,
                },
              ]}
            >
              {props.user?.username ? props.user.username : type}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Reports
          contentOwner={props.user?._id}
          contentId={props.user?.feed?._id}
          isVisible={openReports}
          onClose={() => {
            dispatch(setBlur(false));
            setOpenReports(false);
          }}
          Press={() => {
            setOpenReports(false);
            dispatch(setBlur(false));
            dispatch(setSendReport(true));
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    width: 47,
    height: 47,
    borderRadius: 50,
    overflow: "hidden",
    zIndex: 100,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  type: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
