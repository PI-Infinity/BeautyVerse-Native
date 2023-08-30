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
          console.log(response);
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
    console.log("final: " + finalStatus);
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("request");
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
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
    console.log(responseData);
  } catch (error) {
    console.log(error);
  }
};
