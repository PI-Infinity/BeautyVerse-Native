import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../../components/alertMessage";
import GetSharedFeed from "../../components/getSharedFeed";
import SkeletonComponent from "../../components/skelton";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { setSendReport } from "../../redux/alerts";
import { setFeedRefreshControl } from "../../redux/rerenders";
import { setFeedsScrollY, setFeedsScrollYF } from "../../redux/scrolls";
import { Feed } from "../../screens/feeds/feedCard/feedCard";
import { ScrollGallery } from "./scrollGallery";

/**
 * Feeds screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feeds = ({ navigation, firstLoading, setFirstLoading }) => {
  // defines when screen is focused
  const isFocused = useIsFocused();

  // defines theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user from redux
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  /*
   * feeds list state (For You & Followings)
   */
  const [feeds, setFeeds] = useState([]);

  const [followingsList, setFollowingsList] = useState([]);

  // defines navigator (for you list or followings list)
  const [activeList, setActiveList] = useState(false);

  /*
  page defines query for backend
  this state used to add new users on scrolling. when page changes, in state adds new users with last feeds
  */

  const [page, setPage] = useState(1);

  // Selector for the cleanup state
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // refresh inidcator animation
  const opacityValue = useRef(new Animated.Value(0)).current;
  const transformScroll = useRef(new Animated.Value(0)).current;

  const openLoading = () => {
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(transformScroll, {
        toValue: 60,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeLoading = () => {
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(transformScroll, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /**
   * Get feeds function when screen loads
   */

  const GettingFeeds = async () => {
    openLoading();

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?check=${currentUser._id}&page=1&limit=3`
      );
      setFeeds(response.data.data.feedlist);

      setTimeout(() => {
        closeLoading();
        setFirstLoading(false);
        setPage(1);
      }, 500);
    } catch (error) {
      console.log(error.response.data.message);
      setPage(1);
    }
  };
  useEffect(() => {
    GettingFeeds();
  }, [cleanUp]);

  // Callback to handle scroll
  const scrollYRefF = useRef(0);

  // followgins page state
  const [fPage, setFPage] = useState(1);

  // Function to get feed data from server
  const GetFollowingsFeeds = async () => {
    // setFirstLoading(true);
    openLoading();
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/followings?check=${currentUser._id}&page=1&limit=3`
      );
      setFollowingsList(response.data.data.feedlist);

      setTimeout(() => {
        dispatch(setFeedRefreshControl(false));
        closeLoading();
        setFirstLoading(false);
        setFPage(1);
      }, 500);
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(setFeedRefreshControl(false));
      setFPage(1);
    }
  };
  // getting followings feeds
  useEffect(() => {
    GetFollowingsFeeds();
  }, [cleanUp]);

  /**
   * Function to get new feeds and adding them in state while user scrolling to bottom
   * (used for both, For You and for Followings feeds)
   *  */
  const AddFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?page=${currentPage}&check=${currentUser._id}&limit=3`
      );

      // Update users' state with new feed data
      setFeeds((prev) => {
        const newUsers = response.data.data.feedlist;
        return newUsers.reduce((acc, curr) => {
          const existingUserIndex = acc.findIndex(
            (user) => user._id === curr._id
          );
          if (existingUserIndex !== -1) {
            // User already exists, merge the data
            const mergedUser = { ...acc[existingUserIndex], ...curr };
            return [
              ...acc.slice(0, existingUserIndex),
              mergedUser,
              ...acc.slice(existingUserIndex + 1),
            ];
          } else {
            // User doesn't exist, add to the end of the array
            return [...acc, curr];
          }
        }, prev);
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
    dispatch(setFeedRefreshControl(false));
  };
  // adding for followings feeds
  const AddFollowingsFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/followings?page=${currentPage}&check=${currentUser._id}&limit=3`
      );

      // Update users' state with new feed data
      setFollowingsList((prev) => {
        const newUsers = response.data.data.feedlist;
        return newUsers.reduce((acc, curr) => {
          const existingUserIndex = acc.findIndex(
            (user) => user._id === curr._id
          );
          if (existingUserIndex !== -1) {
            // User already exists, merge the data
            const mergedUser = { ...acc[existingUserIndex], ...curr };
            return [
              ...acc.slice(0, existingUserIndex),
              mergedUser,
              ...acc.slice(existingUserIndex + 1),
            ];
          } else {
            // User doesn't exist, add to the end of the array
            return [...acc, curr];
          }
        }, prev);
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
    dispatch(setFeedRefreshControl(false));
  };

  const flatListRef = useRef();
  const flatListRefF = useRef();

  // Callback to handle scroll
  const scrollYRef = useRef(0);

  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    dispatch(setFeedsScrollY(offsetY));

    scrollYRef.current = offsetY; // Store the scroll position in scrollYRef, not flatListRef
  }, []);

  const handleScrollF = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    dispatch(setFeedsScrollYF(offsetY));

    scrollYRefF.current = offsetY; // Store the scroll position in scrollYRef, not flatListRef
  }, []);

  // State to keep track of displayed video index
  const [currentIndex, setCurrentIndex] = useState(0);

  const AddView = async (userId, itemid) => {
    try {
      if (userId !== currentUser._id) {
        await axios.patch(backendUrl + "/api/v1/feeds/" + itemid + "/view", {
          view: currentUser._id,
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // useRef to keep track of viewable items
  const onViewableItemsChangedRef = useRef(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      const topVisibleItemIndex = viewableItems[0].index;
      const topVisibleItem = viewableItems[0];
      AddView(topVisibleItem.item?.owner._id, topVisibleItem.item?._id);
      setCurrentIndex(topVisibleItemIndex);
    }
  });

  // useMemo to memoize the viewabilityConfig
  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 70, // at least 70% of the item should be visible
    }),
    []
  );

  // view first item
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current && feeds.length > 0) {
      AddView(feeds[0]?.owner._id, feeds[0]?._id);
      isFirstRender.current = false;
    }
  }, [feeds]);

  /**
   * alert messages
   */
  // send report
  const sendReport = useSelector((state) => state.storeAlerts.sendReport);

  // zoom to top on change dependency
  const zoomToTop = useSelector((state) => state.storeApp.zoomToTop);
  let firstRend = useRef();
  useEffect(() => {
    if (firstRend.current) {
      firstRend.current = false;
      return;
    }
    // if (!activeList) {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    // } else {
    flatListRefF.current?.scrollToOffset({ offset: 0, animated: true });
    // }
    // }
  }, [zoomToTop]);

  // animation bottom line
  const position = useRef(new Animated.Value(0)).current;
  // const [activeHelper, setActiveHelper] = useState(true);
  const slideToLeft = () => {
    Animated.timing(position, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const slideToRight = () => {
    Animated.timing(position, {
      toValue: SCREEN_WIDTH / 2,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  /**
   * user feeds gallery
   */
  const [activeGallery, setActiveGallery] = useState(null);

  // Initial state for the animated value
  const translateXValue = useRef(new Animated.Value(0)).current;

  const handlePressLeft = () => {
    setActiveList(false);
    slideToLeft();

    // Animate translateX to 0 (extreme left)
    Animated.timing(translateXValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
    }).start();
    // Other function logic
  };

  const handlePressRight = () => {
    setActiveList(true);
    slideToRight();

    // Animate translateX to negative one screen width (to the left)
    Animated.timing(translateXValue, {
      toValue: -Dimensions.get("window").width,
      useNativeDriver: true,
      duration: 200,
    }).start();
    // Other function logic
  };

  return (
    <View style={{ flex: 1 }}>
      <GetSharedFeed />
      {activeGallery && (
        <Modal isVisible={activeGallery} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              paddingTop: SCREEN_HEIGHT / 15,
              backgroundColor: currentTheme.background,
            }}
          >
            {/* <View style={{ flex: 1, backgroundColor: "green" }}></View> */}
            <ScrollGallery
              route={{ params: activeGallery }}
              setActiveGallery={setActiveGallery}
            />
          </View>
        </Modal>
      )}

      {firstLoading && (
        <View
          style={{
            position: "absolute",
            zIndex: 11111,
            width: SCREEN_WIDTH,
            top: 40,
            height: SCREEN_HEIGHT,
          }}
        >
          <SkeletonComponent />
        </View>
      )}
      <AlertMessage
        isVisible={sendReport}
        onClose={() => dispatch(setSendReport(false))}
        type="success"
        text="The Report sent succesfully!"
      />
      <View>
        <NavigatorComponent
          activeList={activeList}
          currentTheme={currentTheme}
          setActiveList={setActiveList}
          handlePressRight={handlePressRight}
          handlePressLeft={handlePressLeft}
          position={position}
        />

        <Animated.View
          style={{
            opacity: opacityValue,
            transform: [{ scale: 1.2 }],
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            color={currentTheme.pink}
            style={{ position: "absolute", top: 15 }}
            size={20}
          />
        </Animated.View>
      </View>
      <Animated.View
        style={{
          width: SCREEN_WIDTH * 2,
          flex: 1,
          flexDirection: "row",
          transform: [{ translateY: transformScroll }],
        }}
      >
        <Animated.View
          style={{
            width: SCREEN_WIDTH * 2,
            flex: 1,
            flexDirection: "row",
            transform: [{ translateX: translateXValue }],
          }}
        >
          {feeds?.length > 0 ? (
            <FlatList
              contentContainerStyle={{ minHeight: SCREEN_HEIGHT }}
              style={{}}
              showsVerticalScrollIndicator={false}
              ref={flatListRef}
              data={feeds}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                return (
                  <Feed
                    x={index}
                    feed={item}
                    navigation={navigation}
                    feeds={feeds}
                    currentIndex={currentIndex}
                    isFocused={isFocused}
                    feedsLength={feeds?.length}
                    setActiveGallery={setActiveGallery}
                  />
                );
              }}
              onEndReached={() => {
                AddFeeds(page + 1);
                setPage(page + 1);
              }}
              onEndReachedThreshold={1}
              keyExtractor={(item) => item?._id}
              onViewableItemsChanged={onViewableItemsChangedRef.current}
              viewabilityConfig={viewabilityConfig}
            />
          ) : (
            <View
              style={{
                width: SCREEN_WIDTH,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: currentTheme.disabled }}>
                No Feeds found
              </Text>
            </View>
          )}
          {followingsList?.length > 0 ? (
            <FlatList
              contentContainerStyle={{ minHeight: SCREEN_HEIGHT }}
              style={{}}
              showsVerticalScrollIndicator={false}
              ref={flatListRefF}
              data={followingsList}
              onScroll={handleScrollF}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                return (
                  <Feed
                    x={index}
                    feed={item}
                    navigation={navigation}
                    feeds={feeds}
                    currentIndex={currentIndex}
                    isFocused={isFocused}
                    feedsLength={feeds?.length}
                    setActiveGallery={setActiveGallery}
                  />
                );
              }}
              onEndReached={() => {
                AddFollowingsFeeds(fPage + 1);
                setFPage(fPage + 1);
              }}
              onEndReachedThreshold={0.5}
              keyExtractor={(item) => item?._id}
              onViewableItemsChanged={onViewableItemsChangedRef.current}
              viewabilityConfig={viewabilityConfig}
            />
          ) : (
            <View
              style={{
                width: SCREEN_WIDTH,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: currentTheme.disabled }}>
                No Feeds found
              </Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const NavigatorComponent = ({
  activeList,
  currentTheme,
  setActiveList,
  handlePressLeft,
  handlePressRight,
  slideToRight,
  slideToLeft,
  position,
}) => {
  const fadeInOpacity = useRef(new Animated.Value(0.5)).current;
  const fadeInOpacity2 = useRef(new Animated.Value(0.5)).current;
  const language = Language();
  useEffect(() => {
    if (!activeList) {
      Animated.timing(fadeInOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeInOpacity2, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeInOpacity2, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeInOpacity, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [activeList]);
  return (
    <View
      style={{
        width: "100%",
        height: 40,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          handlePressLeft();
        }}
        style={{
          flex: 1,
          alignItems: "center",
          paddingVertical: 10,
          borderBottomWidth: 1.5,
          borderBottomColor: currentTheme.line,
        }}
      >
        <Animated.Text
          style={{
            opacity: fadeInOpacity,
            color: currentTheme.font,
            letterSpacing: 0.3,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {language.language.Main.feedCard.forYou}
        </Animated.Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          // dispatch(setZoomToTop());
          // slideToRight();
          handlePressRight();
        }}
        style={{
          flex: 1,
          alignItems: "center",
          paddingVertical: 10,
          borderBottomWidth: 1.5,
          borderBottomColor: currentTheme.line,
        }}
      >
        <Animated.Text
          style={{
            opacity: fadeInOpacity2,
            color: currentTheme.font,
            letterSpacing: 0.3,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {language.language.User.userPage.followings}
        </Animated.Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.line,
          {
            backgroundColor: currentTheme.pink,
            transform: [{ translateX: position }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    position: "absolute",
    bottom: 0,
    width: SCREEN_WIDTH / 2,
    height: 1.5,
    backgroundColor: "red",
  },
});
