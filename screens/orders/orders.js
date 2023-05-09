import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CacheableImage } from "../../components/cacheableImage";
import { useSelector, useDispatch } from "react-redux";
import { lightTheme, darkTheme } from "../../context/theme";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "../../screens/orders/cardItem";
import { ListItem } from "../../screens/orders/listItem";
import { SortPopup } from "../../screens/orders/sortPopup";

export const Orders = ({ orders }) => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  /**
   * sort
   */
  const [openSortPopup, setOpenSortPopup] = useState(false);
  const [sortValue, setSortValue] = useState("new");

  /**
   * view of list (list or cards)
   *  */
  const [view, setView] = useState(true);
  return (
    <View style={{ paddingBottom: 20 }}>
      {openSortPopup && (
        <View
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
            selectedItem={sortValue}
            setSelectedItem={setSortValue}
          />
        </View>
      )}
      <View
        style={{
          marginHorizontal: 15,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 10,
          backgroundColor: currentTheme.background2,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: currentTheme.font,
              letterSpacing: 0.3,
            }}
          >
            Total Orders: {orders?.length}
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
            Sort: <FontAwesome name="unsorted" size={18} color="#ccc" />
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
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? undefined : false}
        //   style={{ backgroundColor: "red" }}
      >
        {orders?.map((item, index) => {
          let bg;
          if (item.status === "new") {
            bg = "green";
          } else if (item.status === "canceled") {
            bg = "red";
          } else if (item.status === "confirmed") {
            bg = "orange";
          } else {
            bg = currentTheme.background2;
          }
          if (view) {
            return (
              <Card
                key={index}
                item={item}
                bg={bg}
                currentUser={currentUser}
                currentTheme={currentTheme}
              />
            );
          } else {
            return (
              <ListItem
                key={index}
                item={item}
                bg={bg}
                currentUser={currentUser}
                currentTheme={currentTheme}
              />
            );
          }
        })}
        <Text>Orders</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    gap: 5,
  },
});
