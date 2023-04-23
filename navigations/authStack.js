import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "../screens/authentication/login";
import Register from "../screens/authentication/register";
import Identify from "../screens/authentication/identify";
import Business from "../screens/authentication/business";
import { Language } from "../context/language";

const Stack = createStackNavigator();

export function AuthStack({ route }) {
  const language = Language();
  return (
    <Stack.Navigator
    // screenOptions={{
    //   headerShown: false,
    // }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: "BeautyVerse",
          headerStyle: {
            backgroundColor: "rgba(15, 15, 15, 1)",
            height: 50,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: "rgba(15, 15, 15, 1)",
          },
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          title: language?.language?.Auth?.auth?.register,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#111",
            height: 50,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 0.5,
          },
          cardStyle: {
            backgroundColor: "#111",
          },
        }}
      />
      <Stack.Screen
        name="Identify"
        component={Identify}
        options={{
          title: language?.language?.Auth?.auth?.identify,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#111",
            height: 50,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: "#111",
          },
        }}
      />
      <Stack.Screen
        name="Business"
        component={Business}
        options={{
          title: language?.language?.Auth?.auth?.businessInfo,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#111",
            height: 50,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: "#111",
          },
        }}
      />
    </Stack.Navigator>
  );
}
