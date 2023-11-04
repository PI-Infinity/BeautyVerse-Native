import { FontAwesome, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  Linking,
} from "react-native";
import GetTimesAgo from "../../../functions/getTimesAgo";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setCleanUp,
  setRerenderUserFeed,
  setRerenderUserFeeds,
} from "../../../redux/rerenders";
import { sendNotification } from "../../../components/pushNotifications";
import { useSocket } from "../../../context/socketContext";
import { Circle } from "../../../components/skeltons";

/**
 * Feed card's bottom section
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const BottomSection = (props) => {
  // share function
  const [shares, setShares] = useState(null);

  // loading state
  const [loading, setLoading] = useState(true);

  // views
  const [views, setViews] = useState(null);

  // define active theme
  const theme = useSelector((state) => state.storeApp.theme);

  // define socket server
  const socket = useSocket();

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define shares total
  useEffect(() => {
    setShares(props?.feed?.shares);
    setViews(props?.feed?.views);
  }, [props?.feed?.shares, props?.feed?.views]);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // Include other imports you need

  const shareAndOpenURL = async (url, userId, itemId, val) => {
    const UpdatePost = async () => {
      setShares(shares + 1);
      try {
        await axios.patch(`${backendUrl}/api/v1/feeds/${itemId}`, {
          shares: val + 1,
        });
        dispatch(setRerenderUserFeeds());
        dispatch(setRerenderUserFeed());
        if (props.GetUserFeeds) {
          props.GetUserFeeds();
        }

        if (props.user._id !== currentUser._id) {
          await axios.post(
            `${backendUrl}/api/v1/users/${userId}/notifications`,
            {
              senderId: currentUser?._id,
              text: ``,
              date: new Date(),
              type: "share",
              status: "unread",
              feed: `${props.feed._id}`,
            }
          );
          socket.emit("updateUser", {
            targetId: props.user?._id,
          });
          if (props.user?.pushNotificationToken) {
            await sendNotification(
              props.user?.pushNotificationToken,
              currentUser.name,
              "shared your feed!",
              { feed: props.feed._id }
            );
          }
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    try {
      const result = await Share.share({
        message: `Check out this feed! BeautyVerse\n${
          url + "?api/v1/users/" + props.user._id + "/feeds/" + itemId
        }`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log(`Shared with activity type of ${result.activityType}`);
          UpdatePost();
        } else {
          // shared
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("Share was dismissed");
      }
    } catch (err) {
      console.error("An error occurred", err);
    }
  };

  /**
   * Define times ago
   */
  const currentPostTime = GetTimesAgo(
    new Date(props.feed?.createdAt).getTime()
  );

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

  useEffect(() => {
    setLoading(false);
  }, [props?.starsLength]);

  return (
    <View style={[styles.bottomSection, { flex: 1 }]}>
      {loading ? (
        <View
          style={{
            width: "100%",
            height: 25,
            overflow: "hidden",
            borderRadius: 50,
            opacity: 0.2,
          }}
        >
          <Circle />
        </View>
      ) : (
        <View
          style={[
            styles.gradient,
            {
              borderWidth: 1,
              borderColor: props.currentTheme.line,
              flex: 1,
              height: "100%",
            },
          ]}
        >
          <View style={styles.stars}>
            <Pressable
              onPress={
                props?.checkIfStared
                  ? () => props.RemoveStar()
                  : () => props.SetStar()
              }
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                flex: 1,
                height: "100%",
                borderRightWidth: 1,
                borderRightColor: props.currentTheme.line,
                gap: 5,
              }}
            >
              <View>
                <FontAwesome
                  name="star-o"
                  size={22}
                  color={
                    props?.checkIfStared
                      ? props.currentTheme.pink
                      : props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font
                  }
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.2)",
                    textShadowOffset: !theme
                      ? { width: 0, height: 0 }
                      : { width: -0.5, height: 0.5 },
                    textShadowRadius: 0.5,
                  }}
                />
              </View>

              {/* <Text
              style={[
                styles.starsQnt,
                {
                  color: props?.checkIfStared
                    ? props.currentTheme.pink
                    : !props?.checkIfStared &&
                      props.feed?.fileFormat === "video"
                    ? "rgba(255,255,255,0.8)"
                    : props.currentTheme.font,
                },
              ]}
            >
              Star
            </Text> */}

              <Text
                style={[
                  styles.starsQnt,

                  {
                    width: 25,
                    color: props?.checkIfStared
                      ? props.currentTheme.pink
                      : !props?.checkIfStared &&
                        props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font,
                  },
                ]}
              >
                (
                {props?.starsLength < 1000
                  ? props?.starsLength
                  : props?.starsLength > 1000 && props?.starsLength < 1000000
                  ? parseInt(props?.starsLength / 1000) + "K+"
                  : parseInt(props?.starsLength / 1000000) + "M+"}
                )
              </Text>
            </Pressable>

            <Pressable
              onPress={
                props.from === "FeedCard" &&
                !props.notifications &&
                props.from !== "scrollGallery"
                  ? () => {
                      props.navigation.navigate("UserFeed", {
                        user: props.user,
                        feed: props.feed,
                        from: "comment",
                      });
                    }
                  : props.from === "scrollGallery"
                  ? () => props.setOpenReviews(!props.openReviews)
                  : undefined
              }
              style={{
                flex: 1,
                height: "100%",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderRightWidth: 1,
                borderRightColor: props.currentTheme.line,
                gap: 5,
              }}
            >
              <FontAwesome
                name="comment"
                size={18}
                style={{
                  color:
                    props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font,
                  textShadowColor:
                    props.user?.feed?.fileFormat === "video"
                      ? "rgba(0,0,0,0.2)"
                      : props.currentTheme.shadow,
                  textShadowOffset: !theme
                    ? { width: 0, height: 0 }
                    : { width: -0.5, height: 0.5 },
                  textShadowRadius: 0.5,
                }}
              />
              {/* <Text
              style={[
                styles.bottomText,
                {
                  color:
                    props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font,
                },
              ]}
            >
              Comment
            </Text> */}
              <Text
                style={[
                  styles.bottomText,
                  {
                    color:
                      props.feed?.fileFormat === "video"
                        ? "rgba(255,255,255,0.8)"
                        : props.currentTheme.font,
                  },
                ]}
              >
                (
                {props?.reviewsLength < 1000
                  ? props?.reviewsLength
                  : props?.reviewsLength > 1000 &&
                    props?.reviewsLength < 1000000
                  ? parseInt(props?.reviewsLength / 1000) + "K+"
                  : parseInt(props?.reviewsLength / 1000000) + "M+"}
                )
              </Text>
            </Pressable>
            <Pressable
              onPress={() =>
                shareAndOpenURL(
                  "https://beautyverse.international/redirect",
                  props.user._id,
                  props.feed._id,
                  shares ? shares : 0
                )
              }
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: props.currentTheme.line,
              }}
            >
              <View
                style={{
                  height: 35,

                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Fontisto
                  name="share-a"
                  size={17}
                  color={
                    props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font
                  }
                  style={{
                    // marginTop: 1,
                    textShadowColor:
                      props.user?.feed?.fileFormat === "video"
                        ? "rgba(0,0,0,0.2)"
                        : props.currentTheme.shadow,
                    textShadowOffset: !theme
                      ? { width: 0, height: 0 }
                      : { width: -0.5, height: 0.5 },
                    textShadowRadius: 0.5,
                  }}
                />
              </View>

              <Text
                style={[
                  styles.bottomText,
                  {
                    color:
                      props.feed?.fileFormat === "video"
                        ? "rgba(255,255,255,0.8)"
                        : props.currentTheme.font,
                    textShadowColor:
                      props.user?.feed?.fileFormat === "video"
                        ? "rgba(0,0,0,0.2)"
                        : props.currentTheme.shadow,
                    textShadowOffset: !theme
                      ? { width: 0, height: 0 }
                      : { width: -0.5, height: 0.5 },
                    textShadowRadius: 0.5,
                  },
                ]}
              >
                (
                {shares < 1000
                  ? shares
                  : shares > 1000 && shares < 1000000
                  ? parseInt(shares / 1000) + "K+"
                  : parseInt(shares / 1000000) + "M+"}
                )
              </Text>
            </Pressable>
            <Pressable
              onPress={
                props.checkIfSaved
                  ? () => props.UnSaveFeed(props.user._id, props.feed._id)
                  : () => props.SaveFeed(props.user._id, props.feed._id)
              }
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: props.currentTheme.line,
              }}
            >
              <View
                style={{
                  height: 35,

                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <MaterialIcons
                  name="save-alt"
                  size={20}
                  color={
                    props.checkIfSaved
                      ? props.currentTheme.pink
                      : !props.checkIfSaved &&
                        props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font
                  }
                  style={{
                    textShadowColor:
                      props.user?.feed?.fileFormat === "video"
                        ? "rgba(0,0,0,0.2)"
                        : props.currentTheme.shadow,
                    textShadowOffset: !theme
                      ? { width: 0, height: 0 }
                      : { width: -0.5, height: 0.5 },
                    textShadowRadius: 0.5,
                  }}
                />
              </View>

              <Text
                style={[
                  styles.bottomText,
                  {
                    color: props.checkIfSaved
                      ? props.currentTheme.pink
                      : !props.checkIfSaved &&
                        props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font,
                    textShadowColor:
                      props.user?.feed?.fileFormat === "video"
                        ? "rgba(0,0,0,0.2)"
                        : props.currentTheme.shadow,
                    textShadowOffset: !theme
                      ? { width: 0, height: 0 }
                      : { width: -0.5, height: 0.5 },
                    textShadowRadius: 0.5,
                  },
                ]}
              >
                ({props?.savesLength}
                {/* {props.savesLength < 1000
                  ? parseInt(props.savesLength)
                  : parseInt(props.savesLength) > 1000 &&
                    parseInt(props.savesLength) < 1000000
                  ? parseInt(props.savesLength / 1000) + "K+"
                  : parseInt(props.savesLength / 1000000) + "M+"} */}
                )
              </Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 2,
                flex: 1,
                gap: 5,
              }}
            >
              <View
                style={{
                  height: 35,

                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <FontAwesome
                  name="eye"
                  size={18}
                  color={
                    props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font
                  }
                  style={{
                    marginTop: 1,
                    textShadowColor:
                      props.user?.feed?.fileFormat === "video"
                        ? "rgba(0,0,0,0.2)"
                        : props.currentTheme.shadow,
                    textShadowOffset: !theme
                      ? { width: 0, height: 0 }
                      : { width: -0.5, height: 0.5 },
                    textShadowRadius: 0.5,
                  }}
                />
              </View>
              {/* <Text
              style={[
                styles.bottomText,
                {
                  color:
                    props.feed?.fileFormat === "video"
                      ? "rgba(255,255,255,0.8)"
                      : props.currentTheme.font,
                  textShadowColor:
                    props.user?.feed?.fileFormat === "video"
                      ? "rgba(0,0,0,0.2)"
                      : props.currentTheme.shadow,
                  textShadowOffset: { width: -0.5, height: 0.5 },
                  textShadowRadius: 0.5,
                },
              ]}
            >
              Share
            </Text> */}
              <Text
                style={[
                  styles.bottomText,
                  {
                    color:
                      props.feed?.fileFormat === "video"
                        ? "rgba(255,255,255,0.8)"
                        : props.currentTheme.font,
                    textShadowColor:
                      props.user?.feed?.fileFormat === "video"
                        ? "rgba(0,0,0,0.2)"
                        : props.currentTheme.shadow,
                    textShadowOffset: !theme
                      ? { width: 0, height: 0 }
                      : { width: -0.5, height: 0.5 },
                    textShadowRadius: 0.5,
                  },
                ]}
              >
                (
                {views?.length < 1000
                  ? views?.length
                  : views?.length > 1000 && views?.length < 1000000
                  ? parseInt(views?.length / 1000) + "K+"
                  : parseInt(views?.length / 1000000) + "M+"}
                )
              </Text>
            </Pressable>
          </View>
          {props.feed?.fileFormat === "video" && (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
                position: "absolute",
                right: 15,
                bottom: props?.from === "FeedCard" ? 45 : 70,
              }}
            >
              <Pressable
                onPress={(event) => event.stopPropagation()}
                style={{
                  marginLeft: "auto",
                }}
              >
                <Pressable
                  activeOpacity={0.3}
                  onPress={() => dispatch(props.setVideoVolume(!props.volume))}
                  style={{ padding: 5, paddingRight: 0 }}
                >
                  <MaterialIcons
                    name={props.volume ? "volume-off" : "volume-up"}
                    size={20}
                    color="#ccc"
                  />
                </Pressable>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSection: {
    width: SCREEN_WIDTH,
    borderRadius: 50,
    height: 35,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 120,
  },
  stars: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  starsQnt: {
    color: "#fff",
    fontSize: 12,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -0.5, height: 0.5 },
    textShadowRadius: 0.5,
    letterSpacing: 0.3,
  },
  bottomText: {
    color: "#fff",
    fontSize: 12,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -0.5, height: 0.5 },
    textShadowRadius: 0.5,
    letterSpacing: 0.3,
  },
  gradient: {
    flex: 1,
    borderRadius: 50,
    height: 35,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 120,
  },
});
