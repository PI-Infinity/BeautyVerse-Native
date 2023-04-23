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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Card = (props) => {
  const navigation = props.navigation;
  const language = Language();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

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
      {loading && props.x === 0 && (
        <View
          style={{
            gap: 5,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            backgroundColor: "rgba(15, 15, 15, 0.2)",
            flex: 1,
            padding: 0,
            zIndex: 10000,
            justifyContent: "start",
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
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={styles.username}>
            {props.user.username ? props.user.username : type}
          </Text>
          {/* <Entypo name="dots-three-horizontal" style={styles.username} /> */}
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("User", { user: props.user })}
        >
          <Animated.View styles={{ opacity: fadeAnim }}>
            <CacheableImage
              style={{
                width: "100%",
                aspectRatio: 1,
                resizeMode: "cover",
              }}
              source={{
                uri: props.user.cover,
              }}
              onError={() => console.log("Error loading image")}
              manipulationOptions={[
                { resize: { width: "100%", aspectRatio: 1 } },
                { rotate: 90 },
              ]}
            />
          </Animated.View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingLeft: 5,
          }}
        >
          <Text style={styles.name}>{props.user.name}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            width: "100%",
            paddingLeft: 15,
          }}
        >
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            color="#e5e5e5"
            size={16}
          />
          <Text style={styles.address} numberOfLines={1} ellipsizeMode={"tail"}>
            {props.user.address[0].city}
            {props.user.address[0].distruct}
            {props.user.address[0].district &&
              " - " + props.user.address[0].street}
          </Text>
        </View>
        <View style={styles.starsContainer}>
          <View
            style={{
              gap: 5,
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: 5,
              borderRadius: 3,
            }}
          >
            <Icon
              style={[styles.stars, { color: "#bb3394", fontSize: 18 }]}
              name="star-o"
            />
            <Text style={styles.stars}>{stars}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    height: 330,
    // backgroundColor: "rgba(255,255,255,0.01)",
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.01)",
    borderWidth: 1,
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
  },
  address: {
    fontSize: 12,
    color: "#e5e5e5",
    paddingLeft: 5,
    overflow: "hidden",
    paddingRight: 20,
  },
  starsContainer: {
    width: "100%",
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "start",
    gap: 5,
    paddingLeft: 15,
  },
  stars: {
    fontSize: 14,
    color: "#e5e5e5",
  },
});
