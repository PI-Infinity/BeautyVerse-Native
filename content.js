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
import {
  setRerenderCurrentUser,
  setRerenderNotifcations,
} from "./redux/rerenders";
import { SocketContext } from "./context/socketContext";
import { Update } from "./screens/update";
import Constants from "expo-constants";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

/* main content component of app */

const Content = () => {
  // define dispatch to send data to redux toolkit
  const dispatch = useDispatch();

  // Get the loading state from the app's Redux store
  const loading = useSelector((state) => state.storeApp.loading);

  // Get the current user from the user's Redux store
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // Get the rerenderCurrentUser state from the app's Redux store
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );

  // define app version
  const currentVersion = Constants.manifest.version;
  const [appVersion, setAppVersion] = useState(null);

  useEffect(() => {
    const DefineAppVersion = async () => {
      try {
        const response = await axios.get("http://192.168.0.105:5000/version");
        setAppVersion(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    DefineAppVersion();
  }, []);

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
    socket.current = io("https://beautyverse.herokuapp.com");
  }, []);

  useEffect(() => {
    // Emit the addUser event to the server's socket.io instances
    socket.current.emit("addUser", currentUser?._id);
    socket.current.on("getUsers", (users) => {
      // console.log(users);
    });
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
        }, 1000);
      }
    };
    GetUser();
  }, [rerenderCurrentUser]);

  // after getting current user from localstorage, get user data from mongoDB
  useEffect(() => {
    const GetUser = async () => {
      try {
        // Make a request to get the current user's data from the server
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${currUser?._id}`
        );
        // Set the current user in the user's Redux store
        if (response.data.data.user) {
          dispatch(setCurrentUser(response.data.data.user));
        } else {
          AsyncStorage.removeItem("Beautyverse:currentUser");
        }
        dispatch(setRerenderNotifcations());
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } catch (error) {
        console.log(error.response.data.message);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      }
    };
    if (currUser) {
      // Call GetUser if currUser is not null
      GetUser();
    }
  }, [currUser]);

  // rerender current user after some real time updates (notifications in this moment)
  useEffect(() => {
    socket.current.on("userUpdate", () => {
      dispatch(setRerenderCurrentUser());
    });
  }, []);

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
      console.log(error.response.data.message);
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
        console.log(error.response.data.message);
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
      {currentVersion !== appVersion && (
        <Update currentVersion={currentVersion} appVersion={appVersion} />
      )}
      {loading && (
        // Show a loading screen if the app is still loading
        <View
          style={[styles.loading, { backgroundColor: currentTheme.background }]}
        >
          <Text style={[styles.loadingText, { color: "#F866B1" }]}>Beauty</Text>
          <Text style={[styles.loadingText, { color: currentTheme.font }]}>
            Verse
          </Text>
        </View>
      )}
      <StatusBar
        barStyle={!theme ? "dark-content" : "light-content"}
        backgroundColor={currentTheme.background}
      />
      {
        // Render the navigation stack based on whether there is a current user or not
        currentUser ? (
          <SocketContext.Provider value={socket.current}>
            <BottomTabNavigator />
          </SocketContext.Provider>
        ) : (
          <AuthStack />
        )
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
    letterSpacing: 1,
  },
});
