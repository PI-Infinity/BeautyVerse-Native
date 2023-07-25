import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import GetTimesAgo from "../../functions/getTimesAgo";
import { setRerenderCurrentUser } from "../../redux/rerenders";

/**
 * this file includes 2 components (list and item)
 * Define notifications screen
 * Bellow notification item component
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Notifications = ({
  notifications,
  navigation,
  setNotifications,
  setUnreadNotifications,
}) => {
  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // loading state
  const [loading, setLoading] = useState(true);

  // read notification
  const ReadNotification = async (id) => {
    try {
      setUnreadNotifications((prev) => prev - 1);
      setNotifications((prev) => {
        return prev.map((item) => {
          // Check if the current item's _id matches the given id
          if (item?._id === id) {
            // Update the status of the matched notification to "read"
            return {
              ...item,
              status: "read",
            };
          }
          // If the item's _id doesn't match, return the item unchanged
          return item;
        });
      });
      await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/notifications/${id}`,
        {
          status: "read",
        }
      );
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <ScrollView
      scrollEventThrottle={16}
      style={{ flex: 1, backgroundColor: currentTheme.background }}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      contentContainerStyle={{
        paddingHorizontal: 10,
        gap: 5,
        paddingVertical: 15,
      }}
    >
      {loading && notifications?.length > 0 && (
        <View
          style={{
            position: "absolute",
            flex: 1,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: currentTheme.background,
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      )}
      {notifications?.length > 0 ? (
        notifications?.map((item, index) => {
          if (item) {
            return (
              <NotificationItem
                key={index}
                item={item}
                currentTheme={currentTheme}
                navigation={navigation}
                ReadNotification={ReadNotification}
                currentUser={currentUser}
                setNotifications={setNotifications}
                notifications={notifications}
              />
            );
          }
        })
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: 500,
          }}
        >
          <Text style={{ color: currentTheme.disabled }}>
            No Notifications found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

/**
 * Notification item component
 */

