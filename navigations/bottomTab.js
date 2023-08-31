import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../context/socketContext";
import { darkTheme, lightTheme } from "../context/theme";
import { BMSStack } from "../navigations/BMSStack";
import { BMSStackSent } from "../navigations/BMSStackSent";
import { MarketplaceStack } from "../navigations/MarketplaceStack";
import { CustomTabBarCardsIcon } from "../navigations/bottomTabIcons/cards";
import { CustomTabBarProfileIcon } from "../navigations/bottomTabIcons/profile";
import { CustomTabBarChatIcon } from "../navigations/bottomTabIcons/chat";
import { CustomTabBarBookingsIcon } from "../navigations/bottomTabIcons/bookings";
import { CustomTabBarFeedsIcon } from "../navigations/bottomTabIcons/feeds";
import { CustomTabBarMarketplaceIcon } from "../navigations/bottomTabIcons/marketplace";
import { CardsStack } from "../navigations/cardsStack";
import { ChatStack } from "../navigations/chatStack";
import { FeedsStack } from "../navigations/feedsStack";
import { ProfileStack } from "../navigations/profileStack";
import {
  setBestSellersList,
  setLatestList,
  setRandomProductsList,
  setUserProductListingPage,
  setUserProducts,
} from "../redux/Marketplace";
import { setRerederRooms, setRooms } from "../redux/chat";
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
import { setRerenderOrders } from "../redux/rerenders";
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

/**
 * create tab bar
 */
const Tab = createBottomTabNavigator();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

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

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

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
          backendUrl +
            "/api/v1/users/" +
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
          backendUrl +
            "/api/v1/users/" +
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
          backendUrl + "/api/v1/chats/members/" + currentUser._id
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
      // setRerenderChatRooms(!rerenderChatRooms);
      dispatch(setRerederRooms());
    });
  }, []);

  // feeds scroll y position
  const [feedsScrollY, setFeedsScrollY] = useState(0);
  // cards scroll y position
  const [cardsScrollY, setCardsScrollY] = useState(0);
  // cards scroll y position
  const [profileScrollY, setProfileScrollY] = useState(0);

  /**
   * get marketplace products
   */
  /**
   * get user products
   */
  const rerenderProducts = useSelector(
    (state) => state.storeMarketplace.rerenderProducts
  );

  useEffect(() => {
    const GetProducts = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/v1/marketplace");
        if (response.data.data.products?.random) {
          dispatch(setRandomProductsList(response.data.data.products.random));
          // dispatch(setLatestList(response.data.data.products.latestList));
        }
        // ... other dispatches
      } catch (error) {
        console.log("Error fetching products:", error.response.data.message);
      }
    };

    try {
      if (currentUser) {
        GetProducts();
      }
    } catch (error) {
      console.log("Error in useEffect:", error);
    }
  }, [currentUser, rerenderProducts]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        style: {
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
            height: SCREEN_HEIGHT / 12,
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
            height: SCREEN_HEIGHT / 12,
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
      {/** Cards screen, cards stack screens inside tab */}
      <Tab.Screen
        name="Marketplace"
        children={() => (
          <MarketplaceStack
            render={render}
            navigation={navigation}
            // setScrollY={setCardsScrollY}
          />
        )}
        options={{
          tabBarLabel: "",
          tabBarInactiveTintColor: currentTheme.disabled,
          tabBarActiveTintColor: currentTheme.pink,
          tabBarStyle: {
            height: SCREEN_HEIGHT / 12,
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
            <CustomTabBarMarketplaceIcon
              {...props}
              // sum={sum}
              currentTheme={currentTheme}
              // scrollY={cardsScrollY}
            />
          ),
        }}
      />

      {/** Filter screen, filter stack screens inside tab, includes search screen */}
      {currentUser.type !== "shop" && (
        <Tab.Screen
          name={currentUser.type === "user" ? "BMSSent" : "BMS"}
          component={currentUser.type === "user" ? BMSStackSent : BMSStack}
          options={{
            tabBarLabel: "",
            tabBarInactiveTintColor: currentTheme.disabled,
            tabBarActiveTintColor: currentTheme.pink,
            tabBarStyle: {
              height: SCREEN_HEIGHT / 12,
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
                <CustomTabBarBookingsIcon
                  currentTheme={currentTheme}
                  sum={sum}
                  {...props}
                />
              );
            },
          }}
        />
      )}
      {/** Chat screen, chat stack screens inside tab */}
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={({ route }) => ({
          tabBarLabel: "",
          tabBarInactiveTintColor: currentTheme.disabled,
          tabBarActiveTintColor: currentTheme.pink,
          tabBarStyle: {
            height: SCREEN_HEIGHT / 12,
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
            setScrollY={setProfileScrollY}
          />
        )}
        options={{
          tabBarLabel: "",
          tabBarInactiveTintColor: currentTheme.disabled,
          tabBarActiveTintColor: currentTheme.pink,
          tabBarStyle: {
            height: SCREEN_HEIGHT / 12,
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
              scrollY={profileScrollY}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
