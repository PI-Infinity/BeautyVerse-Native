import { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  RefreshControl,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "../components/profileCard";
import { setLoading } from "../redux/app";
import axios from "axios";
import { lightTheme, darkTheme } from "../context/theme";
import LoadingSkeleton from "../components/skeltonCards";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Cards = ({ navigation }) => {
  // Using Redux dispatch hook
  const dispatch = useDispatch();

  // Fetching the current user from Redux store
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // Fetching the current theme from Redux store and setting it
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // Setting up state for users array
  const [users, setUsers] = useState([]);

  // Setting up state for refresh and loading indicators
  const [refresh, setRefresh] = useState(false);
  const [loadingSkelton, setLoadingSkelton] = useState(true);

  // Reference to the FlatList
  const flatListRef = useRef(null);

  // Page number for paginated data
  const [page, setPage] = useState(1);

  // Reference to track if cards should be cleaned
  const cardsCleanRef = useRef(true);

  // Fetching various filters from Redux store
  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);
  const specialists = useSelector((state) => state.storeFilter.specialists);
  const salons = useSelector((state) => state.storeFilter.salons);
  const city = useSelector((state) => state.storeFilter.city);
  const district = useSelector((state) => state.storeFilter.district);

  // Fetching cleanUp flag from Redux store
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  // useEffect hook to get data from the API
  useEffect(() => {
    const Getting = async (currentPage) => {
      try {
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/cards?search=${search}&filter=${filter}&type=${
            specialists ? "specialist" : ""
          }${
            salons ? "beautyCenter" : ""
          }&city=${city}&district=${district}&check=${
            currentUser !== null ? currentUser._id : ""
          }&page=${currentPage}`
        );

        await setUsers(response.data.data.feedList);
        setTimeout(() => {
          setScrollY(0);
          setRefresh(false);
          setTimeout(() => {
            setLoadingSkelton(false);
          }, 300);
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 300);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setLoadingSkelton(false);
        }, 300);
      }
    };
    if (cardsCleanRef.current) {
      cardsCleanRef.current = false;
      setTimeout(() => {
        setTimeout(() => {
          setLoadingSkelton(false);
        }, 300);
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
      setTimeout(() => {
        setLoadingSkelton(false);
      }, 300);
    }, 500);
  }, [cleanUp]);

  // Setting up state and callback for scrolling
  const [scrollY, setScrollY] = useState(0);

  // useCallback is used to memoize the function for a given set of inputs
  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  }, []);

  // Fetching rerenderUserList flag from Redux store
  const rerenderUserList = useSelector(
    (state) => state.storeRerenders.rerenderUserList
  );
  // Function to get users with cards from the API
  const GetUsersWithCards = async (currentPage) => {
    try {
      const response = await axios.get(
        `https://beautyverse.herokuapp.com/api/v1/cards?search=${search}&filter=${filter}&type=${
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
        setRefresh(false);
        setTimeout(() => {
          setLoadingSkelton(false);
        }, 300);
      }, 300);
    } catch (error) {
      console.log(error.response.data.message);
      setTimeout(() => {
        setLoadingSkelton(false);
      }, 300);
    }
  };
  // useEffect hook to get users with cards when the currentUser or rerenderUserList changes
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    if (currentUser) {
      GetUsersWithCards(page);
    } else {
      setTimeout(() => {
        setRefresh(false);
        dispatch(setLoading(false));
      }, 300);
      setTimeout(() => {
        setTimeout(() => {
          setLoadingSkelton(false);
        }, 300);
      }, 500);
    }
  }, [currentUser, rerenderUserList]);

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefresh(true);
    setLoadingSkelton(true);
    setPage(1);
    setUsers([]);
    await GetUsersWithCards(1);
    setTimeout(() => {
      setRefresh(false);
    }, 500);
  }, []);

  // States for handling the opening of a card
  const [openCard, setOpenCard] = useState(false);
  const [openedCardObj, setOpenCardObj] = useState({});

  return (
    <View style={{ flex: 1 }}>
      {loadingSkelton && <LoadingSkeleton />}
      {users?.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={users}
          onScroll={handleScroll}
          scrollEventThrottle={1}
          numColumns={2}
          contentContainerStyle={styles.contentContainer}
          columnWrapperStyle={styles.columnWrapper}
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
            return (
              <Card
                key={index}
                x={index}
                user={item}
                loadingSkelton={loadingSkelton}
                users={users}
                navigation={navigation}
                cards={users}
              />
            );
          }}
          onEndReached={() => {
            setPage((prevPage) => {
              const nextPage = prevPage + 1;
              GetUsersWithCards(nextPage);
              return nextPage;
            });
          }}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: currentTheme.disabled }}>
            No Profiles found
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    zIndex: 10000,
    backgroundColor: "rgba(15,15,15,1)",
    paddingTop: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
