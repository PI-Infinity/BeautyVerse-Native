import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FeedsStack } from "../navigations/feedsStack";
import { CardsStack } from "../navigations/cardsStack";
import { ProfileStack } from "../navigations/profileStack";
import { FilterStack } from "../navigations/filterStack";
import { ChatStack } from "../navigations/chatStack";
import { OrdersStack } from "../navigations/ordersStack";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { setCleanUp } from "../redux/rerenders";
import { useDispatch } from "react-redux";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Language } from "../context/language";
import { CacheableImage } from "../components/cacheableImage";
import { lightTheme, darkTheme } from "../context/theme";
import axios from "axios";

const Tab = createBottomTabNavigator();

const CustomTabBarFeedsIcon = ({ color, size, render, setRender }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        if (isFocused) {
          dispatch(setCleanUp());
        } else {
          navigation.navigate("Feeds");
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
const CustomTabBarCardsIcon = ({ color, size }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        if (isFocused) {
          dispatch(setCleanUp());
        } else {
          navigation.navigate("Cards");
        }
      }}
    >
      <Icon
        name="address-book-o"
        size={24}
        color={color}
        style={{ marginTop: 5 }}
      />
    </TouchableOpacity>
  );
};

export const BottomTabNavigator = ({ socket, onTabBarLayout }) => {
  const language = Language();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const [render, setRender] = useState(true);

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
    (item) => item.status === "unread"
  );

  /**
   * get orders
   */
  const [orders, setOrders] = useState([]);
  const [renderOrders, setRenderOrders] = useState(false);
  useEffect(() => {
    const GetOrders = async () => {
      const response = await axios.get(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/orders"
      );
      setOrders(response.data.data.orders);
    };
    try {
      if (currentUser) {
        GetOrders();
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, [renderOrders]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: currentTheme.background },
        headerShown: false,
        style: {
          backgroundColor: currentTheme.background,
          elevation: 0,
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
          tabBarInactiveTintColor: "#ccc",
          tabBarActiveTintColor: "#F866B1",
          tabBarStyle: {
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            elevation: 0,
          },
          tabBarIcon: (props) => (
            <CustomTabBarFeedsIcon
              {...props}
              render={render}
              setRender={setRender}
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
          tabBarInactiveTintColor: "#ccc",
          tabBarActiveTintColor: "#F866B1",
          tabBarStyle: {
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            elevation: 0,
          },
          tabBarIcon: (props) => <CustomTabBarCardsIcon {...props} />,
        }}
      />
      {/** Filter screen, filter stack screens inside tab, includes search screen */}
      <Tab.Screen
        name="Filters"
        component={FilterStack}
        options={{
          tabBarLabel: "",
          tabBarInactiveTintColor: "#ccc",
          tabBarActiveTintColor: "#F866B1",
          tabBarStyle: {
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <View style={{ height: 30, justifyContent: "center" }}>
              {/** badge for filter */}
              {sum > 0 && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 15,
                    height: 15,
                    backgroundColor: "red",
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    zIndex: 2,
                    right: -5,
                    top: 0,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 10 }}>{sum}</Text>
                </View>
              )}

              <Icon
                name="search"
                size={25}
                color={color}
                style={{ marginTop: 5 }}
              />
            </View>
          ),
        }}
      />
      {/** Orders screen, orders stack screens inside tab */}
      {currentUser.type !== "user" && (
        <Tab.Screen
          name="Orders"
          children={() => <OrdersStack socket={socket} orders={orders} />}
          options={({ route }) => ({
            tabBarLabel: "",
            tabBarInactiveTintColor: "#ccc",
            tabBarActiveTintColor: "#F866B1",
            tabBarStyle: {
              backgroundColor: currentTheme.background,
              borderTopWidth: 1,
              borderTopColor: currentTheme.background2,
              elevation: 0,
            },
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="list-alt"
                size={26}
                color={color}
                style={{ marginTop: 7.5 }}
              />
            ),
          })}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Prevent the default action
              e.preventDefault();

              // Your custom logic here
              setRenderOrders(!renderOrders);

              // Navigate to the desired screen
              navigation.navigate("Orders");
            },
          })}
        />
      )}
      {/** Chat screen, chat stack screens inside tab */}
      <Tab.Screen
        name="Chat"
        children={() => <ChatStack socket={socket} />}
        options={({ route }) => ({
          tabBarLabel: "",
          tabBarInactiveTintColor: "#ccc",
          tabBarActiveTintColor: "#F866B1",
          tabBarStyle: {
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon
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
          tabBarInactiveTintColor: "#ccc",
          tabBarActiveTintColor: "#F866B1",
          tabBarStyle: {
            backgroundColor: currentTheme.background,
            borderTopWidth: 1,
            borderTopColor: currentTheme.background2,
            elevation: 0,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              {unreadNotifications.length > 0 && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 15,
                    height: 15,
                    backgroundColor: "red",
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
                    style={{ color: "#fff", fontSize: 10, textAlign: "center" }}
                  >
                    {unreadNotifications?.length}
                  </Text>
                </View>
              )}
              {currentUser?.cover?.length > 0 ? (
                <CacheableImage
                  style={{
                    height: 27,
                    width: 27,
                    borderRadius: 50,
                    borderWidth: 1.75,
                    borderColor: focused ? currentTheme.pink : "#ccc",
                    marginTop: 5,
                  }}
                  source={{ uri: currentUser?.cover }}
                  manipulationOptions={[
                    { resize: { width: 100, height: 100 } },
                    { rotate: 90 },
                  ]}
                />
              ) : (
                <Icon name="user-circle-o" size={25} color="#e5e5e5" />
              )}
            </View>
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
