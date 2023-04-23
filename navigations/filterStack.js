import { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TouchableOpacity } from "react-native";
import { Filter } from "../screens/filter";
import { Search } from "../screens/search";
import { ListItem, Icon, Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearch,
  setFilter,
  setSpecialists,
  setSalons,
  setCity,
  setDistrict,
  setFilterBadgeSum,
} from "../redux/filter";
import { setCleanUp } from "../redux/rerenders";
import { Language } from "../context/language";

const Stack = createStackNavigator();

export function FilterStack({ route, navigation }) {
  const language = Language();
  const lang = useSelector((state) => state.storeApp.language);
  const dispatch = useDispatch();
  // define signed filter length
  const filter = useSelector((state) => state.storeFilter.filter);
  let filterBadge;
  if (filter !== "") {
    filterBadge = 1;
  } else {
    filterBadge = 0;
  }
  const search = useSelector((state) => state.storeFilter.search);
  let searchBadge;
  if (search !== "") {
    searchBadge = 1;
  } else {
    searchBadge = 0;
  }
  const city = useSelector((state) => state.storeFilter.city);
  let cityBadge;
  if (city !== "") {
    cityBadge = 1;
  } else {
    cityBadge = 0;
  }
  const district = useSelector((state) => state.storeFilter.district);
  let districtBadge;
  if (district !== "") {
    districtBadge = 1;
  } else {
    districtBadge = 0;
  }
  const specialist = useSelector((state) => state.storeFilter.specialists);
  let specialistBadge;
  if (!specialist) {
    specialistBadge = 1;
  } else {
    specialistBadge = 0;
  }

  const object = useSelector((state) => state.storeFilter.salons);
  let objectBadge;
  if (!object) {
    objectBadge = 1;
  } else {
    objectBadge = 0;
  }

  const sum =
    filterBadge +
    cityBadge +
    districtBadge +
    specialistBadge +
    objectBadge +
    searchBadge;

  useEffect(() => {
    dispatch(setFilterBadgeSum(sum));
  }, [sum]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Filter"
        component={Filter}
        options={{
          title: language?.language?.Main?.filter?.filter,
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
          },
          cardStyle: {
            backgroundColor: "rgba(15, 15, 15, 1)",
          },

          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {sum > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setCleanUp());
                    dispatch(setCity(""));
                    dispatch(setDistrict(""));
                    dispatch(setFilter(""));
                    dispatch(setSearch(""));
                    dispatch(setSpecialists(true));
                    dispatch(setSalons(true));
                  }}
                  style={{ marginRight: 15, padding: 5 }}
                >
                  <View style={{ height: 30, justifyContent: "center" }}>
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

                    <Text style={{ color: "#e5e5e5", fontWeight: "bold" }}>
                      {language?.language?.Main?.filter?.clear}
                    </Text>
                  </View>
                  {/* <Icon
                  name="delete"
                  type="MaterialIcons"
                  color="#e5e5e5"
                  size={18}
                /> */}
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="Search"
        component={Search}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Main?.filter?.search,
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
