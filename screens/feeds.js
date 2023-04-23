import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  RefreshControl,
  Text,
  Animated,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Feed } from "../components/feedCard";
import { setLoading } from "../redux/app";
import axios from "axios";
import { setRerenderUserList } from "../redux/rerenders";
import { Skeleton } from "@rneui/themed";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Feeds = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const [users, setUsers] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const [loadingSkelton, setLoadingSkelton] = useState(true);

  const flatListRef = useRef(null);

  const [page, setPage] = useState(1);

  // define scrolling

  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  const feedsCleanRef = useRef(true);

  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);
  const specialists = useSelector((state) => state.storeFilter.specialists);
  const salons = useSelector((state) => state.storeFilter.salons);
  const city = useSelector((state) => state.storeFilter.city);
  const district = useSelector((state) => state.storeFilter.district);

  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  useEffect(() => {
    const Getting = async (currentPage) => {
      try {
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/feeds?search=${search}&filter=${filter}&type=${
            specialists ? "specialist" : ""
          }${
            salons ? "beautyCenter" : ""
          }&city=${city}&district=${district}&page=${currentPage}`
        );
        await setUsers(response.data.data.feedList);
        setTimeout(() => {
          setScrollY(0);
          setRefresh(false);
          setLoadingSkelton(false);
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 300);
      } catch (error) {
        console.log(error);
      }
    };
    if (feedsCleanRef.current) {
      feedsCleanRef.current = false;
      setTimeout(() => {
        setLoadingSkelton(false);
      }, 500);
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
      setLoadingSkelton(false);
    }, 500);
  }, [cleanUp]);

  const rerenderUserList = useSelector(
    (state) => state.storeRerenders.rerenderUserList
  );

  const GetUsersWithFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/feeds?search=${search}&filter=${filter}&type=${
          specialists ? "specialist" : ""
        }${
          salons ? "beautyCenter" : ""
        }&city=${city}&district=${district}&check=${
          currentUser !== null ? currentUser._id : ""
        }&page=${currentPage}`
      );
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
        console.log("false");
        setRefresh(false);
        dispatch(setLoading(false));
      }, 300);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    if (currentUser) {
      GetUsersWithFeeds(page);
    } else {
      setTimeout(() => {
        setRefresh(false);
        dispatch(setLoading(false));
      }, 300);
      setTimeout(() => {
        setLoadingSkelton(false);
      }, 500);
    }
  }, [currentUser, rerenderUserList]);

  const onRefresh = async () => {
    setRefresh(true);
    setLoadingSkelton(true);
    setPage(1);
    setUsers([]);
    GetUsersWithFeeds(1);
    setTimeout(() => {
      setRefresh(false);
    }, 500);
    setTimeout(() => {
      setLoadingSkelton(false);
    }, 1000);
  };

  // open feed
  const [openFeed, setOpenFeed] = useState(false);
  const [openedFeedObj, setOpenFeedObj] = useState({});

  return (
    <View style={{ flex: 1 }}>
      <FlatList
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
          if (item.feed) {
            return (
              <Feed
                x={index}
                user={item}
                loadingSkelton={loadingSkelton}
                setOpenFeed={setOpenFeed}
                setOpenFeedObj={setOpenFeedObj}
                users={users}
                navigation={navigation}
                feeds={users}
              />
            );
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    zIndex: 10000,
    backgroundColor: "rgba(15,15,15,1)",
  },
});
