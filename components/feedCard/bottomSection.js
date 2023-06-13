import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Share,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CacheableImage } from "../../components/cacheableImage";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import GetTimesAgo from "../../functions/getTimesAgo";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  setCleanUp,
  setRerenderUserFeeds,
  setRerenderUserFeed,
} from "../../redux/rerenders";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// share content

export const BottomSection = (props) => {
  const dispatch = useDispatch();
  // share function
  const [shares, setShares] = useState(null);

  useEffect(() => {
    setShares(props?.feed?.shares);
  }, [props?.feed?.shares]);
  const shareAndOpenURL = async (url, userId, itemId, val) => {
    const UpdatePost = async () => {
      try {
        setShares(shares + 1);
        await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/users/${userId}/feeds/${itemId}`,
          {
            shares: val + 1,
          }
        );
        dispatch(setCleanUp());
        dispatch(setRerenderUserFeeds());
        dispatch(setRerenderUserFeed());
        if (props.GetFeedObj) {
          props.GetFeedObj();
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        console.log(`Can't open URL: ${url}`);
        return;
      }

      const result = await Share.share({
        title: "Open My App",
        message: `Check this out: ${url}`,
        url,
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

      // await Linking.openURL(url);
    } catch (err) {
      console.error("An error occurred", err);
    }
  };
  // define times ago
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
  // / Set the angle in degrees
  const angle = 45;

  // Calculate the start and end points for the gradient based on the angle
  const startPoint = {
    x: Math.cos((angle - 90) * (Math.PI / 180)),
    y: Math.sin((angle - 90) * (Math.PI / 180)),
  };
  const endPoint = {
    x: Math.cos((angle + 90) * (Math.PI / 180)),
    y: Math.sin((angle + 90) * (Math.PI / 180)),
  };

  return (
    <View style={styles.bottomSection}>
      <LinearGradient
        colors={[
          "rgba(248, 102, 177, 0.9)",
          "rgba(248, 102, 177, 0.8)",
          "rgba(248, 102, 177, 0.7)",
          "rgba(248, 102, 177, 0.6)",
          "rgba(248, 102, 177, 0.5)",
          "rgba(248, 102, 177, 0.4)",
          "rgba(248, 102, 177, 0.3)",
          "rgba(248, 102, 177, 0.2)",
          "rgba(248, 102, 177, 0.1)",
          "rgba(248, 102, 177, 0.02)",
          "rgba(248, 102, 177, 0)",
        ]}
        style={styles.gradient}
        start={[0.0, 0.0]}
        end={[1.0, 1.0]}
      >
        <View style={styles.stars}>
          <View
            style={{ alignItems: "center", flexDirection: "row", width: 40 }}
          >
            <Pressable
              style={{
                borderRadius: 50,
                padding: 5,
                // backgroundColor: props.currentTheme.background2,
              }}
              onPress={
                props?.checkIfStared
                  ? () => props.RemoveStar()
                  : () => props.SetStar()
              }
            >
              <FontAwesome
                name="star-o"
                size={22}
                color={props?.checkIfStared ? "yellow" : "#ddd"}
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.2)",
                  textShadowOffset: { width: -0.5, height: 0.5 },
                  textShadowRadius: 0.5,
                }}
              />
            </Pressable>
            <Text
              style={[
                styles.starsQnt,
                {
                  color: "#f7f7f7",
                },
              ]}
            >
              {props.starsLength}
            </Text>
          </View>

          <Pressable
            onPress={
              !props.from && !props.notifications
                ? () => {
                    props.navigation.navigate("ScrollGallery", {
                      user: props.user,
                      scrolableFeeds: props.feedObj,
                      feedsLength: props.feeds?.length,
                      page: props.page,
                    });
                  }
                : props.notifications
                ? () => undefined
                : () => props.setOpenReviews(!props.openReviews)
            }
            style={{
              // flex: 1,
              alignItems: "center",
              flexDirection: "row",
              marginBottom: 2,
            }}
          >
            <FontAwesome
              name="comment"
              size={18}
              // color={props.currentTheme.font}
              style={{
                marginLeft: 10,
                marginRight: 5,
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
              {props?.reviewsLength}
            </Text>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Pressable
              style={{
                height: 35,
                marginLeft: 11,
                justifyContent: "center",
                position: "relative",
              }}
              onPress={() =>
                shareAndOpenURL(
                  "https://expo.dev/@beautyverse/beautyverse-app?serviceType=classic&distribution=expo-go",
                  props.user._id,
                  props.feed._id,
                  shares ? shares : 0
                )
              }
            >
              <Fontisto
                name="share-a"
                size={17}
                color="#f7f7f7"
                style={{ marginTop: 1 }}
              />
            </Pressable>
            <Text
              style={[
                styles.bottomText,
                {
                  color: "#f7f7f7",
                },
              ]}
            >
              {shares}
            </Text>
          </View>
        </View>
        {props.feed?.fileFormat === "video" && (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              flex: 1,
              marginRight: 5,
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
      </LinearGradient>
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
    // paddingHorizontal: 10,
    zIndex: 120,
  },
  stars: {
    // backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-evenly",
    // width: 150,
  },
  starsQnt: {
    color: "#fff",
    fontSize: 12,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -0.5, height: 0.5 },
    textShadowRadius: 0.5,
  },
  bottomText: {
    color: "#fff",
    fontSize: 12,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -0.5, height: 0.5 },
    textShadowRadius: 0.5,
  },
  gradient: {
    flex: 1,
    borderRadius: 50,
    height: 35,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    zIndex: 120,
  },
});
