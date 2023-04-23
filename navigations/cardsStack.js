import { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { Login } from "../screens/authentication/login";
import { Feeds } from "../screens/feeds";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import Icon from "react-native-vector-icons/FontAwesome";
import { Text } from "react-native";
import { Cards } from "../screens/cards";

const Stack = createStackNavigator();

const withVariant = (Component, variant) => {
  return (props) => {
    return <User {...props} variant={variant} />;
  };
};

export function CardsStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="cards"
        component={Cards}
        options={{
          title: "",
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
            fontSize: 24,
          },
          cardStyle: {
            backgroundColor: "rgba(15, 15, 15, 1)",
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

          // headerRight: () => (
          //   <View style={{ marginRight: 15 }}>
          //     <Icon name="bars" size={20} color="#fff" />
          //   </View>
          // ),
        }}
      />

      <Stack.Screen
        name="User"
        component={withVariant(User, "visitPage")}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: route.params.user.name,
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
          // headerRight: () => (
          //   <View style={{ marginRight: 15 }}>
          //     <Icon name="edit" size={20} color="#fff" />
          //   </View>
          // ),
        })}
      />
      <Stack.Screen
        name="ScrollGallery"
        component={ScrollGallery}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: "Feeds",
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
