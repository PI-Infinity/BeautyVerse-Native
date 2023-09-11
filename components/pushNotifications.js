import { useState, useEffect, useRef, useContext } from "react";
import { Text, View, Button, Platform, AppState } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../redux/user";
import { setLoading } from "../redux/app";
import * as Location from "expo-location";
import { RouteNameContext } from "../context/routName";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { setCurrentChat } from "../redux/chat";
import { setDate, setStatusFilter } from "../redux/bookings";
import {
  setDateSentBookings,
  setStatusFilterSentBookings,
} from "../redux/sentBookings";
import moment from "moment";
import "moment-timezone";
import * as Localization from "expo-localization";

export default function App({ currentUser }) {
  const routeName = useContext(RouteNameContext);

  useEffect(() => {
    Notifications.setNotificationHandler(
      routeName === "Room"
        ? null
        : {
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: false,
              shouldSetBadge: false,
            }),
          }
    );
  }, [routeName]);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const dispatch = useDispatch();

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const navigation = useNavigation();

  useEffect(() => {
    if (currentUser) {
      registerForPushNotificationsAsync(currentUser).then(async (token) => {
        setExpoPushToken(token);
        if (currentUser && token) {
          try {
            const resp = await axios.patch(
              backendUrl + "/api/v1/users/" + currentUser?._id,
              {
                pushNotificationToken: token,
              }
            );
            dispatch(setCurrentUser(resp.data.data.updatedUser));
            // let { status } = await Location.requestForegroundPermissionsAsync();
            // if (status === "denied") {
            //   dispatch(setLoading(false));
            // }
          } catch (error) {
            console.log(error);
          }
        }
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          if (response.notification.request.content.data.someData) {
            // navigate to target feed after getting notification
            if (response.notification.request.content.data.someData.feed) {
              // get feed
              const GetFeed = async (id) => {
                try {
                  const response = await axios.get(
                    backendUrl +
                      "/api/v1/feeds/" +
                      id +
                      "?check=" +
                      currentUser._id
                  );
                  navigation.navigate("UserFeed", {
                    feed: response.data.data.feed,
                    user: currentUser,
                  });
                } catch (error) {
                  console.log(error.response.data.message);
                }
              };
              GetFeed(response.notification.request.content.data.someData.feed);
            }
            if (response.notification.request.content.data.someData.product) {
              // get feed
              const GetProduct = async (id) => {
                try {
                  const response = await axios.get(
                    backendUrl + "/api/v1/marketplace/" + id
                  );
                  navigation.navigate("Product", {
                    product: response.data.data.product,
                  });
                } catch (error) {
                  console.log(error.response.data.message);
                }
              };
              GetProduct(
                response.notification.request.content.data.someData.product
              );
            }
            // navigate to target user page after getting notification
            if (
              response.notification.request.content.data.someData.user &&
              !response.notification.request.content.data.someData.feed
            ) {
              const parsed = JSON.parse(
                response.notification.request.content.data.someData.user
              );

              navigation.navigate("User" || "UserVisit", {
                user: parsed,
              });
            }
            // navigate to target chat after getting notification
            if (response.notification.request.content.data.someData.room) {
              const parsedChat = JSON.parse(
                response.notification.request.content.data.someData.room
              );
              const parsedUser = JSON.parse(
                response.notification.request.content.data.someData.user
              );
              dispatch(setCurrentChat(parsedChat));
              navigation.navigate("Room", {
                user: parsedUser,
              });
            }
            // navigate to bookings after getting notification
            if (
              response.notification.request.content.data.someData.type ===
              "booking"
            ) {
              let newdate = new Date();
              let formattedDateInTimezone = moment(newdate)
                .tz(Localization.timezone)
                .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

              // recieved bookings
              if (
                currentUser?.type === "specialist" ||
                currentUser?.type === "beautycenter"
              ) {
                dispatch(
                  setStatusFilter(
                    response.notification.request.content.data.someData.status
                  )
                );
                dispatch(
                  setDate({ active: false, date: formattedDateInTimezone })
                );
                navigation.navigate("BMS");
              } else {
                // sent bookings
                dispatch(
                  setStatusFilterSentBookings(
                    response.notification.request.content.data.someData.status
                  )
                );
                dispatch(
                  setDateSentBookings({
                    active: false,
                    date: formattedDateInTimezone,
                  })
                );
                navigation.navigate("BMSSent");
              }
            }
          }
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [currentUser?._id]);
}

async function registerForPushNotificationsAsync(currentUser) {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

export const sendNotification = async (expoPushToken, title, body, feed) => {
  try {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: { someData: feed },
    };
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    const responseData = await response.json();
  } catch (error) {
    console.log(error);
  }
};
