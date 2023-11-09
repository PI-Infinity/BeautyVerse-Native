import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import { Language } from "../../../context/language";
import GetTimesAgo from "../../../functions/getTimesAgo";
import { setScreenModal } from "../../../redux/app";
import {
  setNotifications,
  setUnreadNotifications,
} from "../../../redux/notifications";

/**
 * Notification item component
 */

export const NotificationItem = ({
  item,
  currentTheme,
  navigation,
  ReadNotification,
  currentUser,
  hideModal,
}) => {
  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // define some states
  const [loadCover, setLoadCover] = useState(true);

  // define language
  const language = Language();

  // dispatch
  const dispatch = useDispatch();

  // // on press navigate to feed screen
  // const handlePress = (x) => {
  //   if (x === "feed") {
  //     if (item.feed) {
  //       navigation.navigate("UserFeed", {
  //         user: currentUser,
  //         feed: item.feed,
  //       });
  //     } else {
  //       Alert.alert("Feed not defined");
  //     }
  //   } else if (x === "product") {
  //     if (item.product) {
  //       navigation.navigate("Product", {
  //         product: { ...item.product, owner: currentUser },
  //       });
  //     } else {
  //       Alert.alert("Product not defined");
  //     }
  //   }
  // };

  // notifications
  const notifications = useSelector(
    (state) => state.storeNotifications.notifications
  );
  const unreadNotifications = useSelector(
    (state) => state.storeNotifications.unreadNotifications
  );

  // delete notification
  const DeleteNotification = async () => {
    try {
      Vibration.vibrate();
      const updatedNotifications = notifications?.filter(
        (notification) => notification?._id !== item?._id
      );
      const updatedUnreadNotifications = updatedUnreadNotifications?.filter(
        (notification) => notification?._id !== item?._id
      );
      dispatch(setNotifications(updatedNotifications));
      dispatch(setUnreadNotifications(updatedUnreadNotifications));
      await axios.delete(
        backendUrl +
          `/api/v1/users/${currentUser?._id}/notifications/${item?._id}`
      );
    } catch (error) {
      console.log(error.response);
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

  // define text
  const lang = useSelector((state) => state.storeApp.language);
  let text;
  if (item.type === "star") {
    if (lang === "en") {
      text = "Added star on your feed";
    } else if (lang === "ru") {
      text = "Добавлена звезда к вашей ленте";
    } else if (lang === "ka") {
      text = "მიანიჭა ვარსკვლავი თქვენ პოსტს";
    }
  } else if (item.type === "save") {
    if (lang === "en") {
      text = "Saved your feed";
    } else if (lang === "ru") {
      text = "Ваша лента сохранена";
    } else if (lang === "ka") {
      text = "შეინახა თქვენი პოსტი";
    }
  } else if (item.type === "share") {
    if (lang === "en") {
      text = "Shared your feed";
    } else if (lang === "ru") {
      text = "Ваша лента поделилась";
    } else if (lang === "ka") {
      text = "გააზიარა თქვენი პოსტი";
    }
  } else if (item.type === "review") {
    if (lang === "en") {
      text = "Reviewed your feed";
    } else if (lang === "ru") {
      text = "Ваша лента была просмотрена";
    } else if (lang === "ka") {
      text = "შეაფასა თქვენი პოსტი";
    }
  } else if (item.type === "follow") {
    if (lang === "en") {
      text = "Started following you";
    } else if (lang === "ru") {
      text = "Начал следовать за вами";
    } else if (lang === "ka") {
      text = "გამოიწერა თქვენი გვერდი";
    }
  } else if (item.type === "saveProduct") {
    if (lang === "en") {
      text = "Saved your product";
    } else if (lang === "ru") {
      text = "Сохранил ваш продукт";
    } else if (lang === "ka") {
      text = "შეინახა თქვენი პროდუქტი";
    }
  }

  // delete confirm
  const [confirm, setConfirm] = useState(false);

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

            borderRadius: 50,
            borderWidth: 1,
            borderColor:
              item?.status === "unread" ? currentTheme.pink : currentTheme.line,
          }}
          onPress={
            item.status === "unread"
              ? () => ReadNotification(item?._id)
              : () => setConfirm(true)
          }
        >
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={
              item?.sender
                ? () => {
                    hideModal();
                    navigation.navigate("UserVisit", {
                      user: item?.sender,
                    });
                  }
                : undefined
            }
          >
            {loadCover && item?.sender?.cover?.length > 10 && (
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
            {item?.sender?.cover?.length > 10 ? (
              <Image
                source={{ uri: item?.sender?.cover }}
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
                width: "100%",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text
                style={{
                  color:
                    item?.status === "unread"
                      ? currentTheme.pink
                      : currentTheme.font,
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                {item?.sender?.name}
              </Text>
              <Text
                style={{
                  color:
                    item?.status === "unread"
                      ? currentTheme.pink
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
                  item?.status === "unread"
                    ? currentTheme.pink
                    : currentTheme.font,
                fontSize: 12,
              }}
            >
              {text}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 20, marginLeft: "auto" }}>
            {confirm ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Pressable
                  style={{ padding: 5 }}
                  onPress={() => {
                    DeleteNotification();
                    setConfirm(false);
                  }}
                >
                  <MaterialIcons
                    name="done"
                    size={18}
                    color={currentTheme.pink}
                  />
                </Pressable>
                <Pressable
                  style={{ padding: 5 }}
                  onPress={() => setConfirm(false)}
                >
                  <MaterialIcons
                    name="close"
                    size={18}
                    color={currentTheme.disabled}
                  />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={{ padding: 5 }}
                onPress={() => setConfirm(true)}
              >
                <Entypo
                  style={{ marginLeft: "auto" }}
                  name="dots-three-vertical"
                  size={18}
                  color={currentTheme.font}
                />
              </Pressable>
            )}
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

            borderRadius: 50,
            borderWidth: 1,
            borderColor:
              item?.status === "unread" ? currentTheme.pink : currentTheme.line,
          }}
          onPress={
            item.status === "unread"
              ? () => ReadNotification(item?._id)
              : () => setConfirm(true)
          }
          onLongPress={() => setConfirm(true)}
          delayLongPress={250}
        >
          <Image
            source={require("../../../assets/icon.png")}
            style={{ height: 40, width: 40, borderRadius: 50 }}
          />

          <View
            style={{
              gap: 2.5,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color:
                  item?.status === "unread"
                    ? currentTheme.pink
                    : currentTheme.font,
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              Beautyverse
            </Text>
            <Text
              style={{
                color:
                  item?.status === "unread"
                    ? currentTheme.pink
                    : currentTheme.font,
                fontSize: 12,
              }}
            >
              {item?.text}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 20, marginLeft: "auto" }}>
            {confirm ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Pressable
                  style={{ padding: 5 }}
                  onPress={() => {
                    DeleteNotification();
                    setConfirm(false);
                  }}
                >
                  <MaterialIcons
                    name="done"
                    size={18}
                    color={currentTheme.pink}
                  />
                </Pressable>
                <Pressable
                  style={{ padding: 5 }}
                  onPress={() => setConfirm(false)}
                >
                  <MaterialIcons
                    name="close"
                    size={18}
                    color={currentTheme.disabled}
                  />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={{ padding: 5 }}
                onPress={() => setConfirm(true)}
              >
                <Entypo
                  style={{ marginLeft: "auto" }}
                  name="dots-three-vertical"
                  size={18}
                  color={
                    item?.status === "unread"
                      ? currentTheme.pink
                      : currentTheme.font
                  }
                />
              </Pressable>
            )}
          </View>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({});
