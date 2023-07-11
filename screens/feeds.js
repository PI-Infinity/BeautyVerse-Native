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
import { setCleanUp, setRerenderCurrentUser } from "../redux/rerenders";

/**
 * Feeds screen
 */

const { height: hght, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feeds = ({ navigation }) => {
  // loading state
  const [loading, setLoading] = useState(true);

  // defines when screen focused
  const isFocused = useIsFocused();

  // defines theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines header height
  const headerHeight = useHeaderHeight();

  // defines bottom tab bar height
  const tabBarHeight = useBottomTabBarHeight();

  // defines sreen height without header and tab bar height
  const SCREEN_HEIGHT = hght - tabBarHeight - headerHeight;

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user from redux
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  /*
   * users states with last feed
   */
  const [users, setUsers] = useState([]);

  // defines ref for FlatList where mapped users
  const flatListRef = useRef(null);

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
  const city = useSelector((state) => state.storeFilter.city);
  const district = useSelector((state) => state.storeFilter.district);

  // Selector for the cleanup state
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  /**
   * Get users function when screen loads
   */
  useEffect(() => {
    // Function to get feed data from server
    const Getting = async (currentPage) => {
      setLoading(true);
      try {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/feeds?search=${search}&filter=${filter}&type=${
            specialists ? "specialist" : ""
          }${
            salons ? "beautycenter" : ""
          }&city=${city}&district=${district}&page=${currentPage}`
        );
        setUsers(response.data.data.feedList);
        setTimeout(() => {
          // setScrollY(0);
          setLoading(false);
        }, 300);
      } catch (error) {
        setLoading(false);
        console.log(error.response.data.message);
      }
    };

    if (scrollY < 10) {
      setUsers([]);
      Getting(1);
      setPage(1);
    } else {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      setScrollY(0);
    }
    dispatch(setRerenderCurrentUser());
    // when clean up state changes, reloads users state
  }, [cleanUp]);

  // Selector for user list rerender
  const rerenderUserList = useSelector(
    (state) => state.storeRerenders.rerenderUserList
  );

  /**
   * Function to get new users with feeds and adding them in user state while user scrolling to bottom
   *  */
  const AddUsersWithFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/feeds?search=${search}&filter=${filter}&type=${
          specialists ? "specialist" : ""
        }${
          salons ? "beautycenter" : ""
        }&city=${city}&district=${district}&check=${
          currentUser !== null ? currentUser._id : ""
        }}&page=${currentPage}`
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
  };

  // avoid first render for useEffect which used adding new users
  const isFirstRender = useRef(true);

  // useEffect to handle feed and user data fetching based on current user and rerenderUserList
  useEffect(() => {
    if (isFirstRender.current) {
      setLoading(false);
      isFirstRender.current = false; // set to false after the first render
      return;
    }
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    if (currentUser) {
      AddUsersWithFeeds(page);
    }
  }, [rerenderUserList]);

  // Define scrolling
  const [scrollY, setScrollY] = useState(0);

  const scrollRef = useRef(0);

  // Callback to handle scroll
  const handleScroll = useCallback(
    (event) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      // Remember the current scroll position for the next scroll event
      scrollRef.current = offsetY;
    },
    [scrollRef]
  );

  // Callback to handle refresh
  const onRefresh = useCallback(async () => {
    setPage(1);
    dispatch(setCleanUp());
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

  return (
    <>
      {loading && (
        <View
          style={{
            position: "absolute",
            zIndex: 11111,
            width: SCREEN_WIDTH,
            top: 0,
            backgroundColor: currentTheme.background,
            height: "100%",
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
          contentContainerStyle={{}}
          style={{}}
          showsVerticalScrollIndicator={false}
          ref={flatListRef}
          data={users}
          onScroll={handleScroll}
          scrollEventThrottle={1}
          refreshControl={
            <RefreshControl
              tintColor="#ccc"
              refreshing={loading}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item, index }) => {
            if (item.feed) {
              return (
                <Feed
                  x={index}
                  user={item}
                  navigation={navigation}
                  feeds={users}
                  currentIndex={currentIndex}
                  isFocused={isFocused}
                />
              );
            } else {
              if (index === 0) {
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      height: SCREEN_HEIGHT,
                    }}
                  >
                    <Text style={{ color: currentTheme.disabled }}>
                      No Feeds Found!
                    </Text>
                  </View>
                );
              }
            }
          }}
          onEndReached={() => {
            setPage((prevPage) => {
              const nextPage = prevPage + 1;
              AddUsersWithFeeds(nextPage);
              return nextPage;
            });
          }}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item?._id}
          // showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChangedRef.current}
          viewabilityConfig={viewabilityConfig}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: currentTheme.disabled }}>No Feeds found</Text>
        </View>
      )}
    </>
  );
};
