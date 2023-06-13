import { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Language } from "../../context/language";
import { Entypo } from "@expo/vector-icons";
import ZoomableImage from "../../components/zoomableImage";
import { CacheableVideo } from "../../components/cacheableVideo";
import { setVideoVolume } from "../../redux/feed";
import { lightTheme, darkTheme } from "../../context/theme";
import { TopSection } from "../../components/feedCard/topSection";
import { BottomSection } from "../../components/feedCard/bottomSection";
import { Post } from "../../components/feedCard/post";

export const Feed = (props) => {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
    Dimensions.get("window");

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const navigation = props.navigation;
  const language = Language();
  const dispatch = useDispatch();
  const [feedObj, setFeedObj] = useState([]);
  const [page, setPage] = useState(1);

  const [loadVideo, setLoadVideo] = useState(true);

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
      setLoadVideo(true);
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
            feed: `/api/v1/users/${props.user?._id}/feeds/${feedObj[activeFeed]?._id}`,
          }
        );
      }
    } catch (error) {
      console.error(error.response.data.message);
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
      console.log(error.response.data.message);
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
      console.log(error.response.data.message);
    }
  }

  const rerenderUserFeed = useSelector(
    (state) => state.storeRerenders.rerenderUserFeed
  );
  const feedsRef = useRef(true);

  // open post
  const [numLines, setNumLines] = useState(3);

  // define video volume
  const volume = useSelector((state) => state.storeFeed.videoVolume);

  // pause and resume video
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const videoRef = useRef(null);

  const onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.durationMillis) {
      setVideoDuration(playbackStatus.durationMillis);
    }
    if (playbackStatus.positionMillis) {
      setCurrentPosition(playbackStatus.positionMillis);
    }
  };
  // change video time with slider

  const onSliderValueChange = async (value) => {
    if (videoRef.current && !isNaN(value) && value >= 0) {
      try {
        await videoRef.current.setPositionAsync(value);
      } catch (error) {
        console.error("Error setting video position:", error);
      }
    }
  };

  // define file height
  let hght;
  if (props.user.feed?.video) {
    let originalHeight =
      props.user.feed.fileWidth >= props.user.feed.fileHeight
        ? props.user.feed.fileWidth
        : props.user.feed.fileHeight;
    let originalWidth =
      props.user.feed.fileWidth >= props.user.feed.fileHeight
        ? props.user.feed.fileHeight
        : props.user.feed.fileWidth;

    let wdth = SCREEN_WIDTH;

    let percented = originalWidth / SCREEN_WIDTH;

    hght = originalHeight / percented;
  } else if (props.user.feed?.images[0]) {
    let originalHeight = props.user.feed.fileHeight;
    let originalWidth = props.user.feed.fileWidth;

    let wdth = SCREEN_WIDTH;

    let percented = originalWidth / SCREEN_WIDTH;
    hght = originalHeight / percented;
  }

  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  useEffect(() => {
    if (hght) {
      GetFeedObj(page);
    }
  }, [cleanUp]);

  return (
    <Animated.View
      style={{
        width: SCREEN_WIDTH,
        backgroundColor: currentTheme.background,
      }}
    >
      {props.user.feed?.fileFormat === "img" && (
        <View
          style={{
            height: 70,
            paddingHorizontal: 15,
            paddingVertical: 10,
            zIndex: 120,
            backgroundColor: currentTheme.background,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <TopSection
            notifications={props.from ? true : false}
            user={props.user}
            currentTheme={currentTheme}
            navigation={navigation}
            lang={lang}
            language={language}
            createdAt={props.user.feed.createdAt}
            fileFormat={props.user.feed?.fileFormat}
          />
        </View>
      )}
      {props.user?.feed?.post && props.user.feed?.fileFormat === "img" && (
        <View style={{ paddingLeft: 10 }}>
          <Post
            currentTheme={currentTheme}
            numLines={numLines}
            setNumLines={setNumLines}
            fileFormat={props.user?.feed?.fileFormat}
            text={props.user?.feed.post}
          />
        </View>
      )}
      <View
        name="main-section"
        style={{
          height: hght > 640 ? 640 : hght,
          maxHeight: 640,
          overflow: "hidden",
          justifyContent: "center",
          width: SCREEN_WIDTH,
          // backgroundColor: currentTheme.background2,
        }}
      >
        {props.user.feed?.images?.length > 1 && (
          <View
            style={{
              position: "absolute",
              zIndex: 120,
              bottom: 15,
              right: 15,
              // backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: 50,
            }}
          >
            <Entypo
              name="images"
              color="#fff"
              size={18}
              style={{
                textShadowColor: "rgba(0,0,0,0.2)",

                textShadowOffset: { width: -0.5, height: 0.5 },
                textShadowRadius: 0.5,
              }}
            />
          </View>
        )}
        {props.user.feed?.fileFormat === "video" && (
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              position: "absolute",
              top: 0,
              zIndex: 120,
            }}
          >
            <TopSection
              notifications={props.from ? true : false}
              user={props.user}
              currentTheme={currentTheme}
              navigation={navigation}
              lang={lang}
              language={language}
              createdAt={props.user.feed.createdAt}
              fileFormat={props.user.feed?.fileFormat}
            />
            <View style={{ marginTop: 10 }}>
              {props.user?.feed?.post && (
                <Post
                  currentTheme={currentTheme}
                  numLines={numLines}
                  setNumLines={setNumLines}
                  text={props.user?.feed?.post}
                  fileFormat={props.user.feed?.fileFormat}
                />
              )}
            </View>
          </View>
        )}
        {props.user.feed?.fileFormat === "video" ? (
          <>
            {loadVideo && (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: currentTheme.background2,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator color={currentTheme.pink} size="large" />
              </View>
            )}
            <CacheableVideo
              videoRef={videoRef}
              onLongPress={
                props.from !== "notifications"
                  ? () => {
                      navigation.navigate("ScrollGallery", {
                        user: props.user,
                        scrolableFeeds: feedObj,
                        feedsLength: props.feeds?.length,
                        page: props.page,
                      });
                    }
                  : undefined
              }
              delayLongPress={80}
              style={{
                height:
                  props.user.feed.fileHeight > props.user.feed.fileWidth
                    ? hght
                    : props.user.feed.fileWidth,
              }}
              source={{
                uri: props.user.feed.video,
              }}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              rate={1.0}
              volume={1.0}
              isMuted={volume ? true : false}
              shouldPlay={
                props.currentIndex === props.x && props.isFocused ? true : false
              }
              isLooping
              resizeMode="contain"
              onLoad={(response) => {
                setLoadVideo(false);
                setTimeout(() => {
                  if (props.setLoading) {
                    props.setLoading(false);
                  }
                }, 1000);
              }}
              from="feedCard"
            />
          </>
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            bounces={Platform.OS === "ios" ? false : undefined}
            overScrollMode={Platform.OS === "ios" ? "never" : "always"}
            // style={{ backgroundColor: "red" }}
            contentContainerStyle={{
              height: hght > 640 ? 640 : hght,
              maxHeight: 640,
              width: SCREEN_WIDTH * (props.user.feed?.images?.length || 1),
            }}
          >
            {props.user.feed?.images?.map((itm, x) => {
              return (
                <Pressable
                  key={x}
                  onLongPress={
                    props.from !== "notifications"
                      ? () => {
                          navigation.navigate("ScrollGallery", {
                            user: props.user,
                            scrolableFeeds: feedObj,
                            feedsLength: props.feeds?.length,
                            page: props.page,
                          });
                          dispatch(setVideoVolume(true));
                        }
                      : undefined
                  }
                  delayLongPress={80}
                >
                  <ZoomableImage
                    style={{
                      height: hght > 642 ? 642 : hght + 2,
                      maxHeight: 642,
                      width: SCREEN_WIDTH,
                      zIndex: 100,
                      resizeMode: hght > 642 ? "cover" : "contain",
                    }}
                    source={{
                      uri: itm.url,
                    }}
                    onLoad={() =>
                      setTimeout(() => {
                        GetFeedObj(page);
                        if (props.setLoading) {
                          props.setLoading(false);
                        }
                      }, 1000)
                    }
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {props.user.feed?.fileFormat === "video" && (
          <Pressable
            onPress={(event) => event.stopPropagation()}
            name="bottom-section"
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              width: SCREEN_WIDTH,
              justifyContent: "center",
              position: "absolute",
              bottom: 0,
              // backgroundColor: "red",
            }}
          >
            {props.from !== "notifications" && (
              <BottomSection
                notifications={props.from ? true : false}
                navigation={props.navigation}
                language={language}
                currentTheme={currentTheme}
                RemoveStar={RemoveStar}
                SetStar={SetStar}
                feedObj={feedObj}
                activeFeed={activeFeed}
                user={props.user}
                feed={feedObj[activeFeed]}
                setVideoVolume={setVideoVolume}
                volume={volume}
                reviewsLength={feedObj[activeFeed]?.reviewsLength}
                checkIfStared={feedObj[activeFeed]?.checkIfStared}
                starsLength={feedObj[activeFeed]?.starsLength}
                GetFeedObj={GetFeedObj}
              />
            )}
          </Pressable>
        )}
      </View>
      {props.user.feed?.fileFormat === "img" && (
        <Pressable
          onPress={(event) => event.stopPropagation()}
          name="bottom-section"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: SCREEN_WIDTH,
            backgroundColor: currentTheme.background,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 50,
            }}
          >
            {props.from !== "notifications" && (
              <BottomSection
                notifications={props.from ? true : false}
                navigation={props.navigation}
                language={language}
                currentTheme={currentTheme}
                RemoveStar={RemoveStar}
                SetStar={SetStar}
                feedObj={feedObj}
                activeFeed={activeFeed}
                user={props.user}
                feed={feedObj[activeFeed]}
                reviewsLength={feedObj[activeFeed]?.reviewsLength}
                checkIfStared={feedObj[activeFeed]?.checkIfStared}
                starsLength={feedObj[activeFeed]?.starsLength}
                GetFeedObj={GetFeedObj}
              />
            )}
          </View>
        </Pressable>
      )}

      <View
        style={{
          height: 5,
          backgroundColor: currentTheme.divider,
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "green", overflow: "hidden" },
  topSection: {
    // flexDirection: "colum",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
    height: 70,
    // backgroundColor: "#222",
    zIndex: 100,
  },

  info: {
    // gap: 5,
    // flexDirection: "row",
    width: "100%",
    // justifyContent: "center",
    // alignItems: "center",
    // height: "100%",
  },
  duration: {
    fontSize: 12,
  },
});
