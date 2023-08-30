import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Dimensions,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { SocketContext } from "./context/socketContext";
import { darkTheme, lightTheme } from "./context/theme";
import { AuthStack } from "./navigations/authStack";
import { BottomTabNavigator } from "./navigations/bottomTab";
import {
  setLanguage,
  setLoading,
  setLocation,
  setLogoutLoading,
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
import PushNotifications from "./components/pushNotifications";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

/* main content component of app */

const Content = () => {
  /**
   * define user location
   */

  const [loadLoadingScreenText, setLoadLoadingScreenText] = useState(true);

  const [appState, setAppState] = useState(AppState.currentState);
  const [granted, setGranted] = useState(null);
  const [locationLoader, setLocationLoader] = useState(false);

  // text when loading location

  const [loadingText, setLoadingText] = useState("Determine your location...");
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // defines when app is open or not

  useEffect(() => {
    if (AppState.currentState) {
      AppState.addEventListener("change", handleAppStateChange);

      return () => {
        AppState.removeEventListener("change", handleAppStateChange);
      };
    }
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState) {
      if (appState?.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
      }
      setAppState(nextAppState);
    }
  };

  async function getLocationAsync() {
    // Ask for permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setGranted("off");
      // Return early if permission is not granted
      return;
    }

    setGranted("granted");

    // Try to get the user's current location and handle any errors
    try {
      setLocationLoader(true);
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
      } else {
        setGranted("inactive");
      }
      setTimeout(() => {
        setLocationLoader(false);
        dispatch(setLoading(false));
      }, 1500);
    } catch (error) {
      console.log(error);
      // Handle the error here - you could set an error state, show an error message, etc.
    }
  }

  // // if app state changes, get location
  useEffect(() => {
    getLocationAsync();
  }, [appState]);

  // define dispatch to send data to redux toolkit
  const dispatch = useDispatch();

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // Get the loading state from the app's Redux store
  const loading = useSelector((state) => state.storeApp.loading);
  const logoutLoading = useSelector((state) => state.storeApp.logoutLoading);

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
        const response = await axios.get(backendUrl + "/version");
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
    socket.current = io(backendUrl);
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
          `${backendUrl}/api/v1/users/${currUser?._id}`
        );
        // Set the current user in the user's Redux store
        if (response.data.data.user) {
          dispatch(setCurrentUser(response.data.data.user));
          if (granted === "inactive") {
            dispatch(
              setLocation({
                country: response.data.data.user.address[0].country,
                city: response.data.data.user.address[0]?.city.replace("'", ""),
                latitude: response.data.data.user.address[0].latitude,
                longitude: response.data.data.user.address[0].longitude,
              })
            );
            dispatch(
              setCity(response.data.data.user.address[0].city?.replace("'", ""))
            );
            setTimeout(() => {
              // dispatch(setLoading(false));
              setLocationLoader(false);
            }, 1500);
          }
        } else {
          AsyncStorage.removeItem("Beautyverse:currentUser");
          dispatch(setLoading(false));
        }

        setTimeout(() => {
          setLoadLoadingScreenText(false);
        }, 200);
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
  }, [currUser, granted]);

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
      const response = await axios.get(backendUrl + "/machineId");
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
  }, []);

  // theme state, from redux
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <>
      {currentVersion !== appVersion && (
        <Update currentVersion={currentVersion} appVersion={appVersion} />
      )}
      {currentUser && <PushNotifications currentUser={currentUser} />}

      {loading && (
        <View
          style={[
            styles.loading,
            {
              backgroundColor: currentTheme.background,
              flex: 1,
              resizeMode: "cover",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              // position: "absolute",
              // bottom: 100,
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 7.5,
              paddingHorizontal: 25,
              borderRadius: 50,
              marginBottom: 50,
            }}
          >
            <Text
              style={[
                styles.loadingText,
                { color: currentTheme.pink, letterSpacing: 0.5 },
              ]}
            >
              Beauty
            </Text>
            <Text
              style={[
                styles.loadingText,
                { color: currentTheme.font, letterSpacing: 0.5 },
              ]}
            >
              Verse
            </Text>
          </View>

          {(granted === "inactive" || granted === "off") &&
          !loadLoadingScreenText ? (
            <View
              style={{
                marginTop: 30,
                gap: 15,
                width: "100%",
                alignItems: "center",
                // position: "absolute",

                gap: 15,
                // bottom: 250,
              }}
            >
              <FontAwesome
                name="location-arrow"
                size={28}
                color={currentTheme.font}
              />
              <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
                Please Allow Location Access!{" "}
              </Text>
              <Pressable
                onPress={() => Linking.openSettings()}
                style={{
                  width: "45%",
                  borderWidth: 1,
                  borderColor: currentTheme.pink,
                  borderRadius: 50,
                  padding: 5,
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: currentTheme.font }}>Go to Settings</Text>
              </Pressable>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setGranted("inactive");
                  dispatch(
                    setLocation({
                      country: currentUser?.address[0]?.country,
                      city: currentUser?.address[0]?.city?.replace("'", ""),
                      latitude: currentUser?.address[0]?.latitude,
                      longitude: currentUser?.address[0]?.longitude,
                    })
                  );
                  dispatch(
                    setCity(currentUser?.address[0]?.city?.replace("'", ""))
                  );
                  dispatch(setLoading(false));
                  setLocationLoader(false);
                }}
                style={{
                  width: "75%",
                  // borderWidth: 1,
                  // borderColor: currentTheme.disabled,
                  borderRadius: 50,
                  padding: 5,
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: currentTheme.font,
                    marginTop: 15,
                    letterSpacing: 0.3,
                  }}
                >
                  Continue without location
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator size="small" color={currentTheme.pink} />
          )}

          {locationLoader ? (
            <View style={{ position: "absolute", bottom: 75, gap: 15 }}>
              <Animated.Text
                style={{ color: "#fff", opacity: opacity, letterSpacing: 0.3 }}
              >
                {loadingText}
              </Animated.Text>
            </View>
          ) : (
            <Ionicons
              size={38}
              color={currentTheme.pink}
              name="earth-sharp"
              style={{ position: "absolute", bottom: 75 }}
            />
          )}
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
      {logoutLoading && (
        <View
          style={[
            styles.loading,
            {
              backgroundColor: currentTheme.background,
              flex: 1,
              resizeMode: "cover",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              // position: "absolute",
              // bottom: 100,
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 7.5,
              paddingHorizontal: 25,
              borderRadius: 50,
              marginBottom: 50,
            }}
          >
            <Text
              style={[
                styles.loadingText,
                { color: currentTheme.pink, letterSpacing: 0.5 },
              ]}
            >
              Beauty
            </Text>
            <Text
              style={[
                styles.loadingText,
                { color: currentTheme.font, letterSpacing: 0.5 },
              ]}
            >
              Verse
            </Text>
          </View>
        </View>
      )}
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

    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
});
