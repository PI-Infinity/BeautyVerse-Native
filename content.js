import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { ImageBackground, StatusBar, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import LoadingScreen from "./components/loadingScreen";
import PushNotifications from "./components/pushNotifications";
import { SocketContext } from "./context/socketContext";
import { darkTheme, lightTheme } from "./context/theme";
import { AuthStack } from "./navigations/authStack";
import { BottomTabNavigator } from "./navigations/bottomTab";
import {
  setLanguage,
  setLoading,
  setLocation,
  setMachineId,
  setTheme,
} from "./redux/app";
import { setCity } from "./redux/filter";
import {
  setRerenderCurrentUser,
  setRerenderNotifcations,
} from "./redux/rerenders";
import { setCurrentUser } from "./redux/user";
import { Update } from "./screens/update";

/* main content component of app */

const Content = () => {
  // define dispatch to send data to redux toolkit
  const dispatch = useDispatch();

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // Get the loading state from the app's Redux store
  const loading = useSelector((state) => state.storeApp.loading);

  // theme state, from redux
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // Get the current user from the user's Redux store
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // Get the rerenderCurrentUser state from the app's Redux store
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );

  /**
   * define app version
   *  */
  const currentVersion = Constants.manifest.version;
  const [appVersion, setAppVersion] = useState(null);

  function versionToNumber(version) {
    return version?.split(".").map(Number);
  }

  const current = versionToNumber(currentVersion);
  const app = versionToNumber(appVersion);

  useEffect(() => {
    const DefineAppVersion = async () => {
      try {
        const response = await axios.get(backendUrl + "/version");
        setAppVersion(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    DefineAppVersion();
  }, []);
  /**
   * Define machine unique id
   */
  useEffect(() => {
    const GetMachineId = async () => {
      try {
        const response = await axios.get(backendUrl + "/machineId");
        // dave id in redux
        dispatch(setMachineId(response.data));
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    GetMachineId();
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
    socket.current = io(backendUrl);
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Emit the addUser event to the server's socket.io instances
      socket.current.emit("addUser", currentUser?._id);
    }
  }, [currentUser]);

  /**
   * define user location
   */

  async function getLocationAsync(usr) {
    // Ask for permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();

    // if location not granted, app location equals user main (1) address
    if (status !== "granted") {
      dispatch(
        setLocation({
          country: usr.address[0].country,
          city: usr.address[0]?.city.replace("'", ""),
          latitude: usr.address[0].latitude,
          longitude: usr.address[0].longitude,
        })
      );
      dispatch(setCity(usr.address[0].city?.replace("'", "")));
      return;
    }

    // if location is granted get user geo location
    try {
      // setLocationLoader(true);
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });
      let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
      if (reverseGeocode[0].city) {
        dispatch(
          setLocation({
            country: reverseGeocode[0].country,
            city: reverseGeocode[0].city?.replace("'", ""),
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          })
        );
        dispatch(setCity(reverseGeocode[0].city?.replace("'", "")));
      }
    } catch (error) {
      console.log(error);
      // Handle the error here - you could set an error state, show an error message, etc.
    }
  }

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
        }, 500);
      }
    };
    if (appVersion) {
      GetUser();
    }
  }, [rerenderCurrentUser, appVersion]);

  // after getting current user from localstorage, get user data from mongoDB
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);
  useEffect(() => {
    const GetUser = async () => {
      try {
        // Make a request to get the current user's data from the server
        const response = await axios.get(
          `${backendUrl}/api/v1/users/${currUser?._id}`
        );
        // Set the current user in the user's Redux store
        if (response.data.data.user) {
          await getLocationAsync(response.data.data.user);
          dispatch(setCurrentUser(response.data.data.user));
          dispatch(setLoading(false));
        } else {
          AsyncStorage.removeItem("Beautyverse:currentUser");
          dispatch(setLoading(false));
        }

        dispatch(setRerenderNotifcations());
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(setLoading(false));
      }
    };
    if (currUser) {
      // Call GetUser if currUser is not null
      GetUser();
    }
  }, [currUser, cleanUp]);

  // rerender current user after some real time updates (notifications in this moment)
  useEffect(() => {
    socket.current.on("userUpdate", () => {
      dispatch(setRerenderCurrentUser());
    });
  }, []);

  /**
   * define user's last visit date
   */

  useEffect(() => {
    const GetLastVisit = async () => {
      try {
        await axios.patch(`${backendUrl}/api/v1/users/${currentUser?._id}`, {
          lastLoginAt: new Date(),
        });
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    if (currentUser) {
      GetLastVisit();
    }
  }, [currentUser]);

  return (
    <ImageBackground
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      source={theme ? require("./assets/background.jpg") : null}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: !theme ? currentTheme.background : "rgba(0,0,0,0.5)",
        }}
      >
        {current > app && (
          <Update currentVersion={currentVersion} appVersion={appVersion} />
        )}
        {currentUser && <PushNotifications currentUser={currentUser} />}
        {loading && <LoadingScreen currentTheme={currentTheme} theme={theme} />}
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
      </View>
    </ImageBackground>
  );
};

export default Content;
