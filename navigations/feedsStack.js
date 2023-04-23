import { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { Login } from "../screens/authentication/login";
import { Feeds } from "../screens/feeds";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { ListItem, Icon, Button } from "react-native-elements";
import { Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Language } from "../context/language";
import ColorChangingBackground from "../components/gradientBackground";

const Stack = createStackNavigator();

const withVariant = (Component, variant) => {
  return (props) => {
    return <User {...props} variant={variant} />;
  };
};

export function FeedsStack({ route, navigation }) {
  const language = Language();

  return (
    <Stack.Navigator initialRouteName="Feeds">
      <Stack.Screen
        name="Feeds"
        component={Feeds}
        options={{
          title: "",
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
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#fff",
                  letterSpacing: 1,
                }}
              >
                BeautyVerse
              </Text>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="User"
        component={withVariant(User, "visitPage")}
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
                  color: "#e5e5e5",
                  fontWeight: "bold",
                }}
              >
                {route.params.user.name}
              </Text>
              <MaterialIcons name="verified" size={14} color="#1DA1F2" />
            </View>
          ),

          headerStyle: {
            backgroundColor: "rgba(15,15,15,1)",
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
            backgroundColor: "rgba(15,15,15,1)",
          },
        })}
      />
      <Stack.Screen
        name="ScrollGallery"
        component={ScrollGallery}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.feeds,
          headerStyle: {
            backgroundColor: "rgba(15,15,15,1)",
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
            backgroundColor: "rgba(15,15,15,1)",
          },
        })}
      />
    </Stack.Navigator>
  );
}
