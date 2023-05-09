import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { View, Dimensions, Platform, TouchableOpacity } from "react-native";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { Text } from "react-native";
import { Cards } from "../screens/cards";
import { Orders } from "../screens/orders/orders";
import { AddOrder } from "../screens/orders/addOrder";
import { Statistics } from "../screens/orders/statistics";
import Entypo from "react-native-vector-icons/Entypo";
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
// specific component for orders page, passed some props into component
const withVariantOrders = (orders) => {
  console.log(orders);
  return (props) => {
    return <Orders orders={orders} {...props} />;
  };
};

export function OrdersStack({ route, navigation, orders }) {
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
      {/** main order list screen  */}
      <Stack.Screen
        name="Main"
        children={withVariantOrders(orders)}
        options={({ navigation }) => ({
          title: "Orders",
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
          headerLeft: () => (
            <TouchableOpacity
              acitveOpacity={0.3}
              style={{ marginLeft: 15 }}
              onPress={() => navigation.navigate("Add Order")}
            >
              <Entypo
                style={{
                  color: currentTheme.pink,
                }}
                name="add-to-list"
                size={24}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              acitveOpacity={0.3}
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("Statistics")}
            >
              <MaterialIcons
                name="bar-chart"
                size={24}
                color={currentTheme.font}
              />
            </TouchableOpacity>
          ),
        })}
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
      <Stack.Screen
        name="Add Order"
        component={AddOrder}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Add new order",
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
      <Stack.Screen
        name="Statistics"
        component={Statistics}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Order statistics",
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
