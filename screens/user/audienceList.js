import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  Vibration,
} from "react-native";
import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

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
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const DeleteUser = async (followerId, followingId) => {
    //
    try {
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${followerId}/followings/${followingId}`;
      await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
      const url2 = `https://beautyverse.herokuapp.com/api/v1/users/${followingId}/followers/${followerId}`;
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
    <View style={{ width: "100%" }}>
      {list?.map((item, index) => {
        const t = capitalizeFirstLetter(item.type);
        return (
          <Pressable
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.03)",
              width: (SCREEN_WIDTH / 100) * 80,
              padding: 10,
              paddingHorizontal: 15,
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
              <CacheableImage
                source={{ uri: item.cover }}
                style={{ width: 40, height: 40, borderRadius: 50 }}
                manipulationOptions={[
                  { resize: { width: 40, height: 40 } },
                  { rotate: 90 },
                ]}
              />

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
                  color: "#e5e5e5",
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
