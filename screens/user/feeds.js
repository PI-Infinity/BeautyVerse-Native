import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Vibration,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ScrollGallery } from "../../screens/user/scrollGallery";
import DeleteFeedPopup from "../../components/confirmDialog";
import { ref, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../firebase";
import { setRerenderUserFeed } from "../../redux/rerenders";
import { CacheableImage } from "../../components/cacheableImage";
import { Language } from "../../context/language";
import { Video, ResizeMode } from "expo-av";
import { CacheableVideo } from "../../components/cacheableVideo";
import { lightTheme, darkTheme } from "../../context/theme";
import { BackDrop } from "../../components/backDropLoader";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feeds = ({ targetUser, navigation, variant }) => {
  const [loading, setLoading] = useState(true);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const [feeds, setFeeds] = useState([]);
  const [feedsLength, setFeedsLength] = useState(0);
  const [page, setPage] = useState(1);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const rerenderUserFeeds = useSelector(
    (state) => state.storeRerenders.rerenderUserFeeds
  );

  useEffect(() => {
    async function GetFeeds(userId) {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${userId}/feeds/native?page=${page}&check=${currentUser?._id}`
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

  /**
   *  // add new feeds to feeds, when press to load more button
   */

  async function AddFeeds(userId, nextPage) {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/users/${userId}/feeds/native?page=${nextPage}`
      );
      setFeeds((prev) => {
        const newFeeds = response.data.data?.feeds || [];
        const uniqueNewFeeds = newFeeds.filter(
          (newFeed) => !prev.some((prevFeed) => prevFeed._id === newFeed._id)
        );
        return [...prev, ...uniqueNewFeeds];
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  /**
   *  // remove last feeds from feeds, when press to show less button
   */

  const ReduceFeeds = () => {
    return setFeeds((prev) => {
      const uniqueNewFeeds = feeds.filter(
        (newFeed) => !prev.some((prevFeed) => prevFeed._id === newFeed._id)
      );

      const minFeeds = 8;
      const removeCount = Math.min(prev.length - minFeeds, 8);

      const updatedPrev = prev.slice(0, prev.length - removeCount);
      return [...updatedPrev, ...uniqueNewFeeds];
    });
  };

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
   *  // remove star to feeds, when action in scroll gallery of user page
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
              marginTop: 5,
            }}
          >
            {feeds?.length > 0 ? (
              feeds?.map((item, index) => {
                return (
                  <FeedItem
                    navigation={navigation}
                    key={index}
                    x={index}
                    {...item}
                    targetUser={targetUser}
                    AddFeeds={AddFeeds}
                    ReduceFeeds={ReduceFeeds}
                    feedsLength={feedsLength}
                    page={page}
                    feedsLengthCurrent={feeds?.length}
                    feeds={feeds}
                    setFeeds={setFeeds}
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
          {feeds?.length > 8 && (
            <Pressable
              onPress={
                feedsLength > feeds?.length
                  ? () => AddFeeds(targetUser?._id, page + 1)
                  : ReduceFeeds
              }
              style={{
                padding: 10,
                borderRadius: 5,
                backgroundColor: currentTheme.background2,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text style={{ color: currentTheme.pink }}>
                {feedsLength > feeds?.length ? "Load More" : "Show Less"}
              </Text>
            </Pressable>
          )}
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

    // height: SCREEN_HEIGHT - SCREEN_HEIGHT / 3,
  },
});

const FeedItem = (props) => {
  let feeds = props.feeds.slice(props.x, props.feeds?.length);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const language = Language();
  /** delete image from db and cloud */
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const Deleting = async (itemId, itemName, itemFormat) => {
    setLoading(true);
    props.setFeeds((prev) => prev.filter((item) => item._id !== itemId));

    const values = [];
    /** delete from mongodb
     */

    /** delete from cloude
     */
    // Create a reference to the file to delete
    let fileRef;
    if (itemFormat === "video") {
      fileRef = ref(storage, `videos/${currentUser?._id}/feeds/${itemName}/`);
    } else {
      fileRef = ref(storage, `images/${currentUser?._id}/feeds/${itemName}`);
    }

    // remove feed
    const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/feeds/${itemId}`;
    const response = await fetch(url, { method: "DELETE" })
      .then((response) => response.json())
      .then(async (data) => {
        // Delete the file
        if (itemFormat === "video") {
          deleteObject(fileRef).then(() => {
            console.log("object deleted");
            dispatch(setRerenderUserFeed());
            setLoading(false);
          });
        } else {
          listAll(fileRef)
            .then((res) => {
              res.items.forEach((itemRef) => {
                deleteObject(itemRef).then(() => {
                  dispatch(setRerenderUserFeed());
                  console.log("storage success");
                  setLoading(false);
                });
              });
            })
            .catch((error) => {
              console.log("error : " + error);
            });
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
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

  return (
    <>
      <DeleteFeedPopup
        onClose={() => setConfirmDelete(false)}
        isVisible={confirmDelete}
        onDelete={() => Deleting(props._id, props.name, props?.fileFormat)}
        title={language.language.User.userPage.removeFeed}
        delet={language.language.User.userPage.remove}
        cancel={language.language.User.userPage.cancel}
        // delet,
        // cancel,
      />

      <TouchableOpacity
        style={{
          width: SCREEN_WIDTH / 2 - 1,
          height: SCREEN_WIDTH / 2 - 1,

          // borderRadius: 3,
        }}
        activeOpacity={0.5}
        onLongPress={
          currentUser._id === props.targetUser._id &&
          props.variant != "visitPage"
            ? () => {
                Vibration.vibrate();
                setConfirmDelete(true);
              }
            : undefined
        }
        delayLongPress={300}
        onPress={() => {
          props.navigation.navigate("ScrollGallery", {
            user: props.targetUser,
            scrolableFeeds: feeds,
            feeds: props.feeds,
            feedsLength: props.feedsLength,
            feedsLengthCurrent: props.feedsLengthCurrent,
            page: props.page,
          });
        }}
      >
        <View
          style={{
            position: "absolute",
            width: SCREEN_WIDTH / 2 - 1,
            height: SCREEN_WIDTH / 2 - 1,
            backgroundColor: "rgba(1,1,1,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={props.currentTheme.pink} />
        </View>
        <Animated.View style={{ opacity: fadeAnim }}>
          {props?.fileFormat === "video" ? (
            // <Pressable onPress={(event) => event.stopPropagation()}>
            <CacheableVideo
              type="userGallery"
              style={{
                width: SCREEN_WIDTH / 2 - 2,
                height: SCREEN_WIDTH / 2 - 2,
              }}
              source={{
                uri: props.video,
              }}
              useNativeControls={false}
              rate={1.0}
              volume={0}
              isMuted={false}
              shouldPlay
              isLooping
              resizeMode="cover"
              onLoad={() => setLoading(false)}
            />
          ) : (
            // </Pressable>
            <CacheableImage
              style={{
                width: SCREEN_WIDTH / 2 - 2,
                height: SCREEN_WIDTH / 2 - 2,
              }}
              source={{
                uri: props?.images[0].url,
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
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};
