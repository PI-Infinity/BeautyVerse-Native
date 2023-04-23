import { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Dimensions, Pressable } from "react-native";
import { Login } from "../screens/authentication/login";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { User } from "../screens/user/user";
import { AddFeed } from "../screens/user/addFeed";
import { Settings } from "../screens/user/settings/settings";
import { Addresses } from "../screens/user/settings/addresses";
import { PersonalInfo } from "../screens/user/settings/personalInfo";
import { WorkingInfo } from "../screens/user/settings/workingInfo";
import { Procedures } from "../screens/user/settings/procedures";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Language } from "../context/language";

const Stack = createStackNavigator();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export function ProfileStack({ route, navigation }) {
  const language = Language();
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  return (
    <Stack.Navigator initialRouteName="UserProfile">
      <Stack.Screen
        name="UserProfile"
        children={() => <User user={currentUser} navigation={navigation} />}
        options={({ route }) => ({
          // title: currentUser.name,
          headerStyle: {
            backgroundColor: "rgba(15,15,15,1)",
            height: 50,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitle: "",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: "rgba(15,15,15,1)",
          },
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginLeft: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  letterSpacing: 0.5,
                  color: "#e5e5e5",
                  fontWeight: "bold",
                }}
              >
                {currentUser.name}
              </Text>
              <MaterialIcons name="verified" size={14} color="#1DA1F2" />
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {currentUser.type !== "user" && (
                <Pressable
                  onPress={() => navigation.navigate("AddFeed")}
                  style={{ marginRight: 15, padding: 5, paddingRight: 0 }}
                >
                  <Octicons name="diff-added" size={20} color="#fff" />
                </Pressable>
              )}
              <Pressable
                onPress={() => navigation.navigate("Settings")}
                style={{ marginRight: 15, padding: 5 }}
              >
                <Ionicons name="settings" size={20} color="#fff" />
              </Pressable>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="UserScrollGallery"
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
      <Stack.Screen
        name="AddFeed"
        component={AddFeed}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.add,
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
        name="Settings"
        component={Settings}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.settings,
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
        name="Personal info"
        component={PersonalInfo}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.personalInfo,
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
        name="Procedures"
        component={Procedures}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.procedures,
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
        name="Working info"
        component={WorkingInfo}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.workingInfo,
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
        name="Addresses"
        component={Addresses}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.addresses,
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
