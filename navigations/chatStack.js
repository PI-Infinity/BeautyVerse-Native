import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Product from "../Marketplace/screens/product";
import { CacheableImage } from "../components/cacheableImage";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { setOpenAddChat } from "../redux/chat";
import { Chat } from "../screens/chat/chat";
import { Room } from "../screens/chat/room";
import { FeedItem } from "../screens/feeds/feedScreen";
import { SendBooking } from "../screens/bookings/sendBooking";
import { SentBookings } from "../screens/sentBookings/sentBookings";
import { User } from "../screens/user/user";
import { AIAssistent } from "../screens/chat/AIAssistent";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Stack = createStackNavigator();

export function ChatStack({ navigation }) {
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const language = Language();

  const dispatch = useDispatch();

  // define screen height

  const insets = useSafeAreaInsets();

  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  return (
    <ImageBackground
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      source={theme ? require("../assets/background.jpg") : null}
    >
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
          cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
        }}
      >
        <Stack.Screen
          name="Chats"
          component={Chat}
          options={{
            headerBackTitleVisible: false,
            title: language?.language?.Chat?.chat?.title,
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
              letterSpacing: 0.5,
              fontSize: 18,
            },
            cardStyle: {
              backgroundColor: theme
                ? "rgba(0,0,0,0.6)"
                : currentTheme.background,
            },
            headerLeft: () => (
              <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginLeft: 15, padding: 5 }}
                onPress={() => dispatch(setOpenAddChat(true))}
              >
                <FontAwesome name="plus" size={18} color={currentTheme.font} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginRight: 15, padding: 5 }}
                onPress={() =>
                  navigation.navigate("AIAssistent", {
                    screenHeight: screenHeight,
                  })
                }
              >
                <MaterialCommunityIcons
                  name="robot-love-outline"
                  size={22}
                  color={currentTheme.pink}
                />
              </TouchableOpacity>
            ),
          }}
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
              // backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="AIAssistent"
          component={AIAssistent}
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
            headerTitle: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{
                  padding: 8,
                  paddingLeft: 15,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="robot-love-outline"
                  size={24}
                  color={currentTheme.pink}
                />
                <Text
                  style={{
                    color: currentTheme.font,
                    fontSize: 18,
                    fontWeight: "bold",
                    letterSpacing: 0.5,
                  }}
                >
                  {language.language.Chat.chat.aiAssistant}
                </Text>
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
            title: "Beauty Assistent",
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
                    {route.params?.user?._id !== currentUser._id &&
                      currentUser.type !== "beautycenter" &&
                      currentUser?.type !== "shop" &&
                      route.params?.user.type !== "shop" &&
                      route.params?.user.type !== "user" &&
                      route.params.user.subscription.status === "active" && (
                        <TouchableOpacity
                          acitveOpacity={0.3}
                          onPress={() =>
                            navigation.navigate("Send Booking", {
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
              letterSpacing: 0.5,
              fontSize: 18,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="UserVisit"
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
                    {route.params?.user?._id !== currentUser._id &&
                      currentUser.type !== "beautycenter" &&
                      currentUser?.type !== "shop" &&
                      route.params?.user.type !== "shop" &&
                      route.params?.user.type !== "user" &&
                      route.params.user.subscription.status === "active" && (
                        <TouchableOpacity
                          acitveOpacity={0.3}
                          onPress={() =>
                            navigation.navigate("Send Booking", {
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
        <Stack.Screen
          name="UserFeed"
          component={FeedItem}
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
        <Stack.Screen
          name="Send Booking"
          component={SendBooking}
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
          name="Sent Bookings"
          component={SentBookings}
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
        {/* product screen */}
        <Stack.Screen
          name="Product"
          component={Product}
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
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("User", {
                    user: route.params.product.owner,
                  })
                }
                style={{ padding: 8, marginRight: 8 }}
              >
                {route.params.product.owner?.cover ? (
                  <CacheableImage
                    source={{ uri: route.params.product.owner?.cover }}
                    style={{ width: 25, height: 25, borderRadius: 50 }}
                  />
                ) : (
                  <FontAwesome
                    name="user"
                    size={20}
                    color={currentTheme.disabled}
                  />
                )}
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
    </ImageBackground>
  );
}
