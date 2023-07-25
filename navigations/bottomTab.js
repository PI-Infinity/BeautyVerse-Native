import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../components/cacheableImage";
import { useSocket } from "../context/socketContext";
import { darkTheme, lightTheme } from "../context/theme";
import { ProceduresOptions } from "../datas/registerDatas";
import { CardsStack } from "../navigations/cardsStack";
import { ChatStack } from "../navigations/chatStack";
import { FeedsStack } from "../navigations/feedsStack";
import { FilterStack } from "../navigations/filterStack";
import { ProfileStack } from "../navigations/profileStack";
import { setRerederRooms, setRooms } from "../redux/chat";
import { setSearch } from "../redux/filter";
import {
  setActiveOrders,
  setCanceledOrders,
  setCompletedOrders,
  setFilterResult,
  setLoader,
  setNewOrders,
  setOrders,
  setPendingOrders,
  setRejectedOrders,
  setTotalResult,
} from "../redux/orders";
import {
  setCleanUp,
  setRerenderCurrentUser,
  setRerenderOrders,
  setCardRefreshControl,
  setFeedRefreshControl,
} from "../redux/rerenders";
import {
  setActiveSentOrders,
  setCanceledSentOrders,
  setCompletedSentOrders,
  setLoaderSentOrders,
  setNewSentOrders,
  setPendingSentOrders,
  setRejectedSentOrders,
  setSentOrders,
  setSentOrdersFilterResult,
  setSentOrdersTotalResult,
} from "../redux/sentOrders";
import { setZoomToTop } from "../redux/app";

/**
 * create tab bar
 */
const Tab = createBottomTabNavigator();

// Custom Feed icon for tab bar, includes functions etc.

const CustomTabBarFeedsIcon = ({ color, render, setRender, scrollY }) => {
  // define some routes and contexts
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  return (
    <Pressable
      onPress={() => {
        if (isFocused) {
          if (routeName === "Feeds") {
            if (scrollY > 0) {
              console.log("zoom");
              dispatch(setZoomToTop());
            } else {
              console.log("refresh");
              dispatch(setFeedRefreshControl(true));
              dispatch(setCleanUp());
            }
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
    </Pressable>
  );
};

// define custom cards icon, includes functions etc.

const CustomTabBarCardsIcon = ({ color, scrollY }) => {
  // define some contexts and routes

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  return (
    <Pressable
      onPress={() => {
        if (isFocused) {
          if (routeName === "cards") {
            if (scrollY > 0) {
              dispatch(setZoomToTop());
            } else {
              dispatch(setCardRefreshControl(true));
              dispatch(setCleanUp());
            }
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
    </Pressable>
  );
};

// define custom filter icons

const CustomTabBarFilterIcon = (props) => {
  // define some routes and contexts
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  // search input state
  const searchInput = useSelector((state) => state.storeFilter.searchInput);

  // navigate state, after change state value, runs useeffect to navigate trough screen
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    navigation.navigate("Main");
  }, [navigate]);

  // define procedures list
  const proceduresOptions = ProceduresOptions();

  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.25 }}
      end={{ x: 0.5, y: 1.0 }}
      colors={[props.currentTheme.pink, props.currentTheme.pink]}
      style={{
        padding: 2,
        position: "absolute",
        top: -10,
        width: 45,
        height: 45,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: props.currentTheme.line,
        overflow: "hidden",
      }}
    >
      <Pressable
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
          width: 52,
          height: 52,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
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
              zIndex: 10,
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
              props.sum > 0 && props.focused ? "#fff" : props.currentTheme.pink2
            }
          />
        ) : (
          <MaterialIcons
            name="saved-search"
            size={40}
            color={
              props.sum > 0 && isFocused ? props.currentTheme.pink : "#fff"
            }
            style={{ marginLeft: 8, marginTop: 9 }}
          />
        )}
      </Pressable>
    </LinearGradient>
  );
};

// defined custom chat icon with functions

