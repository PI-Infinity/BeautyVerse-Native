import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import { VerseCategories } from "../datas/categories";
import { ListItem, Icon, Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { setFilter, setSpecialists, setSalons } from "../redux/filter";
import { CheckBox } from "react-native-elements";
import { Cities } from "../components/cities";
import { Districts } from "../components/districts";
import { Search } from "../components/search";
import { Language } from "../context/language";
import { lightTheme, darkTheme } from "../context/theme";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { setCleanUp } from "../redux/rerenders";

export const Filter = ({ navigation }) => {
  const language = Language();
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.storeFilter.filter);
  const lang = useSelector((state) => state.storeApp.language);

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const specialists = useSelector((state) => state.storeFilter.specialists);
  const salons = useSelector((state) => state.storeFilter.salons);
  const city = useSelector((state) => state.storeFilter.city);
  const district = useSelector((state) => state.storeFilter.district);

  const [cities, setCities] = useState([]);

  const [openCities, setOpenCities] = useState(false);
  async function GetCities() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/cities`
    )
      .then((response) => response.json())
      .then((data) => {
        setCities([
          // `${language?.language.Main.filter.city}`,
          ...data.data.cities,
        ]);
      })
      .then(() => {})
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }

  useEffect(() => {
    GetCities();
  }, []);

  const [districts, setDistricts] = useState([]);

  async function GetDistricts() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/districts?city=${city}`
    )
      .then((response) => response.json())
      .then((data) => {
        setDistricts([
          // `${language?.language.Main.filter.district}`,
          ...data.data.districts,
        ]);
      })
      .then(() => {})
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }

  useEffect(() => {
    GetDistricts();
  }, [city]);

  return (
    <ScrollView
      contentContainerStyle={{ gap: 5, alignItems: "center", paddingTop: 10 }}
      showsVerticalScrollIndicator={false}
      x
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? undefined : false}
    >
      <Search navigation={navigation} currentTheme={currentTheme} />
      {VerseCategories?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 7.5,
              marginHorizontal: 10,
              borderWidth: 1.5,
              borderColor:
                filter === item.value
                  ? currentTheme.background2
                  : currentTheme.background2,
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
              <Icon
                name="done"
                type="MaterialIcons"
                color={currentTheme.pink}
                size={16}
              />
            )}
          </TouchableOpacity>
        );
      })}
      <View
        style={{
          height: 1,
          width: "90%",
          backgroundColor: currentTheme.pink,
          opacity: 0.2,
          marginTop: 10,
        }}
      ></View>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 30,
          paddingVertical: 10,
          paddingBottom: 15,
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
        }}
      >
        {!openCities && (
          <FontAwesome5 name="city" color={currentTheme.pink} size={14} />
        )}
        {openCities ? (
          <View>
            <Pressable onPress={() => setOpenCities(false)} style={{}}>
              <Icon
                name="close"
                type="MaterialIcons"
                color={currentTheme.font}
                size={20}
              />
            </Pressable>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: currentTheme.font,
              }}
            >
              {language?.language?.Main?.filter?.city}
            </Text>
            <Cities cities={cities} currentTheme={currentTheme} />
            {districts?.length > 0 && (
              <>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: currentTheme.font,
                  }}
                >
                  {language?.language?.Main?.filter?.district}
                </Text>
                <Districts districts={districts} currentTheme={currentTheme} />
              </>
            )}
          </View>
        ) : (
          <Pressable
            onPress={() => setOpenCities(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,

              width: "100%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: currentTheme.font,
              }}
            >
              {language?.language?.Main?.filter?.location}
            </Text>
          </Pressable>
        )}
      </View>
      <View
        style={{
          height: 1,
          width: "90%",
          backgroundColor: currentTheme.pink,
          opacity: 0.2,
        }}
      ></View>

      <View
        style={{
          width: "100%",
          marginTop: 0,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <CheckBox
          title={language?.language?.Main?.filter?.specialist}
          checked={specialists}
          onPress={() => {
            dispatch(setSpecialists(!specialists));
            dispatch(setCleanUp());
          }}
          containerStyle={[
            styles.checkboxContainer,
            { backgroundColor: "rgba(255,255,255,0.02)", width: "90%" },
          ]}
          textStyle={[
            styles.checkboxText,
            { color: currentTheme.font, fontWeight: "normal" },
          ]}
          checkedColor="#F866b1"
          checkedIcon={
            <Icon
              name="check-box" // Name of the checked icon
              color="#F866b1" // Color of the checked icon
              size={20} // Size of the checked icon
            />
          }
          uncheckedIcon={
            <Icon
              name="check-box-outline-blank" // Name of the unchecked icon
              color="#F866b1" // Color of the unchecked icon
              size={20} // Size of the unchecked icon
            />
          }
        />
        <CheckBox
          title={language?.language?.Main?.filter?.beautySalon}
          checked={salons}
          onPress={() => {
            dispatch(setSalons(!salons));
            dispatch(setCleanUp());
          }}
          containerStyle={[
            styles.checkboxContainer,
            { backgroundColor: "rgba(255,255,255,0.02)", width: "90%" },
          ]}
          textStyle={[
            styles.checkboxText,
            { color: currentTheme.font, fontWeight: "normal" },
          ]}
          checkedColor="#F866b1"
          checkedIcon={
            <Icon
              name="check-box" // Name of the checked icon
              color="#F866b1" // Color of the checked icon
              size={22} // Size of the checked icon
            />
          }
          uncheckedIcon={
            <Icon
              name="check-box-outline-blank" // Name of the unchecked icon
              color="#F866b1" // Color of the unchecked icon
              size={22} // Size of the unchecked icon
            />
          }
        />
      </View>
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
