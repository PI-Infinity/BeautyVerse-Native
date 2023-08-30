import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  Fontisto,
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
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../components/cacheableImage";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { Room } from "../screens/chat/room";
import { FeedItem } from "../screens/feedScreen";
import { Feeds } from "../screens/feeds";
import { SendOrder } from "../screens/orders/sendOrder";
import { SentOrders } from "../screens/sentOrders/sentOrders";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Filter } from "../screens/filter";
import { Search } from "../screens/search";
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
import Product from "../Marketplace/screens/product";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

/* 
  feeds screen stack navigator
*/
const Stack = createStackNavigator();

export function FeedsStack({ navigation, setScrollY }) {
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

  // redux toolkit dispatch
  const dispatch = useDispatch();

  // define user location
  const location = useSelector((state) => state.storeApp.location);

  // language context

  // define active filter's length
  const filter = useSelector((state) => state.storeFilter.filter);
  let filterBadge;
  if (filter !== "") {
    filterBadge = 1;
  } else {
    filterBadge = 0;
  }
  // search state
  const search = useSelector((state) => state.storeFilter.search);
  let searchBadge;
  if (search !== "") {
    searchBadge = 1;
  } else {
    searchBadge = 0;
  }
  // city state
  const city = useSelector((state) => state.storeFilter.city);
  let cityBadge;
  if (
    currentUser.address.find(
      (c) => c?.city.replace("'", "").toLowerCase() === city?.toLowerCase()
    )
  ) {
    cityBadge = 0;
  } else {
    cityBadge = 1;
  }

  // district state
  const district = useSelector((state) => state.storeFilter.district);
  let districtBadge;
  if (district !== "") {
    districtBadge = 1;
  } else {
    districtBadge = 0;
  }
  // specialist state
  const specialist = useSelector((state) => state.storeFilter.specialists);
  let specialistBadge;
  if (!specialist) {
    specialistBadge = 1;
  } else {
    specialistBadge = 0;
  }
  // salon state
  const object = useSelector((state) => state.storeFilter.salons);
  let objectBadge;
  if (!object) {
    objectBadge = 1;
  } else {
    objectBadge = 0;
  }
  // total of active variants of filter and creating total of badge
  const sum =
    filterBadge +
    cityBadge +
    districtBadge +
    specialistBadge +
    objectBadge +
    searchBadge;
  // set badge to redux for getting in different component easily (in bottom tab filter icon gettings badge sum)
  useEffect(() => {
    dispatch(setFilterBadgeSum(sum));
  }, [sum]);

  // feeds first loading
  const [firstLoading, setFirstLoading] = useState(true);

  return (
    <Stack.Navigator
      initialRouteName="Feeds"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
        cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
      }}
      lazy={true}
    >
      {/** main feed list screen  */}
      <Stack.Screen
        name="Feeds"
        children={() => (
          <Feeds
            navigation={navigation}
            setScrollY={setScrollY}
            firstLoading={firstLoading}
            setFirstLoading={setFirstLoading}
          />
        )}
        options={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: currentTheme.background,
            // shadowColor: "#000",
            height: SCREEN_HEIGHT / 9,

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
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
          headerTitleAlign: "center", // Center align the header title

          headerTitle: ({ focused }) => (
            <View
              style={{
                height: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: SCREEN_WIDTH - 15,
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
                    fontSize: 26,
                    fontWeight: "bold",
                    color: currentTheme.font,
                    letterSpacing: 1,
                  }}
                >
                  Beauty
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    color: currentTheme.pink,
                    letterSpacing: 1,
                  }}
                >
                  Verse
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate("Filter")}
                style={{
                  // height: 80,
                  // width: 60,
                  alignItems: "center",
                }}
              >
                {/** badge for filter */}
                {!firstLoading && sum > 0 && (
                  <View
                    style={{
                      width: "auto",
                      minWidth: 15,
                      height: 15,
                      backgroundColor: currentTheme.pink,
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      position: "absolute",
                      top: 5,
                      right: 10,
                      marginBottom: 2,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 3, // negative value places shadow on top
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: "#f1f1f1",
                        fontSize: 10,
                        fontWeight: "bold",
                        letterSpacing: 0.15,
                      }}
                    >
                      {sum}
                    </Text>
                  </View>
                )}

                {/* {focused ? (
                  <FontAwesome
                    name="arrow-up"
                    size={27}
                    color={sum > 0 && focused ? color : currentTheme.pink}
                    style={{ paddingTop: 5 }}
                  />
                ) : ( */}
                {!firstLoading && (
                  <View
                    style={{
                      // backgroundColor: "red",
                      height: 50,
                      width: SCREEN_WIDTH / 3,
                      alignItems: "flex-end",
                      justifyContent: "center",
                      // overflow: "hidden",
                      paddingRight: 10,
                      paddingBottom: 5,
                    }}
                  >
                    <Fontisto
                      name="earth"
                      size={90}
                      color={currentTheme.disabled}
                      style={{
                        position: "absolute",
                        top: 0,
                        zIndex: -1,
                        opacity: 0.1,
                        right: -18,
                      }}
                    />

                    <Feather
                      name="search"
                      size={28}
                      color={currentTheme.disabled}
                    />
                    {/* )} */}
                  </View>
                )}
              </Pressable>
            </View>
          ),
        }}
      />
      {/** user screen in feeds, visit page, that component gettings props "visitPage", so from this component only can to visit page, current user can't modify any data from there  */}
      <Stack.Screen
        name="User"
        children={() => <User navigation={navigation} />}
        options={({ route }) => ({
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
      <Stack.Screen
        name="UserVisit"
        children={() => <User navigation={navigation} />}
        options={({ route }) => ({
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
        name="Send Order"
        component={SendOrder}
        options={({ route }) => ({
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
        name="Sent Orders"
        component={SentOrders}
        options={({ route }) => ({
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
        options={({ route }) => ({
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
            backgroundColor: currentTheme.background,
          },
        })}
      />
      {/** filter screen */}
      <Stack.Screen
        name="Filter"
        component={Filter}
        options={{
          headerBackTitleVisible: false,
          title: language?.language?.Main?.filter?.filter,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
            backgroundColor: currentTheme.background,
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
              onPress={() => navigation.navigate("Feeds")}
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {sum > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    // on press can be clean filter and getting starting position, also with clean() function clear imports as default
                    dispatch(
                      setCity(
                        (
                          currentUser?.address?.find(
                            (a) =>
                              a.city?.toLowerCase()?.replace("'", "") ===
                              location.city
                          )?.city || currentUser.address[0]?.city
                        )?.replace("'", "")
                      )
                    );
                    dispatch(setDistrict(""));
                    dispatch(setFilter(""));
                    dispatch(setSearch(""));
                    dispatch(setSearchInput(""));
                    dispatch(setSpecialists(true));
                    dispatch(setSalons(true));
                    dispatch(setCleanUp());
                  }}
                  style={{ marginRight: 15, padding: 5 }}
                >
                  <View style={{ height: 30, justifyContent: "center" }}>
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
                        right: -5,
                        top: 0,
                      }}
                    >
                      <Text
                        style={{
                          color: "#e5e5e5",
                          fontSize: 10,
                          letterSpacing: 1.5,
                          position: "relative",
                          left: 1,
                        }}
                      >
                        {sum}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: currentTheme.font,
                        fontWeight: "bold",
                        letterSpacing: 0.3,
                      }}
                    >
                      {language?.language?.Main?.filter?.clear}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />
      {/** search screen */}
      <Stack.Screen
        name="Search"
        component={Search}
        options={({ route }) => ({
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
              onPress={() => navigation.navigate("Filter")}
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
