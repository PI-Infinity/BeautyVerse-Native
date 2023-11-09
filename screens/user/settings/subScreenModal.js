import { BlurView } from "expo-blur";
import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PersonalInfo } from "./personalInfo";
import { darkTheme, lightTheme } from "../../../context/theme";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { Procedures } from "./procedures";
import Products from "./userProductListSettings";
import { Dimensions } from "react-native";
import { Addresses } from "./addresses";
import { WorkingInfo } from "./workingInfo";
import { SavedItems } from "./savedItems";
import Support from "./support";
import { Terms } from "../terms";
import { QA } from "../QA";
import { Privacy } from "../privacy";
import { Usage } from "../usage";
import { useNavigation } from "@react-navigation/native";
import { Header } from "./header";
import { AddNewAddress } from "./addNewAddress";
import { SentBookings } from "../../sentBookings/sentBookings";
// Get the full width of the device's screen
const screenWidth = Dimensions.get("window").width;

const Screen = ({ visible, setVisible, screen }) => {
  const navigation = useNavigation();
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const showModal = () => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };
    showModal();
  }, []);

  const hideModal = () => {
    // Animate from left to right
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible({});
    });
  };

  const containerStyle = {
    width: "100%",
    height: "100%",
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [screenWidth, 0],
        }),
      },
    ],
    backgroundColor: "rgba(1, 2, 12, 0.3)",
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 10003,
      }}
    >
      <BlurView tint="dark" intensity={60}>
        <Animated.View style={[containerStyle, styles.modal]}>
          {screen === "Personal Info" && <PersonalInfo hideModal={hideModal} />}
          {screen === "Procedures" && <Procedures hideModal={hideModal} />}
          {screen === "Products" && <Products hideModal={hideModal} />}
          {screen === "Addresses" && <Addresses hideModal={hideModal} />}
          {screen === "Working Info" && <WorkingInfo hideModal={hideModal} />}
          {screen === "Saved Items" && <SavedItems hideModal={hideModal} />}
          {screen === "Sent Bookings" && <SentBookings hideModal={hideModal} />}
          {screen === "Support" && <Support hideModal={hideModal} />}
          {screen === "Terms" && <Terms hideModal={hideModal} />}
          {screen === "QA" && <QA hideModal={hideModal} />}
          {screen === "Privacy" && <Privacy hideModal={hideModal} />}
          {screen === "Usage" && <Usage hideModal={hideModal} />}
        </Animated.View>
      </BlurView>
    </SafeAreaView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  modal: {
    // Style your modal here
  },
});
