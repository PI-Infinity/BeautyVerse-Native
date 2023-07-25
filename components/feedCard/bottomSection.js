import { FontAwesome, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import GetTimesAgo from "../../functions/getTimesAgo";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

/**
 * Feed card's bottom section
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const BottomSection = (props) => {
  // share function
  const [shares, setShares] = useState(null);

  // defines redux dispatch
  const dispatch = useDispatch();

  // define shares total
  useEffect(() => {
    setShares(props?.feed?.shares);
  }, [props?.feed?.shares]);

  // Include other imports you need

  // const shareAndOpenURL = async (url, userId, itemId, val) => {
  //   console.log(url);
  //   const UpdatePost = async () => {
  //     try {
  //       await axios.patch(
  //         `https://beautyverse.herokuapp.com/api/v1/users/${userId}/feeds/${itemId}`,
  //         {
  //           shares: val + 1,
  //         }
  //       );
  //       setShares(shares + 1);
  //       dispatch(setCleanUp());
  //       dispatch(setRerenderUserFeeds());
  //       dispatch(setRerenderUserFeed());
  //       if (props.GetFeedObj) {
  //         props.GetFeedObj();
  //       }
  //     } catch (error) {
  //       console.log(error.response.data.message);
  //     }
  //   };
  //   try {
  //     const canOpen = await Linking.canOpenURL(url);

  //     if (!canOpen) {
  //       console.log(`Can't open URL: ${url}`);
  //       return;
  //     }

  //     const result = await Share.share({
  //       title: "Open My App",
  //       message: `Check this out: ${url}`,
  //       url: url,
  //     });

  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //         console.log(`Shared with activity type of ${result.activityType}`);
  //         UpdatePost();
  //       } else {
  //         // shared
  //         console.log("Shared successfully");
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //       console.log("Share was dismissed");
  //     }
  //   } catch (err) {
  //     console.error("An error occurred", err);
  //   }
  // };

  // share post
  const shareAndOpenURL = async () => {
    try {
      const result = await Share.share({
        message: "Check out my app! beautyverse://",
        url: "beautyverse://",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type of", result.activityType);
        } else {
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share was dismissed");
      }
    } catch (error) {
      console.error("An error occurred", error);
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

  return (
    <View style={[styles.bottomSection, { flex: 1 }]}>
      <View
        style={[
          styles.gradient,
          {
            borderWidth: 1.5,
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
              borderRightWidth: 1.5,
              borderRightColor: props.currentTheme.line,
              gap: 5,
            }}
          >
            <View>
              <FontAwesome
                name="star-o"
                size={22}
                color={props?.checkIfStared ? props.currentTheme.pink : "#fff"}
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.2)",
                  textShadowOffset: { width: -0.5, height: 0.5 },
                  textShadowRadius: 0.5,
                }}
              />
            </View>

            <Text
              style={[
                styles.starsQnt,
                {
                  color: props?.checkIfStared
                    ? props.currentTheme.pink
                    : "#fff",
                },
              ]}
            >
              Star
            </Text>

            <Text
              style={[
                styles.starsQnt,

                {
                  width: 25,
                  color: props?.checkIfStared
                    ? props.currentTheme.pink
                    : "#fff",
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
                    });
                  }
                : props.from === "scrollGallery"
                ? () => props.setOpenReviews(!props.openReviews)
                : undefined
            }
            style={{
              flex: 1.3,
              height: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              borderRightWidth: 1.5,
              borderRightColor: props.currentTheme.line,
              gap: 5,
            }}
          >
            <FontAwesome
              name="comment"
              size={18}
              style={{
                color: "#f7f7f7",
                textShadowColor:
                  props.user?.feed?.fileFormat === "video"
                    ? "rgba(0,0,0,0.2)"
                    : props.currentTheme.shadow,
                textShadowOffset: { width: -0.5, height: 0.5 },
                textShadowRadius: 0.5,
              }}
            />
            <Text
              style={[
                styles.bottomText,
                {
                  color: "#f7f7f7",
                },
              ]}
            >
              Comment
            </Text>
            <Text
              style={[
                styles.bottomText,
                {
                  color:
                    props.feed?.fileFormat === "video"
                      ? "#fff"
                      : props.currentTheme.disabled,
                },
              ]}
            >
              (
              {props?.reviewsLength < 1000
                ? props?.reviewsLength
                : props?.reviewsLength > 1000 && props?.reviewsLength < 1000000
                ? parseInt(props?.reviewsLength / 1000) + "K+"
                : parseInt(props?.reviewsLength / 1000000) + "M+"}
              )
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              shareAndOpenURL(
                "beautyverse://",
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
              <Fontisto
                name="share-a"
                size={17}
                color="#f7f7f7"
                style={{
                  marginTop: 1,
                  textShadowColor:
                    props.user?.feed?.fileFormat === "video"
                      ? "rgba(0,0,0,0.2)"
                      : props.currentTheme.shadow,
                  textShadowOffset: { width: -0.5, height: 0.5 },
                  textShadowRadius: 0.5,
                }}
              />
            </View>
            <Text
              style={[
                styles.bottomText,
                {
                  color: "#fff",
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
            </Text>
            <Text
              style={[
                styles.bottomText,
                {
                  color:
                    props.feed?.fileFormat === "video"
                      ? "#fff"
                      : props.currentTheme.disabled,
                  textShadowColor:
                    props.user?.feed?.fileFormat === "video"
                      ? "rgba(0,0,0,0.2)"
                      : props.currentTheme.shadow,
                  textShadowOffset: { width: -0.5, height: 0.5 },
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
                  color="#e5e5e5"
                />
              </Pressable>
            </Pressable>
          </View>
        )}
      </View>
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
