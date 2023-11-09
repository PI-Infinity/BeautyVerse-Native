import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { BlurView } from "expo-blur";
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
import { setScreenModal } from "../redux/app";
import { ScreenModal } from "../screens/user/settings/screenModal";
import { User } from "../screens/user/userProfile";
import { UserVisit } from "../screens/user/userVisit";
import { useRoute } from "@react-navigation/native";

/**
 * Create user profile stack, where include all main configs
 */
const Stack = createStackNavigator();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export function ProfileStack({ navigation }) {
  // dispatch
  const dispatch = useDispatch();
  // language state
  const language = Language();
  // route
  const routeName = useRoute();
  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  /** in profile stack defined,
   * user personal data, settings
   * and control datas and feeds */

  const insets = useSafeAreaInsets();

  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  /**
   * blur
   */
  const blur = useSelector((state) => state.storeApp.blur);

  // screens modal state
  const screenModal = useSelector((state) =>
    state.storeApp.screenModal?.find((i) => i.activeTabBar === "Profile")
  );

  return (
    <>
      {/** screens modal */}
      {screenModal &&
        screenModal?.active &&
        screenModal?.activeTabBar === "Profile" && (
          <ScreenModal
            visible={screenModal?.active}
            screen={screenModal.screen}
            navigation={navigation}
          />
        )}
      {/**
       * blur background
       */}

      <>
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
      </>
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
          options={({ route, navigation }) => ({
            headerShown: false,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              // backgroundColor: currentTheme.background,
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
            cardStyle: {},
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

        {/* <Stack.Screen
          name="Booking Statistics"
          component={Statistics}
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
            title: "Booking statistics",
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
        /> */}
      </Stack.Navigator>
    </>
  );
}
