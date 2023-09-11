import {
  FontAwesome,
  MaterialIcons,
  Fontisto,
  Feather,
} from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  Dimensions,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../components/cacheableImage";
import { darkTheme, lightTheme } from "../context/theme";
import { Cards } from "../screens/cards";
import { Room } from "../screens/chat/room";
import { FeedItem } from "../screens/feedScreen";
import { SendBooking } from "../screens/bookings/sendBooking";
import { SentBookings } from "../screens/sentBookings/sentBookings";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Language } from "../context/language";
import { useEffect } from "react";
import { Filter } from "../screens/filter";
import {
  setCity,
  setDistrict,
  setFilter,
  setFilterBadgeSum,
  setSalons,
  setSearch,
  setSearchInput,
  setSpecialists,
} from "../redux/filter";
import { setCleanUp } from "../redux/rerenders";
import Main from "../Marketplace/screens/marketplace";
import Product from "../Marketplace/screens/product";
import Search from "../Marketplace/components/search";
import List from "../Marketplace/screens/list";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Stack = createStackNavigator();

/* Card's screen stack navigator */

export function MarketplaceStack({ navigation, setScrollY, scrollY }) {
  // define current user redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines language
  const language = Language();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const insets = useSafeAreaInsets();
  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  // define user location
  const location = useSelector((state) => state.storeApp.location);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
        cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
      }}
    >
      {/** main card list screen  */}
      <Stack.Screen
        name="main"
        children={() => (
          <Main
            navigation={navigation}
            setScrollY={setScrollY}
            scrollY={scrollY}
          />
        )}
        options={{
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
            backgroundColor: currentTheme.background,

            shadowOffset: {
              width: 0,
              height: !theme ? 1 : 0, // negative value places shadow on top
            },
            shadowOpacity: 0,
            shadowRadius: 5,
            elevation: 5, // required for android
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
          headerTitleAlign: "center", // Center align the header title
          headerTitle: ({ focused }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: SCREEN_WIDTH - 15,
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
                    fontSize: 28,
                    fontWeight: "bold",
                    color: currentTheme.font,
                    letterSpacing: 1,
                  }}
                >
                  Beauty
                </Text>
                <Text
                  style={{
                    fontSize: 28,
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
          headerRight: () => {
            return (
              <Pressable
                onPress={() => navigation.navigate("Search")}
                style={{
                  alignItems: "center",
                  // overflow: "hidden",
                }}
              >
                <View
                  style={{
                    // backgroundColor: "red",
                    height: "100%",
                    width: SCREEN_WIDTH / 3,
                    alignItems: "flex-end",
                    justifyContent: "center",
                    // overflow: "hidden",
                    paddingRight: 9,
                    paddingBottom: 4,
                  }}
                >
                  <Feather
                    name="search"
                    size={28}
                    color={currentTheme.disabled}
                  />
                  {/* )} */}
                </View>
              </Pressable>
            );
          },
        }}
      />
      {/** search screen */}
      <Stack.Screen
        name="Search"
        component={Search}
        options={({ route, navigation }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Main?.filter?.search,
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
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("main")}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
        })}
      />
      {/** search screen */}
      <Stack.Screen
        name="List"
        component={List}
        options={({ route, navigation }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Marketplace?.marketplace?.popularProducts,
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
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("main")}
              style={{ padding: 8, paddingLeft: 15 }}
            >
              <FontAwesome
                name="arrow-left"
                color={currentTheme.pink}
                size={22}
              />
            </TouchableOpacity>
          ),
        })}
      />
      {/** user screen in cards, visit page, that component gettings props "visitPage", so from this component only can to visit page, current user can't modify any data from there  */}
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
            if (currentUser?.type.toLowerCase() !== "beautycenter") {
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
        })}
      />
      <Stack.Screen
        name="UserVisit"
        component={User}
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
            if (currentUser?.type.toLowerCase() !== "beautycenter") {
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
      {/* sent booking screen */}
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
      {/** user feed list screen, after press to feed from user page, user can visit to target user's feeds  */}
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
  );
}
