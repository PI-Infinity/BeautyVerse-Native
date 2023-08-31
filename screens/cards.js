import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../components/profileCard";
import LoadingSkeleton from "../components/skeltonCards";
import { darkTheme, lightTheme } from "../context/theme";
import { setCleanUp, setCardRefreshControl } from "../redux/rerenders";

/**
 * Cards Screen component
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Cards = ({ navigation, setScrollY }) => {
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
  const refresh = useSelector(
    (state) => state.storeRerenders.cardRefreshControl
  );
  const [loadingSkelton, setLoadingSkelton] = useState(true);

  // Page number for paginated data
  const [page, setPage] = useState(1);

  // Fetching various filters from Redux store
  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);
  const specialists = useSelector((state) => state.storeFilter.specialists);
  const salons = useSelector((state) => state.storeFilter.salons);
  const shops = useSelector((state) => state.storeFilter.shops);
  const city = useSelector((state) => state.storeFilter.city);
  const district = useSelector((state) => state.storeFilter.district);

  // Fetching cleanUp flag from Redux store
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  // defines location
  const location = useSelector((state) => state.storeApp.location);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // useEffect hook to get data from the API
  useEffect(() => {
    const Getting = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/cards?search=${search}&filter=${filter}&type=${
            specialists ? "specialist" : ""
          }${salons ? "beautyCenter" : ""}${
            shops ? "shop" : ""
          }&city=${city}&district=${district}&check=${
            currentUser !== null ? currentUser._id : ""
          }&page=${1}&limit=8&country=${
            location.country ? location.country : currentUser.address[0].country
          }`
        );

        setUsers(response.data.data.feedList);
        setTimeout(() => {
          setLoadingSkelton(false);
          dispatch(setCardRefreshControl(false));
          setPage(1);
        }, 300);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setLoadingSkelton(false);
          setPage(1);
        }, 300);
      }
    };
    Getting();
  }, [cleanUp, location]);

  const flatListRef = useRef();

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
        `${backendUrl}/api/v1/cards?search=${search}&filter=${filter}&type=${
          specialists ? "specialist" : ""
        }${salons ? "beautyCenter" : ""}${
          shops ? "shop" : ""
        }&city=${city}&district=${district}&check=${
          currentUser !== null ? currentUser._id : ""
        }&page=${currentPage}&limit=8&country=${
          location.country ? location.country : currentUser.address[0].country
        }`
      );
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
      setTimeout(() => {
        setLoadingSkelton(false);
      }, 100);
    }
  };

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    dispatch(setCardRefreshControl(true));
    setPage(1);
    dispatch(setCleanUp());
  }, []);

  // zoom to top on change dependency
  const zoomToTop = useSelector((state) => state.storeApp.zoomToTop);
  let firstRend = useRef();
  useEffect(() => {
    if (firstRend.current) {
      firstRend.current = false;
      return;
    }
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [zoomToTop]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: users?.length > 0 ? "flex-start" : "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {loadingSkelton ? (
        <View
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={currentTheme.pink} size="large" />
        </View>
      ) : users?.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={users}
          onScroll={handleScroll}
          scrollEventThrottle={1}
          numColumns={2}
          contentContainerStyle={{
            width: SCREEN_WIDTH,
          }}
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
            GetUsersWithCards(page + 1);
            setPage(page + 1);
          }}
          onEndReachedThreshold={0.9}
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
