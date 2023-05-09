import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, StatusBar } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BottomTabNavigator } from "./navigations/bottomTab";
import { AuthStack } from "./navigations/authStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setLoading, setMachineId, setTheme, setLanguage } from "./redux/app";
import { setCurrentUser } from "./redux/user";
import { io } from "socket.io-client";
import { lightTheme, darkTheme } from "./context/theme";
import SafeAreaViewRN from "react-native";
import { SafeAreaView as SafeAreaViewContext } from "react-native-safe-area-context";
import { setRerenderNotifcations } from "./redux/rerenders";

const SafeAreaView =
  Platform.OS === "android" ? SafeAreaViewContext : SafeAreaViewRN.SafeAreaView;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Content = () => {
  const dispatch = useDispatch();

  // Get the loading state from the app's Redux store
  const loading = useSelector((state) => state.storeApp.loading);

  // Get the current user from the user's Redux store
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // Get the rerenderCurrentUser state from the app's Redux store
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );

  // get theme and language values saved in async storage, if nulls give them true asa dark them, en for english language
  useEffect(() => {
    const getTheme = async () => {
      let theme = await AsyncStorage.getItem("Beautyverse:themeMode");
      if (theme !== null) {
        let parsed = JSON.parse(theme);
        dispatch(setTheme(parsed.theme));
      } else {
        dispatch(setTheme(true));
      }
    };
    const getLanguage = async () => {
      let langu = await AsyncStorage.getItem("Beautyverse:language");
      if (langu !== null) {
        let parsed = JSON.parse(langu);
        dispatch(setLanguage(parsed.language));
      } else {
        dispatch(setLanguage("en"));
      }
    };
    getTheme();
    getLanguage();
  }, []);

  /**
   * create socket server
   */
  const socket = useRef();

  useEffect(() => {
    // Connect to the server's socket.io instance
    socket.current = io("https://beautyverse.herokuapp.com");
  }, []);

  // avoid first loading, connect only when user is defined
  const socketRef = useRef(true);

  useEffect(() => {
    if (socketRef.current) {
      // Skip the first render to prevent the addUser event from being emitted before the current user is set
      socketRef.current = false;
      return;
    }
    // Emit the addUser event to the server's socket.io instance
    socket.current.emit("addUser", currentUser?._id);
    socket.current.on("getUsers", (users) => {});
  }, [currentUser]);

  /**
   * Import current user from AsyncStorage
   */
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const GetUser = async () => {
      // Get the current user from AsyncStorage
      var user = await AsyncStorage.getItem("Beautyverse:currentUser");
      if (user) {
        setCurrUser(JSON.parse(user));
      } else {
        // If there is no current user, set the currentUser state to null and set loading to false
        dispatch(setCurrentUser(null));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 300);
      }
    };
    GetUser();
  }, [rerenderCurrentUser]);

  // after getting current user from localstorage, get user data from data base
  useEffect(() => {
    const GetUser = async () => {
      try {
        // Make a request to get the current user's data from the server
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${currUser?._id}`
        );
        // Set the current user in the user's Redux store
        await dispatch(setCurrentUser(response.data.data.user));
        dispatch(setRerenderNotifcations());
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 300);
      } catch (error) {
        console.log(error.response.data.message);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 300);
      }
    };
    if (currUser) {
      // Call GetUser if currUser is not null
      GetUser();
    }
  }, [currUser]);

  /**
   * Define machine unique id
   */

  useEffect(() => {
    const GetMachineId = async () => {
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/machineId"
      );
      // dave id in redux
      dispatch(setMachineId(response.data));
    };
    try {
      GetMachineId();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // define user's last visit date
  useEffect(() => {
    const GetLastVisit = async () => {
      try {
        await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
          {
            lastLoginAt: new Date(),
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) {
      GetLastVisit();
    }
  }, []);

  // theme state, from redux
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <>
      {loading && (
        // Show a loading screen if the app is still loading
        <View
          style={[styles.loading, { backgroundColor: currentTheme.background }]}
        >
          <Text style={[styles.loadingText, { color: "#F866B1" }]}>Beauty</Text>
          <Text style={[styles.loadingText, { color: currentTheme.font }]}>
            verse
          </Text>
        </View>
      )}
      <StatusBar
        barStyle={!theme ? "dark-content" : "light-content"}
        backgroundColor={currentTheme.background}
      />
      {
        // Render the navigation stack based on whether there is a current user or not
        currentUser ? <BottomTabNavigator socket={socket} /> : <AuthStack />
      }
    </>
  );
};

export default Content;

const styles = StyleSheet.create({
  // Define styles for the app

  loading: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#111",
    zIndex: 100000,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
});
