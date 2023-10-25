import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
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
import feed, { setFeedPost, setVideoVolume } from "../../redux/feed";
import { setBlur, setLoading } from "../../redux/app";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { sendNotification } from "../../components/pushNotifications";
import { Circle } from "../skeltons";
import GestureTester from "./GestureTester";
import { setActiveScrollGallery } from "../../redux/fixedComponents";
import { BlurView } from "expo-blur";

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

  // define language state from redux
  const lang = useSelector((state) => state.storeApp.language);

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
  const [userFeeds, setUserFeeds] = useState(props.feed ? [props.feed] : []);

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // define all feeds length
  const [feedsLength, setFeedsLength] = useState(null);
  //Get user feeds
  async function GetUserFeeds() {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/${
          props.feed.owner?._id
        }/feeds?page=${1}&check=${currentUser?._id}&language=${lang}&after=${
          props?.feed?._id
        }&firstFeed=${props?.feed?._id}&limit=3`
      );
      if (response.data.data.feeds?.length > 0) {
        setUserFeeds((prev) => prev?.filter((i) => i._id === props?.feed._id));
        setUserFeeds((prev) => [...prev, ...response.data.data.feeds]);

        setFeedsLength(response.data.result);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    if (props.feed) {
      GetUserFeeds();
    }
  }, [props.feed, cleanUp]);

  // define current user state from redux
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define active feec by index
  const [activeFeed, setActiveFeed] = useState(0);

  // define scrollX ref
  const scrollX = useRef(new Animated.Value(0)).current;

  /**
   * when video displayed the video starts
   *  */
  const [loadVideo, setLoadVideo] = useState(true);
  const [loadImage, setLoadImage] = useState(true);

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
   * user actions: stars, comments, saves
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
        `${backendUrl}/api/v1/feeds/${userFeeds[activeFeed]?._id}/stars`,
        {
          star: {
            staredBy: currentUser?._id,
            createdAt: new Date(),
          },
        }
      );
      if (currentUser?._id !== props.feed.owner?._id) {
        await axios.post(
          `${backendUrl}/api/v1/users/${props.feed.owner?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: "",
            date: new Date(),
            type: "star",
            status: "unread",
            feed: `${userFeeds[activeFeed]?._id}`,
          }
        );
        if (props.feed.owner?.pushNotificationToken) {
          await sendNotification(
            props.feed.owner?.pushNotificationToken,
            currentUser.name,
            "added star on your feed!",
            {
              feed: userFeeds[activeFeed]._id,
            }
          );
        }
        socket.emit("updateUser", {
          targetId: props.feed.owner?._id,
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

      const url = `${backendUrl}/api/v1/feeds/${userFeeds[activeFeed]?._id}/stars/${currentUser?._id}`;
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
   *
   * Main save function
   */
  const SaveFeed = async (userId, itemId) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setUserFeeds((prevFeeds) => {
        let updatedFeeds = [...prevFeeds];

        // Check if the array already contains the user's ID
        const existingUserSave = updatedFeeds[activeFeed].saves.find(
          (save) => save.user === currentUser._id
        );

        if (!existingUserSave) {
          updatedFeeds[activeFeed].saves.push({
            user: currentUser._id,
            savedAt: new Date(),
          });
          updatedFeeds[activeFeed].checkIfSaved = true;
        }

        return updatedFeeds;
      });

      await axios.patch(backendUrl + "/api/v1/feeds/" + itemId + "/save", {
        saveFor: currentUser._id,
      });
      if (currentUser?._id !== props.feed.owner?._id) {
        await axios.post(
          `${backendUrl}/api/v1/users/${props.feed.owner?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: ``,
            date: new Date(),
            type: "save",
            status: "unread",
            feed: `${userFeeds[activeFeed]?._id}`,
          }
        );
        if (props.feed.owner?.pushNotificationToken) {
          await sendNotification(
            props.feed.owner?.pushNotificationToken,
            currentUser.name,
            "saved your feed!",
            {
              feed: userFeeds[activeFeed]._id,
            }
          );
        }
        socket.emit("updateUser", {
          targetId: props.feed.owner?._id,
        });
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const UnSaveFeed = async (userId, itemId) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setUserFeeds((prevFeeds) => {
        let updatedFeeds = [...prevFeeds];

        // Remove the user's ID from the saves array
        const newSaves = updatedFeeds[activeFeed].saves.filter(
          (itm) => itm.user !== currentUser._id
        );

        updatedFeeds[activeFeed].saves = newSaves;
        updatedFeeds[activeFeed].checkIfSaved = false;

        return updatedFeeds;
      });

      await axios.patch(backendUrl + "/api/v1/feeds/" + itemId + "/save", {
        unSaveFor: currentUser._id,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // save functions from scroll gallery

  // define rerenders from redux
  const saveRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.saveFromScrollGallery
  );
  const unsaveRerenderFromScrollGallery = useSelector(
    (state) => state.storeRerenders.unsaveFromScrollGallery
  );

  async function SaveFromScrollGallery() {
    setUserFeeds((prevFeeds) => {
      // Clone the array to prevent direct state mutation
      const updatedFeeds = [...prevFeeds];

      // Find the index of the feed by its _id
      const targetFeedIndex = updatedFeeds.findIndex(
        (feed) => feed._id === activeFeedFromScrollGallery
      );

      // If the feed isn't found, return the original state
      if (targetFeedIndex === -1) return prevFeeds;

      // Check if the array already contains the user's ID
      if (!updatedFeeds[targetFeedIndex].saves.includes(currentUser._id)) {
        updatedFeeds[targetFeedIndex].saves = [
          ...updatedFeeds[targetFeedIndex].saves,
          currentUser._id,
        ];
      }

      // Update the checkIfSaved property
      updatedFeeds[targetFeedIndex] = {
        ...updatedFeeds[targetFeedIndex],
        checkIfSaved: true,
      };

      return updatedFeeds;
    });
  }

  const saveRefFromScrollGallery = useRef(true);
  useEffect(() => {
    if (saveRefFromScrollGallery.current) {
      saveRefFromScrollGallery.current = false;
      return;
    }
    SaveFromScrollGallery();
  }, [saveRerenderFromScrollGallery]);

  //////////////////

  const UnsaveFromScrollGallery = () => {
    setUserFeeds((prevFeeds) => {
      // Clone the prevFeeds to ensure no direct mutations
      const updatedFeeds = [...prevFeeds];

      // Find the feed based on its _id
      const targetFeedIndex = updatedFeeds.findIndex(
        (feed) => feed._id === activeFeedFromScrollGallery
      );

      if (targetFeedIndex === -1) return prevFeeds; // If feed not found, return the original state

      // Remove the user's ID from the saves array
      const newSaves = updatedFeeds[targetFeedIndex].saves.filter(
        (id) => id !== currentUser._id
      );

      updatedFeeds[targetFeedIndex] = {
        ...updatedFeeds[targetFeedIndex],
        checkIfSaved: false,
        saves: newSaves,
      };

      return updatedFeeds;
    });
  };

  const unsaveRefFromGallery = useRef(true);
  useEffect(() => {
    if (unsaveRefFromGallery.current) {
      unsaveRefFromGallery.current = false;
      return;
    }
    UnsaveFromScrollGallery();
  }, [unsaveRerenderFromScrollGallery]);

  /**
   * Post
   */

  // open/hide post
  const [numLines, setNumLines] = useState(5);

  // post
  const [post, setPost] = useState(null);

  // define video volume
  const volume = useSelector((state) => state.storeFeed.videoVolume);

  // pause and resume video
  const videoRef = useRef(null);

  /**
   * Define file sizes
   */
  // define file height
  let hght;
  if (props.feed?.video) {
    let originalHeight =
      props.feed.fileWidth >= props.feed.fileHeight
        ? props.feed.fileWidth
        : props.feed.fileHeight;
    let originalWidth =
      props.feed.fileWidth >= props.feed.fileHeight
        ? props.feed.fileHeight
        : props.feed.fileWidth;

    let percented = originalWidth / (SCREEN_WIDTH - 20);

    hght = originalHeight / percented;
  } else if (props.feed?.images[0]) {
    let originalHeight = props.feed.fileHeight;
    let originalWidth = props.feed.fileWidth;

    let percented = originalWidth / (SCREEN_WIDTH - 20);
    hght = originalHeight / percented;
  }

  return (
    <Animated.View
      style={{
        width: SCREEN_WIDTH,
        paddingTop: props.feed?.fileFormat === "img" ? 0 : 10,
        // paddingBottom: props.feed?.fileFormat === "img" ? 0 : 10,
      }}
    >
      {props.feed?.fileFormat === "img" && (
        <View
          style={{
            height: 70,
            paddingHorizontal: 15,
            paddingVertical: 10,
            zIndex: 120,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <TopSection
            notifications={props.from ? true : false}
            user={props.feed.owner}
            currentTheme={currentTheme}
            navigation={navigation}
            lang={lang}
            language={language}
            createdAt={props.feed.createdAt}
            fileFormat={props.feed?.fileFormat}
          />
        </View>
      )}
      {props.feed?.post && props.feed?.fileFormat === "img" && (
        <View style={{ paddingLeft: 10 }}>
          <Post
            currentTheme={currentTheme}
            numLines={numLines}
            setNumLines={setNumLines}
            fileFormat={props.feed?.fileFormat}
            postItem={props.feed?.post}
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
          borderRadius: 20,
          overflow: "hidden",
          paddingTop: 2,
        }}
      >
        {/* <GestureTester /> */}
        {props.feed?.images?.length > 1 && (
          <View
            style={{
              position: "absolute",
              zIndex: 120,
              bottom: 15,
              right: 25,
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
        {props.feed?.fileFormat === "video" && (
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
              user={props.feed.owner}
              currentTheme={currentTheme}
              navigation={navigation}
              lang={lang}
              language={language}
              createdAt={props.feed.createdAt}
              fileFormat={props.feed?.fileFormat}
            />
            <View style={{ marginTop: 10 }}>
              {props.feed?.post && (
                <Post
                  currentTheme={currentTheme}
                  numLines={numLines}
                  setNumLines={setNumLines}
                  fileFormat={props.feed?.fileFormat}
                  postItem={props.feed?.post}
                />
              )}
            </View>
          </View>
        )}
        {props.feed?.fileFormat === "video" ? (
          <>
            {loadVideo && (
              <View
                style={{
                  width: SCREEN_WIDTH - 20,
                  height: "100%",
                  // backgroundColor: currentTheme.disabled,
                  position: "absolute",
                  zIndex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: 20,
                }}
              >
                <Circle borderRadius={20} />
              </View>
            )}
            <BlurView
              intensity={15}
              tint="light"
              style={{ flex: 1, overflow: "hidden", borderRadius: 20 }}
            >
              <CacheableVideo
                videoRef={videoRef}
                key={props.feed.video}
                onPress={() => {
                  dispatch(setBlur(true));
                  props.setActiveGallery({
                    user: props.feed.owner,
                    scrolableFeeds: userFeeds,
                    feedsLength: feedsLength,
                    page: props.page,
                    post: post,
                  });
                }}
                // delayLongPress={80}
                style={{
                  borderRadius: 20,
                  width: SCREEN_WIDTH - 20,
                  height:
                    props.feed.fileHeight > props.feed.fileWidth
                      ? hght
                      : props.feed.fileWidth,
                }}
                source={{
                  uri: props.feed.video,
                }}
                rate={1.0}
                volume={1.0}
                isMuted={volume ? true : false}
                shouldPlay={
                  props.currentIndex === props.x && props.isFocused
                    ? true
                    : false
                }
                isLooping
                resizeMode="contain"
                onLoad={async (response) => {
                  let { status } =
                    await Location.requestForegroundPermissionsAsync();
                  // setTimeout(() => {
                  setLoadVideo(false);
                  // }, 200);
                  setTimeout(() => {
                    if (
                      props.x === props.feedsLength - 1 &&
                      status !== "denied"
                    ) {
                      dispatch(setLoading(false));
                    }
                  }, 1000);
                }}
                from="feedCard"
              />
            </BlurView>
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
            style={{ width: SCREEN_WIDTH - 20, borderRadius: 20 }}
          >
            {props.feed?.images?.map((itm, x) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={x}
                  style={{
                    height:
                      hght > 640 && definedDevice === "mobile"
                        ? 640
                        : hght > 640 && definedDevice !== "mobile"
                        ? 900
                        : hght,
                    maxHeight: definedDevice === "mobile" ? 642 : 900,
                    width: SCREEN_WIDTH - 20,
                    overflow: "hidden",
                  }}
                  // onPress={() => {
                  //   navigation.navigate("ScrollGallery", {
                  //     user: props.feed.owner,
                  //     scrolableFeeds: userFeeds,
                  //     feedsLength: feedsLength,
                  //     page: props.page,
                  //     post: post,
                  //   });
                  //   dispatch(setVideoVolume(true));
                  // }}
                  onPress={() =>
                    // dispatch(
                    //   setActiveScrollGallery({
                    //     user: props.feed.owner,
                    //     scrolableFeeds: userFeeds,
                    //     feedsLength: feedsLength,
                    //     page: props.page,
                    //     post: post,
                    //   })
                    // );

                    {
                      dispatch(setBlur(true));
                      props.setActiveGallery({
                        user: props.feed.owner,
                        scrolableFeeds: userFeeds,
                        feedsLength: feedsLength,
                        page: props.page,
                        post: post,
                      });
                    }
                  }
                >
                  {loadImage && (
                    <View
                      style={{
                        width: SCREEN_WIDTH - 20,
                        height:
                          hght > 640 && definedDevice === "mobile"
                            ? 642
                            : hght > 640 && definedDevice !== "mobile"
                            ? 902
                            : hght + 2,
                        // backgroundColor: currentTheme.disabled,
                        position: "absolute",
                        zIndex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        borderRadius: "20px",
                      }}
                    >
                      <Circle borderRadius={20} />
                    </View>
                  )}
                  <BlurView
                    intensity={15}
                    tint="light"
                    style={{ borderRadius: 20, width: SCREEN_WIDTH - 20 }}
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
                        width: SCREEN_WIDTH - 20,
                        zIndex: 100,
                        resizeMode: hght > 640 ? "cover" : "contain",
                        borderRadius: 20,
                      }}
                      source={{
                        uri: itm.url,
                        cache: "reload",
                      }}
                      onLoad={async () => {
                        // setTimeout(() => {
                        setLoadImage(false);
                        // }, 200);
                        let { status } =
                          await Location.requestForegroundPermissionsAsync();
                        setTimeout(() => {
                          if (
                            props.x + 1 === props.feedsLength - 1 &&
                            status !== "denied"
                          ) {
                            dispatch(setLoading(false));
                          }
                        }, 1000);
                      }}
                    />
                  </BlurView>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {props.feed?.fileFormat === "video" && (
          <Pressable
            onPress={(event) => event.stopPropagation()}
            name="bottom-section"
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              width: SCREEN_WIDTH - 20,
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
                user={props.feed.owner}
                feed={userFeeds[activeFeed]}
                setVideoVolume={setVideoVolume}
                volume={volume}
                reviewsLength={userFeeds[activeFeed]?.reviewsLength}
                checkIfStared={userFeeds[activeFeed]?.checkIfStared}
                checkIfSaved={userFeeds[activeFeed]?.checkIfSaved}
                starsLength={userFeeds[activeFeed]?.starsLength}
                savesLength={userFeeds[activeFeed]?.saves?.length}
                from="FeedCard"
                GetUserFeeds={GetUserFeeds}
                post={post}
                SaveFeed={SaveFeed}
                UnSaveFeed={UnSaveFeed}
              />
            )}
          </Pressable>
        )}
      </View>

      {props.feed?.fileFormat === "img" && (
        <Pressable
          onPress={(event) => event.stopPropagation()}
          name="bottom-section"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: SCREEN_WIDTH,
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
                user={props.feed.owner}
                feed={userFeeds[activeFeed]}
                reviewsLength={userFeeds[activeFeed]?.reviewsLength}
                checkIfStared={userFeeds[activeFeed]?.checkIfStared}
                checkIfSaved={userFeeds[activeFeed]?.checkIfSaved}
                starsLength={userFeeds[activeFeed]?.starsLength}
                savesLength={userFeeds[activeFeed]?.saves?.length}
                GetUserFeeds={GetUserFeeds}
                from="FeedCard"
                post={post}
                SaveFeed={SaveFeed}
                UnSaveFeed={UnSaveFeed}
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
