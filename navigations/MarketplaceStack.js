import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Search from "../Marketplace/components/search";
import List from "../Marketplace/screens/list";
import Main from "../Marketplace/screens/marketplace";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { ScreenModal } from "../screens/user/settings/screenModal";
import { UserVisit } from "../screens/user/userVisit";
import { setScreenModal } from "../redux/app";
import { useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const Stack = createStackNavigator();

/* Card's screen stack navigator */

export function MarketplaceStack({ navigation }) {
  // define current user redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines redux dispatch
  const dispatch = useDispatch();

  // route
  const routeName = useRoute();

  // defines language
  const language = Language();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const insets = useSafeAreaInsets();
  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // screens modal state
  const screenModal = useSelector((state) =>
    state.storeApp.screenModal?.find((i) => i.activeTabBar === "Marketplace")
  );

  const blur = useSelector((state) => state.storeApp.blur);
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      // source={theme ? require("../assets/background.jpg") : null}
    >
      {/** screens modal */}
      {screenModal &&
        screenModal?.active &&
        screenModal?.activeTabBar === "Marketplace" && (
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
        {/** main card list screen  */}
        <Stack.Screen
          name="main"
          children={() => <Main navigation={navigation} />}
          options={{
            headerStyle: {
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
            title: language?.language?.Marketplace?.marketplace?.marketplace,
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              letterSpacing: 0.5,
              fontSize: 22,
            },
            cardStyle: {
              // backgroundColor: currentTheme.background,
              // backgroundColor: currentTheme.background,
            },
            headerTitleAlign: "center", // Center align the header title
            // headerTitle: ({ focused }) => (
            //   <View
            //     style={{
            //       flexDirection: "row",
            //       alignItems: "center",
            //       justifyContent: "center",
            //       width: "100%",
            //     }}
            //   >
            //     <View
            //       style={{
            //         flexDirection: "row",
            //         alignItems: "center",
            //         justifyContent: "center",
            //         paddingBottom: 5,
            //         flex: 1,
            //       }}
            //     >
            //       <Text
            //         style={{
            //           fontSize: 29,
            //           fontWeight: "bold",
            //           color: currentTheme.font,
            //           letterSpacing: 1,
            //         }}
            //       >
            //         Beauty
            //       </Text>
            //       <Text
            //         style={{
            //           fontSize: 29,
            //           fontWeight: "bold",
            //           color: currentTheme.pink,
            //           letterSpacing: 1,
            //         }}
            //       >
            //         Verse
            //       </Text>
            //     </View>
            //   </View>
            // ),
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
