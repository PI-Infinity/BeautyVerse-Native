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
import { Language } from "../../context/language";
import { ListItem, Icon, Button } from "react-native-elements";
import axios from "axios";
import { CacheableImage } from "../../components/cacheableImage";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { lightTheme, darkTheme } from "../../context/theme";

export const User = ({ navigation, user, variant }) => {
  const language = Language();
  const route = useRoute();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );
  const [loading, setLoading] = useState(true);
  // Access the passed route.params
  const userParams = route.params;
  const targetUser = route.params?.user || currentUser;

  const [cover, setCover] = useState("");

  useEffect(() => {
    setCover(targetUser.cover + `?rand=${Math.random()}`);
  }, [currentUser, rerenderCurrentUser]);

  const handleCoverUpdate = (newCover) => {
    setCover(newCover);
  };

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const name = capitalizeFirstLetter(targetUser.name);
  const userType = capitalizeFirstLetter(targetUser.type);

  // creteate scroll ref
  const scrollViewRef = useRef();

  // active navigator

  const [active, setActive] = useState(0);

  // open about
  const [numOfLines, setNumOfLines] = useState(3);

  function changeHeight() {
    if (numOfLines > 3) {
      setNumOfLines(3);
    } else {
      setNumOfLines(8);
    }
  }

  const navigatorItems = [
    {
      id: 0,
      name: language?.language?.User?.userPage?.feeds,
      icon: (
        <Icon
          name="dynamic-feed"
          type="MaterialIcons"
          color={followerDefined ? "#F866B1" : "#ccc"}
          size={18}
        />
      ),
    },
    {
      id: 1,
      name: language?.language?.User?.userPage?.contact,
      icon: (
        <Icon
          name="contacts"
          type="MaterialIcons"
          color={followerDefined ? "#F866B1" : "#ccc"}
          size={16}
        />
      ),
    },
    {
      id: 2,
      name: language?.language?.User?.userPage?.service,
      icon: (
        <Icon
          name="format-list-bulleted"
          type="MaterialIcons"
          color={followerDefined ? "#F866B1" : "#ccc"}
          size={16}
        />
      ),
    },
    {
      id: 3,
      name: language?.language?.User?.userPage?.workingInfo,
      icon: (
        <Icon
          name="info-outline"
          type="MaterialIcons"
          color={followerDefined ? "#F866B1" : "#ccc"}
          size={16}
        />
      ),
    },
    {
      id: 4,
      name: language?.language?.User?.userPage?.statistics,
      icon: (
        <Icon
          name="bar-chart"
          type="MaterialIcons"
          color={followerDefined ? "#F866B1" : "#ccc"}
          size={16}
        />
      ),
    },
    {
      id: 5,
      name: language?.language?.User?.userPage?.audience,
      icon: (
        <Icon
          name="supervised-user-circle"
          type="MaterialIcons"
          color={followerDefined ? "#F866B1" : "#ccc"}
          size={16}
        />
      ),
    },
  ];

  /** Define following to user or not
   * //
   */

  // import followings
  const [followerDefined, setFollowerDefined] = useState("");
  const [render, setRender] = useState(false);

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
          console.log("Error fetching data:", error);
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
      console.error(error);
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
      console.error(error);
    }
    setRender(!render);
  };

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
    activeContent = <WorkingInfo targetUser={targetUser} />;
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

  // send user visit
  const visitor = useSelector((state) => state.storeApp.machineId);

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
      console.log(error);
    }
  }, [visitor, targetUser]);

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
      overScrollMode={Platform.OS === "ios" ? undefined : false}
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
                  backgroundColor: "rgba(1,1,1,0.2)",
                  zIndex: 10000,
                  height: 100,
                  width: 100,
                }}
              >
                <InputFile
                  targetUser={targetUser}
                  onCoverUpdate={handleCoverUpdate}
                />
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
                    <ActivityIndicator />
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
                  backgroundColor: "rgba(255,255,255,0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 110,
                  aspectRatio: 1,
                  borderWidth: 2,
                }}
              >
                <FontAwesomeIcon name="user" size={40} color="#e5e5e5" />
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
              }}
            >
              {targetUser.username ? targetUser.username : userType}
            </Text>
            {targetUser._id !== currentUser._id && (
              <Pressable
                onPress={followerDefined ? () => Unfollow() : () => Follow()}
                style={{ padding: 5 }}
              >
                <Icon
                  name="done-outline"
                  type="MaterialIcons"
                  color={followerDefined ? "#F866B1" : "#ccc"}
                  size={16}
                />
              </Pressable>
            )}
          </View>

          <Pressable
            style={{
              marginTop: 10,
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
                }}
              >
                {targetUser?.about}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
      {targetUser.type !== "user" && (
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
              overScrollMode={Platform.OS === "ios" ? undefined : false}
              renderItem={({ item }) => {
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
                        // borderWidth: 1,
                        // borderColor:
                        //   active === item?.id
                        //     ? "rgba(255,255,255,0.2)"
                        //     : "rgba(15,15,15,1)",
                        borderRadius: 50,
                        backgroundColor:
                          active === item.id ? "#F866B1" : "rgba(0,0,0,0)",
                      }}
                    >
                      {item.icon}
                      <Text
                        style={{
                          color: active === item.id ? "#e5e5e5" : "#ccc",
                        }}
                      >
                        {item?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              }}
              keyExtractor={(item) => item?.id}
            />
          </View>
          <View name="content">{activeContent}</View>
        </>
      )}
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
