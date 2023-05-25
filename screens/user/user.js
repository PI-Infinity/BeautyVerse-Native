import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  StyleSheet,
  UIManager,
  LayoutAnimation,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import { Feeds } from "../../screens/user/feeds";
import { Contact } from "../../screens/user/contact";
import { ProceduresList } from "../../screens/user/procedures";
import { WorkingInfo } from "../../screens/user/workingInfo";
import { Audience } from "../../screens/user/audience";
import { Statistics } from "../../screens/user/statistics/main";
import { useNavigation, useRoute } from "@react-navigation/native";
import InputFile from "../../components/coverInput";
import InputCoverAndroid from "../../components/coverInputAndroid";
import { Language } from "../../context/language";
import axios from "axios";
import { CacheableImage } from "../../components/cacheableImage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { lightTheme, darkTheme } from "../../context/theme";
import { Circle } from "../../components/skeltons";

export const User = ({ navigation, user, variant }) => {
  // Initialize language for multi-language support
  const language = Language();

  // Get current route for navigation
  const route = useRoute();

  // Select theme from global Redux state (dark or light theme)
  const theme = useSelector((state) => state.storeApp.theme);

  // Set currentTheme based on the theme
  const currentTheme = theme ? darkTheme : lightTheme;

  // Get currentUser from global Redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // Get rerenderCurrentUser from global Redux state
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );

  // State for loading indication
  const [loading, setLoading] = useState(true);

  // State for refresh control
  const [refresh, setRefresh] = useState(false);

  // Get userParams from route parameters
  const userParams = route.params;

  // Determine target user either from route parameters or currentUser
  const targetUser = route.params?.user || currentUser;

  // State for cover image
  const [cover, setCover] = useState("");

  // A reference used to skip the first run of useEffect
  const profileCleanRef = useRef(true);

  // useEffect for rerenderCurrentUser
  useEffect(() => {
    if (profileCleanRef.current) {
      profileCleanRef.current = false;
      return;
    }
    setRefresh(true);
    const timer = setTimeout(() => {
      setRefresh(false);
    }, 700);
    return () => clearTimeout(timer); // clear the timer if the component is unmounted
  }, [rerenderCurrentUser]);

  // useEffect for setting cover image
  useEffect(() => {
    setCover(targetUser.cover + `?rand=${Math.random()}`);
  }, [currentUser, rerenderCurrentUser]);

  // Function to handle cover updates
  const handleCoverUpdate = (newCover) => {
    setCover(newCover);
  };

  // Function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // Initialize name and userType
  const name = capitalizeFirstLetter(targetUser.name);

  const tp = capitalizeFirstLetter(targetUser.type);
  let userType;
  if (tp === "Beautycenter") {
    userType = language?.language?.Auth?.auth?.beautySalon;
  } else {
    userType = tp;
  }

  // Scroll ref for scrollable content
  const scrollViewRef = useRef();

  // State for active navigator
  const [active, setActive] = useState(targetUser.type === "user" ? 1 : 0);

  // State for number of visible lines in about
  const [numOfLines, setNumOfLines] = useState(3);

  // Function to change height (number of visible lines)
  function changeHeight() {
    if (numOfLines > 3) {
      setNumOfLines(3);
    } else {
      setNumOfLines(8);
    }
  }

  // Navigator items configuration
  const navigatorItems = [
    {
      id: 0,
      name: language?.language?.User?.userPage?.feeds,
      icon: (
        <MaterialIcons
          name="dynamic-feed"
          color={active === 0 ? currentTheme.background : currentTheme.disabled}
          size={18}
        />
      ),
    },
    {
      id: 1,
      name: language?.language?.User?.userPage?.contact,
      icon: (
        <MaterialIcons
          name="contacts"
          color={active === 1 ? currentTheme.background : currentTheme.disabled}
          size={16}
        />
      ),
    },
    {
      id: 2,
      name: language?.language?.User?.userPage?.service,
      icon: (
        <MaterialIcons
          name="format-list-bulleted"
          color={active === 2 ? currentTheme.background : currentTheme.disabled}
          size={16}
        />
      ),
    },
    {
      id: 3,
      name: language?.language?.User?.userPage?.workingInfo,
      icon: (
        <MaterialIcons
          name="info-outline"
          color={active === 3 ? currentTheme.background : currentTheme.disabled}
          size={16}
        />
      ),
    },
    {
      id: 4,
      name: language?.language?.User?.userPage?.statistics,
      icon: (
        <MaterialIcons
          name="bar-chart"
          color={active === 4 ? currentTheme.background : currentTheme.disabled}
          size={16}
        />
      ),
    },
    {
      id: 5,
      name: language?.language?.User?.userPage?.audience,
      icon: (
        <MaterialIcons
          name="supervised-user-circle"
          color={active === 5 ? currentTheme.background : currentTheme.disabled}
          size={16}
        />
      ),
    },
  ];

  /** Define following to user or not
   * //
   */

  // State for followerDefined
  const [followerDefined, setFollowerDefined] = useState("");
  const [render, setRender] = useState(false);

  // useEffect to check follower
  useEffect(() => {
    async function checkFollower() {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers/${currentUser?._id}/check/`
      )
        .then((response) => response.json())
        .then(async (data) => {
          setFollowerDefined(data.data?.follower);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
    if (targetUser?._id) {
      checkFollower();
    }
  }, [targetUser?._id, render]);

  // function to follow user
  const Follow = async () => {
    try {
      setFollowerDefined({
        followerId: currentUser?._id,
        followerName: currentUser?.name,
        followerCover: currentUser?.cover,
        followerType: currentUser?.type,
        followingId: targetUser?._id,
        followAt: new Date(),
      });
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/followings`,
        {
          followingId: targetUser?._id,
          followerId: currentUser?._id,
          followAt: new Date(),
        }
      );
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers`,
        {
          followerId: currentUser?._id,
          followingId: targetUser?._id,
          followAt: new Date(),
        }
      );
      if (currentUser?._id !== targetUser?._id) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: `გამოიწერა თქვენი გვერდი!`,
            date: new Date(),
            type: "follow",
            status: "unread",
            feed: `/api/v1/users/${currentUser?._id}/`,
          }
        );
      }

      // const data = await response.data;
    } catch (error) {
      console.error(error.response.data.message);
    }
    setRender(!render);
  };
  // function to unfollow user
  const Unfollow = async () => {
    try {
      setFollowerDefined("");
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/followings/${targetUser?._id}`;
      await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
      const url2 = `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers/${followerDefined?.followerId}`;
      await fetch(url2, { method: "DELETE" })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log("Error fetching data:", error);
        });

      // const data = await response.data;
    } catch (error) {
      console.error(error.response.data.message);
    }
    setRender(!render);
  };

  // Define activeContent based on active state
  let activeContent;
  if (active == 0) {
    activeContent = (
      <Feeds
        targetUser={targetUser}
        scrollViewRef={scrollViewRef}
        navigation={navigation}
        variant={variant}
      />
    );
  } else if (active == 1) {
    activeContent = <Contact targetUser={targetUser} />;
  } else if (active == 2) {
    activeContent = <ProceduresList targetUser={targetUser} />;
  } else if (active == 3) {
    activeContent = (
      <WorkingInfo targetUser={targetUser} navigation={navigation} />
    );
  } else if (active == 4) {
    activeContent = (
      <Statistics targetUser={targetUser} navigation={navigation} />
    );
  } else if (active == 5) {
    activeContent = (
      <Audience
        targetUser={targetUser}
        navigation={navigation}
        renderCheck={render}
        setRenderCheck={setRender}
      />
    );
  }

  // Get visitor from global Redux state
  const visitor = useSelector((state) => state.storeApp.machineId);

  // useEffect to send user visit
  useEffect(() => {
    const SendUserVisit = async () => {
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/visitors`,
        {
          visitor,
        }
      );
    };
    try {
      if (targetUser?._id !== currentUser?._id && targetUser && visitor) {
        SendUserVisit();
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, [visitor, targetUser]);

  // Animate component appearance
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%" }}
      nestedScrollEnabled={true}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      refreshControl={<RefreshControl tintColor="#ccc" refreshing={refresh} />}
    >
      <View style={styles.header}>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
          }}
        >
          <View style={styles.coverImg}>
            {variant !== "visitPage" && (
              <View
                style={{
                  position: "absolute",
                  zIndex: 10000,
                  height: 100,
                  width: 100,
                }}
              >
                {Platform.OS === "ios" ? (
                  <InputFile
                    targetUser={targetUser}
                    onCoverUpdate={handleCoverUpdate}
                  />
                ) : (
                  <InputCoverAndroid
                    targetUser={targetUser}
                    onCoverUpdate={handleCoverUpdate}
                  />
                )}
              </View>
            )}
            {cover?.length > 30 ? (
              <View
                style={{
                  width: 110,
                  aspectRatio: 0.99,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading && (
                  <View
                    style={{
                      position: "absolute",
                      width: 110,
                      aspectRatio: 0.99,
                      borderRadius: 50,
                      // backgroundColor: "rgba(1,1,1,0.5)",g
                      zIndex: 120,
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.5,
                    }}
                  >
                    <ActivityIndicator color={currentTheme.pink} />
                  </View>
                )}
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    padding: 10,
                    // backgroundColor: "red",
                  }}
                >
                  <CacheableImage
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      resizeMode: "cover",
                    }}
                    source={{
                      uri: cover,
                    }}
                    manipulationOptions={[
                      {
                        resize: {
                          width: "100%",
                          aspectRatio: 1,
                          resizeMode: "cover",
                        },
                      },
                      { rotate: 90 },
                    ]}
                    onLoad={() => setLoading(false)}
                    onError={() => console.log("Error loading image")}
                  />
                </Animated.View>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 110,
                  aspectRatio: 1,
                  borderWidth: 2,
                }}
              >
                <FontAwesome name="user" size={40} color="#e5e5e5" />
              </View>
            )}
          </View>
        </View>
        <View style={{ flex: 6, justifyContent: "center" }}>
          <View
            name="info"
            style={{
              gap: 10,
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: currentTheme.font,
                letterSpacing: 0.2,
              }}
            >
              {targetUser.username ? targetUser.username : userType}
            </Text>
            {targetUser._id !== currentUser._id && (
              <Pressable
                onPress={followerDefined ? () => Unfollow() : () => Follow()}
                style={{ padding: 5 }}
              >
                <MaterialIcons
                  name="favorite"
                  color={followerDefined ? "#F866B1" : currentTheme.disabled}
                  size={22}
                />
              </Pressable>
            )}
          </View>

          <Pressable
            style={{
              marginTop: 5,
            }}
            onPress={changeHeight}
          >
            <View>
              <Text
                multiline
                numberOfLines={numOfLines}
                style={{
                  fontSize: 14,
                  color: currentTheme.font,
                  lineHeight: 20,
                  letterSpacing: 0.2,
                }}
              >
                {targetUser?.about}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
      {/* {targetUser.type !== "user" && ( */}
      <>
        <View
          name="navigator"
          style={[
            styles.navigator,
            {
              borderBottomColor: currentTheme.background2,
              borderTopColor: currentTheme.background2,
            },
          ]}
        >
          <FlatList
            data={navigatorItems}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            bounces={Platform.OS === "ios" ? false : undefined}
            overScrollMode={Platform.OS === "ios" ? "never" : "always"}
            renderItem={({ item }) => {
              if (
                targetUser.type === "user" &&
                (item.id === 1 || item.id === 5)
              ) {
                return (
                  <TouchableOpacity
                    onPress={() => setActive(item?.id)}
                    style={{
                      height: 25,
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 5,
                      margin: 5,
                      paddingLeft: 15,
                      paddingRight: 15,
                      borderRadius: 50,
                      backgroundColor:
                        active === item.id ? "#F866B1" : "rgba(0,0,0,0)",
                    }}
                  >
                    {item.icon}
                    <Text
                      style={{
                        letterSpacing: 0.2,
                        color:
                          active === item.id
                            ? currentTheme.background
                            : currentTheme.disabled,
                      }}
                    >
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                );
              } else if (targetUser.type !== "user") {
                if (item.id === 4 && variant === "visitPage") {
                  return null;
                } else {
                  return (
                    <TouchableOpacity
                      onPress={() => setActive(item?.id)}
                      style={{
                        height: 25,
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                        margin: 5,
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderRadius: 50,
                        backgroundColor:
                          active === item.id ? "#F866B1" : "rgba(0,0,0,0)",
                      }}
                    >
                      {item.icon}
                      <Text
                        style={{
                          color:
                            active === item.id
                              ? currentTheme.background
                              : currentTheme.disabled,
                        }}
                      >
                        {item?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              }
            }}
            keyExtractor={(item) => item?.id}
          />
        </View>
        <View name="content">{activeContent}</View>
      </>
      {/* )} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: 15,
    paddingRight: 25,
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: "row",
    gap: 25,
  },
  coverImg: {
    width: 90,
    height: 90,
    overflow: "hidden",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  navigator: {
    borderBottomWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    marginTop: 10,
    paddingLeft: 5,
  },
});
