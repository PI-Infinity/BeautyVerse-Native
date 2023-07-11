import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import InputFile from "../../components/coverInput";
import InputCoverAndroid from "../../components/coverInputAndroid";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import {
  setCurrentChat,
  setRerederRooms,
  setRerenderScroll,
  setRooms,
} from "../../redux/chat";
import { Audience } from "../../screens/user/audience";
import { Contact } from "../../screens/user/contact";
import { Feeds } from "../../screens/user/feeds";
import { ProceduresList } from "../../screens/user/procedures";
import { Statistics } from "../../screens/user/statistics/main";
import { WorkingInfo } from "../../screens/user/workingInfo";

/**
 * User Profile Screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const User = ({ navigation, user, variant }) => {
  // Initialize language for multi-language support
  const language = Language();
  const dispatch = useDispatch();
  // Get current route for navigation
  const route = useRoute();

  // State for followerDefined
  const [followerDefined, setFollowerDefined] = useState("");
  const [loadingFollowerDefined, setLoadingFollowerDefined] = useState(true);

  // useEffect to check follower
  useEffect(() => {
    setLoadingFollowerDefined(true);
    async function checkFollower() {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers/${currentUser?._id}/check/`
      )
        .then((response) => response.json())
        .then(async (data) => {
          setFollowerDefined(data.data?.follower);
          setLoadingFollowerDefined(false);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
    if (targetUser?._id) {
      checkFollower();
    }
  }, [targetUser?._id]);

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
  }, [currentUser, rerenderCurrentUser, route]);

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
  const navigatorRef = useRef(null);

  useEffect(() => {
    setActive(targetUser.type === "user" ? 1 : 0);
    navigatorRef.current.scrollToOffset({ offset: 0, animated: true });
  }, [route]);

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
          color={active === 0 ? currentTheme.pink : currentTheme.disabled}
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
          color={active === 1 ? currentTheme.pink : currentTheme.disabled}
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
          color={active === 2 ? currentTheme.pink : currentTheme.disabled}
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
          color={active === 3 ? currentTheme.pink : currentTheme.disabled}
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
          color={active === 4 ? currentTheme.pink : currentTheme.disabled}
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
          color={active === 5 ? currentTheme.pink : currentTheme.disabled}
          size={16}
        />
      ),
    },
  ];

  /** Define following to user or not
   * //
   */

  const [render, setRender] = useState(false);

  // function to follow user
  const Follow = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
  };
  // function to unfollow user
  const Unfollow = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
  };

  // user feeds page in backend
  const [page, setPage] = useState(1);
  const [feedsLength, setFeedsLength] = useState(0);
  const [feeds, setFeeds] = useState([]);

  // Define activeContent based on active state
  let activeContent;
  if (active == 0) {
    activeContent = (
      <Feeds
        page={page}
        setPage={setPage}
        feeds={feeds}
        setFeeds={setFeeds}
        feedsLength={feedsLength}
        setFeedsLength={setFeedsLength}
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

  // navigate to chat
  const rooms = useSelector((state) => state.storeChat.rooms);

  let chatDefined =
    currentUser._id !== targetUser._id &&
    rooms.find(
      (r) =>
        (r.members.member1 === currentUser._id ||
          r.members.member1 === targetUser._id) &&
        (r.members.member2 === currentUser._id ||
          r.members.member2 === targetUser._id)
    );

  // get chat room
  const GetNewChatRoom = async () => {
    let newChat = {
      room: currentUser?._id + targetUser._id,
      members: {
        member1: currentUser._id,
        member2: targetUser._id,
        member2Cover: targetUser.cover,
        member2Name: targetUser.name,
      },
      lastMessage: "",
      lastSender: "",
      status: "read",
    };
    try {
      navigation.navigate("Room", {
        newChat,
        user: targetUser,
      });
      const response = await axios.post(
        "https://beautyverse.herokuapp.com/api/v1/chats/",
        {
          room: currentUser?._id + targetUser._id,
          members: {
            member1: currentUser._id,
            member2: targetUser._id,
          },
          lastMessage: "",
          lastSender: "",
          status: "read",
        }
      );
      dispatch(setCurrentChat(response.data.data.chat));
      dispatch(setRerederRooms());
    } catch (error) {
      if (error.response) {
        Alert.alert(
          error.response.data
            ? error.response.data.message
            : "An error occurred"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        Alert.alert("An error occurred. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        Alert.alert("An error occurred. Please try again.");
      }
      console.log(error.config);
    }
  };

  const insets = useSafeAreaInsets();

  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  // get chat room
  const GetChatRoom = async () => {
    const Room = chatDefined;
    try {
      dispatch(setCurrentChat(Room));
      navigation.navigate("Room", {
        user: targetUser,
        screenHeight: screenHeight,
      });
      if (Room.lastSender !== currentUser._id) {
        await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/chats/" + Room.room,
          {
            status: "read",
          }
        );
      }
      let currentRoomIndex = rooms.findIndex((r) => r._id === Room._id);

      if (currentRoomIndex !== -1) {
        let newRooms = [...rooms];
        newRooms[currentRoomIndex] = {
          ...newRooms[currentRoomIndex],
          status: "read",
        };
        dispatch(setRooms(newRooms));
      }
      dispatch(setRerenderScroll());
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + layoutHeight >= contentHeight - 20) {
      if (feedsLength > feeds.length) {
        setPage(page + 1);
      }
    }
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        nestedScrollEnabled={true}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
        refreshControl={
          <RefreshControl tintColor="#ccc" refreshing={refresh} />
        }
      >
        <View style={styles.header}>
          <View
            style={{
              flex: 2,
              justifyContent: "center",
            }}
          >
            <View style={styles.coverImg}>
              {route.name === "UserProfile" &&
                currentUser._id === targetUser._id && (
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
              ref={navigatorRef}
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
                      onPress={() => {
                        setActive(item?.id);
                        setPage(1);
                      }}
                      style={{
                        height: 28,
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                        margin: 5,
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderRadius: 50,
                        backgroundColor: currentTheme.background2,
                        borderWidth: 1.5,
                        borderColor:
                          active === item.id ? "#F866B1" : "rgba(0,0,0,0)",
                      }}
                    >
                      {item.icon}
                      <Text
                        style={{
                          letterSpacing: 0.2,
                          color:
                            active === item.id
                              ? currentTheme.pink
                              : currentTheme.disabled,
                        }}
                      >
                        {item?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                } else if (targetUser.type !== "user") {
                  if (item.id === 4 && targetUser._id !== currentUser._id) {
                    return null;
                  } else {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setActive(item?.id);
                          setPage(1);
                        }}
                        style={{
                          height: 28,
                          alignItems: "center",
                          flexDirection: "row",
                          gap: 5,
                          margin: 5,
                          paddingLeft: 15,
                          paddingRight: 15,
                          borderRadius: 50,
                          borderWidth: 1.5,
                          borderColor:
                            active === item.id ? "#F866B1" : "rgba(0,0,0,0)",
                        }}
                      >
                        {item.icon}
                        <Text
                          style={{
                            color:
                              active === item.id
                                ? currentTheme.pink
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

      {!loadingFollowerDefined && (
        <View
          style={{
            width: "100%",
            position: "absolute",
            right: 15,
            bottom: 15,
            gap: 0,
            zIndex: 100000,
            alignItems: "flex-end",
          }}
        >
          {targetUser._id !== currentUser._id && (
            <Pressable
              onPress={followerDefined ? () => Unfollow() : () => Follow()}
              style={{
                padding: 5,
                paddingVertical: 5,
                backgroundColor: currentTheme.background2,

                width: 50,
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                marginVertical: 8,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: currentTheme.line,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10, // negative value places shadow on top
                },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 1,
              }}
            >
              {followerDefined ? (
                <FontAwesome5
                  size={18}
                  name="user-check"
                  color={currentTheme.pink}
                  style={{ position: "relative", left: 2 }}
                />
              ) : (
                <MaterialIcons
                  name="person-add-alt-1"
                  size={24}
                  color={currentTheme.font}
                  style={{ position: "relative", left: 2 }}
                />
              )}
              {/* <Text
                style={{
                  color: followerDefined ? currentTheme.pink : "#fff",
                  fontSize: 14,
                  letterSpacing: 0.3,
                }}
              >
                {followerDefined ? "Following" : "Follow"}
              </Text> */}
            </Pressable>
          )}
          {targetUser._id !== currentUser._id && (
            <Pressable
              onPress={
                chatDefined ? () => GetChatRoom() : () => GetNewChatRoom()
              }
              style={{
                padding: 5,
                paddingVertical: 5,
                backgroundColor: currentTheme.background2,
                width: 50,
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                marginVertical: 8,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: currentTheme.line,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10, // negative value places shadow on top
                },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 1,
              }}
            >
              <AntDesign size={24} name="message1" color={currentTheme.font} />
            </Pressable>
          )}
        </View>
      )}
    </>
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
