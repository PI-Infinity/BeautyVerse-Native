import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Collapsible from "react-native-collapsible";
import { AudienceList } from "../../screens/user/audienceList";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CacheableImage } from "../../components/cacheableImage";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Audience = ({
  targetUser,
  navigation,
  renderCheck,
  setRenderCheck,
}) => {
  const [loading, setLoading] = React.useState(true);

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const [openFollowers, setOpenFollowers] = useState(true);
  const [openFollowings, setOpenFollowings] = useState(true);

  const [render, setRender] = useState(false);

  useEffect(() => {
    async function GetAudience(userId) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followings`
      )
        .then((response) => response.json())
        .then((data) => {
          setFollowings({
            length: data.data?.followings?.length,
            list: data.data?.followings,
          });
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    }
    if (targetUser?._id) {
      GetAudience();
    }
  }, [targetUser?._id, render]);
  useEffect(() => {
    async function GetAudience(userId) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers`
      )
        .then((response) => response.json())
        .then((data) => {
          setFollowers({
            length: data?.data?.followers?.length,
            list: data.data?.followers,
          });
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    }
    if (targetUser?._id) {
      GetAudience();
    }
  }, [targetUser?._id, render]);

  setTimeout(() => {
    setLoading(false);
  }, 400);

  return (
    <View>
      {loading ? (
        <View
          style={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: SCREEN_HEIGHT / 1.5,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: "center", gap: 5, marginTop: 30 }}>
          <Pressable
            style={{
              padding: 10,
              paddingVertical: 10,
              width: "80%",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
              alignItems: "center",
              flexDirection: "row",
              gap: 20,
            }}
            onPress={() => setOpenFollowers(!openFollowers)}
          >
            <Text style={{ color: "#e5e5e5" }}>
              Followers ({followers?.length})
            </Text>
            <View>
              {followers.list?.map((item, index) => {
                if (index < 3) {
                  return (
                    <CacheableImage
                      key={index}
                      source={{ uri: item?.followerCover }}
                      style={{ width: 40, height: 40, borderRadius: 50 }}
                      manipulationOptions={[
                        { resize: { width: 40, height: 40 } },
                        { rotate: 90 },
                      ]}
                    />
                  );
                }
              })}
            </View>
            <Text style={{ color: "#e5e5e5" }}>
              {"+" + followers.length > 3 && followers.length - 3}
            </Text>
            <MaterialIcons
              name={openFollowers ? "arrow-drop-up" : "arrow-drop-down"}
              color="#fff"
              size={18}
              style={{ marginLeft: "auto" }}
            />
          </Pressable>
          <Collapsible collapsed={openFollowers}>
            <AudienceList
              list={followers?.list}
              targetUser={targetUser}
              navigation={navigation}
              type="followers"
              render={render}
              setRender={setRender}
              renderCheck={renderCheck}
              setRenderCheck={setRenderCheck}
            />
          </Collapsible>
          <Pressable
            style={{
              padding: 10,
              paddingVertical: 10,
              width: "80%",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
              alignItems: "center",
              flexDirection: "row",
              gap: 20,
            }}
            onPress={() => setOpenFollowings(!openFollowings)}
          >
            <Text style={{ color: "#e5e5e5" }}>
              Followings ({followings?.length})
            </Text>
            <View>
              {followings.list?.map((item, index) => {
                if (index < 4) {
                  return (
                    <CacheableImage
                      key={index}
                      source={{ uri: item?.followingCover }}
                      style={{ width: 40, height: 40, borderRadius: 50 }}
                      manipulationOptions={[
                        { resize: { width: 40, height: 40 } },
                        { rotate: 90 },
                      ]}
                    />
                  );
                }
              })}
            </View>
            <Text style={{ color: "#e5e5e5" }}>
              {"+" + followings.length > 3 && followings.length - 3}
            </Text>
            <MaterialIcons
              name={openFollowings ? "arrow-drop-up" : "arrow-drop-down"}
              color="#fff"
              size={18}
              style={{ marginLeft: "auto" }}
            />
          </Pressable>
          <Collapsible collapsed={openFollowings}>
            <AudienceList
              list={followings?.list}
              targetUser={targetUser}
              navigation={navigation}
              type="followings"
              render={render}
              setRender={setRender}
              renderCheck={renderCheck}
              setRenderCheck={setRenderCheck}
            />
          </Collapsible>
        </View>
      )}
    </View>
  );
};