const NotificationItem = ({
  item,
  currentTheme,
  navigation,
  ReadNotification,
  currentUser,
  setNotifications,
  notifications,
}) => {
  // define screen id by query split
  let feed = item?.feed?.split("/");

  // define some states
  const [loadCover, setLoadCover] = useState(true);
  const [feedObj, setFeedObj] = useState(null);
  const [user, setUser] = useState(null);

  // define language
  const language = Language();

  // define rerender user feed state
  const rerenderUserFeed = useSelector(
    (state) => state.storeRerenders.rerenderUserFeed
  );

  // get feed from DB
  async function GetFeedObj() {
    try {
      if (item?.type !== "welcome") {
        let response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${
            currentUser?._id
          }/feeds/${feed[feed?.length - 1]}?check=${currentUser._id}`
        );

        setFeedObj(response.data.data.feedObj);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  // Get user from DB
  async function GetUser() {
    try {
      if (item?.type !== "welcome") {
        let res = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${item?.senderId}`
        );
        setUser(res.data.data.user);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  // on press navigate to feed screen
  const handlePress = () => {
    if (feedObj) {
      navigation.navigate("UserFeed", {
        user: currentUser,
        feed: feedObj,
      });
    } else {
      Alert.alert("Feed not defined");
    }
  };

  useEffect(() => {
    GetFeedObj();
    GetUser();
  }, [rerenderUserFeed]);

  // delete notification
  const DeleteNotification = async () => {
    try {
      Vibration.vibrate();
      const updatedNotifications = notifications?.filter(
        (notification) => notification?._id !== item?._id
      );
      setNotifications(updatedNotifications);
      await axios.delete(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/notifications/${item?._id}`
      );
      console.log("deleted");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * Define notification time
   */
  const notifiyTime = GetTimesAgo(new Date(item.date).getTime());

  let definedTime;
  if (notifiyTime?.includes("min")) {
    definedTime =
      notifiyTime?.slice(0, -3) + language?.language.Main.feedCard.min;
  } else if (notifiyTime?.includes("h")) {
    definedTime =
      notifiyTime?.slice(0, -1) + language?.language.Main.feedCard.h;
  } else if (notifiyTime?.includes("d")) {
    definedTime =
      notifiyTime?.slice(0, -1) + language?.language.Main.feedCard.d;
  } else if (notifiyTime?.includes("j")) {
    definedTime =
      notifiyTime?.slice(0, -1) + language?.language.Main.feedCard.justNow;
  } else if (notifiyTime?.includes("w")) {
    definedTime =
      notifiyTime?.slice(0, -1) + language?.language.Main.feedCard.w;
  } else if (notifiyTime?.includes("mo")) {
    definedTime =
      notifiyTime?.slice(0, -2) + " " + language?.language.Main.feedCard.mo;
  } else if (notifiyTime?.includes("y")) {
    definedTime =
      notifiyTime?.slice(0, -1) + language?.language.Main.feedCard.y;
  }

  return (
    <>
      {item?.type !== "welcome" ? (
        <Pressable
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 10,
            backgroundColor:
              item?.status === "unread" ? "green" : currentTheme.background,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: currentTheme.line,
          }}
          onPress={() => ReadNotification(item?._id)}
          onLongPress={DeleteNotification}
          delayLongPress={250}
        >
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() =>
              navigation.navigate("UserVisit", {
                user: user,
              })
            }
          >
            {loadCover && item?.senderCover?.length > 10 && (
              <View
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="small" color={currentTheme.pink} />
              </View>
            )}
            {item?.senderCover?.length > 10 ? (
              <Image
                source={{ uri: item?.senderCover }}
                style={{ height: 40, width: 40, borderRadius: 50 }}
                onLoad={() => setLoadCover(false)}
              />
            ) : (
              <View style={{ padding: 5 }}>
                <FontAwesome
                  name="user"
                  size={24}
                  color={
                    item?.status === "unread" ? "#f1f1f1" : currentTheme.pink
                  }
                />
              </View>
            )}
          </TouchableOpacity>
          <View
            style={{
              gap: 2.5,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "70%",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text
                style={{
                  color:
                    item?.status === "unread" ? "#f1f1f1" : currentTheme.font,
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                {item?.senderName}
              </Text>
              <Text
                style={{
                  color:
                    item?.status === "unread"
                      ? "#f1f1f1"
                      : currentTheme.disabled,
                  fontSize: 12,
                }}
              >
                {definedTime}.
              </Text>
            </View>
            <Text
              style={{
                color:
                  item?.status === "unread" ? "#f1f1f1" : currentTheme.font,
                fontSize: 12,
              }}
            >
              {item?.text}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 20, marginLeft: "auto" }}>
            {(item?.type === "star" || item?.type === "review") && (
              <TouchableOpacity
                activeOpacity={0.3}
                style={{ alignItems: "flex-end" }}
                onPress={handlePress}
              >
                <FontAwesome
                  style={{ marginLeft: "auto" }}
                  name="image"
                  size={18}
                  color={
                    item?.status === "unread"
                      ? "#f1f1f1"
                      : currentTheme.disabled
                  }
                />
              </TouchableOpacity>
            )}
            <FontAwesome
              style={{ marginLeft: "auto" }}
              name={
                item?.type === "star"
                  ? "star-o"
                  : item?.type === "follow"
                  ? "check" // Replace 'user-plus' with the desired icon for 'follow'
                  : "comment" // Replace 'default-icon' with the desired default icon
              }
              size={16}
              color={item?.status === "unread" ? "#f1f1f1" : currentTheme.pink}
            />
          </View>
        </Pressable>
      ) : (
        <Pressable
          activeOpacity={0.3}
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 10,
            backgroundColor:
              item?.status === "unread" ? "green" : currentTheme.background,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: currentTheme.line,
          }}
          onPress={
            item?.status === "unread"
              ? () => ReadNotification(item?._id)
              : undefined
          }
          onLongPress={DeleteNotification}
          delayLongPress={250}
        >
          {item?.senderCover?.length > 0 ? (
            <Image
              source={{ uri: item?.cover }}
              style={{ height: 40, width: 40, borderRadius: 50 }}
            />
          ) : (
            <View style={{ padding: 5 }}>
              <FontAwesome name="user" size={24} color={currentTheme.pink} />
            </View>
          )}
          <View
            style={{
              gap: 2.5,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: currentTheme.font,
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              Beautyverse
            </Text>
            <Text
              style={{
                color: currentTheme.font,
                fontSize: 12,
              }}
            >
              {item?.text}
            </Text>
          </View>
          <MaterialIcons
            style={{ marginLeft: "auto" }}
            name="notifications"
            size={20}
            color={currentTheme.pink}
          />
        </Pressable>
      )}
    </>
  );
};
