import {
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  Button,
  ActivityIndicator,
  Pressable,
  Linking,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { CacheableImage } from "../components/cacheableImage";
import { darkTheme, lightTheme } from "../context/theme";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import {
  setCurrentChat,
  setRerederRooms,
  setRooms,
  setRerenderScroll,
} from "../redux/chat";
import axios from "axios";

export const MapFilter = ({ users }) => {
  // defines dispatch for redux
  const dispatch = useDispatch();

  // defines navigation
  const navigation = useNavigation();

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define location city
  const city = useSelector((state) => state.storeFilter.city);

  // define theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const mapRef = useRef(null);

  // useEffect(() => {
  //   // ...rest of your code

  //   // This will recenter the map to the currentUser's location
  //   if (mapRef.current && users[0]?.address[0]) {
  //     mapRef.current.animateToRegion(
  //       {
  //         latitude: users[0]?.address.find(
  //           (a) =>
  //             a.city?.replace("'", "")?.toLocaleLowerCase() ===
  //             city?.toLocaleLowerCase()
  //         )?.latitude,
  //         longitude: users[0]?.address.find(
  //           (a) =>
  //             a.city?.replace("'", "")?.toLocaleLowerCase() ===
  //             city?.toLocaleLowerCase()
  //         )?.longitude,
  //         latitudeDelta: 0.0922,
  //         longitudeDelta: 0.0421,
  //       },
  //       500
  //     ); // Duration of animation in ms
  //   } else {
  //     mapRef.current.animateToRegion(
  //       {
  //         latitude: currentUser.address[0]?.latitude,
  //         longitude: currentUser.address[0]?.longitude,
  //         latitudeDelta: 0.0922,
  //         longitudeDelta: 0.0421,
  //       },
  //       500
  //     ); //
  //   }
  // }, [users]);

  // user modal
  // select user
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // define link to can be press
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  // navigate to chat
  const rooms = useSelector((state) => state.storeChat.rooms);

  let chatDefined =
    currentUser._id !== selectedUser?._id &&
    rooms.find(
      (r) =>
        (r.members.member1 === currentUser._id ||
          r.members.member1 === selectedUser?._id) &&
        (r.members.member2 === currentUser._id ||
          r.members.member2 === selectedUser?._id)
    );

  // get chat room
  const GetNewChatRoom = async () => {
    setModalVisible(false);

    navigation.navigate("Room", { user: selectedUser });

    let newChat = {
      room: currentUser?._id + selectedUser?._id,
      members: {
        member1: currentUser._id,
        member2: selectedUser?._id,
      },
      lastSender: "",
      lastMessage: "",
      lastMessageSeen: "",
      status: "read",
    };
    try {
      const response = await axios.post(backendUrl + "/api/v1/chats/", {
        ...newChat,
      });
      if (response && response.data) {
        // handle the response
        dispatch(setCurrentChat(response.data.data.chat));
      } else {
        console.error(
          "The response or the data from the server was undefined."
        );
      }
    } catch (error) {
      console.log("error");
      console.log(error);
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

  // get chat room
  const GetChatRoom = async () => {
    const Room = chatDefined;

    try {
      setModalVisible(false);

      navigation.navigate("Room", { user: selectedUser });
      dispatch(setCurrentChat(Room));
      if (Room.lastSender !== currentUser._id) {
        await axios.patch(backendUrl + "/api/v1/chats/" + Room.room, {
          status: "read",
        });
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
      // dispatch(setRerenderScroll());
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <>
      {/* <MapView
        ref={mapRef} // Add this line
        style={{ height: "110%" }}
        initialRegion={{
          latitude: users[0]?.address[0].latitude,
          longitude: users[0]?.address[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={[
          {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ]}
      >
        {users?.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.address.find(
                  (a) =>
                    a.city?.replace("'", "")?.toLocaleLowerCase() ===
                    city?.toLocaleLowerCase()
                )?.latitude,
                longitude: item?.address.find(
                  (a) =>
                    a.city?.replace("'", "")?.toLocaleLowerCase() ===
                    city?.toLocaleLowerCase()
                )?.longitude,
              }}
              onPress={() => {
                setSelectedUser(item);
                setModalVisible(true);
              }}
            >
              <MarkerItem item={item} currentTheme={currentTheme} />
            </Marker>
          );
        })}
      </MapView> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={{ backgroundColor: "red" }}
      >
        <Pressable
          style={[styles.centeredView, { opacity: 1 }]}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: currentTheme.background2,
                borderWidth: 2,
                borderColor: currentTheme.pink,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                navigation.navigate("User", { user: selectedUser });
                setModalVisible(false);
              }}
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
              }}
            >
              {selectedUser?.cover.length > 0 ? (
                <CacheableImage
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: currentTheme.pink,
                  }}
                  key={selectedUser?._id}
                  source={{
                    uri: selectedUser?.cover,
                    cache: "reload",
                  }}
                />
              ) : (
                <FontAwesome
                  name="user"
                  size={26}
                  color={currentTheme.pink}
                  style={{ margin: 8 }}
                />
              )}
              <View style={{ gap: 4 }}>
                <Text
                  numberOfLines={1}
                  style={
                    ([styles.modalText],
                    { color: currentTheme.font, fontWeight: "bold" })
                  }
                >
                  {selectedUser?.name}
                </Text>
                <Text
                  style={([styles.modalText], { color: currentTheme.font })}
                >
                  {selectedUser?.type}
                </Text>
              </View>
            </Pressable>
            <View
              style={{
                paddingVertical: 20,
                paddingHorizontal: 10,
                gap: 8,
                width: "100%",
              }}
            >
              {selectedUser?.address[0].street && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",

                    borderBottomWidth: 1,
                    borderColor: currentTheme.line,
                    paddingBottom: 5,
                  }}
                >
                  <Entypo
                    name="location-pin"
                    size={22}
                    color={currentTheme.pink}
                    style={{ position: "relative", right: 5 }}
                  />
                  <Text
                    style={
                      ([styles.modalText],
                      {
                        color: currentTheme.font,
                        fontSize: 12,
                        letterSpacing: 0.3,
                        position: "relative",
                        right: 5,
                      })
                    }
                  >
                    {selectedUser?.address[0].street}
                    {selectedUser?.address[0].streetNumber &&
                      selectedUser?.address[0].streetNumber}
                  </Text>
                </View>
              )}
              <Pressable
                onPress={() => handleLinkPress(`tel:${selectedUser?.phone}`)}
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderColor: currentTheme.line,
                  paddingBottom: 5,
                }}
              >
                <FontAwesome name="phone" size={18} color={currentTheme.pink} />
                <Text
                  numberOfLines={1}
                  style={
                    ([styles.modalText],
                    {
                      color: currentTheme.font,
                      fontSize: 12,
                      letterSpacing: 0.3,
                    })
                  }
                >
                  {selectedUser?.phone}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleLinkPress(`mailto:${selectedUser.email}`)}
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderColor: currentTheme.line,
                  paddingBottom: 5,
                }}
              >
                <MaterialCommunityIcons
                  name="email"
                  size={18}
                  color={currentTheme.pink}
                />
                <Text
                  numberOfLines={1}
                  style={
                    ([styles.modalText],
                    {
                      color: currentTheme.font,
                      fontSize: 12,
                      letterSpacing: 0.3,
                    })
                  }
                >
                  {selectedUser?.email}
                </Text>
              </Pressable>
            </View>
            {selectedUser?._id === currentUser?._id ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={{
                    backgroundColor: "red",
                    padding: 7.5,
                    borderRadius: 50,
                    width: "50%",
                    alignItems: "center",
                    backgroundColor: currentTheme.background2,
                  }}
                >
                  <Text
                    style={{ color: currentTheme.pink, letterSpacing: 0.3 }}
                  >
                    Close
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Pressable
                  onPress={
                    chatDefined
                      ? () => {
                          GetChatRoom();
                        }
                      : () => {
                          GetNewChatRoom();
                        }
                  }
                  style={{
                    backgroundColor: "red",
                    padding: 7.5,
                    borderRadius: 50,
                    width: "47%",
                    alig45tems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: currentTheme.line,
                    backgroundColor: currentTheme.background2,
                    flexDirection: "row",
                    gap: 8,
                  }}
                >
                  <AntDesign
                    size={18}
                    name="message1"
                    color={currentTheme.pink}
                  />
                  <Text
                    style={{ color: currentTheme.font, letterSpacing: 0.3 }}
                  >
                    Chat
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate("Send Order", { user: selectedUser });
                    setModalVisible(false);
                  }}
                  style={{
                    backgroundColor: "red",
                    padding: 7.5,
                    borderRadius: 50,
                    width: "47%",
                    alignItems: "center",
                    backgroundColor: currentTheme.background2,
                    flexDirection: "row",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: currentTheme.line,
                    gap: 8,
                  }}
                >
                  <FontAwesome
                    name="calendar"
                    size={16}
                    color={currentTheme.pink}
                  />
                  <Text
                    style={{ color: currentTheme.font, letterSpacing: 0.3 }}
                  >
                    Schedule
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: "75%",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: "center",
  },
});

const MarkerItem = ({ item, currentTheme }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (item.cover.length < 1) {
      setLoading(false);
    }
  }, [item.cover]);
  return (
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: currentTheme.pink,
        backgroundColor: currentTheme.background2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={currentTheme.pink}
          style={{ position: "absolute" }}
        />
      )}
      {item?.cover.length > 0 ? (
        <CacheableImage
          style={{
            width: 30,
            height: 30,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: currentTheme.pink,
          }}
          key={item?._id}
          source={{
            uri: item?.cover,
            cache: "reload",
          }}
        />
      ) : (
        <FontAwesome name="user" size={16} color={currentTheme.pink} />
      )}
      {item?.online && (
        <View
          style={{
            width: 8,
            height: 8,
            backgroundColor: "#3bd16f",
            borderRadius: 50,
            position: "absolute",
            zIndex: 100,
            left: 0,
            bottom: 0,
            borderWidth: 1,
            borderColor: currentTheme.background,
          }}
        ></View>
      )}
    </View>
  );
};
