import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, RefreshControl, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../components/alertMessage";
import { Feed } from "../components/feedCard/feedCard";
import SkeletonComponent from "../components/skelton";
import { darkTheme, lightTheme } from "../context/theme";
import { setSendReport } from "../redux/alerts";
import { setCleanUp, setFeedRefreshControl } from "../redux/rerenders";
import { setLoading } from "../redux/app";
import * as Location from "expo-location";
/**
 * Feeds screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feeds = ({
  navigation,
  setScrollY,
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
  const [users, setUsers] = useState([]);

  /*
  page defines query for backend
  this state used to add new users on scrolling. when page changes, in state adds new users with last feeds
  */

  const [page, setPage] = useState(1);

  // Selectors for various filters
  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);
  const specialists = useSelector((state) => state.storeFilter.specialists);
  const salons = useSelector((state) => state.storeFilter.salons);
  const shops = useSelector((state) => state.storeFilter.shops);
  const city = useSelector((state) => state.storeFilter.city);
  const district = useSelector((state) => state.storeFilter.district);

  // defines location
  const location = useSelector((state) => state.storeApp.location);

  // Selector for the cleanup state
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  // define active app language
  const lang = useSelector((state) => state.storeApp.language);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Get users function when screen loads
   */
  useEffect(() => {
    // Function to get feed data from server
    const Getting = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/feeds?search=${search}&filter=${filter}&type=${
            specialists ? "specialist" : ""
          }${salons ? "beautycenter" : ""}${
            shops ? "shop" : ""
          }&city=${city}&district=${district}&page=1&country=${
            location.country ? location.country : currentUser.address[0].country
          }`
        );
        setUsers(response.data.data.feedList);
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status === "denied" && response.data.data.feedList?.length < 1) {
        //   dispatch(setLoading(false));
        // }
        setTimeout(() => {
          dispatch(setFeedRefreshControl(false));
          setFirstLoading(false);
          setPage(1);
        }, 500);
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(setFeedRefreshControl(false));
        setPage(1);
      }
    };
    Getting();
  }, [cleanUp, city]);

  const flatListRef = useRef();

  /**
   * Function to get new users with feeds and adding them in user state while user scrolling to bottom
   *  */
  const AddUsersWithFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?search=${search}&filter=${filter}&type=${
          specialists ? "specialist" : ""
        }${salons ? "beautycenter" : ""}${
          shops ? "shop" : ""
        }&city=${city}&district=${district}&check=${
          currentUser !== null ? currentUser._id : ""
        }}&page=${currentPage}&country=${
          location.country ? location.country : currentUser.address[0].country
        }`
      );

      // Update users' state with new feed data
      setUsers((prev) => {
        const newUsers = response.data.data.feedList;
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

  // Callback to handle scroll
  const scrollYRef = useRef(0);

  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
    scrollYRef.current = offsetY; // Store the scroll position in scrollYRef, not flatListRef
  }, []);

  // Callback to handle refresh
  const onRefresh = useCallback(async () => {
    dispatch(setFeedRefreshControl(true));
    dispatch(setCleanUp());
    setPage(1);
  }, []);

  // State to keep track of displayed video index
  const [currentIndex, setCurrentIndex] = useState(0);
  // useRef to keep track of viewable items
  const onViewableItemsChangedRef = useRef(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      const topVisibleItemIndex = viewableItems[0].index;
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
    if (scrollYRef.current > 0) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [zoomToTop]);

  return (
    <View style={{ flex: 1 }}>
      {firstLoading && (
        <View
          style={{
            position: "absolute",
            zIndex: 11111,
            width: SCREEN_WIDTH,
            top: 0,
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
      {users?.length > 0 ? (
        <FlatList
          contentContainerStyle={{ minHeight: SCREEN_HEIGHT }}
          style={{}}
          showsVerticalScrollIndicator={false}
          ref={flatListRef}
          data={users}
          onScroll={handleScroll}
          scrollEventThrottle={1}
          refreshControl={
            <RefreshControl
              tintColor="#ccc"
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item, index }) => {
            return (
              <Feed
                x={index}
                user={item}
                navigation={navigation}
                feeds={users}
                currentIndex={currentIndex}
                isFocused={isFocused}
                feedsLength={users?.length}
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
            flex: 1,

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: currentTheme.disabled }}>No Feeds found</Text>
        </View>
      )}
    </View>
  );
};
