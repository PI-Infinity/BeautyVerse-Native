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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { lightTheme, darkTheme } from "../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const Stack = createStackNavigator();

// specific component for user page, passed some props into component
const withVariant = (Component, variant) => {
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
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: currentTheme.font,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
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
                  color: "#F866B1",
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
                  color: "#e5e5e5",
                  fontWeight: "bold",
                  marginBottom: Platform.OS !== "android" ? 5 : 0,
                }}
              >
                {route.params.user.name}
              </Text>
              <MaterialIcons name="verified" size={14} color="#F866B1" />
            </View>
          ),
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
          },
          cardStyle: {
            backgroundColor: currentTheme.background,
          },
        })}
      />
    </Stack.Navigator>
  );
}
