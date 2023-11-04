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
  setActiveBookings,
  setCanceledBookings,
  setCompletedBookings,
  setFilterResult,
  setLoader,
  setNewBookings,
  setBookings,
  setPendingBookings,
  setRejectedBookings,
  setTotalResult,
} from "../redux/bookings";
import { setRerenderBookings } from "../redux/rerenders";
import {
  setActiveSentBookings,
  setCanceledSentBookings,
  setCompletedSentBookings,
  setLoaderSentBookings,
  setNewSentBookings,
  setPendingSentBookings,
  setRejectedSentBookings,
  setSentBookings,
  setSentBookingsFilterResult,
  setSentBookingsTotalResult,
} from "../redux/sentBookings";
import {
  setNotifications,
  setPage,
  setUnreadNotifications,
} from "../redux/notifications";

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

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

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

  useEffect(() => {
    const GetNotifcations = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/users/" +
            currentUser?._id +
            "/notifications?page=1&limit=15"
        );
        dispatch(setNotifications(response.data.data.notifications));
        dispatch(
          setUnreadNotifications(
            response.data.data.notifications?.filter(
              (i) => i.status === "unread"
            )
          )
        );
        dispatch(setPage(1));
      } catch (error) {
        console.log(error.response);
      }
    };
    if (currentUser) {
      GetNotifcations();
    }
  }, [rerenderNotifications]);

  // defines baclend url

  /**
   * get bookings
   */

  // after run this state, it changes value and rerenders bookings api
  const rerenderBookings = useSelector(
    (state) => state.storeRerenders.rerenderBookings
  );
  // this render also addationally renders some useffects
  const [renderBookings, setRenderBookings] = useState(false);

  // some filters for bookings
  const statusFilter = useSelector((state) => state.storeBookings.statusFilter);
  const date = useSelector((state) => state.storeBookings.date);
  const createdAt = useSelector((state) => state.storeBookings.createdAt);
  const procedure = useSelector((state) => state.storeBookings.procedure);

  // get recieved bookings
  useEffect(() => {
    const GetBookings = async () => {
      try {
        dispatch(setLoader(true));
        const response = await axios.get(
          backendUrl +
            "/api/v1/bookings/" +
            currentUser._id +
            `?page=${1}&status=${
              statusFilter === "All" ? "" : statusFilter?.toLowerCase()
            }&date=${
              date.active ? date.date : ""
            }&createdAt=${createdAt}&procedure=${procedure}`
        );
        // define bookings with specific status
        dispatch(setBookings(response.data.data.bookings));
        dispatch(setTotalResult(response.data.totalResult));
        dispatch(setFilterResult(response.data.filterResult));
        dispatch(setNewBookings(response.data.new));
        dispatch(setPendingBookings(response.data.pending));
        dispatch(setActiveBookings(response.data.active));
        dispatch(setCompletedBookings(response.data.completed));
        dispatch(setRejectedBookings(response.data.rejected));
        dispatch(setCanceledBookings(response.data.canceled));
        setTimeout(() => {
          dispatch(setLoader(false));
        }, 500);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      GetBookings();
    }
  }, [
    renderBookings,
    rerenderBookings,
    statusFilter,
    date,
    procedure,
    createdAt,
  ]);

  // get sent bookings
  const statusFilterSentBookings = useSelector(
    (state) => state.storeSentBookings.statusFilter
  );
  const dateSentBookings = useSelector((state) => state.storeSentBookings.date);

  const createdAtSentBookings = useSelector(
    (state) => state.storeSentBookings.createdAt
  );
  const procedureSentBookings = useSelector(
    (state) => state.storeSentBookings.procedure
  );
  useEffect(() => {
    const GetSentBookings = async () => {
      try {
        dispatch(setLoaderSentBookings(true));
        const response = await axios.get(
          backendUrl +
            "/api/v1/bookings/sent/" +
            currentUser._id +
            `?page=${1}&status=${
              statusFilterSentBookings === "All"
                ? ""
                : statusFilterSentBookings?.toLowerCase()
            }&date=${
              dateSentBookings.active ? dateSentBookings.date : ""
            }&createdAt=${createdAtSentBookings}&procedure=${procedureSentBookings}`
        );

        dispatch(setSentBookings(response.data.data.bookings));
        dispatch(setSentBookingsTotalResult(response.data.totalResult));
        dispatch(setSentBookingsFilterResult(response.data.filterResult));
        dispatch(setNewSentBookings(response.data.new));
        dispatch(setActiveSentBookings(response.data.active));
        dispatch(setPendingSentBookings(response.data.pending));
        dispatch(setCanceledSentBookings(response.data.canceled));
        dispatch(setRejectedSentBookings(response.data.rejected));
        dispatch(setCompletedSentBookings(response.data.completed));
        setTimeout(() => {
          dispatch(setLoaderSentBookings(false));
        }, 500);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    if (currentUser) {
      GetSentBookings();
    }
  }, [
    renderBookings,
    rerenderBookings,
    statusFilterSentBookings,
    dateSentBookings,
    procedureSentBookings,
    createdAtSentBookings,
  ]);

  // this useeffect rerenders bookings in real time when some users sends booking requests
  useEffect(() => {
    socket.on("bookingsUpdate", () => {
      dispatch(setRerenderBookings());
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
  // feeds scroll y position
  const [feedsScrollYF, setFeedsScrollYF] = useState(0);
  // cards scroll y position
  const [cardsScrollY, setCardsScrollY] = useState(0);
  // profile scroll y position
  const [profileScrollY, setProfileScrollY] = useState(0);
  // marketplace scroll y position

  const [marketplaceScrollY, setMarketplaceScrollY] = useState(0);

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
        const response = await axios.get(
          backendUrl + "/api/v1/marketplace" + "?check=" + currentUser._id
        );
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
            setScrollYF={setFeedsScrollYF}
            scrollY={feedsScrollY}
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
              scrollYF={feedsScrollYF}
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
            setScrollY={setMarketplaceScrollY}
            scrollY={marketplaceScrollY}
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
              scrollY={marketplaceScrollY}
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
            navigation={navigation}
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
              scrollY={profileScrollY}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
