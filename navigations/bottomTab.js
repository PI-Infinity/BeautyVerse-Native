import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FeedsStack } from "../navigations/feedsStack";
import { CardsStack } from "../navigations/cardsStack";
import { ProfileStack } from "../navigations/profileStack";
import { FilterStack } from "../navigations/filterStack";
import { Recommended } from "../navigations/recommendedStack";
import { ChatStack } from "../navigations/chatStack";
import Icon from "react-native-vector-icons/FontAwesome";
import { setCleanUp, setRerenderCurrentUser } from "../redux/rerenders";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { View, Text, Image } from "react-native";
import { Language } from "../context/language";

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = ({ socket }) => {
  const language = Language();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const sum = useSelector((state) => state.storeFilter.filterBadgeSum);
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#111" },
        headerShown: false,
        activeTintColor: "#fff",
        inactiveTintColor: "#f1f1f1",
        style: {
          backgroundColor: "#111",
          elevation: 0, // for Android
          shadowOffset: {
            width: 0,
            height: 0, // for iOS
          },
        },
        labelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Main"
        children={() => <FeedsStack />}
        options={({ navigation, route }) => ({
          tabBarLabel: language?.language?.User?.userPage?.main,
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#111",
            borderTopWidth: 1,
            borderTopColor: "#222",
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={22} color={color} />
          ),
        })}
        listeners={{
          tabPress: (e) => {
            dispatch(setCleanUp());
          },
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsStack}
        options={{
          tabBarLabel: language?.language?.User?.userPage?.cards,
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#111)",
            borderTopWidth: 1,
            borderTopColor: "#222",
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="address-book-o" size={20} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            dispatch(setCleanUp());
          },
        }}
      />
      {/* <Tab.Screen
        name="Recommoends"
        component={Recommended}
        options={{
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#111)",
            borderTopWidth: 1,
            borderTopColor: "#222",
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="address-card-o" size={20} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Filters"
        component={FilterStack}
        options={{
          tabBarLabel: language?.language?.Main?.filter?.filter,
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#111)",
            borderTopWidth: 1,
            borderTopColor: "#222",
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <View style={{ height: 30, justifyContent: "center" }}>
              {sum > 0 && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 13,
                    height: 13,
                    backgroundColor: "red",
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    zIndex: 2,
                    right: -5,
                    top: 0,
                    // padding: 1,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 10 }}>{sum}</Text>
                </View>
              )}

              <Icon name="search" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        children={() => <ChatStack socket={socket} />}
        options={({ route }) => ({
          tabBarLabel: language?.language?.Chat?.chat?.title,
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#111)",
            borderTopWidth: 1,
            borderTopColor: "#222",
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="wechat" size={20} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: language?.language?.User?.userPage?.profile,
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#111)",
            borderTopWidth: 1,
            borderTopColor: "#222",
            elevation: 0,
          },
          tabBarIcon: ({ color, size }) => (
            <View>
              <Image
                source={{ uri: currentUser?.cover }}
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "gray",
                }}
              />
            </View>
            // <Icon name="user" size={20} color={color} />
          ),
          // tabBarIcon: ({ focused }) => (
          //   <Image
          //     source={sampleIcon}
          //     resizeMode="contain"
          //     style={{
          //       width: focused ? 24 : 20,
          //       height: focused ? 24 : 20,
          //       tintColor: focused ? '#000' : '#808080',
          //     }}
          //   />
          // ),
        }}
      />
    </Tab.Navigator>
  );
};

const TabBarIcon = (props) => {
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  return (
    <Image
      source={{ uri: currentUser?.cover }}
      resizeMode="contain"
      style={{
        width: focused ? 24 : 20,
        height: focused ? 24 : 20,
      }}
    />
  );
};
