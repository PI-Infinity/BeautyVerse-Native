import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "../../../context/theme";
import { MaterialIcons } from "@expo/vector-icons";

const { height: hght, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Statistics = ({ navigation }) => {
  const [statistics, setStatistics] = useState([]);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  useEffect(() => {
    async function GetStats() {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/statistics`
      )
        .then((response) => response.json())
        .then((data) => {
          setStatistics(data.data.data);
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    }
    if (currentUser) {
      GetStats();
    }
  }, [currentUser?._id]);

  return (
    <>
      <View
        style={{
          marginTop: 20,
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Charts", {
              data: statistics,
            })
          }
          style={{
            backgroundColor: currentTheme.background2,
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="bar-chart" color="#F866B1" size={18} />
          <Text
            style={[
              styles.itemTitle,
              {
                color: currentTheme.font,
                fontWeight: "bold",
                letterSpacing: 0.2,
              },
            ]}
          >
            Charts
          </Text>
          <MaterialIcons
            name="arrow-right"
            color={currentTheme.font}
            size={18}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          gap: SCREEN_WIDTH / 20,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          marginVertical: 15,
          padding: 10,
        }}
      >
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: currentTheme.background2 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Today:
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Visitors: {statistics?.visitors?.daily}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Feeds: {statistics?.feeds?.daily}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Stars: {statistics?.stars?.daily}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Followers: {statistics?.followers?.daily}
          </Text>
        </View>
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: currentTheme.background2 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Last month:
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Visitors: {statistics?.visitors?.monthly}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Feeds: {statistics?.feeds?.monthly}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Stars: {statistics?.stars?.monthly}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Followers: {statistics?.followers?.monthly}
          </Text>
        </View>
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: currentTheme.background2 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Last year:
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Visitors: {statistics?.visitors?.yearly}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Feeds: {statistics?.feeds?.yearly}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Stars: {statistics?.stars?.yearly}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Followers: {statistics?.followers?.yearly}
          </Text>
        </View>
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: currentTheme.background2 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            All time:
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Feeds: {statistics?.feeds?.all}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Stars: {statistics?.stars?.all}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Followers: {statistics?.followers?.all}
          </Text>
          <Text
            style={[
              styles.itemTitle,
              { color: currentTheme.font, letterSpacing: 0.2 },
            ]}
          >
            Followings: {statistics?.followings?.all}
          </Text>
        </View>
      </View>
    </>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  sectionContainer: {
    width: "45%",
    padding: "5%",
    borderRadius: 20,
    gap: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
  },
  itemTitle: {
    fontWeight: "normal",
  },
});