const CustomTabBarChatIcon = ({ color, currentTheme }) => {
  // defined some routes and contexts

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);
  const rooms = useSelector((state) => state.storeChat.rooms);
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define unread messages for chat, shown in badge

  const definedQnt =
    rooms?.length > 0 &&
    rooms?.filter(
      (r) => r.status === "unread" && r.lastSender !== currentUser._id
    );

  return (
    <Pressable
      onPress={() => {
        if (isFocused) {
          if (routeName === "Chats") {
            console.log("render");
            dispatch(setRerederRooms());
          } else {
            dispatch(setRerederRooms());
            navigation.navigate("Chats");
          }
        } else {
          navigation.navigate("Chat");
        }
      }}
    >
      {/** badge for chat */}
      {definedQnt.length > 0 && (
        <View
          style={{
            width: "auto",
            minWidth: 15,
            height: 15,
            backgroundColor: currentTheme.pink,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            position: "absolute",
            right: 0,
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
            {definedQnt?.length}
          </Text>
        </View>
      )}
      <FontAwesome
        name="wechat"
        size={26}
        color={color}
        style={{ marginTop: 5 }}
      />
    </Pressable>
  );
};

// profile custom icon with functions and profile cover

const CustomTabBarProfileIcon = (props) => {
  // define some routes and contexts

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

  // recieved and sent orders redux states
  const newOrders = useSelector((state) => state.storeOrders.new);
  const newSentOrders = useSelector((state) => state.storeSentOrders.new);

  // Select theme from global Redux state (dark or light theme)
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // cover loading state
  const [loadCover, setLoadCover] = useState(true);

  useEffect(() => {
    setLoadCover(true);
    if (props?.currentUser?.cover === "") {
      setLoadCover(false);
    }
  }, [props.currentUser?.cover]);

  return (
    <Pressable
      onPress={() => {
        if (isFocused) {
          if (routeName !== "UserProfile") {
            navigation.navigate("UserProfile");
          } else {
            dispatch(setRerenderCurrentUser());
            dispatch(setRerenderOrders());
          }
        } else {
          navigation.navigate("Profile");
        }
      }}
    >
      {(props.unreadNotifications > 0 ||
        newOrders > 0 ||
        newSentOrders > 0) && (
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
            {props.unreadNotifications + newOrders + newSentOrders}
          </Text>
        </View>
      )}
      {loadCover && (
        <View style={{ position: "absolute", zIndex: 99999, left: 4, top: 8 }}>
          <ActivityIndicator size="small" color={currentTheme.pink} />
        </View>
      )}
      {props.currentUser?.cover?.length > 0 ? (
        <CacheableImage
          key={props.currentUser?.cover}
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
          onLoad={() => setLoadCover(false)}
        />
      ) : (
        <FontAwesome
          name="user-circle-o"
          size={25}
          style={{ marginTop: 5 }}
          color={
            isFocused ? props.currentTheme.pink : props.currentTheme.disabled
          }
        />
      )}
    </Pressable>
  );
};

export const BottomTabNavigator = () => {
  // redux toolkit dispatch
  const dispatch = useDispatch();

  // define socker context
  const socket = useSocket();

  // use navigation hooks to handle navigate trough screens
  const navigation = useNavigation();

  // addational render state (after change value, renders some components by useEffect)
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
  // after run this state, it changes value and rerenders notifications api
  const rerenderNotifications = useSelector(
    (state) => state.storeRerenders.rerenderNotifications
  );
  // notifications state
  const [notifications, setNotifications] = useState([]);
  // unread notifications state
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  // useEffect defines notifications and unread notifications from user's info and defines them in tab bar useStste
  useEffect(() => {
    setNotifications(currentUser.notifications);
    setUnreadNotifications(
      currentUser.notifications.filter((n) => n?.status === "unread").length
    );
  }, [rerenderNotifications]);

  /**
   * get orders
   */

  // after run this state, it changes value and rerenders orders api
  const rerenderOrders = useSelector(
    (state) => state.storeRerenders.rerenderOrders
  );
  // this render also addationally renders some useffects
  const [renderOrders, setRenderOrders] = useState(false);

  // some filters for orders
  const statusFilter = useSelector((state) => state.storeOrders.statusFilter);
  const date = useSelector((state) => state.storeOrders.date);
  const createdAt = useSelector((state) => state.storeOrders.createdAt);
  const procedure = useSelector((state) => state.storeOrders.procedure);

  // get recieved orders
  useEffect(() => {
    const GetOrders = async () => {
      try {
        dispatch(setLoader(true));
        const response = await axios.get(
          "https://beautyverse.herokuapp.com/api/v1/users/" +
            currentUser._id +
            `/orders?page=${1}&status=${
              statusFilter === "All" ? "" : statusFilter?.toLowerCase()
            }&date=${
              date.active ? date.date : ""
            }&createdAt=${createdAt}&procedure=${procedure}`
        );
        // define orders with specific status
        dispatch(setOrders(response.data.data.orders));
        dispatch(setTotalResult(response.data.totalResult));
        dispatch(setFilterResult(response.data.filterResult));
        dispatch(setNewOrders(response.data.new));
        dispatch(setPendingOrders(response.data.pending));
        dispatch(setActiveOrders(response.data.active));
        dispatch(setCompletedOrders(response.data.completed));
        dispatch(setRejectedOrders(response.data.rejected));
        dispatch(setCanceledOrders(response.data.canceled));
        setTimeout(() => {
          dispatch(setLoader(false));
        }, 500);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      GetOrders();
    }
  }, [renderOrders, rerenderOrders, statusFilter, date, procedure, createdAt]);

  // get sent orders
  const statusFilterSentOrders = useSelector(
    (state) => state.storeSentOrders.statusFilter
  );
  const dateSentOrders = useSelector((state) => state.storeSentOrders.date);

  const createdAtSentOrders = useSelector(
    (state) => state.storeSentOrders.createdAt
  );
  const procedureSentOrders = useSelector(
    (state) => state.storeSentOrders.procedure
  );
  useEffect(() => {
    const GetOrders = async () => {
      try {
        dispatch(setLoaderSentOrders(true));
        const response = await axios.get(
          "https://beautyverse.herokuapp.com/api/v1/users/" +
            currentUser._id +
            `/sentorders?page=${1}&status=${
              statusFilterSentOrders === "All"
                ? ""
                : statusFilterSentOrders?.toLowerCase()
            }&date=${
              dateSentOrders.active ? dateSentOrders.date : ""
            }&createdAt=${createdAtSentOrders}&procedure=${procedureSentOrders}`
        );

        dispatch(setSentOrders(response.data.data.sentOrders));
        dispatch(setSentOrdersTotalResult(response.data.totalResult));
        dispatch(setSentOrdersFilterResult(response.data.filterResult));
        dispatch(setNewSentOrders(response.data.new));
        dispatch(setActiveSentOrders(response.data.active));
        dispatch(setPendingSentOrders(response.data.pending));
        dispatch(setCanceledSentOrders(response.data.canceled));
        dispatch(setRejectedSentOrders(response.data.rejected));
        dispatch(setCompletedSentOrders(response.data.completed));
        setTimeout(() => {
          dispatch(setLoaderSentOrders(false));
        }, 500);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    if (currentUser) {
      GetOrders();
    }
  }, [
    renderOrders,
    rerenderOrders,
    statusFilterSentOrders,
    dateSentOrders,
    procedureSentOrders,
    createdAtSentOrders,
  ]);

  // this useeffect rerenders orders in real time when some users sends booking requests
  useEffect(() => {
    socket.on("ordersUpdate", () => {
      dispatch(setRerenderOrders());
    });
  }, []);

  /* 
    Get Chats 
  */

  // render state for rooms
  const rerenderRooms = useSelector((state) => state.storeChat.rerenderRooms);

  // getting chat rooms
  const [rerenderChatRooms, setRerenderChatRooms] = useState(false);
  useEffect(() => {
    const GetChats = async () => {
      try {
        const response = await axios.get(
          "https://beautyverse.herokuapp.com/api/v1/chats/members/" +
            currentUser._id
        );
        // save them in redux toolkit
        dispatch(setRooms(response.data.data.chats));
      } catch (error) {
        console.log(error.response);
        dispatch(setRooms([]));
        console.log(error.response.data.message);
      }
    };
    GetChats();
  }, [rerenderRooms, rerenderChatRooms]);

  useEffect(() => {
    socket.on("chatUpdate", (data) => {
      console.log("chat updated");
      setTimeout(() => {
        setRerenderChatRooms(!rerenderChatRooms);
      }, 1000);
    });
  }, []);

  // feeds scroll y position
  const [feedsScrollY, setFeedsScrollY] = useState(0);
  // cards scroll y position
  const [cardsScrollY, setCardsScrollY] = useState(0);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: currentTheme.background,
          transform: [{ scale: 0.5 }],
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
        children={() => (
          <FeedsStack
            render={render}
            navigation={navigation}
            setScrollY={setFeedsScrollY}
          />
        )}
        options={({}) => ({
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
              scrollY={feedsScrollY}
            />
          ),
        })}
      />

      {/** Cards screen, cards stack screens inside tab */}
      <Tab.Screen
        name="Cards"
        children={() => (
          <CardsStack
            render={render}
            navigation={navigation}
            setScrollY={setCardsScrollY}
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
            <CustomTabBarCardsIcon
              {...props}
              sum={sum}
              currentTheme={currentTheme}
              scrollY={cardsScrollY}
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

      {/** Chat screen, chat stack screens inside tab */}
      <Tab.Screen
        name="Chat"
        component={ChatStack}
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
          tabBarIcon: (props) => (
            <CustomTabBarChatIcon currentTheme={currentTheme} {...props} />
          ),
        })}
      />

      {/** Profile screen, profile stack screens inside tab */}
      <Tab.Screen
        name="Profile"
        children={() => (
          <ProfileStack
            notifications={notifications}
            unreadNotifications={unreadNotifications}
            navigation={navigation}
            setNotifications={setNotifications}
            setUnreadNotifications={setUnreadNotifications}
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
