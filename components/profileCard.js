import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../components/cacheableImage";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";

/**
 * Profile card component in cards screen
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Card = (props) => {
  // define navigation
  const navigation = props.navigation;

  // define language
  const language = Language();
  // define language state
  const lang = useSelector((state) => state.storeApp.language);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define loading
  const [loading, setLoading] = useState(false);

  // capitalize first letters function
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // capitalize and define user's type
  const t = capitalizeFirstLetter(props?.user.type);

  let type;
  if (props.user.type === "specialist") {
    if (lang === "en") {
      type = t;
    } else if (lang === "ka") {
      type = "სპეციალისტი";
    } else {
      type = language?.language?.Main?.feedCard?.specialist;
    }
  } else {
    type = language?.language?.Auth?.auth?.beautySalon;
  }

  /**
   * Define stars total
   */
  const [stars, setStars] = useState([]);

  async function GetStars() {
    await fetch(
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
      {loading ? (
        <View
          style={[styles.container, { borderColor: currentTheme.line }]}
        ></View>
      ) : (
        <View style={[styles.container, { borderColor: currentTheme.line }]}>
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
            {props.user.subscription.status === "active" && (
              <MaterialIcons name="verified" size={14} color="#F866B1" />
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("User", { user: props.user })}
          >
            <Animated.View styles={{ opacity: fadeAnim }}>
              {props.user.cover?.length > 0 ? (
                <View style={{ width: "100%", aspectRatio: 1 }}>
                  <CacheableImage
                    key={props.user?.cover}
                    style={{
                      width: "100%",
                      aspectRatio: 0.99,
                      resizeMode: "cover",
                      // borderRadius: 10,
                    }}
                    source={{
                      uri: props.user.cover,
                    }}
                    onLoad={() => setLoading(false)}
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
                    // borderWidth: 1,
                    borderColor: currentTheme.pink2,
                  }}
                >
                  <FontAwesome name="user" size={80} color="#e5e5e5" />
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
            }}
          >
            <Text style={[styles.username, { color: currentTheme.font }]}>
              {props.user.username ? props.user.username : type}
            </Text>
            {/* <Entypo name="dots-three-horizontal" style={styles.username} /> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: SCREEN_WIDTH / 2 - 20,
              paddingLeft: 15,
            }}
          >
            <MaterialCommunityIcons
              name="map-marker-radius-outline"
              color={currentTheme.pink}
              size={16}
            />
            <Text
              style={[styles.address, { color: currentTheme.font }]}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {props.user.address[0].city.replace("'", "")}
              {props.user.address[0].district &&
                " - " + props.user.address[0].district}
            </Text>
          </View>
          <View
            style={[
              styles.starsContainer,
              {
                justifyContent: "center",
                shadowColor: "#000",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: currentTheme.line,
                shadowOffset: {
                  width: 0,
                  height: 1, // negative value places shadow on top
                },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 1,
                backgroundColor: currentTheme.background2,
              },
            ]}
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
              <FontAwesome
                style={[
                  styles.stars,
                  { color: currentTheme.pink, fontSize: 15 },
                ]}
                name="star-o"
              />
              <Text style={[styles.stars, { color: currentTheme.font }]}>
                {stars}
              </Text>
            </View>
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
              <Feather
                style={[
                  styles.stars,
                  { color: currentTheme.font, fontSize: 14 },
                ]}
                name="users"
              />
              <Text style={[styles.stars, { color: currentTheme.font }]}>
                {props?.user?.followersLength}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH / 2 + 150,
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
    margin: 7.5,
    letterSpacing: 0.2,
  },
  name: {
    fontSize: 14,
    color: "#e5e5e5",
    fontWeight: "bold",
    margin: 12.5,
    marginRight: 5,
    letterSpacing: 0.2,
  },
  address: {
    fontSize: 12,
    color: "#e5e5e5",
    paddingLeft: 5,
    overflow: "hidden",
    paddingRight: 20,
    letterSpacing: 0.2,
  },
  starsContainer: {
    width: "90%",
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.2, // negative value places shadow on top
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // borderRadius: 50,
  },
  stars: {
    fontSize: 14,
    color: "#e5e5e5",
  },
});
