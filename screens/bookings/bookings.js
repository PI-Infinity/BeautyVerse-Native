import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../context/theme";
import {
  addBookings,
  reduceBookings,
  setActiveBookings,
  setCanceledBookings,
  setCompletedBookings,
  setFilterResult,
  setLoader,
  setNewBookings,
  setPendingBookings,
  setRejectedBookings,
  setTotalResult,
} from "../../redux/bookings";
import { Card } from "../../screens/bookings/cardItem";
import DatePicker from "../../screens/bookings/datePicker";
import { ListItem } from "../../screens/bookings/listItem";
import { SortPopup } from "../../screens/bookings/sortPopup";
import { Language } from "../../context/language";

/**
 * Defines bookings list
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Bookings = ({ navigation }) => {
  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines language
  const language = Language();

  // defines loading state
  const [isLoaded, setIsLoaded] = useState(true); // new state variable

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines bookings list
  const BOOKINGS = useSelector((state) => state.storeBookings.bookings);
  const totalResult = useSelector((state) => state.storeBookings.totalResult);

  // defines bookings state
  const [bookings, setBookings] = useState([]);
  // defines list sort direction
  const [sortDirection, setSortDirection] = useState("desc");
  // defines page for backend to add more bookings
  const [page, setPage] = useState(1); // Use 'asc' for ascending, 'desc' for descending

  // sorting function
  const sortBookings = (direction) => {
    let sortedBookings;
    if (direction === "desc") {
      sortedBookings = [...BOOKINGS].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else {
      sortedBookings = [...BOOKINGS].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }

    setBookings(sortedBookings);
  };

  useEffect(() => {
    sortBookings(sortDirection);
  }, [sortDirection, BOOKINGS]);
  useEffect(() => {
    setPage(1);
  }, [BOOKINGS]);

  // defines filter result
  const filterResult = useSelector((state) => state.storeBookings.filterResult);
  // defines status filter value
  const statusFilter = useSelector((state) => state.storeBookings.statusFilter);
  // defines filter date
  const date = useSelector((state) => state.storeBookings.date);
  // defines when booking created
  const createdAt = useSelector((state) => state.storeBookings.createdAt);
  // defines procedure
  const procedure = useSelector((state) => state.storeBookings.procedure);

  // defines loader
  const loader = useSelector((state) => state.storeBookings.loader);

  // defines bottom loader when adding new bookings
  const [bottomLoader, setBottomLoader] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  /**
   * Load more bookings
   */

  const loadMoreBookings = async () => {
    // Increment the page number in the state
    setPage(page + 1);

    // Fetch new bookings
    try {
      const response = await axios.get(
        backendUrl +
          "/api/v1/bookings/" +
          currentUser._id +
          `?page=${page + 1}&status=${
            statusFilter === "All" ? "" : statusFilter?.toLowerCase()
          }&date=${
            date.active ? date.date : ""
          }&createdAt=${createdAt}&procedure=${procedure}`
      );

      dispatch(addBookings(response.data.data.bookings));
      dispatch(setTotalResult(response.data.totalResult));
      dispatch(setFilterResult(response.data.filterResult));
      dispatch(setNewBookings(response.data.new));
      dispatch(setPendingBookings(response.data.pending));
      dispatch(setActiveBookings(response.data.active));
      dispatch(setCompletedBookings(response.data.completed));
      dispatch(setRejectedBookings(response.data.rejected));
      dispatch(setCanceledBookings(response.data.canceled));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * view of list (list or cards)
   *  */
  const [view, setView] = useState(true);

  // booking item
  const BookingCard = ({ item }) => {
    return view ? (
      <Card
        item={item}
        currentUser={currentUser}
        currentTheme={currentTheme}
        navigation={navigation}
        setLoader={setLoader}
        setPage={setPage}
      />
    ) : (
      <ListItem
        item={item}
        currentUser={currentUser}
        currentTheme={currentTheme}
        navigation={navigation}
        setLoader={setLoader}
        setPage={setPage}
      />
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(false);
    }, 200);
  }, []);
  return (
    <>
      {isLoaded ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: 500,
          }}
        >
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      ) : (
        <View style={{ paddingBottom: 20 }}>
          <View
            style={{
              marginHorizontal: 0,
              paddingHorizontal: 15,
              paddingVertical: 10,

              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                position: "absolute",
                zIndex: 1000,
                backgroundColor: "red",
              }}
            ></View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: currentTheme.font,
                  letterSpacing: 0.3,
                  fontSize: 14,
                }}
              >
                {language?.language?.Bookings?.bookings?.result}: {filterResult}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <SortPopup
                currentTheme={currentTheme}
                setPage={setPage}
                from="bookings"
                setBookings={setBookings}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                gap: 15,
                justifyContent: "flex-end",
                marginRight: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => setView(!view)}
                activeOpacity={0.3}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {view ? (
                    <FontAwesome
                      name="list-ol"
                      size={14}
                      color={currentTheme.font}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="card-text-outline"
                      size={18}
                      color={currentTheme.font}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={
                  sortDirection === "asc"
                    ? () => setSortDirection("desc")
                    : () => setSortDirection("asc")
                }
              >
                <MaterialCommunityIcons
                  name={
                    sortDirection === "asc"
                      ? "sort-calendar-ascending"
                      : "sort-calendar-descending"
                  }
                  size={18}
                  color={currentTheme.font}
                />
              </TouchableOpacity>
            </View>
          </View>

          <DatePicker from="bookings" />

          <View
            style={{
              width: "100%",
              paddingHorizontal: 20,
              padding: 5,
              paddingBottom: 10,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          ></View>
          {loader ? (
            <View
              style={{
                // flex: 1,
                height: 500,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator color={currentTheme.pink} size="large" />
            </View>
          ) : (
            <>
              {bookings?.length > 0 ? (
                <FlatList
                  contentContainerStyle={styles.container}
                  data={bookings}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => <BookingCard item={item} />}
                  scrollEventThrottle={16}
                  onEndReached={loadMoreBookings}
                />
              ) : (
                <View
                  style={{
                    width: SCREEN_WIDTH,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 500,
                  }}
                >
                  <Text style={{ color: currentTheme.disabled }}>
                    {language?.language?.Bookings?.bookings?.notFound}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 0,
    paddingBottom: 150,
    gap: 5,
  },
});
