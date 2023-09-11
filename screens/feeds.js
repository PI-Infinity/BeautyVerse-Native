import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import {
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../components/alertMessage";
import { Feed } from "../components/feedCard/feedCard";
import SkeletonComponent from "../components/skelton";
import { darkTheme, lightTheme } from "../context/theme";
import { setSendReport } from "../redux/alerts";
import { setCleanUp, setFeedRefreshControl } from "../redux/rerenders";
import { setLoading, setZoomToTop } from "../redux/app";
import * as Location from "expo-location";
import GetSharedFeed from "../components/getSharedFeed";

/**
 * Feeds screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feeds = ({
  navigation,
  scrollY,
  setScrollY,
  setScrollYF,
  firstLoading,
  setFirstLoading,
}) => {
  // refresh state
  const refresh = useSelector(
    (state) => state.storeRerenders.feedRefreshControl
  );

  // defines when screen focused
  const isFocused = useIsFocused();

  // defines theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user from redux
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  /*
   * users states with last feed
   */
  const [feeds, setFeeds] = useState([]);
  const [followingsList, setFollowingsList] = useState([]);

  // defines navigator of for you list or followings list
  const [activeList, setActiveList] = useState(false);

  /*
  page defines query for backend
  this state used to add new users on scrolling. when page changes, in state adds new users with last feeds
  */

  const [page, setPage] = useState(1);

  // Selector for the cleanup state
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  // define active app language
  const lang = useSelector((state) => state.storeApp.language);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const [loading, setLoading] = useState(true);

  // refresh inidcator animation
  const opacityValue = useRef(new Animated.Value(0)).current;
  const transformScroll = useRef(new Animated.Value(0)).current;

  const openLoading = () => {
    setLoading(true);
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(transformScroll, {
        toValue: 60,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeLoading = () => {
    setLoading(false);
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 300,
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
   * Get users function when screen loads
   */
  // Function to get feed data from server

  const Getting = async () => {
    openLoading();

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?check=${currentUser._id}&page=1&followings=false`
      );
      setFeeds(response.data.data.feedlist);
      setTimeout(() => {
        dispatch(setFeedRefreshControl(false));
        closeLoading();
        setFirstLoading(false);
        setPage(1);
      }, 500);
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(setFeedRefreshControl(false));
      setPage(1);
    }
  };
  useEffect(() => {
    Getting();
  }, [cleanUp]);

  // Callback to handle scroll
  const scrollYRefF = useRef(0);

  // Function to get feed data from server
  const GettingFollowers = async () => {
    // setFirstLoading(true);
    openLoading();
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?check=${currentUser._id}&page=1&followings=true`
      );
      setFollowingsList(response.data.data.feedlist);

      setTimeout(() => {
        dispatch(setFeedRefreshControl(false));
        closeLoading();
        setFirstLoading(false);
        setPage(1);
      }, 500);
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(setFeedRefreshControl(false));
      setPage(1);
    }
  };
  // getting followings feeds
  useEffect(() => {
    GettingFollowers();
  }, [cleanUp]);

  /**
   * Function to get new users with feeds and adding them in user state while user scrolling to bottom
   *  */
  const AddUsersWithFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?page=${currentPage}&check=${currentUser._id}&followings=${activeList}`
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

  const flatListRef = useRef();
  const flatListRefF = useRef();

  // Callback to handle scroll
  const scrollYRef = useRef(0);

  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);

    scrollYRef.current = offsetY; // Store the scroll position in scrollYRef, not flatListRef
  }, []);

  const handleScrollF = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollYF(offsetY);

    scrollYRefF.current = offsetY; // Store the scroll position in scrollYRef, not flatListRef
  }, []);

  // State to keep track of displayed video index
  const [currentIndex, setCurrentIndex] = useState(0);

  const AddView = async (userId, itemid) => {
    try {
      if (userId !== currentUser._id) {
        const response = await axios.patch(
          backendUrl + "/api/v1/feeds/" + itemid + "/view",
          {
            view: currentUser._id,
          }
        );
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
    if (!activeList) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } else {
      flatListRefF.current?.scrollToOffset({ offset: 0, animated: true });
    }
    // }
  }, [zoomToTop]);

  // animation bottom line
  const position = useRef(new Animated.Value(0)).current;
  const [activeHelper, setActiveHelper] = useState(true);
  const slideToLeft = () => {
    Animated.timing(position, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const slideToRight = () => {
    Animated.timing(position, {
      toValue: SCREEN_WIDTH / 2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const scrollRef = useRef();

  const handlePressLeft = () => {
    scrollRef.current.scrollTo({
      x: 0, // Scroll to the extreme left
      animated: true,
    });
    setActiveList(false);
    slideToLeft();
    setActiveHelper(true);
  };

  const handlePressRight = () => {
    scrollRef.current.scrollTo({
      x: Dimensions.get("window").width, // Scroll to the width of the screen (or another value to determine how far to scroll to the right)
      animated: true,
    });
    setActiveList(true);
    slideToRight();
    setActiveHelper(false);
  };

  // useEffect()

  return (
    <View style={{ flex: 1 }}>
      <GetSharedFeed />

      {firstLoading && (
        <View
          style={{
            position: "absolute",
            zIndex: 11111,
            width: SCREEN_WIDTH,
            top: 40,
            backgroundColor: currentTheme.background,
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
          slideToLeft={slideToLeft}
          slideToRight={slideToRight}
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
          />
        </Animated.View>
      </View>
      <Animated.ScrollView
        ref={scrollRef}
        onMomentumScrollBegin={
          activeHelper
            ? () => {
                slideToRight();
                setActiveHelper(false);
                setActiveList(true);
              }
            : () => {
                slideToLeft();
                setActiveHelper(true);
                setActiveList(false);
              }
        }
        horizontal
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, transform: [{ translateY: transformScroll }] }}
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
                />
              );
            }}
            onEndReached={() => {
              AddUsersWithFeeds(page + 1);
              setPage(page + 1);
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
            <Text style={{ color: currentTheme.disabled }}>No Feeds found</Text>
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
                />
              );
            }}
            onEndReached={() => {
              AddUsersWithFeeds(page + 1);
              setPage(page + 1);
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
            <Text style={{ color: currentTheme.disabled }}>No Feeds found</Text>
          </View>
        )}
      </Animated.ScrollView>
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
  useEffect(() => {
    if (!activeList) {
      Animated.timing(fadeInOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeInOpacity2, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeInOpacity2, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeInOpacity, {
        toValue: 0.5,
        duration: 200,
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
          // dispatch(setZoomToTop());
          // slideToLeft();
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
          For you
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
          Followings
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
