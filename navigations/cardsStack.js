import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { View, Dimensions, Platform } from "react-native";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { Text } from "react-native";
import { Cards } from "../screens/cards";
import { MaterialIcons } from "@expo/vector-icons";
import { lightTheme, darkTheme } from "../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const Stack = createStackNavigator();

// specific component for user page, passed some props into component
const withVariant = (Component, variant) => {
  return (props) => {
    return <User {...props} variant={variant} />;
  };
};

// specific component for user page, passed some props into component
const withVariantVisit = (Component, variant) => {
  return (props) => {
    return <User {...props} variant={variant} />;
  };
};

export function CardsStack({ route }) {
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
        cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
      }}
    >
      {/** main card list screen  */}
      <Stack.Screen
        name="cards"
        component={Cards}
        options={{
          headerStyle: {
            backgroundColor: currentTheme.background,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: !theme ? 0.5 : 0, // negative value places shadow on top
            },
            shadowOpacity: 0.2,
            shadowRadius: 2,
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
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // marginBottom: 10,
                flex: 1,
                width: SCREEN_WIDTH - 30,
                justifyContent: "center",
                marginBottom: Platform.OS !== "android" ? 5 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: "bold",
                  color: currentTheme.pink,
                  letterSpacing: 1,
                }}
              >
                Beauty
              </Text>
              <Text
                style={{
                  fontSize: 23,
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
      {/** user screen in cards, visit page, that component gettings props "visitPage", so from this component only can to visit page, current user can't modify any data from there  */}
      <Stack.Screen
        name="User"
        component={withVariant(User, "visitPage")}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: route.params.user.name,
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
                  marginBottom: Platform.OS !== "android" ? 5 : 0,
                }}
              >
                {route.params.user.name}
              </Text>
              {route.params.user.subscription.status === "active" && (
                <MaterialIcons name="verified" size={14} color="#F866B1" />
              )}
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="UserVisit"
        component={withVariantVisit(User, "visitPage")}
        options={({ route }) => ({
          headerBackTitleVisible: false,
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
                {route.params.user.name}
              </Text>
              <MaterialIcons name="verified" size={20} color="#F866B1" />
            </View>
          ),

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
      {/** user feed list screen, after press to feed from user page, user can visit to target user's feeds  */}
      <Stack.Screen
        name="ScrollGallery"
        component={ScrollGallery}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Feeds",
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
    </Stack.Navigator>
  );
}
