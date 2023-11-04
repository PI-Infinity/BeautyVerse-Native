import {
  Feather,
  FontAwesome,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { useEffect } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Product from "../Marketplace/screens/product";
import { CacheableImage } from "../components/cacheableImage";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
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
import { SendBooking } from "../screens/bookings/sendBooking";
import { Cards } from "../screens/cards";
import { Room } from "../screens/chat/room";
import { FeedItem } from "../screens/feeds/feedScreen";
import { ScrollGallery } from "../screens/feeds/scrollGallery";
import { Filter } from "../screens/filter";
import { Search } from "../screens/search";
import { SentBookings } from "../screens/sentBookings/sentBookings";
import { User } from "../screens/user/user";
// import Mirror from "../Mirror/screens/mirror";
import { BlurView } from "expo-blur";
import { setLocation } from "../redux/app";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Stack = createStackNavigator();

/* Card's screen stack navigator */

export function CardsStack({ navigation, setScrollY }) {
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
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
          cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
        }}
      >
        {/** main card list screen  */}
        <Stack.Screen
          name="cards"
          children={() => (
            <Cards navigation={navigation} setScrollY={setScrollY} />
          )}
          // component={Mirror}
          options={{
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,
              shadowColor: currentTheme.line,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 24,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: theme
                ? "rgba(0,0,0,0.6)"
                : currentTheme.background,
            },
            headerTitleAlign: "center", // Center align the header title

            headerTitle: ({ focused }) => (
              <View
                style={{
                  height: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <View style={{ flex: 0.5, height: 20 }}></View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
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
                <Pressable
                  onPress={() => navigation.navigate("Filter")}
                  style={{
                    height: 30,
                    // width: 60,
                    alignItems: "center",
                    flex: 0.5,
                  }}
                >
                  {/** badge for filter */}
                  {sum > 0 && (
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
                        top: -5,
                        right: 0,
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
                  <View
                    style={{
                      height: 30,
                      flex: 0.5,
                      width: SCREEN_WIDTH / 3.5,
                      alignItems: "flex-end",
                      justifyContent: "center",
                      position: "absolute",

                      // overflow: "hidden",
                    }}
                  >
                    <Fontisto
                      name="earth"
                      size={120}
                      color={currentTheme.disabled}
                      style={{
                        position: "absolute",
                        top: 10,
                        zIndex: -1,
                        opacity: 0.1,
                        right: 10,
                      }}
                    />

                    <Feather
                      name="search"
                      size={30}
                      style={{ marginRight: 10 }}
                      color={currentTheme.disabled}
                    />
                    {/* )} */}
                  </View>
                </Pressable>
              </View>
            ),
          }}
        />
        {/** user screen in cards, visit page, that component gettings props "visitPage", so from this component only can to visit page, current user can't modify any data from there  */}
        <Stack.Screen
          name="User"
          component={User}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
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
        {/* sent booking screen */}
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
            // title: "name",
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
              shadowColor: "#000",
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
                onPress={() => navigation.navigate("cards")}
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
                      dispatch(setSpecialists(true));
                      dispatch(setSalons(true));
                      dispatch(setSearchInput(""));
                      dispatch(
                        setLocation({
                          country: currentUser.address[0].country,
                          city: currentUser.address[0]?.city?.replace("'", ""),
                          latitude: currentUser.address[0]?.latitude,
                          longitude: currentUser.address[0]?.longitude,
                        })
                      );
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
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            title: language?.language?.Main?.filter?.search,
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
