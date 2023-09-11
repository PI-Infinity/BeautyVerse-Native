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
  addSentBookings,
  reduceSentBookings,
  setActiveSentBookings,
  setCanceledSentBookings,
  setCompletedSentBookings,
  setLoaderSentBookings,
  setNewSentBookings,
  setPendingSentBookings,
  setRejectedSentBookings,
  setSentBookingsFilterResult,
  setSentBookingsTotalResult,
} from "../../redux/sentBookings";
import DatePicker from "../bookings/datePicker";
import { ListItem } from "../sentBookings/listItem";
import { SortPopup } from "../bookings/sortPopup";
import { Card } from "./cardItem";

/**
 * Defines sent bookings list in user settings
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const SentBookings = ({ navigation }) => {
  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines loading state
  const [isLoaded, setIsLoaded] = useState(true); // new state variable

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines bookings from redux
  const Bookings = useSelector((state) => state.storeSentBookings.sentBookings);
  // defines bookings state
  const [bookings, setBookings] = useState([]);
  // defines sort direction state
  const [sortDirection, setSortDirection] = useState("desc");

  // sorting function
  const sortBookings = (direction) => {
    let sortedBookings;
    if (Bookings?.length > 0) {
      if (direction === "desc") {
        sortedBookings = [...Bookings].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      } else {
        sortedBookings = [...Bookings].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      }

      setBookings(sortedBookings);
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    sortBookings(sortDirection);
  }, [sortDirection, Bookings]);

  // defines filter result
  const filterResult = useSelector(
    (state) => state.storeSentBookings.filterResult
  );
  // defines status filter value
  const statusFilter = useSelector(
    (state) => state.storeSentBookings.statusFilter
  );
  // defines filter date
  const date = useSelector((state) => state.storeSentBookings.date);
  // defines when created state
  const createdAt = useSelector((state) => state.storeSentBookings.createdAt);
  // defines procedure state
  const procedure = useSelector((state) => state.storeSentBookings.procedure);

  // defines page to get more bookings
  const [page, setPage] = useState(1);

  // defines loader
  const loader = useSelector((state) => state.storeSentBookings.loader);

  // defines loader on load more button
  const [bottomLoader, setBottomLoader] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const loadMoreBookings = async () => {
    if (bookings?.length > 4) {
      // Increment the page number in the state
      setPage(page + 1);

      // Fetch new bookings
      try {
        setBottomLoader(true);
        const response = await axios.get(
          backendUrl +
            "/api/v1/bookings/" +
            currentUser._id +
            `/?page=${page + 1}&status=${
              statusFilter === "All" ? "" : statusFilter?.toLowerCase()
            }&date=${
              date.active ? date.date : ""
            }&createdAt=${createdAt}&procedure=${procedure}`
        );
        dispatch(addSentBookings(response.data.data.bookings));
        dispatch(setSentBookingsTotalResult(response.data.totalResult));
        dispatch(setSentBookingsFilterResult(response.data.filterResult));
        dispatch(setNewSentBookings(response.data.new));
        dispatch(setActiveSentBookings(response.data.active));
        dispatch(setPendingSentBookings(response.data.pending));
        dispatch(setCanceledSentBookings(response.data.canceled));
        dispatch(setRejectedSentBookings(response.data.rejected));
        dispatch(setCompletedSentBookings(response.data.completed));
        setTimeout(() => {
          setBottomLoader(false);
        }, 100);
      } catch (error) {
        console.log(error.response);
      }
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
        setLoader={setLoaderSentBookings}
        setPage={setPage}
      />
    ) : (
      <ListItem
        item={item}
        currentUser={currentUser}
        currentTheme={currentTheme}
        navigation={navigation}
        setLoader={setLoaderSentBookings}
        setPage={setPage}
      />
    );
  };

  // // load more/less btn
  // const renderLoadMoreButton = () => {
  //   if (bottomLoader) {
  //     return (
  //       <ActivityIndicator color={currentTheme.pink} style={{ padding: 8 }} />
  //     );
  //   } else {
  //     return (
  //       <Pressable
  //         style={{
  //           width: "100%",
  //           alignItems: "center",
  //           padding: filterResult > 5 ? 7.5 : 0,
  //           backgroundColor: currentTheme.background2,
  //           marginTop: filterResult > 5 ? 10 : 0,
  //           borderRadius: 50,
  //           borderWidth: 1,
  //           borderColor: currentTheme.line,
  //           opacity: filterResult > 5 ? 1 : 0,
  //         }}
  //         onPress={
  //           filterResult > bookings?.length && filterResult > 5
  //             ? () => loadMoreBookings()
  //             : filterResult <= bookings?.length && filterResult > 5
  //             ? () => {
  //                 setBottomLoader(true);
  //                 dispatch(reduceSentBookings());
  //                 setPage(1);
  //                 setTimeout(() => {
  //                   setBottomLoader(false);
  //                 }, 200);
  //               }
  //             : () => console.log("less")
  //         }
  //       >
  //         {filterResult > bookings?.length && filterResult > 5 ? (
  //           <Text style={{ color: currentTheme.pink, fontWeight: "bold" }}>
  //             Load More
  //           </Text>
  //         ) : filterResult <= bookings?.length && filterResult > 5 ? (
  //           <Text style={{ color: currentTheme.disabled, fontWeight: "bold" }}>
  //             Load Less
  //           </Text>
  //         ) : null}
  //       </Pressable>
  //     );
  //   }
  // };

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
              // backgroundColor: currentTheme.background2,
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
                Result: {filterResult}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <SortPopup
                currentTheme={currentTheme}
                setPage={setPage}
                from="sentBookings"
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

          <DatePicker from="sentBookings" />

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
                  onEndReached={loadMoreBookings}
                  scrollEventThrottle={16}
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
                    No bookings found!
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
    paddingBottom: 100,
    gap: 5,
  },
});
