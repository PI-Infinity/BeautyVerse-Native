import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FeedsStack } from "../navigations/feedsStack";
import { CardsStack } from "../navigations/cardsStack";
import { ProfileStack } from "../navigations/profileStack";
import { FilterStack } from "../navigations/filterStack";
import { ChatStack } from "../navigations/chatStack";
import { OrdersStack } from "../navigations/ordersStack";
import { FontAwesome } from "@expo/vector-icons";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { setCleanUp, setRerenderCurrentUser } from "../redux/rerenders";
import { useDispatch } from "react-redux";
import {
  useNavigation,
  useRoute,
  useIsFocused,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import { Language } from "../context/language";
import { CacheableImage } from "../components/cacheableImage";
import { lightTheme, darkTheme } from "../context/theme";
import axios from "axios";
import { setOrders } from "../redux/orders";
import { setSearch } from "../redux/filter";
import { setRerenderUserList } from "../redux/rerenders";
import { ProceduresOptions } from "../datas/registerDatas";
import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();

const CustomTabBarFeedsIcon = ({
  color,
  size,
  render,
  setRender,
  sum,
  currentTheme,
}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);
  const result = useSelector((state) => state.storeApp.feedsResult);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      // style={{
      //   borderTopWidth: 2,
      //   borderColor: isFocused ? "pink" : "rgba(0,0,0,0)",
      // }}
      onPress={() => {
        if (isFocused) {
          if (routeName === "Feeds") {
            dispatch(setCleanUp());
          } else {
            navigation.navigate("Feeds");
          }
        } else {
          navigation.navigate("Main");
          setRender(!render);
        }
      }}
    >
      <MaterialCommunityIcons
        name="cards-variant"
        size={30}
        color={color}
        style={{ marginTop: 5 }}
      />
    </TouchableOpacity>
  );
};
const CustomTabBarCardsIcon = ({ color, size, sum, currentTheme }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);
  const result = useSelector((state) => state.storeApp.cardsResult);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (isFocused) {
          if (routeName === "cards") {
            dispatch(setCleanUp());
          } else {
            navigation.navigate("cards");
          }
        } else {
          navigation.navigate("Cards");
        }
      }}
    >
      <FontAwesome
        name="address-book-o"
        size={24}
        color={color}
        style={{ marginTop: 5 }}
      />
    </TouchableOpacity>
  );
};
const CustomTabBarOrdersIcon = ({
  color,
  size,
  setRenderOrders,
  renderOrders,
}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (isFocused) {
          setRenderOrders(!renderOrders);
        } else {
          navigation.navigate("Orders");
        }
      }}
    >
      <FontAwesome
        name="list-alt"
        size={26}
        color={color}
        style={{ marginTop: 7.5 }}
      />
    </TouchableOpacity>
  );
};
const CustomTabBarFilterIcon = (props) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const searchInput = useSelector((state) => state.storeFilter.searchInput);
  const search = useSelector((state) => state.storeFilter.search);
  const [navigate, setNavigate] = useState(false);

  const proceduresOptions = ProceduresOptions();

  useEffect(() => {
    navigation.navigate("Main");
  }, [navigate]);

  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.25 }}
      end={{ x: 0.5, y: 1.0 }}
      colors={[
        props.currentTheme.lightPink,
        // props.currentTheme.pink,
        props.currentTheme.pink,
        props.currentTheme.pink,
        // props.currentTheme.pink,
        props.currentTheme.pink,
      ]}
      style={{
        padding: 2,
        // backgroundColor: props.currentTheme.pink,
        position: "absolute",
        top: -15,
        width: 42,
        height: 42,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: props.currentTheme.line,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={
          isFocused
            ? () => {
                let val = proceduresOptions.find(
                  (item) => item.label === searchInput
                );
                if (val) {
                  dispatch(setSearch(val.value));
                } else {
                  dispatch(setSearch(searchInput));
                }

                setTimeout(() => {
                  setNavigate(!navigate);
                  dispatch(setCleanUp());
                }, 10);
              }
            : () => {
                navigation.navigate("Filters");
              }
        }
        style={{
          justifyContent: "center",
          // backgroundColor: props.currentTheme.background2,
          width: 45,
          height: 45,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",

          // borderWidth: 1.5,
          // borderColor: props.focused
          //   ? props.currentTheme.pink
          //   : props.currentTheme.disabled,
        }}
      >
        {/** badge for filter */}
        {props.sum > 0 && !props.focused && (
          <View
            style={{
              width: "auto",
              minWidth: 15,
              height: 15,
              backgroundColor: props.currentTheme.background2,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              // position: "absolute",
              zIndex: 10,
              // right: -10,
              // top: -7,
              position: "absolute",
              top: 6,
              right: 8,
              marginBottom: 2,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3, // negative value places shadow on top
              },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text
              style={{
                color: "#f1f1f1",
                fontSize: 10,
                fontWeight: "bold",
                letterSpacing: 0.15,
              }}
            >
              {props.sum}
            </Text>
          </View>
        )}

        {props.focused ? (
          <FontAwesome
            name="arrow-up"
            size={20}
            color={
              props.sum > 0 && props.focused
                ? "#f1f1f1"
                : props.currentTheme.pink2
            }
          />
        ) : (
          <MaterialIcons
            name="saved-search"
            size={40}
            color={
              props.sum > 0 && isFocused ? props.currentTheme.pink : "#f1f1f1"
            }
            style={{ marginLeft: 6, marginTop: 6 }}
          />
        )}
        {/* {!props.focused && (
          <Text
            style={{
              fontSize: 10,
              color: props.currentTheme.background,
              fontWeight: "bold",
              marginLeft: 2,
            }}
          >
            Filter
          </Text>
        )} */}
      </TouchableOpacity>
    </LinearGradient>
  );
};
const CustomTabBarProfileIcon = (props) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (isFocused) {
          if (routeName !== "UserProfile") {
            navigation.navigate("UserProfile");
          } else {
            dispatch(setRerenderCurrentUser());
          }
        } else {
          navigation.navigate("Profile");
        }
      }}
    >
      {props.unreadNotifications.length > 0 && (
        <View
          style={{
            width: "auto",
            minWidth: 15,
            height: 15,
            backgroundColor: props.currentTheme.pink,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 2,
            right: -5,
            top: -2,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 10,
              textAlign: "center",
              letterSpacing: 0.15,
            }}
          >
            {props.unreadNotifications?.length}
          </Text>
        </View>
      )}
      {props.currentUser?.cover?.length > 0 ? (
        <CacheableImage
          style={{
            height: 27,
            width: 27,
            borderRadius: 50,
            borderWidth: 1.75,
            borderColor: props.focused
              ? props.currentTheme.pink
              : props.currentTheme.disabled,
            marginTop: 5,
          }}
          source={{ uri: props.currentUser?.cover }}
          manipulationOptions={[
            { resize: { width: 100, height: 100 } },
            { rotate: 90 },
          ]}
        />
      ) : (
        <FontAwesome
          name="user-circle-o"
          size={25}
          style={{ marginTop: 2 }}
          color={
            isFocused ? props.currentTheme.pink : props.currentTheme.disabled
          }
        />
      )}
    </TouchableOpacity>
  );
};

