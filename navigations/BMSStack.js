import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
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
import { CacheableImage } from "../components/cacheableImage";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { AddBooking } from "../screens/bookings/addBooking";
import { Bookings } from "../screens/bookings/bookings";
import { Room } from "../screens/chat/room";
import { ScreenModal } from "../screens/user/settings/screenModal";
import { UserVisit } from "../screens/user/userVisit";
import { setScreenModal } from "../redux/app";
import { useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";

/* 
  Create filter stack navigator
*/

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Stack = createStackNavigator();

export function BMSStack({ navigation }) {
  // redux toolkit dispatch
  const dispatch = useDispatch();

  // route
  const routeName = useRoute();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // language context
  const language = Language();

  const insets = useSafeAreaInsets();
  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  // screens modal state
  const screenModal = useSelector((state) =>
    state.storeApp.screenModal?.find((i) => i.activeTabBar === "BMS")
  );

  const blur = useSelector((state) => state.storeApp.blur);
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
        screenModal?.activeTabBar === "BMS" && (
          <ScreenModal
            visible={screenModal?.active}
            screen={screenModal.screen}
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
        {/** main booking list screen  */}
        <Stack.Screen
          name="bookings"
          children={() => <Bookings navigation={navigation} />}
          options={({ navigation }) => ({
            headerBackTitleVisible: false,
            title: language?.language?.Bookings?.bookings?.bms,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              maxWidth: "90%",
              fontWeight: "bold",
              fontSize: 22,
              letterSpacing: 0.5,
              textAlign: "center",
            },
            cardStyle: {},

            headerRight: () => (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  right: 15,
                }}
              >
                <TouchableOpacity
                  acitveOpacity={0.3}
                  // style={{ marginRight: 15 }}
                  onPress={() =>
                    dispatch(
                      setScreenModal({
                        active: true,
                        screen: "Add Booking",
                      })
                    )
                  }
                >
                  <MaterialIcons
                    style={{
                      color: currentTheme.pink,
                    }}
                    name="add"
                    size={28}
                  />
                </TouchableOpacity>

                {/* <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("Booking Statistics")}
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
