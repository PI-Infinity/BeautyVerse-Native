import { useState, useEffect, useMemo, useRef } from "react";
import {
  Platform,
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Vibration,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  setAddStarRerenderFromScrollGallery,
  setRemoveStarRerenderFromScrollGallery,
  setAddReviewQntRerenderFromScrollGallery,
  setRemoveReviewQntRerenderFromScrollGallery,
} from "../../redux/rerenders";
import { setActiveFeedFromScrollGallery } from "../../redux/actions";
import { Skeleton } from "@rneui/themed";
import uuid from "react-native-uuid";
import GetTimesAgo from "../../functions/getTimesAgo";
import { Language } from "../../context/language";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CacheableImage } from "../../components/cacheableImage";
import ZoomableImage from "../../components/zoomableImage";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const ScrollGallery = ({ route, navigation }) => {
  const props = route.params;

  const language = Language();

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  return (
    <ScrollView style={styles.container}>
      {props.scrolableFeeds?.map((item, index) => {
        return (
          <FeedItem
            key={index}
            user={props.user}
            x={index}
            {...item}
            language={language}
            currentUser={currentUser}
            navigation={navigation}
            setFeeds={props.setFeeds}
            feeds={props.feeds}
          />
        );
      })}
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
            backgroundColor: "rgba(255,255,255,0.05)",
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    zIndex: 10000,
    backgroundColor: "rgba(15,15,15,1)",
  },
  topSection: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 15,
    paddingTop: 15,
    paddingBottom: 15,
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
  name: { fontSize: 14, fontWeight: "bold", color: "#fff" },
  type: { fontSize: 12, color: "#fff" },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#111",
  },
  stars: { flexDirection: "row", alignItems: "center" },
  starsQnt: { color: "#fff", fontSize: 14, marginLeft: 5 },
  bottomText: { color: "#fff", fontSize: 14 },
  reviews: {
    backgroundColor: "rgba(15,15,15,0.97)",
    padding: 15,
    paddingBottom: 20,
    paddingTop: 0,
  },
  addReview: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 45,
    backgroundColor: "rgba(15,15,15,0.97)",
    padding: 0,
    paddingTop: 5,
    paddingBottom: 15,
    gap: 10,
  },
  reviewInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    height: 35,
    width: "100%",
    borderRadius: 50,
    paddingLeft: 10,
    color: "#fff",
    flex: 15,
    fontSize: 14,
  },
  sendReviewIcon: {
    fontSize: 20,
    color: "#e5e5e5",
    flex: 1,
  },
  reviewsList: { gap: 10, marginTop: 15 },
  reviewItem: {
    gap: 10,
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
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(255,255,255,0.03)",
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
});

