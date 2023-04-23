import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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

export const Filter = ({ navigation }) => {
  const language = Language();
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.storeFilter.filter);
  const lang = useSelector((state) => state.storeApp.language);

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
    <ScrollView contentContainerStyle={{ gap: 7.5, alignItems: "center" }}>
      <Search navigation={navigation} />
      {VerseCategories?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 7.5,
              backgroundColor: "rgba(255,255,255,0.02)",
              width: "90%",
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => dispatch(setFilter(item.value))}
          >
            <Text style={{ color: "#e5e5e5" }}>
              {lang === "en" ? item.eng : lang === "ka" ? item.geo : item.rus}
            </Text>
            {filter === item.value && (
              <Icon name="done" type="MaterialIcons" color="green" size={16} />
            )}
          </TouchableOpacity>
        );
      })}

      <View
        style={{ width: "100%", paddingHorizontal: 30, paddingVertical: 20 }}
      >
        {openCities ? (
          <View>
            <Pressable onPress={() => setOpenCities(false)} style={{}}>
              <Icon
                name="close"
                type="MaterialIcons"
                color="#e5e5e5"
                size={20}
              />
            </Pressable>
            <Text
              style={{ fontWeight: "bold", fontSize: 18, color: "#e5e5e5" }}
            >
              {language?.language?.Main?.filter?.city}
            </Text>
            <Cities cities={cities} />
            {districts?.length > 0 && (
              <>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "#e5e5e5" }}
                >
                  {language?.language?.Main?.filter?.district}
                </Text>
                <Districts districts={districts} />
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
              style={{ fontWeight: "bold", fontSize: 18, color: "#e5e5e5" }}
            >
              {language?.language?.Main?.filter?.location}
            </Text>

            <Icon name="list" type="MaterialIcons" color="#e5e5e5" size={20} />
          </Pressable>
        )}
      </View>
      <View style={{ width: "90%", marginTop: 0, marginBottom: 20 }}>
        <CheckBox
          title={language?.language?.Main?.filter?.specialist}
          checked={specialists}
          onPress={() => dispatch(setSpecialists(!specialists))}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxText}
        />
        <CheckBox
          title={language?.language?.Main?.filter?.beautySalon}
          checked={salons}
          onPress={() => dispatch(setSalons(!salons))}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxText}
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
