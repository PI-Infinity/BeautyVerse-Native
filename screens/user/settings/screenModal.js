import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useContext, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../../context/theme";
import { Settings } from "./settings";
import { Notifications } from "../notifications/list";
import { AddFeed } from "../../feeds/addFeed";
import { FeedItem } from "../../feeds/feedScreen";
import { removeScreenModal, setScreenModal } from "../../../redux/app";
import Product from "../../../Marketplace/screens/product";
import Charts from "../statistics/chart";
import { ActivityIndicator } from "react-native-paper";
import { Room } from "../../chat/room";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AIAssistent } from "../../chat/AIAssistent";
import { Filter } from "../../filter";
import { ScrollGallery } from "../../feeds/scrollGallery";
import { SendBooking } from "../../bookings/sendBooking";
import { UserVisit } from "../userVisit";
import { RouteNameContext } from "../../../context/routName";
import { AddBooking } from "../../bookings/addBooking";
import Search from "../../../Marketplace/components/search";
import List from "../../../Marketplace/screens/list";
import Support from "./support";

// Get the full width of the device's screen
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const ScreenModal = ({ screen, navigation }) => {
  // dispatch
  const dispatch = useDispatch();

  // loading
  const [loading, setLoading] = useState(true);

  // route name

  const activeTabBar = useSelector((state) => state.storeApp.activeTabBar);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [animation] = useState(new Animated.Value(0));

  // Separate Animated.Value for opacity
  const [opacityAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const showModal = () => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };
    showModal();
  }, []);

  const hideModal = () => {
    Animated.parallel([
      // Slide animation
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Fade out animation
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(removeScreenModal(activeTabBar));
      // Reset the opacityAnim for the next time the modal is displayed
      opacityAnim.setValue(1);
    });
  };

  const containerStyle = {
    width: "100%",
    height: "100%",
    paddingTop: 25,
    backgroundColor: "rgba(1, 2, 12, 0.6)",
    transform: [
      {
        [screen === "Notifications" ||
        screen === "Settings" ||
        screen === "User" ||
        screen === "Filter" ||
        screen === "Marketplace List" ||
        screen === "Charts"
          ? "translateX"
          : "translateY"]: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [
            screen === "Notifications" ||
            screen === "Settings" ||
            screen === "User" ||
            screen === "Filter" ||
            screen === "Marketplace List" ||
            screen === "Charts"
              ? SCREEN_WIDTH
              : SCREEN_HEIGHT,
            0,
          ],
        }),
      },
    ],
  };

  const insets = useSafeAreaInsets();
  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 10002,
        // paddingTop: 45,
        // backgroundColor: "rgba(1, 2, 12, 0.4)",
      }}
    >
      <Animated.View style={{ opacity: opacityAnim }}>
        <BlurView tint="dark" intensity={60}>
          <Animated.View style={[containerStyle, styles.modal]}>
            {loading ? (
              <View style={{ height: 600, justifyContent: "center" }}>
                <ActivityIndicator color={currentTheme.pink} size={24} />
              </View>
            ) : (
              <Animated.View style={[containerStyle, styles.modal]}>
                {screen === "Settings" && (
                  <Settings hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "Notifications" && (
                  <Notifications
                    hideModal={hideModal}
                    navigation={navigation}
                  />
                )}
                {screen === "Add Feed" && (
                  <AddFeed hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "Feed" && (
                  <FeedItem hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "Product" && (
                  <Product hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "Charts" && (
                  <Charts hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "User" && (
                  <UserVisit hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "ScrollGallery" && (
                  <ScrollGallery
                    hideModal={hideModal}
                    navigation={navigation}
                  />
                )}
                {screen === "Filter" && (
                  <Filter hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "Send Booking" && (
                  <SendBooking hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "Add Booking" && (
                  <AddBooking hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "Support" && (
                  <Support hideModal={hideModal} navigation={navigation} />
                )}
                {screen === "Room" && (
                  <Room
                    hideModal={hideModal}
                    navigation={navigation}
                    screenHeight={screenHeight}
                  />
                )}
                {screen === "AIAssistent" && (
                  <AIAssistent
                    hideModal={hideModal}
                    navigation={navigation}
                    screenHeight={screenHeight}
                  />
                )}
              </Animated.View>
            )}
          </Animated.View>
        </BlurView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    // Style your modal here
  },
});