const FeedItem = (props) => {
  const dispatch = useDispatch();

  const [imageSize, setImageSize] = useState({
    width: SCREEN_WIDTH,
    height: 0,
  });

  useEffect(() => {
    const loadImageSize = () => {
      Image.getSize(props?.mobile, (width, height) => {
        const aspectRatio = width / height;
        const scaledHeight = SCREEN_WIDTH / aspectRatio;
        setImageSize({ width: SCREEN_WIDTH, height: scaledHeight });
      });
    };
    if (props !== []) {
      loadImageSize();
    }
  }, [props?._id]);

  /**
   *  // add stars to feeds
   */
  const [starsLength, setStarsLength] = useState(props.starsLength);
  const [checkIfStared, setCheckifStared] = useState(props.checkIfStared);

  const SetStar = async () => {
    try {
      setStarsLength((prev) => prev + 1);
      setCheckifStared(true);
      dispatch(setActiveFeedFromScrollGallery(props?._id));

      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props._id}/stars`,
        {
          staredBy: props.currentUser?._id,
          createdAt: new Date(),
        }
      );
      if (props.currentUser?._id !== props?.user._id) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/notifications`,
          {
            senderId: props.currentUser?._id,
            text: `მიანიჭა ვარსკვლავი თქვენ პოსტს!`,
            date: new Date(),
            type: "star",
            status: "unread",
            feed: `/api/v1/users/${props?.user._id}/feeds/${props.feed?._id}`,
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

    dispatch(setActiveFeedFromScrollGallery(props._id));
    try {
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props._id}/stars/${props.currentUser?._id}`;
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
          `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props?._id}/reviews?page=${reviewsPage}`
        );
        setReviewsList(response.data.data.reviews);
        setReviewLength(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };
    if (reviewsListRef.current) {
      reviewsListRef.current = false;
      return;
    }
    GetReviews();
  }, [imageSize]);

  async function AddNewReviews(nextPage) {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props?._id}/reviews?page=${nextPage}`
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
      dispatch(setActiveFeedFromScrollGallery(props._id));
      dispatch(setAddReviewQntRerenderFromScrollGallery());
      setReviewInput("");
      setOpenReviews(true);
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props._id}/reviews`,
        {
          reviewId: newId,
          reviewer: props.currentUser?._id,
          createdAt: new Date(),
          text: reviewInput,
        }
      );
      // if (currentUser._id !== props?.targetUser._id) {
      //   await axios.post(
      //     `https://beautyverse.herokuapp.com/api/v1/users/${props?.targetUser._id}/notifications`,
      //     {
      //       senderId: currentUser?._id,
      //       text: `დატოვა კომენტარი თქვენს პოსტზე!`,
      //       date: new Date(),
      //       type: "star",
      //       status: "unread",
      //       feed: `/api/v1/users/${props?.targetUser._id}/feeds/${props.currentFeed?._id}`,
      //     }
      //   );
      // }
    } catch (error) {
      console.error(error);
    }
  };

  // remove review
  const [removeReview, setRemoveReview] = useState(null);

  const DeleteReview = async (id) => {
    const url = `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/feeds/${props._id}/reviews/${id}`;
    try {
      setReviewsList((prevReviews) =>
        prevReviews.filter((review) => review.reviewId !== id)
      );
      setReviewLength((prev) => prev - 1);
      dispatch(setActiveFeedFromScrollGallery(props._id));
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

  // define times ago

  const GetActionTime = (time) => {
    let definedTime;
    if (time?.includes("min")) {
      definedTime =
        time?.slice(0, -3) + props?.language?.language.Main.feedCard.min;
    } else if (time?.includes("h")) {
      definedTime =
        time?.slice(0, -1) + props?.language?.language.Main.feedCard.h;
    } else if (time?.includes("d")) {
      definedTime =
        time?.slice(0, -1) + props?.language?.language.Main.feedCard.d;
    } else if (time?.includes("j")) {
      definedTime =
        time?.slice(0, -1) + props?.language?.language.Main.feedCard.justNow;
    } else if (time?.includes("w")) {
      definedTime =
        time?.slice(0, -1) + props?.language?.language.Main.feedCard.w;
    } else if (time?.includes("mo")) {
      definedTime =
        time?.slice(0, -2) + props?.language?.language.Main.feedCard.mo;
    } else if (time?.includes("y")) {
      definedTime =
        time?.slice(0, -1) + props?.language?.language.Main.feedCard.y;
    }
    return definedTime;
  };

  const currentPostTime = GetTimesAgo(new Date(props?.createdAt).getTime());
  const definedTime = GetActionTime(currentPostTime);

  // open reviews
  const [openReviews, setOpenReviews] = useState(false);

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

  return (
    <Animated.View
      style={{ opacity: fadeAnim, height: "auto", marginBottom: 20 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({
          ios: 0,
          android: -500,
        })}
      >
        <View style={{ height: 1, backgroundColor: "#222" }} />
        <View style={styles.topSection}>
          <View>
            {props.user?.cover?.length > 0 ? (
              <Pressable
                style={styles.coverContainer}
                onPress={() =>
                  props.navigation.navigate("User", {
                    user: props?.user,
                  })
                }
              >
                <CacheableImage
                  style={{ width: 40, height: 40 }}
                  source={{
                    uri: props.user?.cover,
                  }}
                  manipulationOptions={[
                    { resize: { width: 40, height: 40 } },
                    { rotate: 90 },
                  ]}
                />
              </Pressable>
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
          </View>
          <View style={{ gap: 3 }}>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              onPress={() =>
                props.navigation.navigate("User", {
                  user: props?.user,
                })
              }
            >
              <Text style={styles.name}>{props.user?.name}</Text>
              <MaterialIcons name="verified" size={14} color="#1DA1F2" />
            </Pressable>
            <Text style={styles.type}>{props.user?.type}</Text>
          </View>
        </View>
        {props.user?.feed?.post && (
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
        )}
        <Pressable
          style={{
            width: SCREEN_WIDTH,
            height: imageSize.height > 600 ? 600 : imageSize.height,
          }}
          delayLongPress={100}
          onPress={() => props.navigation.goBack()}
        >
          <ZoomableImage
            style={{
              height: imageSize.height,
              width: SCREEN_WIDTH,
              resizeMode: imageSize.height > 600 ? "cover" : "contain",
              maxHeight: 600,
            }}
            source={{
              uri: props?.mobile,
            }}
            manipulationOptions={[
              { resize: { width: SCREEN_WIDTH, height: imageSize.height } },
              { rotate: 90 },
            ]}
          />
        </Pressable>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          name="bottom-section"
          style={styles.bottomSection}
        >
          <View style={styles.stars}>
            <Pressable onPress={checkIfStared ? RemoveStar : SetStar}>
              <Icon
                name="star-o"
                size={24}
                color={checkIfStared ? "#bb3394" : "#ccc"}
              />
            </Pressable>
            <Text style={styles.starsQnt}>{starsLength}</Text>
          </View>
          <View>
            <Text style={styles.bottomText}>{definedTime}</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={styles.reviews}
        >
          <View style={styles.addReview}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write text.."
              placeholderTextColor="#ccc"
              onChangeText={(text) => setReviewInput(text)}
              value={reviewInput}
            />
            <Icon
              name="send"
              style={styles.sendReviewIcon}
              onPress={AddReview}
            />
          </View>
          <Pressable
            style={{
              paddingBottom: 15,
              paddingTop: 5,
              width: "100%",
              borderBottomWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
            onPress={() => setOpenReviews(!openReviews)}
          >
            <Text style={[styles.bottomText, { color: "#ccc", fontSize: 14 }]}>
              {reviewLength} comments
            </Text>
          </Pressable>
          {openReviews && (
            <Pressable
              style={styles.reviewsList}
              // onPress={() => setOpenReviews(false)}
            >
              {reviewsList?.map((item, index) => {
                const currentReviewTime = GetTimesAgo(
                  new Date(item?.createdAt).getTime()
                );
                const reviewTime = GetActionTime(currentReviewTime);
                return (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewReviewer}>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <CacheableImage
                          style={styles.reviewItemCover}
                          source={{ uri: item.reviewer.cover }}
                          manipulationOptions={[
                            // { resize: { width: SCREEN_WIDTH, height: imageSize.height } },
                            { rotate: 90 },
                          ]}
                        />

                        <Text style={styles.reviewItemName}>
                          {item.reviewer.name}
                        </Text>
                      </View>
                      <Text style={{ color: "#ccc", fontSize: 12 }}>
                        {reviewTime}
                      </Text>
                    </View>
                    <View style={styles.reviewTextContainer}>
                      <Pressable
                        onLongPress={
                          props.user._id === props.currentUser._id ||
                          props.currentUser._id === item.reviewer.id
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
                        <Text style={styles.reviewText}>{item.text}</Text>
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
              })}
              {reviewLength > 10 && (
                <Pressable
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  onPress={
                    reviewsList?.length < reviewLength
                      ? () => AddNewReviews(reviewsPage + 1)
                      : () => ReduceReviews()
                  }
                  style={{ width: "100%", alignItems: "center" }}
                >
                  <Text style={{ color: "orange" }}>
                    {reviewsList?.length < reviewLength
                      ? "Load more"
                      : "Show less"}
                  </Text>
                </Pressable>
              )}
            </Pressable>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
