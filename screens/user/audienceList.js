import React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { CacheableImage } from "../../components/cacheableImage";
import { FontAwesome } from "@expo/vector-icons";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector } from "react-redux";

/**
 * Audience list component in user screen audience section
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const AudienceList = ({
  list,
  targetUser,
  navigation,
  type,
  setRender,
  render,
  renderCheck,
  setRenderCheck,
}) => {
  // function capitalizes first letter
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);

  // define current user
  const currentTheme = theme ? darkTheme : lightTheme;

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Unfollow user
   */

  const DeleteUser = async (followerId, followingId) => {
    //
    try {
      const url = `${backendUrl}/api/v1/users/${followerId}/followings/${followingId}`;
      await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
      const url2 = `${backendUrl}/api/v1/users/${followingId}/followers/${followerId}`;
      await fetch(url2, { method: "DELETE" })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log("Error fetching data:", error);
        });

      // const data = await response.data;
    } catch (error) {
      console.error(error);
    }
    setRender(!render);
    setRenderCheck(!renderCheck);
  };

  return (
    <View style={{ width: "100%", gap: 8 }}>
      {list?.map((item, index) => {
        const t = capitalizeFirstLetter(item.type);
        return (
          <Pressable
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: currentTheme.line,
              width: (SCREEN_WIDTH / 100) * 80,
              padding: 8,
            }}
            onPress={() => navigation.navigate("UserVisit", { user: item })}
            onLongPress={
              type === "followers"
                ? () => {
                    Vibration.vibrate();
                    DeleteUser(item._id, targetUser._id);
                  }
                : () => {
                    Vibration.vibrate();
                    DeleteUser(targetUser._id, item._id);
                  }
            }
            delayLongPress={300}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              {item?.cover ? (
                <View>
                  {item.online && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: "#3bd16f",
                        borderRadius: 50,
                        position: "absolute",
                        zIndex: 100,
                        right: 1,
                        bottom: 1,
                        borderWidth: 1.5,
                        borderColor: currentTheme.background,
                      }}
                    ></View>
                  )}
                  <CacheableImage
                    source={{ uri: item.cover }}
                    style={{ width: 40, height: 40, borderRadius: 50 }}
                    manipulationOptions={[
                      { resize: { width: 40, height: 40 } },
                      { rotate: 90 },
                    ]}
                  />
                </View>
              ) : (
                <View>
                  {item.online && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: "#3bd16f",
                        borderRadius: 50,
                        position: "absolute",
                        zIndex: 100,
                        right: 1,
                        bottom: 1,
                        borderWidth: 1.5,
                        borderColor: currentTheme.background,
                      }}
                    ></View>
                  )}
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      backgroundColor: currentTheme.disabled,
                      borderRadius: 50,
                    }}
                  >
                    <FontAwesome
                      name="user"
                      size={22}
                      color={currentTheme.font}
                    />
                  </View>
                </View>
              )}

              <Text
                style={{
                  color: "#e5e5e5",
                  fontWeight: "bold",
                  letterSpacing: 0.2,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  color: currentTheme.disabled,
                  fontWeight: "normal",
                  fontSize: 12,
                  letterSpacing: 0.2,
                }}
              >
                {t}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({});
