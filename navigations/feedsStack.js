import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { View, Dimensions, Pressable, TouchableOpacity } from "react-native";
import { Feeds } from "../screens/feeds";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { Text } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { Language } from "../context/language";
import { lightTheme, darkTheme } from "../context/theme";
import { useSelector } from "react-redux";
import { SendOrder } from "../screens/orders/sendOrder";
import { SentOrders } from "../screens/sentOrders/sentOrders";

const Stack = createStackNavigator();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// specific component for user page, passed some props into component

export function FeedsStack({ route, navigation }) {
  // language and theme imports
  const language = Language();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const currentUser = useSelector((state) => state.storeUser.currentUser);
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
        component={Feeds}
        options={{
          headerStyle: {
            backgroundColor: currentTheme.background,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: !theme ? 1 : 0, // negative value places shadow on top
            },
            shadowOpacity: 0.1,
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

          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: Platform.OS !== "android" ? 5 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: currentTheme.pink,
                  letterSpacing: 1,
                }}
              >
                Beauty
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: currentTheme.font,
                  letterSpacing: 1,
                }}
              >
                verse
              </Text>
            </View>
          ),
        }}
      />
      {/** user screen in feeds, visit page, that component gettings props "visitPage", so from this component only can to visit page, current user can't modify any data from there  */}
      <Stack.Screen
        name="User"
        component={User}
        options={({ route }) => ({
          headerBackTitleVisible: false,
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
            if (currentUser?.type.toLowerCase() !== "beautycenter") {
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
        component={User}
        options={({ route }) => ({
          headerBackTitleVisible: false,
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
            if (currentUser?.type.toLowerCase() !== "beautycenter") {
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
          title: "Booking",
          headerStyle: {
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
          title: "My Bookings",
          headerStyle: {
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
          headerStyle: {
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
    </Stack.Navigator>
  );
}
