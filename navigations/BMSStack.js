import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { CacheableImage } from "../components/cacheableImage";
import { Room } from "../screens/chat/room";
import { FeedItem } from "../screens/feedScreen";
import { SendOrder } from "../screens/orders/sendOrder";
import { SentOrders } from "../screens/sentOrders/sentOrders";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AddOrder } from "../screens/orders/addOrder";
import { Orders } from "../screens/orders/orders";
import Product from "../Marketplace/screens/product";

/* 
  Create filter stack navigator
*/

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Stack = createStackNavigator();

export function BMSStack({ navigation }) {
  // redux toolkit dispatch
  const dispatch = useDispatch();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define user location
  const location = useSelector((state) => state.storeApp.location);

  // language context
  const language = Language();

  const insets = useSafeAreaInsets();
  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
        cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
      }}
    >
      {/** main order list screen  */}
      <Stack.Screen
        name="orders"
        children={() => <Orders navigation={navigation} />}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Bookings?.bookings?.bms,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,

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
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("orders")}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
          title: language?.language?.Bookings?.bookings?.addOrder,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,

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
        name="User"
        component={User}
        options={({ route, navigation }) => ({
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
          title: route.params.user.name,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
          headerTitleAlign: "center", // Center align the header title
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
            if (
              currentUser?.type.toLowerCase() !== "beautycenter" &&
              currentUser?.type.toLowerCase() !== "shop"
            ) {
              return (
                <View style={{ marginRight: 20 }}>
                  {route.params.user._id !== currentUser._id && (
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
            }
          },
        })}
      />
      <Stack.Screen
        name="UserVisit"
        component={User}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
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
            if (
              currentUser?.type.toLowerCase() !== "beautycenter" &&
              currentUser?.type.toLowerCase() !== "shop"
            ) {
              return (
                <View style={{ marginRight: 20 }}>
                  {route.params.user._id !== currentUser._id && (
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
            }
          },

          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
      {/* sent order screen */}
      <Stack.Screen
        name="Send Order"
        component={SendOrder}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
          title: language?.language?.Bookings?.bookings?.createBooking,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
          title: language?.language?.User?.userPage?.sentBookings,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
      {/** user feed list screen, after press to feed from user page, user can visit to target user's feeds  */}
      <Stack.Screen
        name="ScrollGallery"
        component={ScrollGallery}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
          title: "Feeds",
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
          // title: "name",
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
            backgroundColor: currentTheme.background,

            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: (props) => {
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("User", {
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
                {route.params.user?.cover?.length > 0 ? (
                  <View>
                    {route.params.user?.online && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: "#3bd16f",
                          borderRadius: 50,
                          position: "absolute",
                          zIndex: 100,
                          right: 0,
                          bottom: 0,
                          borderWidth: 1.5,
                          borderColor: currentTheme.background,
                        }}
                      ></View>
                    )}
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
                  </View>
                ) : (
                  <View>
                    {route.params.user?.online && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: "#3bd16f",
                          borderRadius: 50,
                          position: "absolute",
                          zIndex: 100,
                          right: 1,
                          bottom: 1,
                          borderWidth: 1.5,
                          borderColor: currentTheme.background,
                        }}
                      ></View>
                    )}
                    <View
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: currentTheme.line,
                      }}
                    >
                      <FontAwesome
                        name="user"
                        size={20}
                        color={currentTheme.disabled}
                      />
                    </View>
                  </View>
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
      <Stack.Screen
        name="UserFeed"
        component={FeedItem}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
          title: language?.language?.Main?.feedCard?.feed,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
      {/* product screen */}
      <Stack.Screen
        name="Product"
        component={Product}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
          title: route.params.product.title,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
