import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  RefreshControl,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Feed } from "../components/feedCard/feedCard";
import axios from "axios";
import { setRerenderCurrentUser } from "../redux/rerenders";
import { useIsFocused } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { lightTheme, darkTheme } from "../context/theme";
import SkeletonComponent from "../components/skelton";
import AlertMessage from "../components/alertMessage";
import { setSendReport } from "../redux/alerts";

const { height: hght, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feeds = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const SCREEN_HEIGHT = hght - tabBarHeight - headerHeight;

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const flatListRef = useRef(null);
  const [page, setPage] = useState(1);

  // A ref to keep track of the feeds
  const feedsCleanRef = useRef(true);

  // Selectors for various filters
  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);
  const specialists = useSelector((state) => state.storeFilter.specialists);
  const salons = useSelector((state) => state.storeFilter.salons);
  const city = useSelector((state) => state.storeFilter.city);
  const district = useSelector((state) => state.storeFilter.district);

  // Selector for the cleanup state
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  // Effect to handle the cleanup of the feed
  useEffect(() => {
    // Function to get feed data from server
    const Getting = async (currentPage) => {
      try {
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/feeds?search=${search}&filter=${filter}&type=${
            specialists ? "specialist" : ""
          }${
            salons ? "beautycenter" : ""
          }&city=${city}&district=${district}&page=${currentPage}`
        );
        await setUsers(response.data.data.feedList);
        setTimeout(() => {
          setScrollY(0);
          setRefresh(false);
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 300);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    if (feedsCleanRef.current) {
      feedsCleanRef.current = false;
      return;
    }
    if (scrollY < 10) {
      setRefresh(true);
      Getting(1);
      setPage(1);
    } else {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      setScrollY(0);
    }
    setTimeout(() => {
      dispatch(setRerenderCurrentUser());
    }, 500);
  }, [cleanUp]);

  // Selector for user list rerender
  const rerenderUserList = useSelector(
    (state) => state.storeRerenders.rerenderUserList
  );

  // Function to get users with feeds
  const GetUsersWithFeeds = async (currentPage) => {
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
      await setUsers((prev) => {
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
      setTimeout(() => {
        setRefresh(false);
      }, 300);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // useEffect to handle feed and user data fetching based on current user and rerenderUserList
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    if (currentUser) {
      GetUsersWithFeeds(page);
    } else {
      setTimeout(() => {
        setRefresh(false);
      }, 300);
    }
  }, [currentUser, rerenderUserList]);

  // Define scrolling
  const [scrollY, setScrollY] = useState(0);

  // Callback to handle scroll
  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  }, []);

  // Callback to handle refresh
  const onRefresh = useCallback(async () => {
    setRefresh(true);
    setLoading(true);
    setPage(1);
    setUsers([]);
    await GetUsersWithFeeds(1);
    setTimeout(() => {
      setRefresh(false);
    }, 500);
  }, []);

  // State to handle open feed
  const [openFeed, setOpenFeed] = useState(false);
  const [openedFeedObj, setOpenFeedObj] = useState({});

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
          // // pagingEnabled={true}
          // bounces={Platform.OS === "ios" ? false : undefined}
          // overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          refreshControl={
            <RefreshControl
              tintColor="#ccc"
              refreshing={refresh}
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
                  setLoading={setLoading}
                />
              );
            } else {
              setTimeout(() => {
                setLoading(false);
              }, 2000);
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
              GetUsersWithFeeds(nextPage);
              return nextPage;
            });
          }}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
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

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    zIndex: 10000,
    backgroundColor: "rgba(15,15,15,1)",
  },
});
