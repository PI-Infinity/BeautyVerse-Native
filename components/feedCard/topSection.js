import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { CacheableImage } from "../../components/cacheableImage";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import GetTimesAgo from "../../functions/getTimesAgo";
import { useSelector, useDispatch } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { Reports } from "../../components/feedCard/reports";
import { setSendReport } from "../../redux/alerts";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const TopSection = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const route = useRoute();

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const t = capitalizeFirstLetter(props?.user.type);

  let type;
  if (props.user.type === "specialist") {
    if (props?.lang === "en") {
      type = t;
    } else if (props?.lang === "ka") {
      type = "სპეციალისტი";
    } else {
      type = props.language?.language?.Main?.feedCard?.specialist;
    }
  } else {
    type = props.language?.language?.Auth?.auth?.beautySalon;
  }

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
        <View style={[styles.coverContainer, { borderColor: "#ccc" }]}>
          {props.user?.cover?.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={
                !props.notifications
                  ? () =>
                      navigation.navigate(
                        route.name === "Feeds" ? "User" : "UserVisit",
                        {
                          user: props.user,
                        }
                      )
                  : undefined
              }
              style={{
                width: 42,
                height: 42,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
              }}
            >
              <CacheableImage
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
                !props.notifications
                  ? () =>
                      navigation.navigate(
                        route.name === "Feeds" ? "User" : "UserVisit",
                        {
                          user: props.user,
                        }
                      )
                  : undefined
              }
            >
              <FontAwesome name="user" size={24} color="#e5e5e5" />
            </Pressable>
          )}
        </View>
        <View
          style={{
            gap: 2.5,
            width: SCREEN_WIDTH - 90,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              flexDirection: "row",
              gap: 7.5,
              alignItems: "center",
              // marginBottom: 2,
            }}
            onPress={
              !props.notifications
                ? () =>
                    navigation.navigate(
                      route.name === "Feeds" ? "User" : "UserVisit",
                      {
                        user: props.user,
                      }
                    )
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

            <Pressable
              style={{
                position: "absolute",
                right: 0,
                padding: 10,
                paddingRight: 5,
                zIndex: 1000,
              }}
              onPress={
                route.name === "UserScrollGallery" || route.name === "UserFeed"
                  ? props?.DotsFunction
                  : () => setOpenReports(!openReports)
              }
            >
              <Entypo
                name="dots-three-horizontal"
                size={18}
                color={props.currentTheme.font}
              />
            </Pressable>
          </TouchableOpacity>

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
          onClose={() => setOpenReports(false)}
          Press={() => {
            setOpenReports(false);
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
    borderWidth: 1,
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
