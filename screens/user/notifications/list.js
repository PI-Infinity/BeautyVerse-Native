import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, ScrollView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../../context/theme";
import { NotificationItem } from "./item";
import {
  addNotifications,
  addUnreadNotifications,
  setNotifications,
  setPage,
  setUnreadNotifications,
} from "../../../redux/notifications";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../../../screens/user/settings/header";
import { Language } from "../../../context/language";

/**
 * this file includes 2 components (list and item)
 * Define notifications screen
 * Bellow notification item component
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Notifications = ({ hideModal, navigation }) => {
  // define language
  const language = Language();

  // dispatch
  const dispatch = useDispatch();
  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // notifications
  const notifications = useSelector(
    (state) => state.storeNotifications.notifications
  );

  const unreadNotifications = useSelector(
    (state) => state.storeNotifications.unreadNotifications
  );

  const [loading, setLoading] = useState(true);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * add notifications list
   */

  // page
  const page = useSelector((state) => state.storeNotifications.page);

  const AddNotifcations = async (p) => {
    try {
      const response = await axios.get(
        backendUrl +
          "/api/v1/users/" +
          currentUser?._id +
          `/notifications?page=${p}&limit=15`
      );
      if (response.data.data.notifications) {
        dispatch(addNotifications(response.data.data.notifications));
        dispatch(
          addUnreadNotifications(
            response.data.data.notifications?.filter(
              (i) => i.status === "unread"
            )
          )
        );
        dispatch(setPage(p));
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // read notification
  const ReadNotification = async (id) => {
    try {
      dispatch(
        setUnreadNotifications(
          unreadNotifications?.filter((i) => i?._id !== id)
        )
      );
      dispatch(
        setNotifications(
          notifications.map((item) => {
            // Check if the current item's _id matches the given id
            if (item?._id === id) {
              // Update the status of the matched notification to "read"
              return {
                ...item,
                status: "read",
              };
            } else {
              return item;
            }
          })
        )
      );
      await axios.patch(
        backendUrl + `/api/v1/users/${currentUser?._id}/notifications/${id}`,
        {
          status: "read",
        }
      );
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const onEndReachedHandler = () => {
    AddNotifcations(page + 1);
  };

  // render notification item
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index }) => (
    <NotificationItem
      key={index}
      item={item}
      currentTheme={currentTheme}
      navigation={navigation}
      currentUser={currentUser}
      ReadNotification={ReadNotification}
      hideModal={hideModal}
    />
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Header
        title={language?.language?.User?.userPage?.notifications}
        onBack={hideModal}
      />
      {loading ? (
        <View
          style={{
            width: SCREEN_WIDTH,
            height: 100,
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="small" color={currentTheme.pink} />
        </View>
      ) : (
        <>
          {notifications?.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              onMomentumScrollEnd={
                Platform.OS === "android" ? onEndReachedHandler : undefined
              }
              onEndReached={
                Platform.OS === "ios" ? onEndReachedHandler : undefined
              }
              onEndReachedThreshold={0.1}
              contentContainerStyle={{
                paddingHorizontal: 10,
                gap: 5,
                paddingVertical: 15,
                paddingBottom: 100,
              }}
              // style={{ backgroundColor: currentTheme.background }}
            />
          ) : (
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: currentTheme.disabled,
                  letterSpacing: 0.5,
                }}
              >
                Notifications not found!
              </Text>
            </View>
          )}
        </>
      )}
    </>
  );
};
