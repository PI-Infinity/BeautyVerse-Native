import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Product from "../Marketplace/screens/product";
import { CacheableImage } from "../components/cacheableImage";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { SendBooking } from "../screens/bookings/sendBooking";
import { Room } from "../screens/chat/room";
import { FeedItem } from "../screens/feeds/feedScreen";
import { Feeds } from "../screens/feeds/list";
import { SentBookings } from "../screens/sentBookings/sentBookings";
import { ScrollGallery } from "../screens/feeds/scrollGallery";
import { User } from "../screens/user/user";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

/* 
  feeds screen stack navigator
*/
const Stack = createStackNavigator();

export function FeedsStack({ navigation, setScrollY, scrollY, setScrollYF }) {
  // ltheme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines language
  const language = Language();
  const lang = useSelector((state) => state.storeApp.language);

  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const insets = useSafeAreaInsets();
  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  // feeds first loading
  const [firstLoading, setFirstLoading] = useState(true);

  /**
   * blur
   */

  const blur = useSelector((state) => state.storeApp.blur);

  return (
    <ImageBackground
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      source={theme ? require("../assets/background.jpg") : null}
    >
      {/**
       * blour background
       */}

      <>
        {blur && (
          <BlurView
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              position: "absolute",
              zIndex: 1000,
              top: 0,
              left: 0,
            }}
            // style={styles.blurView}
            tint="dark" // or 'dark'
            intensity={40}
          ></BlurView>
        )}
      </>

      <Stack.Navigator
        initialRouteName="Feeds"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
          cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
        }}
        lazy={true}
      >
        {/** Main - feeds list screen  */}
        <Stack.Screen
          name="Feeds"
          children={() => (
            <Feeds
              navigation={navigation}
              setScrollY={setScrollY}
              setScrollYF={setScrollYF}
              scrollY={scrollY}
              firstLoading={firstLoading}
              setFirstLoading={setFirstLoading}
            />
          )}
          options={{
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: currentTheme.background,
              shadowColor: currentTheme.line,
              height: SCREEN_HEIGHT / 9,

              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: theme
                ? "rgba(0,0,0,0.6)"
                : currentTheme.background,
              // backgroundColor: "red",
            },
            headerTitleAlign: "center", // Center align the header title

            headerTitle: ({ focused }) => (
              <View
                style={{
                  height: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  // width: SCREEN_WIDTH - 15,
                  overflow: "hidden",

                  // marginBottom: Platform.OS !== "android" ? 5 : 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 29,
                      fontWeight: "bold",
                      color: currentTheme.font,
                      letterSpacing: 1,
                    }}
                  >
                    Beauty
                  </Text>
                  <Text
                    style={{
                      fontSize: 29,
                      fontWeight: "bold",
                      color: currentTheme.pink,
                      letterSpacing: 1,
                    }}
                  >
                    Verse
                  </Text>
                </View>
              </View>
            ),
          }}
        />
        {/** user screen in feeds, visit page, that component gettings props "visitPage", so from this component only can to visit page, current user can't modify any data from there  */}
        <Stack.Screen
          name="User"
          children={() => <User navigation={navigation} />}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
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
          name="UserVisit"
          children={() => <User navigation={navigation} />}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
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
              backgroundColor: currentTheme.background,
              height: SCREEN_HEIGHT / 9,
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
        {/** user feed list screen, after press to feed, user can visit to target user's feeds  */}
        <Stack.Screen
          name="ScrollGallery"
          component={ScrollGallery}
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
                  {route.params?.user.name}
                </Text>
                <MaterialIcons name="verified" size={14} color="#F866B1" />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="UserFeed"
          component={FeedItem}
          options={({ route, navigation }) => ({
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
            headerBackTitleVisible: false,
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
          name="Room"
          initialParams={{ screenHeight }}
          component={Room}
          options={({ navigation, route }) => ({
            headerBackTitleVisible: false,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
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
