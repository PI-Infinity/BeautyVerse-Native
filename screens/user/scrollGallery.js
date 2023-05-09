import { useState, useEffect, useRef } from "react";
import {
  Platform,
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Vibration,
  FlatList,
  Keyboard,
  KeyboardEvent,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  setAddStarRerenderFromScrollGallery,
  setRemoveStarRerenderFromScrollGallery,
  setAddReviewQntRerenderFromScrollGallery,
  setRemoveReviewQntRerenderFromScrollGallery,
} from "../../redux/rerenders";
import { setActiveFeedFromScrollGallery } from "../../redux/actions";
import uuid from "react-native-uuid";
import GetTimesAgo from "../../functions/getTimesAgo";
import { Language } from "../../context/language";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CacheableImage } from "../../components/cacheableImage";
import ZoomableImage from "../../components/zoomableImage";
import { CacheableVideo } from "../../components/cacheableVideo";
import SmoothModal from "../../screens/user/editPostPopup";
import { setVideoVolume } from "../../redux/feed";
import Slider from "@react-native-community/slider";
import { lightTheme, darkTheme } from "../../context/theme";
import { TopSection } from "../../components/feedCard/topSection";
import { BottomSection } from "../../components/feedCard/bottomSection";
import { Post } from "../../components/feedCard/post";
import { useIsFocused } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const ScrollGallery = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const props = route.params;
  const language = Language();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // get displayed video index
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChangedRef = useRef(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      const topVisibleItemIndex = viewableItems[0].index;
      setCurrentIndex(topVisibleItemIndex);
    }
  });

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70, // at least 70% of the item should be visible
  };

  // // define video volume
  // const [volume, setVolume] = useState(true);

  const renderItem = ({ item, index }) => (
    <FeedItem
      key={index}
      user={props.user}
      x={index}
      feed={item}
      language={language}
      currentUser={currentUser}
      navigation={navigation}
      setFeeds={props.setFeeds}
      feeds={props.feeds}
      currentIndex={currentIndex}
      isFocused={isFocused}
      scrolableFeeds={props.scrolableFeeds}
      // volume={volume}
      // setVolume={setVolume}
    />
  );

  return (
    <View>
      <FlatList
        data={props.scrolableFeeds}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? undefined : false}
      />
      {props.feedsLengthCurrent > 7 && (
        <Pressable
          onPress={
            props.feedsLength > props.feedsLengthCurrent
              ? () => props.AddFeeds(props.user?._id, props.page + 1)
              : props.ReduceFeeds
          }
          style={{
            padding: 10,
            borderRadius: 5,
            backgroundColor: currentTheme.background2,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "orange" }}>
            {props.feedsLength > props.feedsLengthCurrent
              ? "Load More"
              : "Load Less"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    zIndex: 10000,
    backgroundColor: "#111",
  },

  info: { gap: 5 },
  name: { fontSize: 14, fontWeight: "bold", color: "#fff" },
  type: { fontSize: 12, color: "#fff" },
  stars: { flexDirection: "row", alignItems: "center" },
  starsQnt: { color: "#fff", fontSize: 14, marginLeft: 5 },
  bottomText: { color: "#fff", fontSize: 14 },
  reviews: {
    backgroundColor: "rgba(15,15,15,0.97)",
    padding: 15,
    paddingBottom: 10,
    paddingTop: 0,
  },
  addReview: {
    flexDirection: "row",
    flex: 1,
    minHeight: 45,
    backgroundColor: "rgba(15,15,15,0.97)",
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
    backgroundColor: "rgba(255,255,255,0.01)",
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

const FeedItem = (props) => {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const lang = useSelector((state) => state.storeApp.language);

  /**
   *  // add stars to feeds
   */
  const [starsLength, setStarsLength] = useState(props?.feed?.starsLength);
  const [checkIfStared, setCheckifStared] = useState(
    props?.feed?.checkIfStared
  );

  const SetStar = async () => {
    try {
      setStarsLength((prev) => prev + 1);
      setCheckifStared(true);
      dispatch(setActiveFeedFromScrollGallery(props?.feed._id));

      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props.feed._id}/stars`,
        {
          staredBy: props.currentUser?._id,
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
            feed: `/api/v1/users/${props.user?._id}/feeds/${props.feed._id}`,
          }
        );
      }
      setTimeout(() => {
        dispatch(setAddStarRerenderFromScrollGallery());
      }, 300);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *  // remove stars from feeds
   */
  const RemoveStar = async () => {
    setStarsLength((prev) => prev - 1);
    setCheckifStared(false);

    dispatch(setActiveFeedFromScrollGallery(props.feed._id));
    try {
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props.feed._id}/stars/${props.currentUser?._id}`;
      const response = await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => {
          dispatch(setRemoveStarRerenderFromScrollGallery());
        });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   *  // getReviews
   */
  const reviewsListRef = useRef(true);
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewLength, setReviewLength] = useState(null);
  const [reviewsPage, setReviewsPage] = useState(1);

  useEffect(() => {
    const GetReviews = async () => {
      try {
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${props?.user?._id}/feeds/${props?.feed._id}/reviews?page=${reviewsPage}`
        );
        setReviewsList(response.data.data.reviews);
        setReviewLength(response.data.result);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    GetReviews();
  }, [props.feed._id]);

  async function AddNewReviews(nextPage) {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props?.feed._id}/reviews?page=${nextPage}`
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
    } catch (error) {
      console.log(error);
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
        id: props.currentUser?._id,
        name: props.currentUser?.name,
        cover: props.currentUser?.cover,
        type: props.currentUser?.type,
      },
      createdAt: new Date(),
      text: reviewInput,
    };
    try {
      setReviewsList((prevReviews) => [newReview, ...prevReviews]);
      setReviewLength((prev) => prev + 1);
      dispatch(setActiveFeedFromScrollGallery(props.feed._id));
      dispatch(setAddReviewQntRerenderFromScrollGallery());
      setReviewInput("");
      setOpenReviews(true);
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props.feed._id}/reviews`,
        {
          reviewId: newId,
          reviewer: props.currentUser?._id,
          createdAt: new Date(),
          text: reviewInput,
        }
      );
      if (currentUser?._id !== props.user?._id) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${props.user?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: `დატოვა კომენტარი თქვენს პოსტზე!`,
            date: new Date(),
            type: "review",
            status: "unread",
            feed: `/api/v1/users/${props.user?._id}/feeds/${props?.feed._id}`,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    const url = `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props.feed._id}/reviews/${id}`;
    try {
      setReviewsList((prevReviews) =>
        prevReviews.filter((review) => review.reviewId !== id)
      );
      setReviewLength((prev) => prev - 1);
      dispatch(setActiveFeedFromScrollGallery(props.feed._id));
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

  // fade in

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // open post
  const [numLines, setNumLines] = useState(3);

  // define file sizes;

  let width = SCREEN_WIDTH;
  let addationalSize = props.feed.fileHeight - SCREEN_WIDTH;
  let inPercent = (addationalSize / props.feed.fileHeight) * 100;
  let height = props.feed.fileWidth - (props.feed.fileWidth / 100) * inPercent;

  //open feed options

  const [post, setPost] = useState("");
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
  // change video time with slider
  const onSlidingStart = () => {
    setIsSliding(true);
  };
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

    let wdth = SCREEN_WIDTH;

    let percented = originalWidth / SCREEN_WIDTH;

    hght = originalHeight / percented;
  } else if (props?.feed?.images) {
    let originalHeight = props.feed.fileHeight;
    let originalWidth = props.feed.fileWidth;

    let wdth = SCREEN_WIDTH;

    let percented = originalWidth / SCREEN_WIDTH;
    hght = originalHeight / percented;
  }

  const formatTime = (timeInMillis) => {
    const milliseconds = Math.floor(timeInMillis % 1000);
    const seconds = Math.floor((timeInMillis / 1000) % 60);
    const minutes = Math.floor((timeInMillis / (1000 * 60)) % 60);

    const formattedMilliseconds =
      milliseconds < 100 ? `0${milliseconds}` : `${milliseconds}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const useKeyboard = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    useEffect(() => {
      function onKeyboardDidShow(e: KeyboardEvent) {
        setKeyboardHeight(e.endCoordinates.height);
      }

      function onKeyboardDidHide() {
        setKeyboardHeight(0);
      }

      const showSubscription = Keyboard.addListener(
        "keyboardDidShow",
        onKeyboardDidShow
      );
      const hideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        onKeyboardDidHide
      );

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    return keyboardHeight;
  };

  const KeyboardHeight = useKeyboard();

  const [inputHeight, setInputHeight] = useState(35);

  return (
    <Animated.View
      style={{
        // maxHeight: props.screenHeight,
        width: SCREEN_WIDTH,
        backgroundColor: currentTheme.background,
        opacity: fadeAnim,
      }}
    >
      {feedOption && (
        <SmoothModal
          visible={feedOption}
          onClose={() => setFeedOption(false)}
          onSave={() => setFeedOption(false)}
          post={props?.feed?.post}
          feedId={props.feed._id}
          setPost={setPost}
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
            backgroundColor: currentTheme.background,
          }}
        >
          <TopSection
            user={props.user}
            currentTheme={currentTheme}
            navigation={props.navigation}
            lang={lang}
            language={props.language}
            from="scrollGallery"
            visible={feedOption}
            onClose={() => setFeedOption(false)}
            onSave={() => setFeedOption(false)}
            post={props?.feed?.post}
            feedId={props.feed._id}
            setPost={setPost}
            feedOption={feedOption}
            createdAt={props.feed.createdAt}
            DotsFunction={() => setFeedOption(!feedOption)}
            fileFormat={props.feed.fileFormat}
          />
        </View>
      )}
      {props?.feed?.post && props?.feed?.fileFormat === "img" && (
        <View style={{ paddingLeft: 10 }}>
          <Post
            currentTheme={currentTheme}
            numLines={numLines}
            setNumLines={setNumLines}
            text={post}
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
            navigation={props.navigation}
            lang={lang}
            language={props.language}
            from="scrollGallery"
            visible={feedOption}
            onClose={() => setFeedOption(false)}
            onSave={() => setFeedOption(false)}
            post={props?.feed?.post}
            feedId={props.feed._id}
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
                text={post}
              />
            </View>
          )}
        </View>
      )}
      <View
        name="main-section"
        style={{
          height: hght > 640 ? 640 : hght,
          maxHeight: 640,
          overflow: "hidden",
          justifyContent: "center",
          // backgroundColor: currentTheme.background2,
        }}
      >
        {props?.feed?.images?.length > 1 && (
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
        {props?.feed?.fileFormat === "video" ? (
          <CacheableVideo
            videoRef={videoRef}
            onLongPress={() => props.navigation.goBack()}
            delayLongPress={250}
            style={{
              height:
                props.feed.fileHeight >= props.feed.fileWidth
                  ? hght
                  : props.feed.fileWidth,
            }}
            source={{
              uri: props.feed.video,
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
          />
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={Platform.OS === "ios" ? false : undefined}
            overScrollMode={Platform.OS === "ios" ? undefined : false}
          >
            {props?.feed?.images.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() => props.navigation.goBack()}
                >
                  <ZoomableImage
                    style={{
                      height: hght > 640 ? 640 : hght,
                      maxHeight: 640,
                      width: SCREEN_WIDTH,
                      zIndex: 100,
                      resizeMode: hght > 640 ? "cover" : "contain",
                    }}
                    source={{
                      uri: item.url,
                    }}
                  />
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
              width: SCREEN_WIDTH,
              justifyContent: "center",
              position: "absolute",
              bottom: 0,
              // backgroundColor: "red",
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
                  minWidth: "20%",
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
                  // backgroundColor: "black",
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
                // backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 50,
                // borderColor: "rgba(248, 102, 177, 0.3)",
                // borderWidth: 1,
              }}
            >
              <BottomSection
                navigation={props.navigation}
                language={props.language}
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
                starsLength={starsLength}
                reviewsLength={reviewLength}
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
            backgroundColor: currentTheme.background,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 50,
              // borderColor: "rgba(248, 102, 177, 0.3)",
              // borderWidth: 1,
            }}
          >
            <BottomSection
              navigation={props.navigation}
              language={props.language}
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
              starsLength={starsLength}
              reviewsLength={reviewLength}
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
        {reviewInput.length > 0 && reviewInput.length}
      </Text>
      {openReviews && (
        <View
          style={[
            styles.addReview,
            {
              backgroundColor: currentTheme.background,
              // marginBottom: KeyboardHeight,
            },
          ]}
        >
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
            placeholder="Write text.."
            placeholderTextColor="#ccc"
            onChangeText={(text) => setReviewInput(text)}
            value={reviewInput}
            returnKeyType="default"
            multiline={true}
            onContentSizeChange={(e) => {
              setInputHeight(e.nativeEvent.contentSize.height);
            }}
          />
          <Icon
            name="send"
            style={[styles.sendReviewIcon, { color: currentTheme.font }]}
            onPress={handleOnPress}
          />
        </View>
      )}
      {openReviews && (
        <Pressable
          style={styles.reviewsList}
          // onPress={() => setOpenReviews(false)}
        >
          {reviewsList?.length > 0 ? (
            reviewsList?.map((item, index) => {
              // const currentReviewTime = GetTimesAgo(
              //   new Date(item?.createdAt).getTime()
              // );
              // const reviewTime = GetActionTime(currentReviewTime);
              return (
                <ReviewItem
                  key={index}
                  item={item}
                  currentTheme={currentTheme}
                  user={props.user}
                  currentUser={props.currentUser}
                  setRemoveReview={setRemoveReview}
                  removeReview={removeReview}
                  DeleteReview={DeleteReview}
                  navigation={props.navigation}
                  language={props.language}
                />
              );
            })
          ) : (
            <View style={{ padding: 20, paddingVertical: 10 }}>
              <Text style={{ color: "#888", fontSize: 12 }}>No comments</Text>
            </View>
          )}
          {reviewLength > 10 && (
            <Pressable
              style={{ backgroundColor: currentTheme.background2 }}
              onPress={
                reviewsList?.length < reviewLength
                  ? () => AddNewReviews(reviewsPage + 1)
                  : () => ReduceReviews()
              }
              style={{ width: "100%", alignItems: "center" }}
            >
              <Text style={{ color: "orange" }}>
                {reviewsList?.length < reviewLength ? "Load more" : "Show less"}
              </Text>
            </Pressable>
          )}
        </Pressable>
      )}
      {/* </KeyboardAvoidingView> */}
    </Animated.View>
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
  useEffect(() => {
    const GetUser = async () => {
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/users/" + item.reviewer.id
      );
      setUser(response.data.data.user);
    };
    try {
      if (item) {
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
            onPress={() =>
              navigation.navigate("User", {
                user: User,
              })
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
                <Icon name="user" size={20} color="#e5e5e5" />
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("User", {
                user: User,
              })
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
            user._id === currentUser._id || currentUser._id === item.reviewer.id
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
          <Icon
            name="remove"
            style={styles.reveiwDeleteIcon}
            onPress={() => DeleteReview(item.reviewId)}
          />
        )}
      </View>
    </View>
  );
};
