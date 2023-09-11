import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Localization from "expo-localization";
import moment from "moment";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  Linking,
  Dimensions,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import DeleteConfirm from "../../components/confirmDialog";
import { useSocket } from "../../context/socketContext";
import { ProceduresOptions } from "../../datas/registerDatas";
import { setRerenderBookings } from "../../redux/rerenders";
import { StatusPopup } from "../../screens/bookings/statusPopup";
import { Language } from "../../context/language";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  setCurrentChat,
  setRerederRooms,
  setRerenderScroll,
  setRooms,
} from "../../redux/chat";
import { sendNotification } from "../../components/pushNotifications";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 *
 * @returns List view item
 */

export const ListItem = ({ item, currentUser, currentTheme, setLoader }) => {
  // defines redux dispatch
  const dispatch = useDispatch();

  //
  const navigation = useNavigation();

  // language
  const language = Language();

  // defines socket server
  const socket = useSocket();

  // defines delete confirm dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Delete booking
   */
  const DeleteBooking = async () => {
    try {
      setLoader(true);
      await axios.delete(
        backendUrl +
          "/api/v1/bookings/booking/" +
          item.bookingNumber +
          "?user=" +
          currentUser._id
      );
      dispatch(setRerenderBookings());
      setTimeout(() => {
        setLoader(false);
      }, 200);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  // change status
  const UpdateBooking = async (body) => {
    try {
      await axios.patch(
        backendUrl + "/api/v1/bookings/booking/" + item.bookingNumber,
        body
      );
      if (item.client?.pushNotificationToken) {
        if (body?.status.client) {
          await sendNotification(
            item.client?.pushNotificationToken,
            currentUser.name,
            "has changed booking status to - " + body.status.client,
            { type: "booking", status: body.status.client }
          );
        } else {
          await sendNotification(
            item.client?.pushNotificationToken,
            currentUser.name,
            "has sent you a new status date - " + body.date,
            { type: "booking", date: body.date }
          );
        }
        socket.emit("UpdateBookings", {
          targetId: item.client?._id,
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // status option
  const [selectedItem, setSelectedItem] = useState(item.status.seller);
  const [openStatusOption, setOpenStatusOption] = useState(false);

  // defines beautyverse procedures list
  const proceduresOptions = ProceduresOptions();

  // define some style
  let font = currentTheme.font;
  // if (selectedItem === "new") {
  //   bg = "green";
  //   font = "green";
  // } else if (selectedItem === "pending") {
  //   bg = "orange";
  //   font = "orange";
  // } else if (selectedItem === "canceled" || selectedItem === "rejected") {
  //   bg = currentTheme.disabled;
  //   font = currentTheme.disabled;
  // } else if (selectedItem === "active") {
  //   bg = currentTheme.pink;
  //   font = currentTheme.pink;
  // } else {
  //   bg = "#ccc";
  //   font = "#ccc";
  // }

  // creates link by url
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  // navigate to chat
  const rooms = useSelector((state) => state.storeChat.rooms);

  let chatDefined =
    currentUser._id !== item.client._id &&
    rooms.find(
      (r) =>
        (r.members.member1 === currentUser._id ||
          r.members.member1 === item.client._id) &&
        (r.members.member2 === currentUser._id ||
          r.members.member2 === item.client._id)
    );

  // get chat room
  const GetNewChatRoom = async () => {
    let newChat = {
      room: currentUser?._id + item.client._id,
      members: {
        member1: currentUser._id,
        member2: item.client._id,
        member2Cover: item.client.cover,
        member2Name: item.client.name,
      },
      lastMessage: "",
      lastSender: "",
      status: "read",
      lastMessageSeen: "",
    };
    try {
      navigation.navigate("Room", {
        newChat,
        user: item.client,
      });
      const response = await axios.post(backendUrl + "/api/v1/chats/", {
        room: currentUser?._id + item.client._id,
        members: {
          member1: currentUser._id,
          member2: item.client._id,
        },
        lastMessage: "",
        lastSender: "",
        status: "read",
      });
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
        user: item?.client,
        screenHeight: screenHeight,
      });
      if (Room.lastSender !== currentUser._id) {
        await axios.patch(backendUrl + "/api/v1/chats/" + Room.room, {
          status: "read",
          // lastMessageSeen: "seen",
        });
      }
      let currentRoomIndex = rooms.findIndex((r) => r._id === Room._id);

      if (currentRoomIndex !== -1) {
        let newRooms = [...rooms];
        newRooms[currentRoomIndex] = {
          ...newRooms[currentRoomIndex],
          status: "read",
          // lastMessageSeen:
          //   Room.lastSender !== currentUser._id ? "seen" : "unread",
        };
        dispatch(setRooms(newRooms));
      }
      dispatch(setRerenderScroll());
    } catch (error) {
      console.log(error);
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
        contentContainerStyle={{
          height: openStatusOption ? 205 : 40,
          paddingRight: 80,
          alignItems: openStatusOption ? "skretch" : "center",
          // justifyContent: "center",
          borderWidth: 1,
          borderColor: currentTheme.line,
        }}
        style={
          {
            // padding: 15,
            // borderRadius: 10,
          }
        }
      >
        {openDeleteDialog && (
          <View style={{ zIndex: 10000, position: "absolute" }}>
            <DeleteConfirm
              title={language?.language?.Bookings?.bookings?.areYouSure}
              isVisible={openDeleteDialog}
              cancel={language?.language?.Bookings?.bookings?.cancel}
              delet={language?.language?.Bookings?.bookings?.delete}
              onClose={() => setOpenDeleteDialog(false)}
              onDelete={DeleteBooking}
            />
          </View>
        )}
        <View style={{ marginLeft: 8 }}>
          <StatusPopup
            currentTheme={currentTheme}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            UpdateBooking={UpdateBooking}
            Delete={DeleteBooking}
            from="listItem"
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: "row" }}
          onLongPress={() => {
            Vibration.vibrate();
            setOpenDeleteDialog(true);
          }}
        >
          <View
            style={{
              height: openStatusOption ? 205 : 40,
              borderRightWidth: 1,
              borderColor: currentTheme.line,
              padding: 5,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(() => {
              // let formattedDateWithMonthName = moment
              //   .utc(item.date)
              //   .format("DD MMMM YYYY - HH:mm");
              let dt = moment.utc(item?.date).format("DD MMMM YYYY");
              let tm = moment.utc(item?.date).format("HH:mm");

              // For Today
              let Today = moment()
                .tz(Localization.timezone)
                .format("DD MMMM YYYY");
              // For yesterday
              let yesterday = moment()
                .tz(Localization.timezone)
                .subtract(1, "days")
                .format("DD MMMM YYYY");

              // For tomorrow
              let tomorrow = moment()
                .tz(Localization.timezone)
                .add(1, "days")
                .format("DD MMMM YYYY");

              let initialDate;
              if (dt === Today) {
                initialDate = language?.language?.Bookings?.bookings?.today;
              } else if (dt === yesterday) {
                initialDate = language?.language?.Bookings?.bookings?.yesterday;
              } else if (dt === tomorrow) {
                initialDate = language?.language?.Bookings?.bookings?.tomorrow;
              } else {
                initialDate = dt;
              }

              return (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: font, letterSpacing: 0.2 }}>
                    {initialDate}
                  </Text>
                  <Text style={{ color: font, letterSpacing: 0.2 }}>
                    {" - " + tm}
                  </Text>
                </View>
              );
            })()}
            {/* <Text style={{ color: font, letterSpacing: 0.3 }}>
              {(() => {
                let formattedDateInTimezone = moment(item.date)
                  .tz(Localization.timezone)
                  .format("DD/MM/YYYY - HH:mm");

                return formattedDateInTimezone;
              })()}
            </Text> */}
          </View>

          <View
            style={{
              flex: 1,
              borderRightWidth: 1,
              borderColor: currentTheme.line,
              // padding: 5,
              // paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              {(() => {
                let lab = proceduresOptions?.find(
                  (it) =>
                    it?.value?.toLowerCase() ===
                    item?.bookingProcedure?.toLowerCase()
                );

                return lab?.label;
              })()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRightWidth: 1,
              borderColor: currentTheme.line,
              padding: 5,
              // paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: font }}>
              {language?.language?.Bookings?.bookings?.price}:{" "}
            </Text>
            {item.bookingSum ? (
              <>
                <Text style={{ color: font, letterSpacing: 0.2 }}>
                  {item.bookingSum}{" "}
                </Text>
                {item?.currency === "Dollar" ? (
                  <FontAwesome name="dollar" color={"#111"} size={14} />
                ) : item?.currency === "Euro" ? (
                  <FontAwesome name="euro" color={"#111"} size={14} />
                ) : (
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: font,
                      fontSize: 14,
                    }}
                  >
                    {"\u20BE"}
                  </Text>
                )}
              </>
            ) : (
              <Text
                style={{
                  color: font,
                  fontSize: 14,
                }}
              >
                N/A
              </Text>
            )}
          </View>
          <View
            style={{
              gap: 10,
              flexDirection: "row",
              alignItems: "center",
              padding: 5,
              paddingHorizontal: 10,
              height: "100%",
              borderRightWidth: 1,
              borderColor: currentTheme.line,
            }}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              {language?.language?.Bookings?.bookings?.client}:
            </Text>
            <View
              style={{
                borderRadius: 10,
                gap: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                acitveOpacity={0.3}
                onPress={
                  item.client?._id
                    ? () =>
                        navigation.navigate("UserVisit", {
                          user: item.client,
                        })
                    : undefined
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {item.client?.cover ? (
                  <CacheableImage
                    style={{
                      width: 30,
                      aspectRatio: 0.95,
                      resizeMode: "cover",
                      borderRadius: 50,
                    }}
                    source={{
                      uri: item.client?.cover,
                    }}
                    manipulationOptions={[
                      {
                        resize: {
                          width: "100%",
                          aspectRatio: 0.95,
                          resizeMode: "cover",
                        },
                      },
                      { rotate: 90 },
                    ]}
                  />
                ) : (
                  <FontAwesome name="user" size={20} color="#e5e5e5" />
                )}

                <Text style={{ color: font, letterSpacing: 0.3 }}>
                  {item.client.name}
                </Text>
              </TouchableOpacity>
              {item.client?._id && (
                <TouchableOpacity
                  style={{ padding: 5, paddingHorizontal: 4 }}
                  activeOpacity={0.3}
                  onPress={
                    chatDefined ? () => GetChatRoom() : () => GetNewChatRoom()
                  }
                >
                  <MaterialCommunityIcons
                    name="chat-processing"
                    size={22}
                    color={currentTheme.font}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() =>
                handleLinkPress(`tel:${item?.client?.phone.phone}`)
              }
              style={{
                height: "100%",
                paddingHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
                borderRightWidth: 1,
                borderColor: currentTheme.line,
              }}
            >
              <Text style={{ color: font, letterSpacing: 0.3 }}>
                {language?.language?.Bookings?.bookings?.phone}:{" "}
                {item?.client?.phone?.phone}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              padding: 5,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              {language?.language?.Bookings?.bookings?.bookedAt}:{" "}
            </Text>
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              {(() => {
                let formattedDateInTimezone = moment(item.date)
                  .tz(Localization.timezone)
                  .format("DD/MM/YYYY - HH:mm");

                return formattedDateInTimezone;
              })()}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};
