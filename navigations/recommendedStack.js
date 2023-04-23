import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { Feeds } from "../screens/feeds";
import { User } from "../screens/user/user";
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();

export function Recommended({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Feeds}
        options={{
          title: "Beautyverse",
          headerStyle: {
            backgroundColor: "#222",
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
            backgroundColor: "#222",
          },
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <Icon name="star-half-full" size={20} color="#fff" />
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 15 }}>
              <Icon name="bars" size={20} color="#fff" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="User"
        component={User}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: route.params.userName,
          headerStyle: {
            backgroundColor: "#222",
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
            backgroundColor: "#222",
          },
        })}
      />
    </Stack.Navigator>
  );
}
