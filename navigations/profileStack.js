import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { CacheableImage } from "../components/cacheableImage";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { Room } from "../screens/chat/room";
import { FeedItem } from "../screens/feedScreen";
import { AddOrder } from "../screens/orders/addOrder";
import { Orders } from "../screens/orders/orders";
import { SendOrder } from "../screens/orders/sendOrder";
import { Statistics } from "../screens/orders/statistics";
import { Prices } from "../screens/prices";
import { SentOrders } from "../screens/sentOrders/sentOrders";
import { QA } from "../screens/user/QA";
import { AddFeed } from "../screens/user/addFeed";
import { Notifications } from "../screens/user/notifications";
import { Privacy } from "../screens/user/privacy";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { Addresses } from "../screens/user/settings/addresses";
import { PersonalInfo } from "../screens/user/settings/personalInfo";
import { Procedures } from "../screens/user/settings/procedures";
import { Settings } from "../screens/user/settings/settings";
import { WorkingInfo } from "../screens/user/settings/workingInfo";
import Charts from "../screens/user/statistics/chart";
import { Terms } from "../screens/user/terms";
import { Usage } from "../screens/user/usage";
import { User } from "../screens/user/user";
import { AddNewAddress } from "../screens/user/settings/addNewAddress";
import { AddNewProcedures } from "../screens/user/settings/addNewProcedures";

/**
 * Create user profile stack, where include all main configs
 */
const Stack = createStackNavigator();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export function ProfileStack({
  navigation,
  unreadNotifications,
  setUnreadNotifications,
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

  const newOrders = useSelector((state) => state.storeOrders.new);
  const newSentOrders = useSelector((state) => state.storeSentOrders.new);
  /** in profile stack defined,
   * user personal data, settings
   * and control datas and feeds */

  const insets = useSafeAreaInsets();

  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

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
                maxWidth: "75%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: 0.5,
                  color: currentTheme.font,
                  fontWeight: "bold",
                }}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {currentUser.name} {/* current user name un screen header */}
              </Text>
              {currentUser.subscription.status === "active" && (
                <MaterialIcons
                  name="verified"
                  size={14}
                  color="#F866B1"
                  style={{ marginTop: 2 }}
                />
              )}
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* add feed icon in header of screen */}
              {currentUser.type !== "user" && (
                <>
                  <Pressable
                    onPress={() => navigation.navigate("AddFeed")}
                    style={{ marginRight: 12, padding: 5, paddingRight: 0 }}
                  >
                    <MaterialIcons
                      name="add-box"
                      size={22}
                      color={currentTheme.pink}
                    />
                  </Pressable>

                  <Pressable
                    acitveOpacity={0.3}
                    style={{
                      marginRight: 10,
                      marginLeft: 4,
                      flexDirection: "row",
                      opacity: 1,
                      alignItems: "center",
                      backgroundColor: currentTheme.line,
                      borderRadius: 50,
                      padding: 5,
                      paddingVertical: 2.5,
                    }}
                    onPress={() => navigation.navigate("Orders")}
                  >
                    {newOrders > 0 && (
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
                          right: -2,
                          top: -2,
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 10 }}>
                          {newOrders}
                        </Text>
                      </View>
                    )}
                    <Entypo
                      name="list"
                      size={24}
                      color={currentTheme.disabled}
                    />
                    <Text
                      style={{
                        color:
                          currentUser.subscription.status === "active"
                            ? currentTheme.pink
                            : currentTheme.disabled,
                        fontWeight: "bold",
                        letterSpacing: -1,
                        fontSize: 16,
                      }}
                    >
                      BMS
                    </Text>
                  </Pressable>
                </>
              )}
              <View>
                {unreadNotifications > 0 && (
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
                      {unreadNotifications}
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
                {newSentOrders > 0 && (
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
                      right: -2,
                      top: 0,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10 }}>
                      {newSentOrders}
                    </Text>
                  </View>
                )}
                <Ionicons
                  name="settings"
                  size={20}
                  color={currentTheme.disabled}
                  style={{ marginBottom: 0.5 }}
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
            setUnreadNotifications={setUnreadNotifications}
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
        children={() => <User navigation={navigation} />}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: (props) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                width: "100%",
                gap: 5,
              }}
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
          headerRight: (props) => {
            return (
              <View style={{ marginRight: 20 }}>
                {route.params.user._id !== currentUser._id &&
                  currentUser.type !== "beautycenter" && (
                    <TouchableOpacity
                      acitveOpacity={0.3}
                      onPress={() =>
                        navigation.navigate("Send Order", {
                          user: route.params.user,
                        })
                      }
                    >
                      <FontAwesome
                        name="calendar"
                        size={18}
                        color={currentTheme.font}
                      />
                    </TouchableOpacity>
                  )}
              </View>
            );
          },

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
        name="ScrollGallery"
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
        component={FeedItem}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Feed",
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
      {/** main order list screen  */}
      <Stack.Screen
        name="Orders"
        children={() => <Orders navigation={navigation} />}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          title: "Booking Managment",
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

          headerRight: () => (
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("Add Order")}
              >
                <MaterialIcons
                  style={{
                    color: currentTheme.pink,
                  }}
                  name="add"
                  size={24}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("Order Statistics")}
              >
                <MaterialIcons
                  name="bar-chart"
                  size={26}
                  color={currentTheme.font}
                />
              </TouchableOpacity> */}
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Add Order"
        component={AddOrder}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Add new order",
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
        name="Send Order"
        component={SendOrder}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Booking",
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
        name="Sent Orders"
        component={SentOrders}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "My Bookings",
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
        name="Order Statistics"
        component={Statistics}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Order statistics",
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
          headerRight: () => (
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("AddNewProcedures")}
              >
                <MaterialIcons
                  style={{
                    color: currentTheme.pink,
                  }}
                  name="add"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          ),
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
          headerRight: () => (
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("AddNewAddress")}
              >
                <MaterialIcons
                  style={{
                    color: currentTheme.pink,
                  }}
                  name="add"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      {/* edit addresses screen */}
      <Stack.Screen
        name="AddNewAddress"
        component={AddNewAddress}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Add new address",
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
      {/* add procedures screen */}
      <Stack.Screen
        name="AddNewProcedures"
        component={AddNewProcedures}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Add new procedures",
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
      <Stack.Screen
        name="Room"
        component={Room}
        initialParams={{ screenHeight }}
        options={({ navigation, route }) => ({
          headerBackTitleVisible: false,
          // title: "name",
          headerStyle: {
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: (props) => {
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("UserVisit", {
                    user: route.params.user,
                  })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  justifyContent: "center",
                  width: SCREEN_WIDTH - 150,
                }}
              >
                {route.params.user?.cover?.length > 0 && (
                  <CacheableImage
                    source={{ uri: route.params.user?.cover }}
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 50,
                      resizeMode: "cover",
                    }}
                    manipulationOptions={[
                      { resize: { width: 30, height: 30 } },
                      { rotate: 90 },
                    ]}
                  />
                )}

                <Text
                  style={{
                    fontSize: 18,
                    letterSpacing: 0.5,
                    color: currentTheme.font,
                    fontWeight: "bold",
                  }}
                >
                  {route.params.user?.name}
                </Text>
              </Pressable>
            );
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            letterSpacing: 0.5,
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
    </Stack.Navigator>
  );
}
