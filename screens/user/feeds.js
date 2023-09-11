import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import { CacheableVideo } from "../../components/cacheableVideo";
import { darkTheme, lightTheme } from "../../context/theme";
import { Circle } from "../../components/skeltons";

/**
 * File includes 2 components (list, item)
 * User feeds component in user screen
 * Bellow Feed Item of feeds
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feeds = ({
  targetUser,
  navigation,
  variant,
  page,
  feedsLength,
  setFeedsLength,
  feeds,
  setFeeds,
}) => {
  // define loading
  const [loading, setLoading] = useState(true);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const lang = useSelector((state) => state.storeApp.language);

  // define rerender user feeds in user screen
  const rerenderUserFeeds = useSelector(
    (state) => state.storeRerenders.rerenderUserFeeds
  );

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // get user feeds
  useEffect(() => {
    async function GetFeeds(userId) {
      setFeeds([]);
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/feeds/${userId}/feeds?page=${1}&limit=8&check=${
            currentUser?._id
          }`
        );

        setFeeds(response.data.data?.feeds);
        setFeedsLength(response.data.result);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    if (targetUser?._id) {
      GetFeeds(targetUser?._id);
    }
  }, [rerenderUserFeeds]);

  const activeFeed = useSelector(
    (state) => state.storeActions.activeFeedFromScrollGallery
  );

  /**
   *  // add star to feeds, when action in scroll gallery of user page
   */

  const addStarRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.addStarRerenderFromScrollGallery
  );
  const addStarRefFromScrollGallery = useRef(true);

  useEffect(() => {
    if (addStarRefFromScrollGallery.current) {
      addStarRefFromScrollGallery.current = false;
      return;
    }
    setFeeds((prev) => {
      return prev.map((item) => {
        if (item._id === activeFeed) {
          return {
            ...item,
            checkIfStared: true,
            starsLength: item.starsLength + 1,
          };
        }
        return item;
      });
    });
  }, [addStarRerenderFromScrollGallery]);

  /**
   *  // remove star from feeds, when action in scroll gallery of user page
   */

  const removeStarRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.removeStarRerenderFromScrollGallery
  );
  const removeStarRefFromScrollGallery = useRef(true);

  useEffect(() => {
    if (removeStarRefFromScrollGallery.current) {
      removeStarRefFromScrollGallery.current = false;
      return;
    }
    setFeeds((prev) => {
      return prev.map((item) => {
        if (item._id === activeFeed) {
          return {
            ...item,
            checkIfStared: false,
            starsLength: item.starsLength - 1,
          };
        }
        return item;
      });
    });
  }, [removeStarRerenderFromScrollGallery]);

  /**
   *  // add review to feeds, when action in scroll gallery of user page
   */

  const addReviewQntRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.addReviewQntRerenderFromScrollGallery
  );
  const addReviewRefScrollGallery = useRef(true);

  useEffect(() => {
    if (addReviewRefScrollGallery.current) {
      addReviewRefScrollGallery.current = false;
      return;
    }
    setFeeds((prev) => {
      return prev.map((item) => {
        if (item._id === activeFeed) {
          return {
            ...item,
            reviewsLength: item.reviewsLength + 1,
          };
        }
        return item;
      });
    });
  }, [addReviewQntRerenderFromScrollGallery]);

  /**
   *  // remove star to feeds, when action in scroll gallery of user page
   */

  const removeReviewQntRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.removeReviewQntRerenderFromScrollGallery
  );
  const RemoveReviewRefFromScrollGallery = useRef(true);

  useEffect(() => {
    if (RemoveReviewRefFromScrollGallery.current) {
      RemoveReviewRefFromScrollGallery.current = false;
      return;
    }
    setFeeds((prev) => {
      return prev.map((item) => {
        if (item._id === activeFeed) {
          return {
            ...item,
            reviewsLength: item.reviewsLength + 1,
          };
        }
        return item;
      });
    });
  }, [removeReviewQntRerenderFromScrollGallery]);

  return (
    <View style={styles.list}>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: SCREEN_HEIGHT - SCREEN_HEIGHT / 3,
          }}
        >
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      ) : (
        <>
          <View
            style={{
              padding: 0,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 1,
              // marginTop: 5,
            }}
          >
            {feeds?.length > 0 ? (
              feeds?.map((item, index) => {
                return (
                  <FeedItem
                    navigation={navigation}
                    key={index}
                    x={index}
                    feed={item}
                    targetUser={targetUser}
                    variant={variant}
                    currentTheme={currentTheme}
                  />
                );
              })
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  height: SCREEN_HEIGHT / 1.7,
                }}
              >
                <Text style={{ color: currentTheme.disabled }}>
                  No feeds found
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    width: SCREEN_WIDTH,
    maxWidth: SCREEN_WIDTH,
    flex: 1,
  },
});

/**
 * Feed Item of feeds component
 */

const FeedItem = (props) => {
  const [loadingFeed, setLoadingFeed] = useState(true);
  // fade in
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <>
      <TouchableOpacity
        style={{
          width: SCREEN_WIDTH / 2 - 2,
          height: SCREEN_WIDTH / 2 - 2,
        }}
        activeOpacity={0.9}
        onPress={() => {
          props.navigation.navigate("UserFeed", {
            user: props.targetUser,
            feed: props.feed,
          });
        }}
      >
        {loadingFeed && (
          <View
            style={{
              position: "absolute",
              width: SCREEN_WIDTH / 2 - 2,
              aspectRatio: 1,
              backgroundColor: "rgba(1,1,1,0.1)",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Circle />
          </View>
        )}
        <Animated.View style={{ opacity: fadeAnim }}>
          {props?.feed.fileFormat === "video" ? (
            <CacheableVideo
              type="userGallery"
              style={{
                width: SCREEN_WIDTH / 2 - 2,
                height: SCREEN_WIDTH / 2 - 2,
              }}
              source={{
                uri: props.feed.video,
              }}
              useNativeControls={false}
              rate={1.0}
              volume={0}
              isMuted={false}
              shouldPlay
              isLooping
              resizeMode="cover"
              onLoad={() =>
                setTimeout(() => {
                  setLoadingFeed(false);
                }, 500)
              }
            />
          ) : (
            <CacheableImage
              style={{
                width: SCREEN_WIDTH / 2 - 2,
                height: SCREEN_WIDTH / 2 - 2,
              }}
              source={{
                uri: props?.feed.images[0].url,
              }}
              manipulationOptions={[
                {
                  resize: {
                    width: SCREEN_WIDTH / 2 - 2,
                    height: SCREEN_WIDTH / 2 - 2,
                  },
                },
                { rotate: 90 },
              ]}
              onLoad={() =>
                setTimeout(() => {
                  setLoadingFeed(false);
                }, 500)
              }
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};
