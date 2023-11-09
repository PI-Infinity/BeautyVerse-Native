import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { darkTheme, lightTheme } from "../../../context/theme";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setCity,
  setDistrict,
  setFilter,
  setFilterBadgeSum,
  setSalons,
  setSearch,
  setSearchInput,
  setShops,
  setSpecialists,
} from "../../../redux/filter";
import { setLocation } from "../../../redux/app";
import { Language } from "../../../context/language";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Header = ({ title, onBack, subScreen, clearBtn }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const language = Language();
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define user location
  const location = useSelector((state) => state.storeApp.location);

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
  if (
    currentUser.address.find(
      (c) => c?.city.replace("'", "").toLowerCase() === city?.toLowerCase()
    )
  ) {
    cityBadge = 0;
  } else {
    cityBadge = 1;
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
  // salon state
  const shop = useSelector((state) => state.storeFilter.shops);
  let shopBadge;
  if (!shop) {
    shopBadge = 1;
  } else {
    shopBadge = 0;
  }
  // total of active variants of filter and creating total of badge
  const sum =
    filterBadge +
    cityBadge +
    districtBadge +
    specialistBadge +
    objectBadge +
    shopBadge +
    searchBadge;
  // set badge to redux for getting in different component easily (in bottom tab filter icon gettings badge sum)
  useEffect(() => {
    dispatch(setFilterBadgeSum(sum));
  }, [sum]);
  return (
    <View
      style={{
        height: 50,
        width: SCREEN_WIDTH,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: !theme ? currentTheme.background : "rgba(0,0,0,0.5)",
      }}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onBack}>
        <MaterialIcons name="arrow-left" color={currentTheme.pink} size={40} />
      </TouchableOpacity>
      <Text
        style={{
          color: currentTheme.font,
          fontWeight: "bold",
          fontSize: 18,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      <View style={{ width: 22, height: "100%", justifyContent: "center" }}>
        {subScreen && (
          <Pressable onPress={subScreen?.onPress}>{subScreen?.icon}</Pressable>
        )}
        {clearBtn && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {sum > 0 && (
              <TouchableOpacity
                onPress={() => {
                  // on press can be clean filter and getting starting position, also with clean() function clear imports as default
                  dispatch(
                    setCity(
                      (
                        currentUser?.address?.find(
                          (a) =>
                            a.city?.toLowerCase()?.replace("'", "") ===
                            location.city
                        )?.city || currentUser.address[0]?.city
                      )?.replace("'", "")
                    )
                  );
                  dispatch(setDistrict(""));
                  dispatch(setFilter(""));
                  dispatch(setSearch(""));
                  dispatch(setSpecialists(true));
                  dispatch(setSalons(true));
                  dispatch(setShops(true));
                  dispatch(setSearchInput(""));
                  dispatch(
                    setLocation({
                      country: currentUser.address[0].country,
                      city: currentUser.address[0]?.city?.replace("'", ""),
                      latitude: currentUser.address[0]?.latitude,
                      longitude: currentUser.address[0]?.longitude,
                    })
                  );
                }}
                style={{ padding: 5 }}
              >
                <View
                  style={{
                    position: "absolute",
                    right: 5,
                    top: -5,
                  }}
                >
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
                      right: -5,
                      top: -5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#e5e5e5",
                        fontSize: 10,
                        letterSpacing: 1.5,
                        position: "relative",
                        left: 1,
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
