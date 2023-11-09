import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { setBlur, setScreenModal } from "../redux/app";
import { setOpenAddChat } from "../redux/chat";
import { Chat } from "../screens/chat/chat";
import { ScreenModal } from "../screens/user/settings/screenModal";
import { UserVisit } from "../screens/user/userVisit";
import { useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Stack = createStackNavigator();

export function ChatStack({ navigation }) {
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const language = Language();

  const dispatch = useDispatch();
  const routeName = useRoute();

  // define screen height

  const insets = useSafeAreaInsets();

  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  // screens modal state
  const screenModal = useSelector((state) =>
    state.storeApp.screenModal?.find((i) => i.activeTabBar === "Chat")
  );

  const blur = useSelector((state) => state.storeApp.blur);
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      {/** screens modal */}
      {screenModal &&
        screenModal?.active &&
        screenModal?.activeTabBar === "Chat" && (
          <ScreenModal
            visible={screenModal?.active}
            screen={screenModal.screen}
            navigation={navigation}
          />
        )}
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
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
          cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
        }}
      >
        <Stack.Screen
          name="Chats"
          component={Chat}
          options={{
            headerBackTitleVisible: false,
            title: language?.language?.Chat?.chat?.title,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              letterSpacing: 0.5,
              fontSize: 22,
            },
            cardStyle: {},
            headerLeft: () => (
              <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginLeft: 15, padding: 5 }}
                onPress={() => {
                  dispatch(setBlur(true));
                  dispatch(setOpenAddChat(true));
                }}
              >
                <FontAwesome name="plus" size={18} color={currentTheme.font} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                acitveOpacity={0.3}
                style={{ marginRight: 15, padding: 5 }}
                onPress={() =>
                  dispatch(
                    setScreenModal({
                      active: true,
                      screen: "AIAssistent",
                      route: routeName.name,
                    })
                  )
                }
              >
                <MaterialCommunityIcons
                  name="robot-love-outline"
                  size={22}
                  color={currentTheme.pink}
                />
              </TouchableOpacity>
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
            cardStyle: {},
          })}
        />
      </Stack.Navigator>
    </View>
  );
}
