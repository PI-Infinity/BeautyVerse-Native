import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Skeleton } from "@rneui/themed";
import GetTimesAgo from "../functions/getTimesAgo";
import { Language } from "../context/language";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AnimatedSkeleton from "../components/animatedSkelton";
import { CacheableImage } from "../components/cacheableImage";
import ZoomableImage from "../components/zoomableImage";
import { Video, ResizeMode } from "expo-av";
import { useIsFocused } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feed = (props) => {
  const navigation = props.navigation;
  const language = Language();
  const dispatch = useDispatch();
  const [feedObj, setFeedObj] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const lang = useSelector((state) => state.storeApp.language);

  const addStarRerender = useSelector(
    (state) => state.storeRerenders.addStarRerender
  );
  const removeStarRerender = useSelector(
    (state) => state.storeRerenders.removeStarRerender
  );
  const addReviewQntRerender = useSelector(
    (state) => state.storeRerenders.addReviewQntRerender
  );
  const removeReviewQntRerender = useSelector(
    (state) => state.storeRerenders.removeReviewQntRerender
  );

  const [activeFeed, setActiveFeed] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const currentIndex = Math.round(value / SCREEN_WIDTH);
      setActiveFeed(currentIndex);
    });

    return () => {
      scrollX.removeListener(listener);
    };
  }, [scrollX]);

  /**
   * add and remove stars from opened feed actions
   */

  async function AddStar(currentPage) {
    setFeedObj((prevFeeds) => {
      const updatedFeeds = [...prevFeeds];
      updatedFeeds[activeFeed] = {
        ...updatedFeeds[activeFeed],
        checkIfStared: true,
        starsLength: updatedFeeds[activeFeed]?.starsLength + 1,
      };
      return updatedFeeds;
    });
  }

  const RemoveStarFromState = () => {
    setFeedObj((prevFeeds) => {
      const updatedFeeds = [...prevFeeds];
      updatedFeeds[activeFeed] = {
        ...updatedFeeds[activeFeed],
        checkIfStared: false,
        starsLength: updatedFeeds[activeFeed].starsLength - 1,
      };
      return updatedFeeds;
    });
  };

  /**
   * add and remove stars from scrollable gallery feed actions
   */

  const activeFeedFromScrollGallery = useSelector(
    (state) => state.storeActions.activeFeedFromScrollGallery
  );
  const addStarRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.addStarRerenderFromScrollGallery
  );
  const removeStarRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.removeStarRerenderFromScrollGallery
  );

  async function AddStarFromScrollGallery() {
    setFeedObj((prev) => {
      return prev.map((item) => {
        if (item._id === activeFeedFromScrollGallery) {
          return {
            ...item,
            checkIfStared: true,
            starsLength: item.starsLength + 1,
          };
        }
        return item;
      });
    });
  }
  const addStarRefFromScrollGallery = useRef(true);
  useEffect(() => {
    if (addStarRefFromScrollGallery.current) {
      addStarRefFromScrollGallery.current = false;
      return;
    }
    AddStarFromScrollGallery();
  }, [addStarRerenderFromScrollGallery]);

  //////////////////

  const RemoveStarFromScrollGallery = () => {
    setFeedObj((prev) => {
      return prev.map((item) => {
        if (item._id === activeFeedFromScrollGallery) {
          return {
            ...item,
            checkIfStared: false,
            starsLength: item.starsLength - 1,
          };
        }
        return item;
      });
    });
  };
  const removeStarRefFromGallery = useRef(true);
  useEffect(() => {
    if (removeStarRefFromGallery.current) {
      removeStarRefFromGallery.current = false;
      return;
    }
    RemoveStarFromScrollGallery();
  }, [removeStarRerenderFromScrollGallery]);

  // set star
  const SetStar = async () => {
    try {
      AddStar();
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props.user?._id}/feeds/${feedObj[activeFeed]?._id}/stars`,
        {
          staredBy: currentUser?._id,
          createdAt: new Date(),
        }
      );
      if (currentUser?._id !== props.user?._id) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${props.user?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: `მიანიჭა ვარსკვლავი თქვენ პოსტს!`,
            date: new Date(),
            type: "star",
            status: "unread",
            feed: `/api/v1/users/${props.user?._id}/feeds/${props.feed?._id}`,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // remove star
  const RemoveStar = async () => {
    try {
      RemoveStarFromState();

      const url = `https://beautyverse.herokuapp.com/api/v1/users/${props.user?._id}/feeds/${feedObj[activeFeed]?._id}/stars/${currentUser?._id}`;
      const response = await fetch(url, { method: "DELETE" })
        .then((response) => response.json())

        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   *  // change reviews quantity from scroll gallery
   */

  const addReviewQntRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.addReviewQntRerenderFromScrollGallery
  );
  const removeReviewQntRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.removeReviewQntRerenderFromScrollGallery
  );

  async function AddReviewFromScrollGallery(currentPage) {
    setFeedObj((prev) => {
      return prev.map((item) => {
        if (item._id === activeFeedFromScrollGallery) {
          return {
            ...item,
            reviewsLength: item.reviewsLength + 1,
          };
        }
        return item;
      });
    });
  }
  const addReviewRefScrollGallery = useRef(true);
  useEffect(() => {
    if (addReviewRefScrollGallery.current) {
      addReviewRefScrollGallery.current = false;
      return;
    }
    AddReviewFromScrollGallery();
  }, [addReviewQntRerenderFromScrollGallery]);

  // remove review

  const RemoveReviewScrollGallery = () => {
    setFeedObj((prev) => {
      return prev.map((item) => {
        if (item._id === activeFeedFromScrollGallery) {
          return {
            ...item,
            reviewsLength: item.reviewsLength - 1,
          };
        }
        return item;
      });
    });
  };
  const RemoveReviewRefFromScrollGallery = useRef(true);
  useEffect(() => {
    if (RemoveReviewRefFromScrollGallery.current) {
      RemoveReviewRefFromScrollGallery.current = false;
      return;
    }
    RemoveReviewScrollGallery();
  }, [removeReviewQntRerenderFromScrollGallery]);

  // define times ago

  const currentPostTime = GetTimesAgo(
    new Date(feedObj[activeFeed]?.createdAt).getTime()
  );

  let definedTime;
  if (currentPostTime?.includes("min")) {
    definedTime =
      currentPostTime?.slice(0, -3) + language?.language.Main.feedCard.min;
  } else if (currentPostTime?.includes("h")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.h;
  } else if (currentPostTime?.includes("d")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.d;
  } else if (currentPostTime?.includes("j")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.justNow;
  } else if (currentPostTime?.includes("w")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.w;
  } else if (currentPostTime?.includes("mo")) {
    definedTime =
      currentPostTime?.slice(0, -2) + language?.language.Main.feedCard.mo;
  } else if (currentPostTime?.includes("y")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.y;
  }

  // image size
  const [imageSize, setImageSize] = useState({
    width: SCREEN_WIDTH,
    height: 0,
  });

  useEffect(() => {
    const loadImageSize = () => {
      Image.getSize(props.user.feed?.mobile, (width, height) => {
        const aspectRatio = width / height;
        const scaledHeight = SCREEN_WIDTH / aspectRatio;
        setImageSize({ width: SCREEN_WIDTH, height: scaledHeight });
      });
    };
    if (props.user.feed?.mobile) {
      loadImageSize();
    }
  }, [props?.user._id, props.user.feed._id]);

  // get feeds
  async function GetFeedObj(currentPage) {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/users/${
          props.user?._id
        }/feeds/native?page=${1}&check=${currentUser?._id}`
      );
      setFeedObj(response.data.data.feeds);
    } catch (error) {
      console.log(error);
    }
  }

  const rerenderUserFeed = useSelector(
    (state) => state.storeRerenders.rerenderUserFeed
  );
  const feedsRef = useRef(true);

  useEffect(() => {
    if (feedsRef.current) {
      feedsRef.current = false;
      return;
    }
    if (props) {
      GetFeedObj(page);
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [imageSize, rerenderUserFeed]);

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const t = capitalizeFirstLetter(props.user.type);

  let type;
  if (lang === "en") {
    type = t;
  } else if (lang === "ka") {
    type = "სპეციალისტი";
  } else {
    type = language?.language?.Main?.feedCard?.specialist;
  }

  // open post
  const [numLines, setNumLines] = useState(3);

  const video = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      video.current?.playAsync();
    } else {
      video.current?.pauseAsync();
    }
  }, [isFocused]);
  return (
    <>
      {loading && (
        <View
          style={{
            gap: 5,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            backgroundColor: "rgba(15, 15, 15, 1)",
            flex: 1,
            padding: 0,
            zIndex: 10000,
            justifyContent: "start",
            gap: 10,
          }}
        >
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <View key={index} style={{ gap: 10, opacity: 0.1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingLeft: 10,
                    height: 60,
                  }}
                >
                  <Skeleton circle width={40} height={40} animation="pulse" />
                  <View style={{ gap: 10 }}>
                    <Skeleton width={120} height={10} animation="pulse" />
                    <Skeleton width={90} height={7} animation="pulse" />
                  </View>
                </View>
                <View>
                  <Skeleton
                    width={SCREEN_WIDTH}
                    height={100}
                    animation="pulse"
                  />
                </View>
                <View style={{ width: SCREEN_WIDTH, alignItems: "center" }}>
                  <Skeleton
                    width={SCREEN_WIDTH - 40}
                    height={10}
                    animation="pulse"
                  />
                </View>
              </View>
            ))}
        </View>
      )}
      <Animated.View
        style={{
          width: SCREEN_WIDTH,
          height: parseInt(imageSize.height) + 105,
          maxHeight: 600,
        }}
      >
        <View style={{ height: 1 }} />

        <View style={styles.topSection}>
          <View>
            <Pressable
              style={styles.coverContainer}
              onPress={() =>
                navigation.navigate("User", {
                  user: props.user,
                })
              }
            >
              {props.user?.cover?.length > 0 ? (
                <CacheableImage
                  style={{ width: 40, height: 40 }}
                  source={{
                    uri: props.user?.cover,
                  }}
                  manipulationOptions={[
                    { resize: { width: 100, height: 100 } },
                    { rotate: 90 },
                  ]}
                />
              ) : (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "gray",
                  }}
                ></View>
              )}
            </Pressable>
          </View>
          <View style={styles.Info}>
            <Pressable
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                marginBottom: 2,
              }}
              onPress={() =>
                navigation.navigate("User", {
                  user: props.user,
                })
              }
            >
              <Text style={styles.name}>{props.user?.name}</Text>
              <MaterialIcons name="verified" size={14} color="#1DA1F2" />
            </Pressable>
            <Text style={styles.type}>
              {props.user?.username ? props.user.username : type}
            </Text>
          </View>
        </View>
        {/* {props.user?.feed?.post && (
          <Pressable
            onPress={
              numLines > 3 ? () => setNumLines(3) : () => setNumLines(15)
            }
            style={{ paddingHorizontal: 15, paddingBottom: 15, paddingTop: 5 }}
          >
            <Text
              multiline
              numberOfLines={numLines}
              style={{
                color: "#e5e5e5",
                letterSpacing: 0.3,
                fontSize: 14,
                lineHeight: 18,
              }}
            >
              {props.user?.feed?.post}
            </Text>
          </Pressable>
        )} */}
        <Pressable
          name="main-section"
          style={{
            height: imageSize.height,
            width: "100%",
            maxHeight: 600,
          }}
          onPress={() => {
            navigation.navigate("ScrollGallery", {
              user: props.user,
              scrolableFeeds: feedObj,
              feedsLength: props.feeds?.length,
              page: props.page,
            });
          }}
        >
          {props.user.feed.fileFormat === "video" ? (
            <Pressable onPress={(event) => event.stopPropagation()}>
              <Video
                ref={video}
                style={{ height: "100%", width: SCREEN_WIDTH }}
                source={{
                  uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                // onPlaybackStatusUpdate={(status) => console.log(status)}
              />
            </Pressable>
          ) : (
            <ZoomableImage
              style={{
                height: imageSize.height,
                width: "100%",
                maxHeight: 600,
                resizeMode: imageSize.height > 600 ? "cover" : "cover",
              }}
              source={{
                uri: props.user.feed?.mobile,
              }}
              manipulationOptions={[
                { resize: { width: "100%", height: imageSize.height } },
                { rotate: 90 },
              ]}
            />
          )}
        </Pressable>

        <View name="bottom-section" style={styles.bottomSection}>
          <View style={styles.stars}>
            <Pressable
              onPress={
                feedObj[activeFeed]?.checkIfStared
                  ? () => RemoveStar()
                  : () => SetStar()
              }
            >
              <Icon
                name="star-o"
                size={24}
                color={feedObj[activeFeed]?.checkIfStared ? "#bb3394" : "#ccc"}
              />
            </Pressable>
            <Text style={styles.starsQnt}>
              {feedObj[activeFeed]?.starsLength}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              navigation.navigate("ScrollGallery", {
                user: props.user,
                scrolableFeeds: feedObj,
                feedsLength: props.feeds?.length,
                page: props.page,
              });
            }}
          >
            <Text style={styles.bottomText}>
              {feedObj[activeFeed]?.reviewsLength}{" "}
              {language?.language?.Main?.feedCard?.reviews}
            </Text>
          </Pressable>
          <View>
            <Text style={styles.bottomText}>{definedTime}</Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "green" },
  topSection: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 15,
    height: 60,
    backgroundColor: "#111",
  },
  coverContainer: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "gray",
    overflow: "hidden",
  },
  info: { gap: 5 },
  name: { fontSize: 14, fontWeight: "bold", color: "#fff", letterSpacing: 0.3 },
  type: { fontSize: 12, color: "#fff", letterSpacing: 0.3 },

  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: "#111",
  },
  stars: { flexDirection: "row", alignItems: "center" },
  starsQnt: { color: "#fff", fontSize: 14, marginLeft: 5 },
  bottomText: { color: "#fff", fontSize: 14 },
});
