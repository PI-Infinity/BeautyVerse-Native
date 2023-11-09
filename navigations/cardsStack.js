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
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { setFilterBadgeSum, setFilterScreenModal } from "../redux/filter";
import { Cards } from "../screens/cards";
// import Mirror from "../Mirror/screens/mirror";
import { FilterScreenModal } from "../screens/filterScreenModal";
import { ScreenModal } from "../screens/user/settings/screenModal";
import { UserVisit } from "../screens/user/userVisit";
import { setScreenModal } from "../redux/app";
import { useContext } from "react";
import { RouteNameContext } from "../context/routName";
import { useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Stack = createStackNavigator();

/* Card's screen stack navigator */

export function CardsStack({ navigation }) {
  // define current user redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines redux dispatch
  const dispatch = useDispatch();

  // routename
  const routeName = useRoute();

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

  // screens modal state
  const screenModal = useSelector((state) =>
    state.storeApp.screenModal?.find((i) => i.activeTabBar === "Cards")
  );

  // filter screens modal state
  const filterScreenModal = useSelector(
    (state) => state.storeFilter.filterScreenModal
  );

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      {/** screens modal */}
      {screenModal &&
        screenModal?.active &&
        screenModal?.activeTabBar === "Cards" && (
          <ScreenModal
            visible={screenModal?.active}
            screen={screenModal.screen}
            navigation={navigation}
          />
        )}
      {/** filter modal */}
      {filterScreenModal?.active && (
        <FilterScreenModal
          visible={filterScreenModal?.active}
          screen={filterScreenModal.screen}
          navigation={navigation}
        />
      )}

      {blur && (
        <BlurView
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: "absolute",
            zIndex: 10005,
            top: 0,
            left: 0,
          }}
          // style={styles.blurView}
          tint="dark" // or 'dark'
          intensity={40}
        ></BlurView>
      )}
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
          cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
        }}
      >
        {/** main card list screen  */}
        <Stack.Screen
          name="cards"
          children={() => <Cards navigation={navigation} />}
          // component={Mirror}
          options={{
            headerTitle: "Profiles",
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              // backgroundColor: currentTheme.background,
              shadowColor: currentTheme.line,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              letterSpacing: 0.5,
              fontSize: 22,
            },
            cardStyle: {
              // backgroundColor: theme
              //   ? "rgba(0,0,0,0.6)"
              //   : currentTheme.background,
            },
            headerTitleAlign: "center", // Center align the header title

            headerRight: ({ focused }) => (
              <View
                style={{
                  height: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {/* <View style={{ flex: 0.5, height: 20 }}></View> */}
                {/* <View
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
                </View> */}
                <Pressable
                  // onPress={() => navigation.navigate("Filter")}
                  onPress={() =>
                    dispatch(
                      setFilterScreenModal({ active: true, screen: "Filter" })
                    )
                  }
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
        <Stack.Screen
          name="UserVisit"
          children={(route) => (
            <UserVisit navigation={navigation} route={route} />
          )}
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
                  {route.params.user?.name}
                </Text>
                {route.params.user?.subscription.status === "active" && (
                  <MaterialIcons name="verified" size={14} color="#F866B1" />
                )}
              </View>
            ),
            headerRight: (props) => {
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
                          dispatch(
                            setScreenModal({
                              active: true,
                              screen: "Send Booking",
                              data: route?.params.user,
                              route: routeName.name,
                            })
                          )
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
            cardStyle: {},
          })}
        />
      </Stack.Navigator>
    </View>
  );
}
