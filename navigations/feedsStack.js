import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { setScreenModal } from "../redux/app";
import { Feeds } from "../screens/feeds/list";
import { ScreenModal } from "../screens/user/settings/screenModal";
import { UserVisit } from "../screens/user/userVisit";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

/* 
  feeds screen stack navigator
*/
const Stack = createStackNavigator();

export function FeedsStack({ navigation }) {
  // ltheme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines language
  const language = Language();
  const routeName = useRoute();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.storeApp.language);

  // // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // feeds first loading
  const [firstLoading, setFirstLoading] = useState(true);
  const activeTabBar = useSelector((state) => state.storeApp.activeTabBar);

  const screenModal = useSelector((state) =>
    state.storeApp.screenModal.find((i) => i.activeTabBar === "Feeds")
  );

  const blur = useSelector((state) => state.storeApp.blur);

  return (
    <>
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
      {/** screens modal */}
      {screenModal &&
        screenModal?.active &&
        screenModal?.activeTabBar === "Feeds" && (
          <ScreenModal
            visible={screenModal?.active}
            screen={screenModal.screen}
            navigation={navigation}
          />
        )}

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
              firstLoading={firstLoading}
              setFirstLoading={setFirstLoading}
            />
          )}
          options={{
            headerBackTitleVisible: false,
            headerStyle: {
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
            cardStyle: {},
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
              // backgroundColor: currentTheme.background,

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
              // backgroundColor: currentTheme.background,
            },
          })}
        />
      </Stack.Navigator>
    </>
  );
}
