import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Welcome from "../screens/welcome";
import { Login } from "../screens/authentication/login";
import { Type } from "../screens/authentication/type";
// import Identify from "../screens/authentication/identify";
import Business from "../screens/authentication/business";
import { Prices } from "../screens/prices";
import { useSelector } from "react-redux";
import { Language } from "../context/language";
import { lightTheme, darkTheme } from "../context/theme";
import { Terms } from "../screens/user/terms";
import { QA } from "../screens/user/QA";
import { Privacy } from "../screens/user/privacy";
import { Usage } from "../screens/user/usage";
import { Identify } from "../screens/authentication/identify";
import { PersonalInfo } from "../screens/authentication/personalInfo";
// import { Info } from "../screens/authentication/info";
import { SuccessRegister } from "../screens/authentication/SuccessRegister";
import { Accept } from "../screens/authentication/accept";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Stack = createStackNavigator();

export function AuthStack({ route }) {
  // define theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  // define language which stored from context folder
  const language = Language();
  const navigation = useNavigation();
  //*
  // define authentications screens
  //
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
        cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
      }}
    >
      {/** Main welcome screen */}
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          title: "Welcome",
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: Platform.OS !== "android" ? 5 : 0,
                flex: 1,
                width: SCREEN_WIDTH - 30,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: currentTheme.font,
                  letterSpacing: 0.5,
                }}
              >
                {language?.language?.Auth?.auth?.welcome}
              </Text>
            </View>
          ),
        }}
      />
      {/** login screen */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: language?.language?.Auth?.auth?.login,
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
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
        }}
      />
      {/** register screen, where users choices register types */}
      <Stack.Screen
        name="Type"
        component={Type}
        options={{
          title: language?.language?.Auth?.auth?.choice,
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
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
        }}
      />
      <Stack.Screen
        name="Identify"
        component={Identify}
        options={{
          title: language?.language?.Auth?.auth?.identify,
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
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
        }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{
          title: language?.language?.Auth?.auth?.register,
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
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
        }}
      />
      {/* */}
      <Stack.Screen
        name="Accept"
        component={Accept}
        options={{
          title: language?.language?.Auth?.auth?.acceptRules,
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
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
        }}
      />
      {/** identify screen, main register  */}
      <Stack.Screen
        name="SuccessRegister"
        component={SuccessRegister}
        options={{
          title: language?.language?.Auth?.auth?.congretulation,
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
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
        }}
      />

      {/** business register screen, if user specialist or beauty salon */}
      <Stack.Screen
        name="Business"
        component={Business}
        options={{
          title: language?.language?.Auth?.auth?.businessInfo,
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
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
        }}
      />
      {/** prices screen, navigated from welcome screen */}
      <Stack.Screen
        name="Prices"
        component={Prices}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.User?.userPage?.prices,
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
      {/** terms and rules, navigated from welcome screen */}
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={({ route }) => ({
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
          title: language?.language?.Pages?.pages?.terms,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
      {/** Privacy policy, navigated from welcome screen */}
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={({ route }) => ({
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
          title: language?.language?.Pages?.pages?.privacy,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
      {/** question and answers screen, navigated from welcome screen */}
      <Stack.Screen
        name="QA"
        component={QA}
        options={({ route }) => ({
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
          title: language?.language?.Pages?.pages?.qa,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
      {/** how beautyverse works screen, navigated from welcome screen */}
      <Stack.Screen
        name="Usage"
        component={Usage}
        options={({ route }) => ({
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
          title: language?.language?.Pages?.pages?.usage,
          headerStyle: {
            height: SCREEN_HEIGHT / 9,
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
