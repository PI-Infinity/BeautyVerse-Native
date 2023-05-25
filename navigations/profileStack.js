import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { View, Dimensions, Pressable } from "react-native";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { AddFeed } from "../screens/user/addFeed";
import { Settings } from "../screens/user/settings/settings";
import { Addresses } from "../screens/user/settings/addresses";
import { Prices } from "../screens/prices";
import { PersonalInfo } from "../screens/user/settings/personalInfo";
import { WorkingInfo } from "../screens/user/settings/workingInfo";
import { Procedures } from "../screens/user/settings/procedures";
import { Terms } from "../screens/user/terms";
import { QA } from "../screens/user/QA";
import { Privacy } from "../screens/user/privacy";
import { Usage } from "../screens/user/usage";

import { Notifications } from "../screens/user/notifications";
import { UserFeed } from "../screens/user/userFeed";
import Charts from "../screens/user/statistics/chart";
import { MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { Language } from "../context/language";
import { lightTheme, darkTheme } from "../context/theme";
import axios from "axios";

const Stack = createStackNavigator();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// specific component for user page, passed some props into component
const withVariant = (Component, variant) => {
  return (props) => {
    return <User {...props} variant={variant} />;
  };
};

export function ProfileStack({
  route,
  navigation,
  unreadNotifications,
  notifications,
  setNotifications,
}) {
  // language state
  const language = Language();
  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  /** in profile stack defined,
   * user personal data, settings
   * and control datas and feeds */
  return (
    <Stack.Navigator
      initialRouteName="UserProfile"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
        cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
      }}
    >
      {/* current user profile screen */}
      <Stack.Screen
        name="UserProfile"
        children={() => <User user={currentUser} navigation={navigation} />}
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: currentTheme.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: "",
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginLeft: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: 0.5,
                  color: currentTheme.font,
                  fontWeight: "bold",
                }}
              >
                {currentUser.name} {/* current user name un screen header */}
              </Text>
              {currentUser.subscription.status === "active" && (
                <MaterialIcons name="verified" size={14} color="#F866B1" />
              )}
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* add feed icon in header of screen */}
              {currentUser.type !== "user" && (
                <Pressable
                  onPress={() => navigation.navigate("AddFeed")}
                  style={{ marginRight: 12.5, padding: 5, paddingRight: 0 }}
                >
                  <MaterialIcons
                    name="add-box"
                    size={22}
                    color={currentTheme.pink}
                  />
                </Pressable>
              )}
              <View>
                {unreadNotifications.length > 0 && (
                  <View
                    style={{
                      width: "auto",
                      minWidth: 13,
                      height: 13,
                      backgroundColor: currentTheme.pink,
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      zIndex: 2,
                      right: 6,
                      top: 2,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10 }}>
                      {unreadNotifications.length}
                    </Text>
                  </View>
                )}
                <Pressable
                  onPress={() => navigation.navigate("Notifications")}
                  style={{ marginRight: 5, padding: 5 }}
                >
                  {/* settings button*/}
                  <Ionicons
                    name="notifications"
                    size={20.5}
                    color={currentTheme.disabled}
                  />
                </Pressable>
              </View>
              <Pressable
                onPress={() => navigation.navigate("Settings")}
                style={{ marginRight: 15, padding: 5 }}
              >
                {/* settings button*/}
                <Ionicons
                  name="settings"
                  size={20}
                  color={currentTheme.disabled}
                  style={{ marginBottom: 1 }}
                />
              </Pressable>
            </View>
          ),
        })}
      />
      {/** User notifications page */}
      <Stack.Screen
        name="Notifications"
        children={() => (
          <Notifications
            notifications={notifications}
            navigation={navigation}
            setNotifications={setNotifications}
          />
        )}
        options={({ route }) => ({
          headerTitle: "Notifications",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="UserVisit"
        component={withVariant(User, "visitPage")}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerTitle: (props) => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text
                style={{
                  fontSize: 18,
                  letterSpacing: 0.5,
                  color: currentTheme.font,
                  fontWeight: "bold",
                }}
              >
                {route.params.user.name}
              </Text>
              {route.params.user.subscription.status === "active" && (
                <MaterialIcons name="verified" size={14} color="#F866B1" />
              )}
            </View>
          ),

          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* current user feed's list screen */}
      <Stack.Screen
        name="UserScrollGallery"
        component={ScrollGallery}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.feeds,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="UserFeed"
        component={UserFeed}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.feeds,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* add feed screen */}
      <Stack.Screen
        name="AddFeed"
        component={AddFeed}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.add,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* settings screen, inside settings are navigations to edit's screens */}
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.settings,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* edit personal info screen */}
      <Stack.Screen
        name="Personal info"
        component={PersonalInfo}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.personalInfo,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* edit procedures screen */}
      <Stack.Screen
        name="Procedures"
        component={Procedures}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.procedures,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* edit working info screen */}
      <Stack.Screen
        name="Working info"
        component={WorkingInfo}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.workingInfo,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* edit addresses screen */}
      <Stack.Screen
        name="Addresses"
        component={Addresses}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.addresses,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* prices screen */}
      <Stack.Screen
        name="Prices"
        component={Prices}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.prices,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/* this is a screen, which shows statistics of users with different time systems */}
      <Stack.Screen
        name="Charts"
        component={Charts}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Charts",
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Pages?.pages?.terms,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Pages?.pages?.privacy,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="QA"
        component={QA}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Pages?.pages?.qa,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
      <Stack.Screen
        name="Usage"
        component={Usage}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Pages?.pages?.usage,
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
    </Stack.Navigator>
  );
}
