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
  addSentOrders,
  reduceSentOrders,
  setActiveSentOrders,
  setCanceledSentOrders,
  setCompletedSentOrders,
  setLoaderSentOrders,
  setNewSentOrders,
  setPendingSentOrders,
  setRejectedSentOrders,
  setSentOrdersFilterResult,
  setSentOrdersTotalResult,
} from "../../redux/sentOrders";
import DatePicker from "../../screens/orders/datePicker";
import { ListItem } from "../../screens/orders/listItem";
import { SortPopup } from "../../screens/orders/sortPopup";
import { Card } from "../../screens/sentOrders/cardItem";

/**
 * Defines sent orders list in user settings
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const SentOrders = ({ navigation }) => {
  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines loading state
  const [isLoaded, setIsLoaded] = useState(true); // new state variable

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines orders from redux
  const ORDERS = useSelector((state) => state.storeSentOrders.orders);
  // defines orders state
  const [orders, setOrders] = useState([]);
  // defines sort direction state
  const [sortDirection, setSortDirection] = useState("desc");

  // sorting function
  const sortOrders = (direction) => {
    let sortedOrders;
    if (direction === "desc") {
      sortedOrders = [...ORDERS].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else {
      sortedOrders = [...ORDERS].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }

    setOrders(sortedOrders);
  };

  useEffect(() => {
    sortOrders(sortDirection);
  }, [sortDirection, ORDERS]);

  // defines filter result
  const filterResult = useSelector(
    (state) => state.storeSentOrders.filterResult
  );
  // defines status filter value
  const statusFilter = useSelector(
    (state) => state.storeSentOrders.statusFilter
  );
  // defines filter date
  const date = useSelector((state) => state.storeSentOrders.date);
  // defines when created state
  const createdAt = useSelector((state) => state.storeSentOrders.createdAt);
  // defines procedure state
  const procedure = useSelector((state) => state.storeSentOrders.procedure);

  // defines page to get more orders
  const [page, setPage] = useState(1);

  // defines loader
  const loader = useSelector((state) => state.storeSentOrders.loader);

  // defines loader on load more button
  const [bottomLoader, setBottomLoader] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const loadMoreOrders = async () => {
    // Increment the page number in the state
    setPage(page + 1);

    // Fetch new orders
    try {
      setBottomLoader(true);
      const response = await axios.get(
        backendUrl +
          "/api/v1/users/" +
          currentUser._id +
          `/sentorders?page=${page + 1}&status=${
            statusFilter === "All" ? "" : statusFilter?.toLowerCase()
          }&date=${
            date.active ? date.date : ""
          }&createdAt=${createdAt}&procedure=${procedure}`
      );
      dispatch(addSentOrders(response.data.data.sentOrders));
      dispatch(setSentOrdersTotalResult(response.data.totalResult));
      dispatch(setSentOrdersFilterResult(response.data.filterResult));
      dispatch(setNewSentOrders(response.data.new));
      dispatch(setActiveSentOrders(response.data.active));
      dispatch(setPendingSentOrders(response.data.pending));
      dispatch(setCanceledSentOrders(response.data.canceled));
      dispatch(setRejectedSentOrders(response.data.rejected));
      dispatch(setCompletedSentOrders(response.data.completed));
      setTimeout(() => {
        setBottomLoader(false);
      }, 100);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * view of list (list or cards)
   *  */
  const [view, setView] = useState(true);

  // order item
  const OrderCard = ({ item }) => {
    return view ? (
      <Card
        item={item}
        currentUser={currentUser}
        currentTheme={currentTheme}
        navigation={navigation}
        setLoader={setLoaderSentOrders}
        setPage={setPage}
      />
    ) : (
      <ListItem
        item={item}
        currentUser={currentUser}
        currentTheme={currentTheme}
        navigation={navigation}
        setLoader={setLoaderSentOrders}
        setPage={setPage}
      />
    );
  };

  // load more/less btn
  const renderLoadMoreButton = () => {
    if (bottomLoader) {
      return (
        <ActivityIndicator color={currentTheme.pink} style={{ padding: 8 }} />
      );
    } else {
      return (
        <Pressable
          style={{
            width: "100%",
            alignItems: "center",
            padding: filterResult > 5 ? 7.5 : 0,
            backgroundColor: currentTheme.background2,
            marginTop: filterResult > 5 ? 10 : 0,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: currentTheme.line,
            opacity: filterResult > 5 ? 1 : 0,
          }}
          onPress={
            filterResult > orders?.length && filterResult > 5
              ? () => loadMoreOrders()
              : filterResult <= orders?.length && filterResult > 5
              ? () => {
                  setBottomLoader(true);
                  dispatch(reduceSentOrders());
                  setPage(1);
                  setTimeout(() => {
                    setBottomLoader(false);
                  }, 200);
                }
              : () => console.log("less")
          }
        >
          {filterResult > orders?.length && filterResult > 5 ? (
            <Text style={{ color: currentTheme.pink, fontWeight: "bold" }}>
              Load More
            </Text>
          ) : filterResult <= orders?.length && filterResult > 5 ? (
            <Text style={{ color: currentTheme.disabled, fontWeight: "bold" }}>
              Load Less
            </Text>
          ) : null}
        </Pressable>
      );
    }
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
                from="sentOrders"
                setOrders={setOrders}
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

          <DatePicker from="sentOrders" />

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
              {orders?.length > 0 ? (
                <FlatList
                  contentContainerStyle={styles.container}
                  bounces={Platform.OS === "ios" ? false : undefined}
                  overScrollMode={Platform.OS === "ios" ? "never" : "always"}
                  data={orders}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => <OrderCard item={item} />}
                  ListFooterComponent={renderLoadMoreButton}
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
                    No orders found!
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
