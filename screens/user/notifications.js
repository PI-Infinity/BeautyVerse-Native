import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Alert,
  Vibration,
  Platform,
} from "react-native";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { lightTheme, darkTheme } from "../../context/theme";
import axios from "axios";
import { setRerenderCurrentUser } from "../../redux/rerenders";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Notifications = ({
  notifications,
  navigation,
  setNotifications,
}) => {
  const dispatch = useDispatch();
  // curent user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // loading state
  const [loading, setLoading] = useState(true);

  // read notification
  const ReadNotification = async (id) => {
    try {
      setNotifications((prev) => {
        return prev.map((item) => {
          // Check if the current item's _id matches the given id
          if (item._id === id) {
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
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/notifications/${id}`,
        {
          status: "read",
        }
      );
      dispatch(setRerenderCurrentUser());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: currentTheme.background }}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? undefined : false}
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
          <ActivityIndicator size="large" />
        </View>
      )}
      {notifications?.length > 0 ? (
        notifications?.map((item, index) => {
          return (
            <NotificationItem
              key={index}
              item={item}
              currentTheme={currentTheme}
              navigation={navigation}
              ReadNotification={ReadNotification}
              setLoading={setLoading}
              currentUser={currentUser}
              setNotifications={setNotifications}
              notifications={notifications}
            />
          );
        })
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: 500,
          }}
          onLoad={() => setLoading(false)}
        >
          <Text style={{ color: currentTheme.disabled }}>
            No Notifications found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

const NotificationItem = ({
  item,
  currentTheme,
  navigation,
  ReadNotification,
  setLoading,
  currentUser,
  setNotifications,
  notifications,
}) => {
  let feed = item.feed.split("/");

  const [feedObj, setFeedObj] = useState(null);
  const [user, setUser] = useState(null);

  async function GetFeedObj(currentPage) {
    try {
      if (item.type !== "welcome") {
        let response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${
            currentUser?._id
          }/feeds/${feed[feed?.length - 1]}`
        );
        setFeedObj(response.data);
        let res = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${item.senderId}`
        );
        setUser(res.data.data.user);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const handlePress = () => {
    if (feedObj) {
      navigation.navigate("UserFeed", {
        user: currentUser,
        feedObj: feedObj.data.feedObj,
      });
    } else {
      Alert.alert("Feed not defined");
    }
  };

  useEffect(() => {
    GetFeedObj();
  }, []);

  // delete notification

  const DeleteNotification = async () => {
    try {
      Vibration.vibrate();
      const updatedNotifications = notifications.filter(
        (notification) => notification._id !== item._id
      );
      setNotifications(updatedNotifications);
      await axios.delete(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/notifications/${item._id}`
      );
      console.log("deleted");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      {item.type !== "welcome" ? (
        <Pressable
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 10,
            backgroundColor:
              item.status === "unread" ? "green" : currentTheme.background,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
          }}
          onPress={() => ReadNotification(item._id)}
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
            <Image
              source={{ uri: item.senderCover }}
              style={{ height: 40, width: 40, borderRadius: 50 }}
              onLoad={() =>
                setTimeout(() => {
                  setLoading(false);
                }, 200)
              }
            />
          </TouchableOpacity>
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
              {item.senderName}
            </Text>
            <Text
              style={{
                color: currentTheme.font,
                fontSize: 12,
              }}
            >
              {item.text}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 20, marginLeft: "auto" }}>
            {(item.type === "star" || item.type === "review") && (
              <TouchableOpacity
                activeOpacity={0.3}
                style={{ alignItems: "flex-end" }}
                onPress={handlePress}
              >
                <Icon
                  style={{ marginLeft: "auto" }}
                  name="image"
                  size={18}
                  color={currentTheme.font}
                />
              </TouchableOpacity>
            )}
            <Icon
              style={{ marginLeft: "auto", opacity: 0.6 }}
              name={
                item.type === "star"
                  ? "star-o"
                  : item.type === "follow"
                  ? "check" // Replace 'user-plus' with the desired icon for 'follow'
                  : "comment" // Replace 'default-icon' with the desired default icon
              }
              size={16}
              color={currentTheme.font}
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
              item.status === "unread" ? "green" : currentTheme.background,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
          }}
          onPress={
            item.status === "unread"
              ? () => ReadNotification(item._id)
              : undefined
          }
          onLongPress={DeleteNotification}
          delayLongPress={250}
        >
          <Image
            source={{ uri: currentUser.cover }}
            style={{ height: 40, width: 40, borderRadius: 50 }}
            onLoad={() =>
              setTimeout(() => {
                setLoading(false);
              }, 200)
            }
          />
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
              {item.text}
            </Text>
          </View>
          <MaterialIcons
            style={{ marginLeft: "auto", opacity: 0.6 }}
            name="notifications"
            size={16}
            color={currentTheme.font}
          />
        </Pressable>
      )}
    </>
  );
};
