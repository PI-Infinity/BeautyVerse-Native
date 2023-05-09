import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Skeleton } from "@rneui/themed";
import GetTimesAgo from "../functions/getTimesAgo";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Language } from "../context/language";
import { CacheableImage } from "../components/cacheableImage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { lightTheme, darkTheme } from "../context/theme";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Card = (props) => {
  const navigation = props.navigation;
  const language = Language();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [loading, setLoading] = useState(false);

  const lang = useSelector((state) => state.storeApp.language);

  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // capitalize first letters

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const t = capitalizeFirstLetter(props?.user.type);
  let type;
  if (lang === "en") {
    type = t;
  } else if (lang === "ka") {
    type = "სპეციალისტი";
  } else {
    type = language?.language?.Main?.feedCard?.specialist;
  }
  /**
   * Define start total
   */
  const [stars, setStars] = useState([]);

  async function GetStars() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/stars`
    )
      .then((response) => response.json())
      .then(async (data) => {
        setStars(data.data.stars);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }

  useEffect(() => {
    GetStars();
  }, []);

  // fade in

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <>
      {Platform.OS === "ios" && loading && props.x === 0 && (
        <View
          style={{
            gap: 5,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            backgroundColor: currentTheme.background2,
            flex: 1,
            padding: 0,
            zIndex: 10000,
            gap: 10,
          }}
        >
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <View key={index} style={{ gap: 10, opacity: 0.1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingLeft: 10,
                    height: 60,
                  }}
                >
                  <Skeleton circle width={40} height={40} animation="pulse" />
                  <View style={{ gap: 10 }}>
                    <Skeleton width={120} height={10} animation="pulse" />
                    <Skeleton width={90} height={7} animation="pulse" />
                  </View>
                </View>
                <View>
                  <Skeleton
                    width={SCREEN_WIDTH}
                    height={100}
                    animation="pulse"
                  />
                </View>
                <View style={{ width: SCREEN_WIDTH, alignItems: "center" }}>
                  <Skeleton
                    width={SCREEN_WIDTH - 40}
                    height={10}
                    animation="pulse"
                  />
                </View>
              </View>
            ))}
        </View>
      )}
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={[styles.username, { color: currentTheme.font }]}>
            {props.user.username ? props.user.username : type}
          </Text>
          {/* <Entypo name="dots-three-horizontal" style={styles.username} /> */}
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("User", { user: props.user })}
        >
          <Animated.View styles={{ opacity: fadeAnim }}>
            {props.user.cover?.length > 0 ? (
              <View style={{ width: "100%", aspectRatio: 1 }}>
                <CacheableImage
                  style={{
                    width: "100%",
                    aspectRatio: 0.99,
                    resizeMode: "cover",
                    // borderRadius: 10,
                  }}
                  source={{
                    uri: props.user.cover,
                  }}
                  onError={() => console.log("Error loading image")}
                />
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: currentTheme.pink2,
                }}
              >
                <Icon name="user" size={80} color="#e5e5e5" />
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingLeft: 5,
            backgroundColor: currentTheme.background,
            gap: 0,
          }}
        >
          <Text style={[styles.name, { color: currentTheme.font }]}>
            {props.user.name}
          </Text>
          <MaterialIcons name="verified" size={14} color="#F866B1" />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingLeft: 15,
          }}
        >
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            color={currentTheme.font}
            size={16}
          />
          <Text
            style={[styles.address, { color: currentTheme.font }]}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {props.user.address[0].city.replace("'", "")}
            {props.user.address[0].distruct}
            {props.user.address[0].district &&
              " - " + props.user.address[0].street}
          </Text>
        </View>
        <LinearGradient
          colors={[
            "rgba(248, 102, 177, 0.9)",
            "rgba(248, 102, 177, 0.8)",
            "rgba(248, 102, 177, 0.7)",
            "rgba(248, 102, 177, 0.6)",
            "rgba(248, 102, 177, 0.5)",
            "rgba(248, 102, 177, 0.4)",
            "rgba(248, 102, 177, 0.3)",
            "rgba(248, 102, 177, 0.2)",
            "rgba(248, 102, 177, 0.1)",
            "rgba(248, 102, 177, 0.02)",
            "rgba(248, 102, 177, 0)",
          ]}
          style={styles.starsContainer}
          start={[0.0, 0.0]}
          end={[1.0, 1.0]}
        >
          <View
            style={{
              gap: 5,
              alignItems: "center",
              flexDirection: "row",
              // backgroundColor: currentTheme.background2,
              padding: 5,
              borderRadius: 3,
            }}
          >
            <Icon
              style={[styles.stars, { color: "yellow", fontSize: 16 }]}
              name="star-o"
            />
            <Text style={[styles.stars, { color: currentTheme.font }]}>
              {stars}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
    height: 365,
    // backgroundColor: "rgba(255,255,255,0.01)",
    // margin: 5,
    // borderRadius: 5,
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.05)",
    borderWidth: 0.5,
    gap: 2.5,
  },
  username: {
    fontSize: 14,
    color: "#e5e5e5",
    fontWeight: "bold",
    margin: 12.5,
  },
  name: {
    fontSize: 14,
    color: "#e5e5e5",
    fontWeight: "bold",
    margin: 10,
    marginRight: 5,
  },
  address: {
    fontSize: 12,
    color: "#e5e5e5",
    paddingLeft: 5,
    overflow: "hidden",
    paddingRight: 20,
  },
  starsContainer: {
    width: "90%",
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,

    borderRadius: 50,
  },
  stars: {
    fontSize: 14,
    color: "#e5e5e5",
  },
});
