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
} from "react-native";
import React, { useState, useEffect } from "react";
import { CacheableImage } from "../../components/cacheableImage";
import { useSelector, useDispatch } from "react-redux";
import { lightTheme, darkTheme } from "../../context/theme";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "../../screens/orders/cardItem";
import { ListItem } from "../../screens/orders/listItem";
import { SortPopup } from "../../screens/orders/sortPopup";
import { BackDrop } from "../../components/backDropLoader";
import DateTimePicker from "@react-native-community/datetimepicker";
import { setDate } from "../../redux/orders";
// import Date from "../../screens/orders/date";

export const Orders = ({ navigation, refresh }) => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const orders = useSelector((state) => state.storeOrders.orders);

  const [loader, setLoader] = useState(false);

  const filter = useSelector((state) => state.storeOrders.statusFilter);
  const D = useSelector((state) => state.storeOrders.date);

  const date = new Date(D);

  /**
   * sort
   */
  const [openSortPopup, setOpenSortPopup] = useState(false);

  /**
   * view of list (list or cards)
   *  */
  const [view, setView] = useState(true);

  return (
    <>
      {loader && (
        <View
          style={{
            position: "absolute",
            zIndex: 10000,
            backgroundColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <View style={{ paddingBottom: 20 }}>
        {openSortPopup && (
          <Pressable
            onPress={() => setOpenSortPopup(false)}
            style={{
              position: "absolute",
              zIndex: 180,
              top: 50,
              width: "100%",
              alignItems: "center",
              flex: 1,
              backgroundColor: "rgba(1,1,1,0.5)",
              height: "100%",
            }}
          >
            <SortPopup
              currentTheme={currentTheme}
              setOpenSortPopup={setOpenSortPopup}
            />
          </Pressable>
        )}
        {/* <View style={{ marginVertical: 10, marginTop: 5 }}>
        <Date />
      </View> */}
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
              Active: 4
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.3}
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => setOpenSortPopup(!openSortPopup)}
          >
            <Text
              style={{
                color: currentTheme.font,
                letterSpacing: 0.3,
              }}
            >
              {filter ? filter : "All"}{" "}
              <FontAwesome name="unsorted" size={18} color="#ccc" />
            </Text>
          </TouchableOpacity>

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
        >
          <View style={{ gap: 2 }}>
            <Text
              style={{
                color: currentTheme.font,
                letterSpacing: 0.3,
                fontSize: 12,
              }}
            >
              Today income: {orders?.length} {currentUser.currency}
            </Text>

            <Text
              style={{
                color: currentTheme.font,
                letterSpacing: 0.3,
                fontSize: 12,
              }}
            >
              Monthly income: {orders?.length} {currentUser.currency}
            </Text>
          </View>

          <View
            style={{ backgroundColor: "pink", width: 80, borderRadius: 50 }}
          >
            <DateTimePicker
              value={date}
              mode="date"
              // is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  dispatch(setDate(selectedDate.toISOString()));
                }
              }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          bounces={Platform.OS === "ios" ? false : undefined}
          overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          refreshControl={
            <RefreshControl tintColor="#ccc" refreshing={refresh} />
          }
        >
          {orders?.map((item, index) => {
            if (view) {
              return (
                <Card
                  key={index}
                  item={item}
                  currentUser={currentUser}
                  currentTheme={currentTheme}
                  navigation={navigation}
                  setLoader={setLoader}
                />
              );
            } else {
              return (
                <ListItem
                  key={index}
                  item={item}
                  currentUser={currentUser}
                  currentTheme={currentTheme}
                  navigation={navigation}
                  setLoader={setLoader}
                />
              );
            }
          })}
          <Text>Orders</Text>
        </ScrollView>
      </View>
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
