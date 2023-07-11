import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import {
  setCity,
  setDistrict,
  setFilter,
  setFilterBadgeSum,
  setSalons,
  setSearch,
  setSpecialists,
} from "../redux/filter";
import { setCleanUp } from "../redux/rerenders";
import { Filter } from "../screens/filter";
import { Search } from "../screens/search";

/* 
  Create filter stack navigator
*/

const Stack = createStackNavigator();

export function FilterStack() {
  // redux toolkit dispatch
  const dispatch = useDispatch();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // language context
  const language = Language();

  // define active filter's length
  const filter = useSelector((state) => state.storeFilter.filter);
  let filterBadge;
  if (filter !== "") {
    filterBadge = 1;
  } else {
    filterBadge = 0;
  }
  // search state
  const search = useSelector((state) => state.storeFilter.search);
  let searchBadge;
  if (search !== "") {
    searchBadge = 1;
  } else {
    searchBadge = 0;
  }
  // city state
  const city = useSelector((state) => state.storeFilter.city);
  let cityBadge;
  if (city !== "") {
    cityBadge = 1;
  } else {
    cityBadge = 0;
  }
  // district state
  const district = useSelector((state) => state.storeFilter.district);
  let districtBadge;
  if (district !== "") {
    districtBadge = 1;
  } else {
    districtBadge = 0;
  }
  // specialist state
  const specialist = useSelector((state) => state.storeFilter.specialists);
  let specialistBadge;
  if (!specialist) {
    specialistBadge = 1;
  } else {
    specialistBadge = 0;
  }
  // salon state
  const object = useSelector((state) => state.storeFilter.salons);
  let objectBadge;
  if (!object) {
    objectBadge = 1;
  } else {
    objectBadge = 0;
  }
  // total of active variants of filter and creating total of badge
  const sum =
    filterBadge +
    cityBadge +
    districtBadge +
    specialistBadge +
    objectBadge +
    searchBadge;
  // set badge to redux for getting in different component easily (in bottom tab filter icon gettings badge sum)
  useEffect(() => {
    dispatch(setFilterBadgeSum(sum));
  }, [sum]);

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
        cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
      }}
    >
      {/** filter screen */}
      <Stack.Screen
        name="Filter"
        component={Filter}
        options={{
          title: language?.language?.Main?.filter?.filter,
          headerStyle: {
            backgroundColor: currentTheme.background,
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
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {sum > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    // on press can be clean filter and getting starting position, also with clean() function clear imports as default
                    dispatch(setCity(""));
                    dispatch(setDistrict(""));
                    dispatch(setFilter(""));
                    dispatch(setSearch(""));
                    dispatch(setSpecialists(true));
                    dispatch(setSalons(true));
                    dispatch(setCleanUp());
                  }}
                  style={{ marginRight: 15, padding: 5 }}
                >
                  <View style={{ height: 30, justifyContent: "center" }}>
                    <View
                      style={{
                        width: "auto",
                        minWidth: 13,
                        height: 13,
                        backgroundColor: currentTheme.pink,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        zIndex: 2,
                        right: -5,
                        top: 0,
                      }}
                    >
                      <Text
                        style={{
                          color: "#e5e5e5",
                          fontSize: 10,
                          letterSpacing: 1.5,
                        }}
                      >
                        {sum}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: currentTheme.font,
                        fontWeight: "bold",
                        letterSpacing: 0.3,
                      }}
                    >
                      {language?.language?.Main?.filter?.clear}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />
      {/** search screen */}
      <Stack.Screen
        name="Search"
        component={Search}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          title: language?.language?.Main?.filter?.search,
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
    </Stack.Navigator>
  );
}
