import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import { darkTheme, lightTheme } from "../../context/theme";
import { AudienceList } from "../../screens/user/audienceList";
import { Language } from "../../context/language";

/**
 * audience component in user screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Audience = ({
  targetUser,
  navigation,
  renderCheck,
  setRenderCheck,
}) => {
  // defines language
  const language = Language();
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);

  // define current user
  const currentTheme = theme ? darkTheme : lightTheme;

  // define loading state
  const [loading, setLoading] = React.useState(true);

  // define followers and followings states
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  // define open/hide followers list states
  const [openFollowers, setOpenFollowers] = useState(true);
  const [openFollowings, setOpenFollowings] = useState(true);

  // define addational render state
  const [render, setRender] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Get Audience
   */

  // get followings
  useEffect(() => {
    async function GetAudience(userId) {
      await fetch(backendUrl + `/api/v1/users/${targetUser?._id}/followings`)
        .then((response) => response.json())
        .then((data) => {
          setFollowings({
            length: data.result,
            list: data.data.followings,
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

  // get followers

  useEffect(() => {
    async function GetAudience(userId) {
      await fetch(backendUrl + `/api/v1/users/${targetUser?._id}/followers`)
        .then((response) => response.json())
        .then((data) => {
          setFollowers({
            length: data.result,
            list: data.data.followers,
          });

          setTimeout(() => {
            setLoading(false);
          }, 400);
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    }
    if (targetUser?._id) {
      GetAudience();
    }
  }, [targetUser?._id, render]);

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
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: "center", gap: 5, marginTop: 30 }}>
          <Pressable
            style={{
              padding: 15,
              paddingVertical: 10,
              width: "90%",
              borderRadius: 50,
              borderWidth: 1,
              borderColor: currentTheme.background2,
              alignItems: "center",
              flexDirection: "row",
              gap: 20,
            }}
            onPress={() => setOpenFollowers(!openFollowers)}
          >
            <Text style={{ color: currentTheme.font, letterSpacing: 0.2 }}>
              {language?.language?.User?.userPage?.followers} (
              {followers?.length})
            </Text>
            <View style={{ flexDirection: "row", gap: -10 }}>
              {followers.list?.map((item, index) => {
                if (index < 3) {
                  return (
                    <Pressable
                      key={index}
                      onPress={() =>
                        navigation.navigate("UserVisit", {
                          user: item,
                        })
                      }
                    >
                      {item?.cover?.length > 0 ? (
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
                                right: 5,
                                bottom: 1,
                                borderWidth: 1.5,
                                borderColor: currentTheme.background,
                              }}
                            ></View>
                          )}
                          <CacheableImage
                            source={{ uri: item?.cover }}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              borderWidth: 3,
                              borderColor: currentTheme.background,
                            }}
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
                                right: 5,
                                bottom: 1,
                                borderWidth: 1.5,
                                borderColor: currentTheme.background,
                              }}
                            ></View>
                          )}
                          <View
                            style={{
                              borderRadius: 100,
                              width: 40,
                              aspectRatio: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(255,255,255,0.1)",
                            }}
                          >
                            <FontAwesome
                              name="user"
                              size={20}
                              color="#e5e5e5"
                            />
                          </View>
                        </View>
                      )}
                    </Pressable>
                  );
                }
              })}
            </View>
            {followers.length > 3 && (
              <Text
                style={{
                  color: currentTheme.font,
                  letterSpacing: 0.2,
                  position: "relative",
                  right: 5,
                }}
              >
                +{followers.length - 3}
              </Text>
            )}
            <MaterialIcons
              name={openFollowers ? "arrow-drop-up" : "arrow-drop-down"}
              color={currentTheme.pink}
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
              padding: 15,
              paddingVertical: 10,
              width: "90%",
              borderRadius: 50,
              borderWidth: 1,
              borderColor: currentTheme.background2,
              alignItems: "center",
              flexDirection: "row",
              gap: 15,
            }}
            onPress={() => setOpenFollowings(!openFollowings)}
          >
            <Text style={{ color: currentTheme.font, letterSpacing: 0.2 }}>
              {language?.language?.User?.userPage?.followings} (
              {followings?.length})
            </Text>
            <View style={{ flexDirection: "row", gap: -10 }}>
              {followings.list?.map((item, index) => {
                if (index < 3) {
                  return (
                    <Pressable
                      key={index}
                      onPress={() =>
                        navigation.navigate("UserVisit", {
                          user: item,
                        })
                      }
                    >
                      {item.cover?.length > 0 ? (
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
                                right: 5,
                                bottom: 1,
                                borderWidth: 1.5,
                                borderColor: currentTheme.background,
                              }}
                            ></View>
                          )}
                          <CacheableImage
                            key={index}
                            source={{ uri: item?.cover }}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              borderWidth: 3,
                              borderColor: currentTheme.background,
                            }}
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
                                right: 5,
                                bottom: 1,
                                borderWidth: 1.5,
                                borderColor: currentTheme.background,
                              }}
                            ></View>
                          )}
                          <View
                            style={{
                              borderRadius: 100,
                              width: 40,
                              aspectRatio: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(255,255,255,0.1)",
                            }}
                          >
                            <FontAwesome
                              name="user"
                              size={20}
                              color="#e5e5e5"
                            />
                          </View>
                        </View>
                      )}
                    </Pressable>
                  );
                }
              })}
            </View>
            {followings.length > 3 && (
              <Text
                style={{
                  color: currentTheme.font,
                  letterSpacing: 0.2,
                  position: "relative",
                  right: 5,
                }}
              >
                +{followings.length - 3}
              </Text>
            )}
            <MaterialIcons
              name={openFollowings ? "arrow-drop-up" : "arrow-drop-down"}
              color={currentTheme.pink}
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
