import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../../context/theme";
import axios from "axios";
import { setScreenModal } from "../../../redux/app";
import { useRoute } from "@react-navigation/native";
import { Language } from "../../../context/language";

/**
 * Define statistics component in user screen
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Statistics = ({ navigation }) => {
  // dispatch
  const dispatch = useDispatch();
  // language
  const language = Language();
  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // route
  const route = useRoute();
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // define statistics state
  const [statistics, setStatistics] = useState([]);

  // get statistics from backend
  useEffect(() => {
    async function GetStats() {
      try {
        const response = await axios.get(
          backendUrl + `/api/v1/users/${currentUser?._id}/statistics`
        );
        setStatistics(response.data.data.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
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
          activeOpacity={0.8}
          onPress={() =>
            dispatch(
              setScreenModal({
                active: true,
                screen: "Charts",
                data: statistics,
              })
            )
          }
          style={{
            borderWidth: 1,
            borderColor: currentTheme.line,
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
            {language?.language?.User?.userPage?.statistics}
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
            { borderWidth: 1, borderColor: currentTheme.line },
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
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="eye" size={18} color={currentTheme.pink} />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Visitors: {statistics?.visitors?.daily}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="cards-variant"
              size={18}
              color={currentTheme.pink}
            />

            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Feeds: {statistics?.feeds?.daily}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="star-o" size={18} color={currentTheme.pink} />

            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Stars: {statistics?.stars?.daily}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="heart" size={18} color={currentTheme.pink} />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Followers: {statistics?.followers?.daily}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.sectionContainer,
            { borderWidth: 1, borderColor: currentTheme.line },
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

          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="eye" size={18} color={currentTheme.pink} />

            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Visitors: {statistics?.visitors?.monthly}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="cards-variant"
              size={18}
              color={currentTheme.pink}
            />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Feeds: {statistics?.feeds?.monthly}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="star-o" size={18} color={currentTheme.pink} />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Stars: {statistics?.stars?.monthly}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="heart" size={16} color={currentTheme.pink} />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Followers: {statistics?.followers?.monthly}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.sectionContainer,
            { borderWidth: 1, borderColor: currentTheme.line },
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

          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="eye" size={18} color={currentTheme.pink} />

            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Visitors: {statistics?.visitors?.yearly}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="cards-variant"
              size={18}
              color={currentTheme.pink}
            />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Feeds: {statistics?.feeds?.yearly}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="star-o" size={18} color={currentTheme.pink} />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Stars: {statistics?.stars?.yearly}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="heart" size={16} color={currentTheme.pink} />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Followers: {statistics?.followers?.yearly}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.sectionContainer,
            { borderWidth: 1, borderColor: currentTheme.line },
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

          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="cards-variant"
              size={18}
              color={currentTheme.pink}
            />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Feeds: {statistics?.feeds?.all}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="star-o" size={18} color={currentTheme.pink} />
            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Stars: {statistics?.stars?.all}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="heart" size={16} color={currentTheme.pink} />

            <Text
              style={[
                styles.itemTitle,
                { color: currentTheme.font, letterSpacing: 0.2 },
              ]}
            >
              Followers: {statistics?.followers?.all}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <FontAwesome name="heart" size={16} color={currentTheme.pink} />
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
