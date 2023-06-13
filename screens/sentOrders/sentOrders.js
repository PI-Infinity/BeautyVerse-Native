import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CacheableImage } from "../../components/cacheableImage";
import { useSelector, useDispatch } from "react-redux";
import { lightTheme, darkTheme } from "../../context/theme";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "../../screens/sentOrders/cardItem";
import { ListItem } from "../../screens/orders/listItem";
import { SortPopup } from "../../screens/orders/sortPopup";
import { BackDrop } from "../../components/backDropLoader";
import { setDate } from "../../redux/orders";
import {
  setLoaderSentOrders,
  addSentOrders,
  setSentOrdersTotalResult,
  setSentOrdersFilterResult,
  setNewSentOrders,
  setActiveSentOrders,
  reduceSentOrders,
} from "../../redux/sentOrders";
import axios from "axios";
import DatePicker from "../../screens/orders/datePicker";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const SentOrders = ({ navigation }) => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const [isLoaded, setIsLoaded] = useState(true); // new state variable
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const orders = useSelector((state) => state.storeSentOrders.orders);

  const totalResult = useSelector((state) => state.storeSentOrders.totalResult);

  const filterResult = useSelector(
    (state) => state.storeSentOrders.filterResult
  );

  const statusFilter = useSelector(
    (state) => state.storeSentOrders.statusFilter
  );
  const date = useSelector((state) => state.storeSentOrders.date);
  const createdAt = useSelector((state) => state.storeSentOrders.createdAt);
  const procedure = useSelector((state) => state.storeSentOrders.procedure);

  const [page, setPage] = useState(1);

  const loader = useSelector((state) => state.storeSentOrders.loader);
  const rerenderOrders = useSelector(
    (state) => state.storeRerenders.rerenderOrders
  );

  const [bottomLoader, setBottomLoader] = useState(false);

  const loadMoreOrders = async () => {
    // Increment the page number in the state
    setPage(page + 1);

    // Fetch new orders
    try {
      setBottomLoader(true);
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
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
      setTimeout(() => {
        setBottomLoader(false);
      }, 100);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * sort
   */
  const [openSortPopup, setOpenSortPopup] = useState(false);

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
      />
    ) : (
      <ListItem
        item={item}
        currentUser={currentUser}
        currentTheme={currentTheme}
        navigation={navigation}
        setLoader={setLoaderSentOrders}
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
              backgroundColor: currentTheme.background2,
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
              <SortPopup currentTheme={currentTheme} from="sentOrders" />
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => setView(!view)}
                activeOpacity={0.3}
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: currentTheme.font,
                    letterSpacing: 0.3,
                  }}
                >
                  View:{" "}
                </Text>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {view ? (
                    <FontAwesome name="list-ol" size={14} color="#ccc" />
                  ) : (
                    <MaterialCommunityIcons
                      name="card-text-outline"
                      size={18}
                      color="#ccc"
                    />
                  )}
                </View>
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
