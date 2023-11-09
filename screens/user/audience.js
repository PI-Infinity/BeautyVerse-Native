import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import { Circle } from "../../components/skeltons";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { setBlur } from "../../redux/app";

/**
 * audience component in user screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Audience = ({ targetUser, navigation }) => {
  // defines language
  const language = Language();

  //dispatch
  const dispatch = useDispatch();

  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define loading state
  const [loading, setLoading] = React.useState(true);

  // define followers and followings states
  const [followers, setFollowers] = useState([]);
  const [followersLength, setFollowersLength] = useState(null);
  const [followings, setFollowings] = useState([]);
  const [followingsLength, setFollowingsLength] = useState(null);

  // define open/hide followers list states
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowings, setOpenFollowings] = useState(false);

  // define addational render state
  const [render, setRender] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Get Audience
   */

  // get followings
  const [followingsPage, setFollowingsPage] = useState(1);
  useEffect(() => {
    async function GetAudience() {
      try {
        const response = await axios.get(
          backendUrl +
            `/api/v1/users/${targetUser?._id}/followings?page=1&limit=10`
        );
        setFollowings(response.data.data.followings);
        setFollowingsLength(response.data.result);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
    if (targetUser) {
      GetAudience();
    }
  }, [render]);

  // get followers
  const [followersPage, setFollowersPage] = useState(1);
  useEffect(() => {
    async function GetAudience() {
      try {
        const response = await axios.get(
          backendUrl +
            `/api/v1/users/${targetUser?._id}/followers?page=1&limit=10`
        );
        setFollowers(response.data.data.followers);
        setFollowersLength(response.data.result);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    if (targetUser) {
      GetAudience();
    }
  }, [render]);

  return (
    <>
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
          <View
            style={{ flex: 1, alignItems: "center", gap: 5, marginTop: 30 }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
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
              onPress={
                followers?.length > 0
                  ? () => {
                      dispatch(setBlur(true));
                      setOpenFollowers(true);
                    }
                  : undefined
              }
            >
              <Text
                style={{
                  color:
                    followers?.length > 0
                      ? currentTheme.font
                      : currentTheme.disabled,
                  letterSpacing: 0.3,
                  fontWeight: "bold",
                }}
              >
                {language?.language?.User?.userPage?.followers} (
                {followersLength})
              </Text>
              <View style={{ flexDirection: "row", gap: -10 }}>
                {followers?.map((item, index) => {
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
                          <CoverImg item={item} currentTheme={currentTheme} />
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
              {followersLength > 3 && (
                <Text
                  style={{
                    color: currentTheme.font,
                    letterSpacing: 0.2,
                    position: "relative",
                    right: 5,
                  }}
                >
                  +{followersLength - 3}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
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
              onPress={
                followings?.length > 0
                  ? () => {
                      dispatch(setBlur(true));
                      setOpenFollowings(true);
                    }
                  : undefined
              }
            >
              <Text
                style={{
                  color:
                    followings?.length > 0
                      ? currentTheme.font
                      : currentTheme.disabled,
                  letterSpacing: 0.3,
                  fontWeight: "bold",
                }}
              >
                {language?.language?.User?.userPage?.followings} (
                {followingsLength})
              </Text>
              <View style={{ flexDirection: "row", gap: -10 }}>
                {followings?.map((item, index) => {
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
                          <CoverImg item={item} currentTheme={currentTheme} />
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
              {followingsLength > 3 && (
                <Text
                  style={{
                    color: currentTheme.font,
                    letterSpacing: 0.2,
                    position: "relative",
                    right: 5,
                  }}
                >
                  +{followingsLength - 3}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      {openFollowings && (
        <ListModal
          list={followings}
          openModal={openFollowings}
          setOpenModal={setOpenFollowings}
          currentTheme={currentTheme}
          page={followingsPage}
          setPage={setFollowingsPage}
          setList={setFollowings}
          from="followings"
          targetUser={targetUser}
          theme={theme}
        />
      )}
      {openFollowers && (
        <ListModal
          list={followers}
          openModal={openFollowers}
          setOpenModal={setOpenFollowers}
          currentTheme={currentTheme}
          page={followersPage}
          setPage={setFollowersPage}
          setList={setFollowers}
          from="followers"
          targetUser={targetUser}
          theme={theme}
        />
      )}
    </>
  );
};

/**
 * List modal
 */

const ListModal = ({
  list,
  setList,
  openModal,
  setOpenModal,
  currentTheme,
  from,
  targetUser,
  page,
  setPage,
  theme,
}) => {
  const [loading, setLoading] = useState(true);

  const language = Language();
  const dispatch = useDispatch();

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const AddAudience = async () => {
    try {
      const response = await axios.get(
        backendUrl +
          `/api/v1/users/${targetUser?._id}/${from}?page=${page + 1}&limit=5`
      );
      setPage(page + 1);
      setList((prev) => {
        const newUsers =
          from === "followings"
            ? response.data.data.followings
            : response.data.data.followers;
        return newUsers.reduce((acc, curr) => {
          const existingUserIndex = acc.findIndex(
            (user) => user._id === curr._id
          );
          if (existingUserIndex !== -1) {
            // User already exists, merge the data
            const mergedUser = { ...acc[existingUserIndex], ...curr };
            return [
              ...acc.slice(0, existingUserIndex),
              mergedUser,
              ...acc.slice(existingUserIndex + 1),
            ];
          } else {
            // User doesn't exist, add to the end of the array
            return [...acc, curr];
          }
        }, prev);
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  return (
    <Modal
      transparent
      animationType="fadeIn"
      isVisible={openModal}
      onRequestClose={() => {
        dispatch(setBlur(false));
        setOpenModal(false);
      }}
    >
      <BlurView
        style={{
          flex: 1,
        }}
        tint="dark"
        intensity={60}
      >
        <Pressable
          onPress={() => {
            dispatch(setBlur(false));
            setOpenModal(false);
          }}
          style={{
            flex: 1,
            width: "100%",
            zIndex: 100,
            height: "100%",
            alignItems: "center",
            paddingTop: 70,
          }}
        >
          <View
            style={[
              styles.modalContent,
              {
                borderWidth: 1.5,
                borderBottomWidth: 0,
                borderColor: currentTheme.pink,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                flex: 1,
                overflow: "hidden",
                paddingTop: 30,
              },
            ]}
          >
            <Text
              style={{
                marginVertical: 12.5,
                color: currentTheme.font,
                letterSpacing: 0.5,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {from === "followers"
                ? language?.language?.User?.userPage?.followers
                : language?.language?.User?.userPage?.followings}
            </Text>
            <View
              style={{ marginBottom: 8, width: "100%", alignItems: "center" }}
            >
              {/* <Search /> */}
            </View>
            <View>
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    height: 500,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size="small" color={currentTheme.pink} />
                </View>
              ) : (
                <FlatList
                  data={list}
                  renderItem={({ item, index }) => {
                    return (
                      <RenderItem
                        key={index}
                        item={item}
                        currentTheme={currentTheme}
                        setOpenModal={setOpenModal}
                      />
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReached={AddAudience} // Add this function to handle the bottom reach
                  onEndReachedThreshold={0.5} // This indicates at what point (as a threshold) should the onEndReached be triggered, 0.5 is halfway.
                />
              )}
            </View>
          </View>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 10,
    justifyContent: "center",
    borderRadius: 4,
    alignItems: "center",
    width: "100%",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 5,
  },
  userItem: {
    width: SCREEN_WIDTH - 50,
    marginBottom: 4,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 4,
    borderRadius: 50,
  },
});

const RenderItem = ({ item, currentTheme, setOpenModal }) => {
  const navigation = useNavigation();
  const language = Language();
  const dispatch = useDispatch();
  let type;
  if (item?.type === "specialist") {
    type = language?.language?.Main?.feedCard?.specialist;
  } else if (item?.type === "shop") {
    type = language?.language?.Marketplace?.marketplace?.shop;
  } else if (item?.type === "beautycenter") {
    type = language?.language?.Auth?.auth?.beautySalon;
  } else {
    type = language?.language?.Auth?.auth?.user;
  }
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.userItem,
        { borderWidth: 1, borderColor: currentTheme.line },
      ]}
      onPress={() => {
        navigation.navigate("UserVisit", { user: item });
        setOpenModal(false);
        dispatch(setBlur(false));
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {item.cover?.length > 10 ? (
          <View>
            {item?.online && (
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
              style={{
                height: 40,
                width: 40,
                borderRadius: 50,
                resizeMode: "cover",
              }}
              source={{ uri: item.cover }}
              manipulationOptions={[
                { resize: { width: 40, height: 40 } },
                { rotate: 90 },
              ]}
            />
          </View>
        ) : (
          <View>
            {item?.online && (
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
                width: 40,
                height: 40,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: currentTheme.line,
              }}
            >
              <FontAwesome name="user" size={24} color="#e5e5e5" />
            </View>
          </View>
        )}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#e5e5e5",
            letterSpacing: 0.2,
          }}
        >
          {item?.name}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          color: currentTheme.disabled,
          letterSpacing: 0.2,
          paddingRight: 8,
        }}
      >
        {item?.username?.length > 0 ? item?.username : type}
      </Text>
    </TouchableOpacity>
  );
};

const CoverImg = ({ item, currentTheme }) => {
  const [loadingImg, setLoadingImg] = useState(true);
  return (
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
          width: 40,
          height: 40,
          borderRadius: 50,
          overflow: "hidden",
        }}
      >
        {loadingImg && <Circle />}

        <CacheableImage
          source={{ uri: item.cover }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 50,
            borderWidth: 1.5,
            borderColor: currentTheme.pink,
          }}
          manipulationOptions={[
            { resize: { width: 40, height: 40 } },
            { rotate: 90 },
          ]}
          onLoad={() => setLoadingImg(false)}
        />
      </View>
    </View>
  );
};
