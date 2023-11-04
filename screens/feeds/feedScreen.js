import { Entypo, FontAwesome } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import { CacheableVideo } from "../../components/cacheableVideo";
import { BottomSection } from "./feedCard/bottomSection";
import { Post } from "./feedCard/post";
import { TopSection } from "./feedCard/topSection";
import ZoomableImage from "../../components/zoomableImage";
import { Language } from "../../context/language";
import { useSocket } from "../../context/socketContext";
import { darkTheme, lightTheme } from "../../context/theme";
import GetTimesAgo from "../../functions/getTimesAgo";
import { setActiveFeedFromScrollGallery } from "../../redux/actions";
import { setVideoVolume } from "../../redux/feed";
import {
  setAddReviewQntRerenderFromScrollGallery,
  setAddStarRerenderFromScrollGallery,
  setRemoveReviewQntRerenderFromScrollGallery,
  setRemoveStarRerenderFromScrollGallery,
  setRerenderUserFeed,
  setSaveFromScrollGallery,
  setUnsaveFromScrollGallery,
} from "../../redux/rerenders";
import SmoothModal from "../user/editPostPopup";
import { sendNotification } from "../../components/pushNotifications";
import { Circle } from "../../components/skeltons";
import { BlurView } from "expo-blur";
/**
 * Feed screen uses when navigate to only one feed screen
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const FeedItem = ({ route }) => {
  // define socket server
  const socket = useSocket();

  // define props from route
  const props = route.params;

  // define some hooks
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const language = Language();

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define current user and language
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const lang = useSelector((state) => state.storeApp.language);

  /**
   *  // add stars to feeds
   */
  const [starsLength, setStarsLength] = useState(props?.feed?.starsLength);

  // check if feed is stared by current user
  const [checkIfStared, setCheckifStared] = useState(
    props?.feed?.checkIfStared
  );

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // get post translate

  // set star function
  const SetStar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      setStarsLength((prev) => prev + 1);
      setCheckifStared(true);
      dispatch(setActiveFeedFromScrollGallery(props?.feed?._id));

      await axios.post(`${backendUrl}/api/v1/feeds/${props.feed?._id}/stars`, {
        star: {
          staredBy: currentUser?._id,
          createdAt: new Date(),
        },
      });
      if (currentUser?._id !== props.user?._id) {
        await axios.post(
          backendUrl + `/api/v1/users/${props.user?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: ``,
            date: new Date(),
            type: "star",
            status: "unread",
            feed: `${props.feed?._id}`,
          }
        );
        if (props.user._id !== currentUser._id) {
          if (props.user?.pushNotificationToken) {
            await sendNotification(
              props.user?.pushNotificationToken,
              currentUser.name,
              "added star on your feed!",
              {
                feed: props.feed._id,
              }
            );
          }
        }
        socket.emit("updateUser", {
          targetId: props.user?._id,
        });
      }
      setTimeout(() => {
        dispatch(setAddStarRerenderFromScrollGallery());
        dispatch(setRerenderUserFeed());
      }, 300);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *  // remove stars from feeds
   */
  const RemoveStar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStarsLength((prev) => prev - 1);
    setCheckifStared(false);

    dispatch(setActiveFeedFromScrollGallery(props.feed?._id));
    try {
      const url =
        backendUrl +
        `/api/v1/feeds/${props.feed?._id}/stars/${currentUser?._id}`;
      const response = await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => {
          dispatch(setRemoveStarRerenderFromScrollGallery());
          dispatch(setRerenderUserFeed());
        });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   *  // getReviews
   */
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewLength, setReviewLength] = useState(props?.feed?.reviewsLength);
  const [reviewsPage, setReviewsPage] = useState(1);

  useEffect(() => {
    const GetReviews = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            `/api/v1/feeds/${props?.feed?._id}/reviews?page=${reviewsPage}`
        );
        setReviewsList(response.data.data.reviews);
        setReviewLength(response.data.result);
      } catch (error) {
        console.log("error");
        console.log(error.response.data.message);
      }
    };

    GetReviews();
  }, [props.feed?._id]);

  async function AddNewReviews(nextPage) {
    try {
      const response = await axios.get(
        backendUrl +
          `/api/v1/feeds/${props?.feed?._id}/reviews?page=${nextPage}`
      );
      setReviewsList((prev) => {
        const newReviews = response.data.data?.reviews || [];
        const uniqueReviews = newReviews.filter(
          (newReview) =>
            !prev.some(
              (prevReview) => prevReview.reviewId === newReview.reviewId
            )
        );
        return [...prev, ...uniqueReviews];
      });
      dispatch(setRerenderUserFeed());
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  // reducre reviews on show less
  const ReduceReviews = () => {
    return setReviewsList((prev) => {
      const uniqueReviews = reviewsList.filter(
        (newReview) =>
          !prev.some((prevReview) => prevReview.reviewId === newReview.reviewId)
      );

      const minReviews = 10;
      const removeCount = Math.min(prev.length - minReviews, 10);

      const updatedPrev = prev.slice(0, prev.length - removeCount);

      dispatch(setRerenderUserFeed());
      return [...updatedPrev, ...uniqueReviews];
    });
  };

  /**
   *  // add new review
   */
  const [reviewInput, setReviewInput] = useState("");

  const AddReview = async () => {
    const newId = uuid.v4();
    const newReview = {
      reviewId: newId,
      reviewer: {
        id: currentUser?._id,
        name: currentUser?.name,
        cover: currentUser?.cover,
        type: currentUser?.type,
      },
      createdAt: new Date(),
      text: reviewInput,
    };
    try {
      setReviewsList((prevReviews) => [newReview, ...prevReviews]);
      setReviewLength((prev) => prev + 1);
      dispatch(setActiveFeedFromScrollGallery(props.feed?._id));
      dispatch(setAddReviewQntRerenderFromScrollGallery());
      setReviewInput("");
      setOpenReviews(true);
      await axios.post(
        backendUrl + `/api/v1/feeds/${props.feed?._id}/reviews`,
        {
          reviewId: newId,
          reviewer: currentUser?._id,
          createdAt: new Date(),
          text: reviewInput,
        }
      );
      if (currentUser?._id !== props.user?._id) {
        await axios.post(
          backendUrl + `/api/v1/users/${props.user?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: ``,
            date: new Date(),
            type: "review",
            status: "unread",
            feed: `${props?.feed?._id}`,
          }
        );
        if (props.user._id !== currentUser._id) {
          if (props.user?.pushNotificationToken) {
            await sendNotification(
              props.user?.pushNotificationToken,
              currentUser.name,
              "added comment on your feed!",
              { feed: props.feed._id }
            );
          }
        }
      }

      socket.emit("updateUser", {
        targetId: props.user?._id,
      });
      dispatch(setRerenderUserFeed());
    } catch (error) {
      console.error(error);
    }
  };

  // add reviue handler

  const handleOnPress = () => {
    if (reviewInput?.length > 0 && reviewInput?.length < 501) {
      AddReview();
    } else if (reviewInput?.length > 500) {
      Alert.alert("Max length is 500");
    }
  };

  // remove review
  const [removeReview, setRemoveReview] = useState(null);

  const DeleteReview = async (id) => {
    const url = backendUrl + `/api/v1/feeds/${props.feed?._id}/reviews/${id}`;
    try {
      setReviewsList((prevReviews) =>
        prevReviews.filter((review) => review.reviewId !== id)
      );
      setReviewLength((prev) => prev - 1);
      dispatch(setActiveFeedFromScrollGallery(props.feed?._id));
      dispatch(setRemoveReviewQntRerenderFromScrollGallery());

      const response = await fetch(url, { method: "DELETE" });

      if (response.status === 200) {
        const data = await response.json();

        // Update the feed.reviews array by filtering out the deleted review
      } else {
        console.error("Error deleting review:", response.status);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // open reviews
  const [openReviews, setOpenReviews] = useState(true);

  /**
   *
   * Main save function
   */

  const [savesLength, setSavesLength] = useState(props?.feed?.saves?.length);
  const [checkIfSaved, setCheckifSaved] = useState(props?.feed?.checkIfSaved);

  const SaveFeed = async (userId, itemId) => {
    try {
      setCheckifSaved(true);
      setSavesLength(savesLength + 1);
      dispatch(setActiveFeedFromScrollGallery(itemId));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      dispatch(setSaveFromScrollGallery());

      await axios.patch(backendUrl + "/api/v1/feeds/" + itemId + "/save", {
        saveFor: currentUser._id,
      });
      if (currentUser?._id !== props.user?._id) {
        await axios.post(
          backendUrl + `/api/v1/users/${props.user?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: ``,
            date: new Date(),
            type: "save",
            status: "unread",
            feed: `${props?.feed?._id}`,
          }
        );
        if (props.user._id !== currentUser._id) {
          if (props.user?.pushNotificationToken) {
            await sendNotification(
              props.user?.pushNotificationToken,
              currentUser.name,
              "saved your feed!",
              { feed: props.feed._id }
            );
          }
        }
      }

      socket.emit("updateUser", {
        targetId: props.user?._id,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const UnSaveFeed = async (userId, itemId) => {
    try {
      setCheckifSaved(false);
      setSavesLength(savesLength - 1);
      dispatch(setActiveFeedFromScrollGallery(itemId));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      dispatch(setUnsaveFromScrollGallery());

      await axios.patch(backendUrl + "/api/v1/feeds/" + itemId + "/save", {
        unSaveFor: currentUser._id,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // fade in

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // open/hide post
  const [numLines, setNumLines] = useState(5);

  //open feed options
  const [post, setPost] = useState("");

  // change position on keyboard open
  const [onFocusState, setOnFocusState] = useState(false);

  // set post on load screen

  useEffect(() => {
    setPost(props?.feed?.post);
  }, []);

  const [feedOption, setFeedOption] = useState(false);

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

  // on slide timeline change video time
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
  if (props.feed.video) {
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
  } else if (props?.feed?.images) {
    let originalHeight = props.feed.fileHeight;
    let originalWidth = props.feed.fileWidth;

    let percented = originalWidth / (SCREEN_WIDTH - 20);
    hght = originalHeight / percented;
  }

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

  // format video TIME
  const formatTime = (timeInMillis) => {
    const seconds = Math.floor((timeInMillis / 1000) % 60);
    const minutes = Math.floor((timeInMillis / (1000 * 60)) % 60);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // define input height
  const [inputHeight, setInputHeight] = useState(35);

  // load video state
  const [loadVideo, setLoadVideo] = useState(true);
  const [loadImage, setLoadImage] = useState(true);

  const scrollViewRef = useRef();

  console.log(starsLength);

  return (
    // <BlurView tint="extra-dark" intensity={90} style={{ flex: 1 }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 250 }}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        <Animated.View
          style={{
            width: SCREEN_WIDTH - 20,
            opacity: fadeAnim,
            marginLeft: 10,
            alignItems: "center",
          }}
        >
          {feedOption && (
            <SmoothModal
              visible={feedOption}
              onClose={() => setFeedOption(false)}
              onSave={() => setFeedOption(false)}
              post={post}
              itemId={props?.feed?._id}
              fileFormat={props?.feed.fileFormat}
              itemName={props?.feed.name}
              setPost={setPost}
              navigation={navigation}
            />
          )}
          {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        > */}
          {props?.feed?.fileFormat === "img" && (
            <View
              style={{
                height: 70,
                paddingHorizontal: 15,
                paddingVertical: 10,
                zIndex: 120,
              }}
            >
              <TopSection
                user={props.user}
                currentTheme={currentTheme}
                navigation={navigation}
                lang={lang}
                language={language}
                from="scrollGallery"
                visible={feedOption}
                onClose={() => setFeedOption(false)}
                onSave={() => setFeedOption(false)}
                post={props?.feed?.post}
                feedId={props.feed?._id}
                setPost={setPost}
                feedOption={feedOption}
                createdAt={props.feed.createdAt}
                DotsFunction={() => setFeedOption(!feedOption)}
                fileFormat={props.feed.fileFormat}
              />
            </View>
          )}

          {props?.feed?.fileFormat === "img" && (
            <View style={{ paddingLeft: 10, width: "100%" }}>
              <Post
                currentTheme={currentTheme}
                numLines={numLines}
                setNumLines={setNumLines}
                postItem={post}
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
              maxHeight: 640,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              width: SCREEN_WIDTH - 20,
              borderRadius: 20,
              overflow: "hidden",
              paddingTop: 2,
            }}
          >
            {props?.feed?.images?.length > 1 && (
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
            {props?.feed?.fileFormat === "video" && (
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
                  user={props.user}
                  currentTheme={currentTheme}
                  navigation={navigation}
                  lang={lang}
                  language={language}
                  from="scrollGallery"
                  visible={feedOption}
                  onClose={() => setFeedOption(false)}
                  onSave={() => setFeedOption(false)}
                  post={props?.feed?.post}
                  feedId={props.feed?._id}
                  setPost={setPost}
                  feedOption={feedOption}
                  createdAt={props.feed.createdAt}
                  DotsFunction={() => setFeedOption(!feedOption)}
                  fileFormat={props.feed.fileFormat}
                />
                {props?.feed?.post && (
                  <View style={{ marginTop: 10 }}>
                    <Post
                      currentTheme={currentTheme}
                      numLines={numLines}
                      setNumLines={setNumLines}
                      postItem={post}
                    />
                  </View>
                )}
              </View>
            )}
            {props?.feed?.fileFormat === "video" ? (
              <>
                {loadVideo && (
                  <View
                    style={{
                      width: SCREEN_WIDTH - 20,
                      height: "100%",
                      position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                  >
                    <Circle borderRadius={20} />
                  </View>
                )}
                <BlurView intensity={20} tint="light">
                  <CacheableVideo
                    videoRef={videoRef}
                    delayLongPress={250}
                    style={{
                      borderRadius: 20,
                      height:
                        props.feed.fileHeight >= props.feed.fileWidth
                          ? hght
                          : props.feed.fileWidth,
                      width: SCREEN_WIDTH - 20,
                    }}
                    source={{
                      uri: props.feed.video,
                    }}
                    onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                    rate={1.0}
                    volume={1.0}
                    isMuted={volume ? true : false}
                    shouldPlay={true}
                    isLooping
                    resizeMode="contain"
                    onLoad={
                      () =>
                        // setTimeout(() => {
                        setLoadVideo(false)
                      // }, 200)
                    }
                  />
                </BlurView>
              </>
            ) : (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={Platform.OS === "ios" ? false : undefined}
                overScrollMode={Platform.OS === "ios" ? "never" : "always"}
              >
                {props?.feed?.images.map((item, index) => {
                  return (
                    <Pressable key={index} delayLongPress={50}>
                      {loadImage && (
                        <View
                          style={{
                            width: SCREEN_WIDTH - 20,
                            height: hght > 642 ? 642 : hght,
                            backgroundColor: currentTheme.background2,
                            position: "absolute",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 20,
                          }}
                        >
                          <Circle borderRadius={20} />
                        </View>
                      )}
                      <BlurView intensity={20} tint="light">
                        <ZoomableImage
                          style={{
                            height: hght > 642 ? 642 : hght,
                            maxHeight: 642,
                            width: SCREEN_WIDTH - 20,
                            borderRadius: 20,
                            zIndex: 100,
                            resizeMode: hght > 642 ? "cover" : "contain",
                          }}
                          source={{
                            uri: item.url,
                          }}
                          onLoad={
                            () =>
                              // setTimeout(() => {
                              setLoadImage(false)
                            // }, 200)
                          }
                        />
                      </BlurView>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
            {props?.feed?.fileFormat === "video" && (
              <Pressable
                onPress={(event) => event.stopPropagation()}
                name="bottom-section"
                style={{
                  paddingHorizontal: 10,
                  paddingTop: 30,
                  paddingVertical: 10,
                  width: SCREEN_WIDTH - 20,
                  justifyContent: "center",
                  position: "absolute",
                  bottom: 0,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                      minWidth: "25%",
                    }}
                  >
                    <Text style={[styles.duration, { flex: 1 }]}>
                      {formatTime(currentPosition)}
                    </Text>
                    <Text style={[styles.duration, { flex: 0 }]}>-</Text>
                    <Text style={[styles.duration, { flex: 1 }]}>
                      {formatTime(videoDuration)}
                    </Text>
                  </View>

                  <Slider
                    style={{
                      flex: 1,
                      height: 5,
                      padding: 15,
                    }}
                    minimumValue={0}
                    maximumValue={videoDuration}
                    value={currentPosition}
                    onSlidingComplete={onSliderValueChange}
                    thumbTintColor="rgba(0,0,0,0)"
                    minimumTrackTintColor="#F866B1"
                  />
                </View>

                <View
                  style={{
                    width: "100%",
                    borderRadius: 50,
                  }}
                >
                  <BottomSection
                    navigation={navigation}
                    language={language}
                    currentTheme={currentTheme}
                    RemoveStar={RemoveStar}
                    SetStar={SetStar}
                    user={props.user}
                    feed={props.feed}
                    from="scrollGallery"
                    setOpenReviews={setOpenReviews}
                    openReviews={openReviews}
                    volume={volume}
                    setVideoVolume={setVideoVolume}
                    checkIfStared={checkIfStared}
                    checkIfSaved={checkIfSaved}
                    starsLength={starsLength}
                    reviewsLength={reviewLength}
                    savesLength={savesLength}
                    SaveFeed={SaveFeed}
                    UnSaveFeed={UnSaveFeed}
                  />
                </View>
              </Pressable>
            )}
          </View>
          {props?.feed?.fileFormat === "img" && (
            <View
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
                <BottomSection
                  navigation={navigation}
                  language={language}
                  currentTheme={currentTheme}
                  RemoveStar={RemoveStar}
                  SetStar={SetStar}
                  user={props.user}
                  feed={props.feed}
                  from="scrollGallery"
                  setOpenReviews={setOpenReviews}
                  openReviews={openReviews}
                  volume={volume}
                  setVideoVolume={setVideoVolume}
                  checkIfStared={checkIfStared}
                  checkIfSaved={checkIfSaved}
                  starsLength={starsLength}
                  reviewsLength={reviewLength}
                  savesLength={savesLength}
                  SaveFeed={SaveFeed}
                  UnSaveFeed={UnSaveFeed}
                />
              </View>
            </View>
          )}
          <Text
            style={{
              fontSize: 12,
              color: currentTheme.font,
              marginLeft: 15,
              position: "relative",
              top: 10,
            }}
          >
            {reviewInput.length > 0 && reviewInput.length}{" "}
            {reviewInput.length > 0 && (
              <Text style={{ color: currentTheme.disabled }}>(max 500)</Text>
            )}
          </Text>
          {openReviews && (
            <View style={[styles.addReview, {}]}>
              <TextInput
                style={[
                  styles.reviewInput,
                  {
                    backgroundColor: currentTheme.background2,
                    color: currentTheme.font,
                    maxWidth: "100%",
                    height: inputHeight,
                  },
                ]}
                autoFocus={props.from === "comment" ? true : false}
                onFocus={() => scrollViewRef.current.scrollTo({ y: 1200 })}
                onBlur={() => scrollViewRef.current.scrollTo({ y: 0 })}
                placeholder={language?.language.Main.feedCard.writeText}
                placeholderTextColor="#ccc"
                onChangeText={(text) => setReviewInput(text)}
                value={reviewInput}
                returnKeyType="default"
                multiline={true}
                onContentSizeChange={(e) => {
                  setInputHeight(e.nativeEvent.contentSize.height);
                }}
              />
              <FontAwesome
                name="send"
                style={[styles.sendReviewIcon, { color: currentTheme.font }]}
                onPress={handleOnPress}
              />
            </View>
          )}
          {openReviews && (
            <Pressable style={styles.reviewsList}>
              {reviewsList?.length > 0 ? (
                reviewsList?.map((item, index) => {
                  return (
                    <ReviewItem
                      key={index}
                      item={item}
                      currentTheme={currentTheme}
                      user={props.user}
                      currentUser={currentUser}
                      setRemoveReview={setRemoveReview}
                      removeReview={removeReview}
                      DeleteReview={DeleteReview}
                      navigation={navigation}
                      language={language}
                    />
                  );
                })
              ) : (
                <View style={{ padding: 20, paddingVertical: 10 }}>
                  <Text style={{ color: "#888", fontSize: 12 }}>
                    {language?.language.Main.feedCard.noComments}
                  </Text>
                </View>
              )}
              {reviewLength > 10 && (
                <Pressable
                  style={{
                    backgroundColor: currentTheme.background2,
                    width: "100%",
                    alignItems: "center",
                  }}
                  onPress={
                    reviewsList?.length < reviewLength
                      ? () => AddNewReviews(reviewsPage + 1)
                      : () => ReduceReviews()
                  }
                >
                  <Text style={{ color: "orange" }}>
                    {reviewsList?.length < reviewLength
                      ? language?.language.Bookings.bookings.loadMore
                      : language?.language.Bookings.bookings.loadLess}
                  </Text>
                </Pressable>
              )}
            </Pressable>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
    // </BlurView>
  );
};

const ReviewItem = ({
  item,
  currentTheme,
  user,
  currentUser,
  removeReview,
  DeleteReview,
  navigation,
  setRemoveReview,
  language,
}) => {
  const [User, setUser] = useState(null);
  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  useEffect(() => {
    const GetUser = async () => {
      const response = await axios.get(
        backendUrl + "/api/v1/users/" + item.reviewer.id
      );

      if (response.data) {
        setUser(response.data.data.user);
      }
    };
    try {
      if (item.reviewer.id) {
        GetUser();
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, [item]);

  // get review date

  const currentPostTime = GetTimesAgo(new Date(item.createdAt).getTime());

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

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewReviewer}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={
              User
                ? () =>
                    navigation.navigate("User", {
                      user: User,
                    })
                : undefined
            }
          >
            {item.reviewer?.cover?.length > 30 ? (
              <CacheableImage
                style={styles.reviewItemCover}
                source={{ uri: item.reviewer.cover }}
                manipulationOptions={[
                  // { resize: { width: SCREEN_WIDTH, height: height } },
                  { rotate: 90 },
                ]}
              />
            ) : (
              <View
                style={{
                  borderRadius: 100,
                  width: 30,
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              >
                <FontAwesome name="user" size={20} color="#e5e5e5" />
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={
              User
                ? () =>
                    navigation.navigate("User", {
                      user: User,
                    })
                : undefined
            }
          >
            <Text style={[styles.reviewItemName, { color: currentTheme.font }]}>
              {item.reviewer.name}
            </Text>
          </Pressable>
        </View>
        <Text style={{ color: currentTheme.font, fontSize: 12 }}>
          {definedTime}
        </Text>
      </View>
      <View
        style={[
          styles.reviewTextContainer,
          { borderColor: currentTheme.background2 },
        ]}
      >
        <Pressable
          onLongPress={
            user?._id === currentUser?._id ||
            currentUser?._id === item.reviewer?.id
              ? () => {
                  const pattern = [20, 100];
                  setRemoveReview(item.reviewId);
                  Vibration.vibrate(pattern);
                }
              : undefined
          }
          delayLongPress={300}
          onPress={() => setRemoveReview(null)}
          style={{ flex: 1 }}
        >
          <Text style={[styles.reviewText, { color: currentTheme.font }]}>
            {item.text}
          </Text>
        </Pressable>
        {removeReview === item.reviewId && (
          <FontAwesome
            name="remove"
            style={styles.reveiwDeleteIcon}
            onPress={() => DeleteReview(item.reviewId)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    zIndex: 10000,
  },

  info: { gap: 5 },
  name: { fontSize: 14, fontWeight: "bold", color: "#fff" },
  type: { fontSize: 12, color: "#fff" },
  stars: { flexDirection: "row", alignItems: "center" },
  starsQnt: { color: "#fff", fontSize: 14, marginLeft: 5 },
  bottomText: { color: "#fff", fontSize: 14 },
  reviews: {
    padding: 15,
    paddingBottom: 10,
    paddingTop: 0,
  },
  addReview: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minHeight: 45,

    padding: 0,
    paddingTop: 5,
    paddingBottom: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    gap: 10,
  },
  reviewInput: {
    minHeight: 35,
    width: "100%",
    borderRadius: 10,
    paddingLeft: 15,
    paddingTop: 10,
    color: "#fff",
    flex: 15,
    fontSize: 14,
    justifyContent: "center",
  },
  sendReviewIcon: {
    fontSize: 20,
    color: "#e5e5e5",
    flex: 1,
  },
  reviewsList: { gap: 10, marginBottom: 20 },
  reviewItem: {
    gap: 10,
    marginHorizontal: 20,
  },
  reviewReviewer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewItemCover: {
    width: 30,
    height: 30,
    borderRadius: 50,
    resizeMode: "cover",
  },
  reviewItemName: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  reviewTextContainer: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    alignItems: "center",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    padding: 10,
    paddingTop: 7,
    paddingLeft: 15,
  },
  reviewText: {
    width: "100%",
    color: "#ccc",
  },
  reveiwDeleteIcon: {
    fontSize: 16,
    color: "red",
  },
  duration: {
    fontSize: 12,
    color: "#e5e5e5",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});