export const BottomTabNavigator = ({ socket, onTabBarLayout }) => {
  const language = Language();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const [render, setRender] = useState(false);

  // Get the filter badge sum from the app state. badge for bottom tab filter icon. when user changes any filter, badge shows how many filter is set currently
  const sum = useSelector((state) => state.storeFilter.filterBadgeSum);

  // Get the current user from the app state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define app theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  /**
   * get user notifications
   */
  const rerenderNotifications = useSelector(
    (state) => state.storeRerenders.rerenderNotifications
  );
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    setNotifications(currentUser.notifications);
  }, [rerenderNotifications]);

  let unreadNotifications = notifications?.filter(
    (item) => item?.status === "unread"
  );

  /**
   * get orders
   */
  const rerenderOrders = useSelector(
    (state) => state.storeRerenders.rerenderOrders
  );
  const [renderOrders, setRenderOrders] = useState(false);

  /**
   * refresh orders
   */
  const [refresh, setRefresh] = useState(true);
  const status = useSelector((state) => state.storeOrders.statusFilter);
  useEffect(() => {
    const GetOrders = async () => {
      setRefresh(true);
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          `/orders/?status=${status || "active"}&page=1`
      );
      dispatch(setOrders(response.data.data.orders));
      setTimeout(() => {
        setRefresh(false);
      }, 500);
    };
    try {
      if (currentUser) {
        GetOrders();
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, [renderOrders, rerenderOrders, status]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: currentTheme.background,
        },
        headerShown: false,
        style: {
          backgroundColor: currentTheme.background,
          elevation: 1,
          // for Android
          shadowOffset: {
            width: 0,
            height: 0, // for iOS
          },
        },
      }}
    >
      {/** Main screen, feed stack screens inside tab */}
      <Tab.Screen
        name="Main"
        children={() => <FeedsStack render={render} />}
        options={({ navigation, route }) => ({
          tabBarLabel: "",
          tabBarInactiveTintColor: currentTheme.disabled,
          tabBarActiveTintColor: currentTheme.pink,
          tabBarStyle: {
            paddingTop: 1,
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: !theme ? -1 : 0, // negative value places shadow on top
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5, // required for android
          },
          tabBarIcon: (props) => (
            <CustomTabBarFeedsIcon
              {...props}
              render={render}
              setRender={setRender}
              currentTheme={currentTheme}
              sum={sum}
            />
          ),
        })}
      />

      {/** Cards screen, cards stack screens inside tab */}
      <Tab.Screen
        name="Cards"
        component={CardsStack}
        options={{
          tabBarLabel: "",
          tabBarInactiveTintColor: currentTheme.disabled,
          tabBarActiveTintColor: currentTheme.pink,
          tabBarStyle: {
            paddingTop: 1,
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            shadowColor: "#000",

            shadowOffset: {
              width: 0,
              height: !theme ? -1 : 0, // negative value places shadow on top
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5, // required for android
          },
          tabBarIcon: (props) => (
            <CustomTabBarCardsIcon
              {...props}
              sum={sum}
              currentTheme={currentTheme}
            />
          ),
        }}
      />
      {/** Filter screen, filter stack screens inside tab, includes search screen */}
      <Tab.Screen
        name="Filters"
        component={FilterStack}
        options={{
          tabBarLabel: "",
          tabBarInactiveTintColor: currentTheme.disabled,
          tabBarActiveTintColor: currentTheme.pink,
          tabBarStyle: {
            paddingTop: 1,
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            shadowColor: "#000",

            shadowOffset: {
              width: 0,
              height: !theme ? -1 : 0, // negative value places shadow on top
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5, // required for android
          },
          tabBarIcon: (props) => {
            return (
              <CustomTabBarFilterIcon
                currentTheme={currentTheme}
                sum={sum}
                {...props}
              />
            );
          },
        }}
      />
      {/* * Orders screen, orders stack screens inside tab
      {currentUser.type !== "user" && (
        <Tab.Screen
          name="Orders"
          children={() => <OrdersStack socket={socket} refresh={refresh} />}
          options={({ route }) => ({
            tabBarLabel: "",
            tabBarInactiveTintColor: currentTheme.disabled,
            tabBarActiveTintColor: currentTheme.pink,
            tabBarStyle: {
              backgroundColor: currentTheme.background,
              borderTopWidth: 1,
              borderTopColor: currentTheme.background2,
              shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2, // negative value places shadow on top
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // required for android
              elevation: 0,
            },
            tabBarIcon: (props) => (
              <CustomTabBarOrdersIcon
                {...props}
                setRenderOrders={setRenderOrders}
                renderOrders={renderOrders}
              />
            ),
          })}
        />
      )} */}
      {/** Chat screen, chat stack screens inside tab */}
      <Tab.Screen
        name="Chat"
        children={() => <ChatStack socket={socket} />}
        options={({ route }) => ({
          tabBarLabel: "",
          tabBarInactiveTintColor: currentTheme.disabled,
          tabBarActiveTintColor: currentTheme.pink,
          tabBarStyle: {
            paddingTop: 1,
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            shadowColor: "#000",

            shadowOffset: {
              width: 0,
              height: !theme ? -1 : 0, // negative value places shadow on top
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5, // required for android
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome
              name="wechat"
              size={26}
              color={color}
              style={{ marginTop: 5 }}
            />
          ),
        })}
      />

      {/** Profile screen, profile stack screens inside tab */}
      <Tab.Screen
        name="Profile"
        children={() => (
          <ProfileStack
            socket={socket}
            notifications={notifications}
            unreadNotifications={unreadNotifications}
            navigation={navigation}
            setNotifications={setNotifications}
          />
        )}
        options={{
          tabBarLabel: "",
          tabBarInactiveTintColor: currentTheme.disabled,
          tabBarActiveTintColor: currentTheme.pink,
          tabBarStyle: {
            paddingTop: 1,
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            shadowColor: "#000",

            shadowOffset: {
              width: 0,
              height: !theme ? -1 : 0, // negative value places shadow on top
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5, // required for android
          },
          tabBarIcon: (props) => (
            <CustomTabBarProfileIcon
              {...props}
              currentUser={currentUser}
              currentTheme={currentTheme}
              unreadNotifications={unreadNotifications}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// image cover for profile tab bar.
const TabBarIcon = (props) => {
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  return (
    <Image
      source={{ uri: currentUser?.cover }}
      resizeMode="contain"
      style={{
        width: focused ? 24 : 20,
        height: focused ? 24 : 20,
      }}
    />
  );
};
