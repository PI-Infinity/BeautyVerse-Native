import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  Fontisto,
} from "@expo/vector-icons";
import React, { useEffect, useState, useContext } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Cities } from "../components/cities";
import { Districts } from "../components/districts";
import { Search } from "../components/search";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { VerseCategories } from "../datas/categories";
import {
  setFilter,
  setSalons,
  setShops,
  setSpecialists,
} from "../redux/filter";
import { setCleanUp } from "../redux/rerenders";
import { MapFilter } from "../components/mapFilter";
import axios from "axios";

/**
 * FILTER SCREEN component
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Filter = ({ navigation }) => {
  // define some context
  const language = Language();
  const dispatch = useDispatch();

  // define theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define language
  const lang = useSelector((state) => state.storeApp.language);

  // define location
  const location = useSelector((state) => state.storeApp.location);

  // Selectors for various filters
  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);
  const specialists = useSelector((state) => state.storeFilter.specialists);
  const salons = useSelector((state) => state.storeFilter.salons);
  const shops = useSelector((state) => state.storeFilter.shops);
  const city = useSelector((state) => state.storeFilter.city);
  const district = useSelector((state) => state.storeFilter.district);

  // define active cities in BeautyVerse
  const [cities, setCities] = useState([]);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // open cities state
  const [openCities, setOpenCities] = useState(false);

  // get cities from db function
  async function GetCities() {
    await fetch(
      `${backendUrl}/api/v1/cities?country=${
        location.country ? location.country : currentUser.address[0].country
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setCities([...data.data.cities]);
      })
      .then(() => {})
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }

  useEffect(() => {
    GetCities();
  }, [currentUser, location]);

  // define BeautyVerse's active districts by city

  const [districts, setDistricts] = useState([]);

  async function GetDistricts() {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/districts?city=${city}`
      );
      setDistricts([...response.data.data.districts]);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    GetDistricts();
  }, [city]);

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines users states
  const [users, setUsers] = useState([]);
  const [usersLength, setUsersLength] = useState(null);

  const [page, setPage] = useState(1);
  // Selector for the cleanup state
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  /**
   * Get users function when screen loads
   */
  useEffect(() => {
    // Function to get feed data from server
    const Getting = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/cards?search=${search}&filter=${filter}&type=${
            specialists ? "specialist" : ""
          }${salons ? "beautycenter" : ""}${
            shops ? "shop" : ""
          }&city=${city}&district=${district}&page=1&country=${
            location.country ? location.country : currentUser.address[0].country
          }`
        );
        setUsersLength(response.data.cardsResult);
        setUsers(response.data.data.cards);
        setPage(1);
      } catch (error) {
        console.log(error.response.data.message);
        setPage(1);
      }
    };
    Getting();
  }, [search, filter, specialists, salons, city, district, cleanUp]);

  // add feeds

  /**
   * Function to get new users with feeds and adding them in user state while user scrolling to bottom
   *  */

  const AddUsersWithFeeds = async (currentPage) => {
    setPage(currentPage);
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/cards?search=${search}&filter=${filter}&type=${
          specialists ? "specialist" : ""
        }${salons ? "beautycenter" : ""}${
          shops ? "shop" : ""
        }&city=${city}&district=${district}&check=${
          currentUser !== null ? currentUser._id : ""
        }}&page=${currentPage}&country=${
          location.country ? location.country : currentUser.address[0].country
        }`
      );
      // Update users' state with new feed data
      setUsers((prev) => {
        const newUsers = response.data.data.cards;
        return newUsers.reduce((acc, curr) => {
          const existingUserIndex = acc.findIndex(
            (user) => user._id === curr._id
          );
          if (existingUserIndex !== -1) {
            // User already exists, merge the data
            const mergedUser = { ...acc[existingUserIndex], ...curr };
            return [
              ...acc.slice(0, existingUserIndex),
              mergedUser,
              ...acc.slice(existingUserIndex + 1),
            ];
          } else {
            // User doesn't exist, add to the end of the array
            return [...acc, curr];
          }
        }, prev);
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
    // dispatch(setFeedRefreshControl(false));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 5,
        alignItems: "center",
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      scrollEnabled={!openCities ? true : false}
    >
      <View style={{ marginBottom: 5, width: "100%" }}>
        <Search navigation={navigation} currentTheme={currentTheme} />
      </View>
      <View
        style={{
          width: "100%",
          height: SCREEN_HEIGHT / 2,
          // margin: 10,
          overflow: "hidden",
        }}
      >
        {!openCities && (
          <View
            style={{
              width: "10%",
              alignItems: "center",
              position: "absolute",
              bottom: 15,
              right: 8,
              zIndex: 100000,
              gap: 10,
            }}
          >
            <Pressable
              onPress={() => {
                dispatch(setSpecialists(!specialists));
                dispatch(setCleanUp());
              }}
              style={{
                backgroundColor: currentTheme.background,

                borderRadius: 50,
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="face-woman-profile"
                size={18}
                color={specialists ? currentTheme.pink : "#ccc"}
                style={{ position: "relative", left: 1 }}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                dispatch(setSalons(!salons));
                dispatch(setCleanUp());
              }}
              style={{
                backgroundColor: currentTheme.background,

                borderRadius: 50,
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="home-variant-outline"
                size={20}
                color={salons ? currentTheme.pink : "#ccc"}
                style={{ position: "relative", left: 0.5 }}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                dispatch(setShops(!shops));
                dispatch(setCleanUp());
              }}
              style={{
                backgroundColor: currentTheme.background,

                borderRadius: 50,
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Fontisto
                name="shopping-bag-1"
                size={15}
                color={shops ? currentTheme.pink : "#ccc"}
                style={{ position: "relative", left: 0.5 }}
              />
            </Pressable>
            {!openCities && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={
                  usersLength > users?.length
                    ? () => AddUsersWithFeeds(page + 1)
                    : undefined
                }
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: currentTheme.background,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color:
                      usersLength > users?.length
                        ? currentTheme.pink
                        : currentTheme.disabled,
                  }}
                >
                  {usersLength > users?.length ? "+5" : "+0"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <MapFilter users={users} />
        <Pressable
          onPress={() => setOpenCities(!openCities)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: currentTheme.background,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 50,

            position: "absolute",
            bottom: 8,
            left: 8,
          }}
        >
          <FontAwesome5 name="city" color={currentTheme.pink} size={12} />
          <View>
            {currentUser.address.find(
              (c) =>
                c?.city.replace("'", "").toLowerCase() === city?.toLowerCase()
            ) && district === "" ? null : (
              <View
                style={{
                  width: "auto",
                  minWidth: 15,
                  height: 15,
                  backgroundColor: currentTheme.pink,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  zIndex: 2,
                  right: -15,
                  top: -3,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 10,
                    letterSpacing: 0.3,
                  }}
                >
                  {city === "" ||
                  (currentUser.address.some(
                    (c) => c?.city.replace("'", "") === city
                  ) &&
                    district === "")
                    ? 0
                    : currentUser.address.some(
                        (c) => c?.city.replace("'", "") === city
                      ) && district !== ""
                    ? 1
                    : city !== "" && district === ""
                    ? 1
                    : city === "" && district !== ""
                    ? 1
                    : 2}
                </Text>
              </View>
            )}

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
                color: currentTheme.font,
              }}
            >
              {city ? city : "Location"}
            </Text>
          </View>

          <MaterialIcons
            name={openCities ? "arrow-drop-down" : "arrow-drop-up"}
            color={currentTheme.font}
            size={20}
          />
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openCities}
          onRequestClose={() => {
            setOpenCities(!openCities);
          }}
        >
          <View
            style={{
              width: "100%",
              height: SCREEN_HEIGHT,
              gap: 10,
              backgroundColor: "rgba(0,0,0,1)",
              paddingTop: 80,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View style={{ marginTop: 20 }}>
                  {districts?.length > 0 && (
                    <>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          color: currentTheme.font,
                          letterSpacing: 0.3,
                        }}
                      >
                        {language?.language?.Main?.filter?.district}
                      </Text>
                      <Districts
                        districts={districts}
                        currentTheme={currentTheme}
                      />
                    </>
                  )}
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: currentTheme.font,
                      letterSpacing: 0.3,
                    }}
                  >
                    {language?.language?.Main?.filter?.city}
                  </Text>
                  <Cities cities={cities} currentTheme={currentTheme} />
                </View>
              </View>
            </ScrollView>
            <View
              style={{ width: SCREEN_WIDTH, alignItems: "center", height: 100 }}
            >
              <TouchableOpacity
                onPress={() => setOpenCities(false)}
                style={{
                  zIndex: 99999,
                }}
              >
                <MaterialIcons
                  name="arrow-drop-down"
                  color={currentTheme.pink}
                  size={40}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <Text
        style={{
          color: currentTheme.font,
          fontWeight: "bold",
          letterSpacing: 0.3,
          marginVertical: 10,
        }}
      >
        Categories
      </Text>
      {VerseCategories?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 7.5,
              paddingLeft: 20,
              marginHorizontal: 10,

              borderWidth: 1,
              borderLeftWidth: 1,
              borderColor: currentTheme.line,
              width: "95%",
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",

              // borderColor: "rgba(255,255,255,0.05)",
            }}
            onPress={() => {
              dispatch(setFilter(item.value));
              dispatch(setCleanUp());
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 0, alignItems: "center" }}
            >
              {/* {item.icon} */}
              <Text
                style={{
                  letterSpacing: 0.3,
                  color:
                    filter === item.value
                      ? currentTheme.pink
                      : currentTheme.font,
                  // fontWeight: "bold",
                }}
              >
                {lang === "en" ? item.eng : lang === "ka" ? item.geo : item.rus}
              </Text>
            </View>
            {filter === item.value && (
              <MaterialIcons name="done" color={currentTheme.pink} size={16} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  checkboxContainer: {
    backgroundColor: "#111",
    borderWidth: 0,
    borderRadius: 5,
  },
  checkboxText: {
    color: "#fff",
  },
});
