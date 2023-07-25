import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableVideo } from "../../components/cacheableVideo";
import { BottomSection } from "../../components/feedCard/bottomSection";
import { Post } from "../../components/feedCard/post";
import { TopSection } from "../../components/feedCard/topSection";
import ZoomableImage from "../../components/zoomableImage";
import { Language } from "../../context/language";
import { useSocket } from "../../context/socketContext";
import { darkTheme, lightTheme } from "../../context/theme";
import feed, { setVideoVolume } from "../../redux/feed";

/**
 * Feed Item in feeds screen
 */
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feed = (props) => {
  // define device type tablet or mobile
  let aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  let isTablet = aspectRatio < 1.6;
  let definedDevice;
  if (isTablet) {
    definedDevice = "tablet";
    console.log("ipad"); // The device is a tablet
  } else {
    definedDevice = "mobile";
  }

  // define theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define navigation
  const navigation = props.navigation;

  // define language
  const language = Language();

  // define socket server
  const socket = useSocket();

  // define redux dispatch
  const dispatch = useDispatch();

  // define cleanup state from redux

  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  /**
   * in Feeds object is defined user with 5 feeds.
   * when navigate to user's feeds this state will send there for mapping
   */
  const [userFeeds, setUserFeeds] = useState([]);

  // define all feeds length
  const [feedsLength, setFeedsLength] = useState(null);
  //Get user feeds
  async function GetUserFeeds() {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/users/${
          props.user?._id
        }/feeds/native?page=${1}&check=${currentUser?._id}`
      );
      setUserFeeds(response.data.data.feeds);
      setFeedsLength(response.data.result);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    if (props.user.feed) {
      GetUserFeeds();
    }
  }, [props.user.feed, cleanUp]);

  // define current user state from redux
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // define language state from redux
  const lang = useSelector((state) => state.storeApp.language);

  // define active feec by index
  const [activeFeed, setActiveFeed] = useState(0);

  // define scrollX ref
  const scrollX = useRef(new Animated.Value(0)).current;

  /**
   * when video displayed the video starts
   *  */
  const [loadVideo, setLoadVideo] = useState(true);

  // when scrolling defines active feed and plays video if displayed part of it

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
   * user actions: stars, comments
   */

  // add and remove stars from feed screen useState

  async function AddStar() {
    setUserFeeds((prevFeeds) => {
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
    setUserFeeds((prevFeeds) => {
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
   * add and remove stars from user feeds screen
   */

  // define rerenders from redux
  const activeFeedFromScrollGallery = useSelector(
    (state) => state.storeActions.activeFeedFromScrollGallery
  );
  const addStarRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.addStarRerenderFromScrollGallery
  );
  const removeStarRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.removeStarRerenderFromScrollGallery
  );

  // define functions
  async function AddStarFromScrollGallery() {
    setUserFeeds((prev) => {
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
    setUserFeeds((prev) => {
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

  /*
  
  set star main function 
  */
  const SetStar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      AddStar();
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props.user?._id}/feeds/${userFeeds[activeFeed]?._id}/stars`,
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
            feed: `/api/v1/users/${props.user?._id}/feeds/${userFeeds[activeFeed]?._id}`,
          }
        );
        socket.emit("updateUser", {
          targetId: props.user?._id,
        });
      }
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  /**
   * Remove start main function
   */
  const RemoveStar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      RemoveStarFromState();

      const url = `https://beautyverse.herokuapp.com/api/v1/users/${props.user?._id}/feeds/${userFeeds[activeFeed]?._id}/stars/${currentUser?._id}`;
      await fetch(url, { method: "DELETE" })
        .then((response) => response.json())

        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // change comments quantity from scroll gallery

  const addReviewQntRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.addReviewQntRerenderFromScrollGallery
  );
  const removeReviewQntRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.removeReviewQntRerenderFromScrollGallery
  );

  async function AddReviewFromScrollGallery(currentPage) {
    setUserFeeds((prev) => {
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
    setUserFeeds((prev) => {
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

  /**
   * Post
   */

  // open/hide post
  const [numLines, setNumLines] = useState(3);

  // define video volume
  const volume = useSelector((state) => state.storeFeed.videoVolume);

  // pause and resume video
  const videoRef = useRef(null);

  /**
   * Define file sizes
   */
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

    let percented = originalWidth / SCREEN_WIDTH;

    hght = originalHeight / percented;
  } else if (props.user.feed?.images[0]) {
    let originalHeight = props.user.feed.fileHeight;
    let originalWidth = props.user.feed.fileWidth;

    let percented = originalWidth / SCREEN_WIDTH;
    hght = originalHeight / percented;
  }

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
      {props.user.feed?.post && props.user.feed?.fileFormat === "img" && (
        <View style={{ paddingLeft: 10 }}>
          <Post
            currentTheme={currentTheme}
            numLines={numLines}
            setNumLines={setNumLines}
            fileFormat={props.user.feed?.fileFormat}
            text={props.user.feed.post}
          />
        </View>
      )}
      <View
        name="main-section"
        style={{
          height:
            hght > 640 && definedDevice === "mobile"
              ? 640
              : hght > 640 && definedDevice !== "mobile"
              ? 900
              : hght,
          maxHeight: definedDevice === "mobile" ? 640 : 900,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          width: SCREEN_WIDTH,
        }}
      >
        {props.user.feed?.images?.length > 1 && (
          <View
            style={{
              position: "absolute",
              zIndex: 120,
              bottom: 15,
              right: 15,
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
              position: "absolute",
              top: 0,
              zIndex: 120,
              paddingHorizontal: 15,
              paddingVertical: 10,
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
            <View style={{ marginTop: 10 }}>
              {props.user.feed?.post && (
                <Post
                  currentTheme={currentTheme}
                  numLines={numLines}
                  setNumLines={setNumLines}
                  text={props.user.feed?.post}
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
              onLongPress={() =>
                navigation.navigate("ScrollGallery", {
                  user: props.user,
                  scrolableFeeds: userFeeds,
                  feedsLength: feedsLength,
                  page: props.page,
                })
              }
              delayLongPress={80}
              style={{
                width: SCREEN_WIDTH,
                height:
                  props.user.feed.fileHeight > props.user.feed.fileWidth
                    ? hght
                    : props.user.feed.fileWidth,
              }}
              source={{
                uri: props.user.feed.video,
              }}
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
            contentContainerStyle={{
              overflow: "hidden",
              alignItems: "center",
            }}
          >
            {props.user.feed.images?.map((itm, x) => {
              return (
                <Pressable
                  key={x}
                  style={{
                    height:
                      hght > 640 && definedDevice === "mobile"
                        ? 640
                        : hght > 640 && definedDevice !== "mobile"
                        ? 900
                        : hght,
                    maxHeight: definedDevice === "mobile" ? 642 : 900,
                    width: SCREEN_WIDTH,
                    overflow: "hidden",
                  }}
                  onLongPress={() => {
                    navigation.navigate("ScrollGallery", {
                      user: props.user,
                      scrolableFeeds: userFeeds,
                      feedsLength: feedsLength,
                      page: props.page,
                    });
                    dispatch(setVideoVolume(true));
                  }}
                  delayLongPress={80}
                >
                  <ZoomableImage
                    key={itm.url}
                    style={{
                      height:
                        hght > 640 && definedDevice === "mobile"
                          ? 642
                          : hght > 640 && definedDevice !== "mobile"
                          ? 902
                          : hght + 2,
                      maxHeight: definedDevice === "mobile" ? 642 : 900,
                      width: SCREEN_WIDTH,
                      zIndex: 100,
                      resizeMode: hght > 640 ? "cover" : "contain",
                    }}
                    source={{
                      uri: itm.url,
                      cache: "reload",
                    }}
                    onLoad={() =>
                      setTimeout(() => {
                        if (props.setLoading) {
                          props.setLoading(false);
                        }
                      }, 500)
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
                activeFeed={activeFeed}
                user={props.user}
                feed={userFeeds[activeFeed]}
                setVideoVolume={setVideoVolume}
                volume={volume}
                reviewsLength={userFeeds[activeFeed]?.reviewsLength}
                checkIfStared={userFeeds[activeFeed]?.checkIfStared}
                starsLength={userFeeds[activeFeed]?.starsLength}
                from="FeedCard"
                GetUserFeeds={GetUserFeeds}
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
                activeFeed={activeFeed}
                user={props.user}
                feed={userFeeds[activeFeed]}
                reviewsLength={userFeeds[activeFeed]?.reviewsLength}
                checkIfStared={userFeeds[activeFeed]?.checkIfStared}
                starsLength={userFeeds[activeFeed]?.starsLength}
                GetUserFeeds={GetUserFeeds}
                from="FeedCard"
              />
            )}
          </View>
        </Pressable>
      )}

      <View
        style={{
          height: 1,
          backgroundColor: currentTheme.divider,
        }}
      />
    </Animated.View>
  );
};
