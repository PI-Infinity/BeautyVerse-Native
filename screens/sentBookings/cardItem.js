import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import * as Localization from "expo-localization";
import moment from "moment";
import "moment-timezone";
import { useEffect, useState } from "react";
import {
  Linking,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import DeleteConfirm from "../../components/confirmDialog";
import { useSocket } from "../../context/socketContext";
import { ProceduresOptions } from "../../datas/registerDatas";
import { setRerenderBookings } from "../../redux/rerenders";
import ItemDateAndTimePicker from "../bookings/itemDateAndTimePicker";
import { StatusPopup } from "../bookings/statusPopup";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  setRooms,
  setCurrentChat,
  setRerederRooms,
  setRerenderScroll,
} from "../../redux/chat";
import { useNavigation } from "@react-navigation/native";
import { sendNotification } from "../../components/pushNotifications";
import { setSentBookings } from "../../redux/sentBookings";
import { Language } from "../../context/language";
import * as Haptics from "expo-haptics";

/**
 * Card item for sent bookings
 */

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Card = ({
  item,
  currentUser,
  currentTheme,

  setLoader,
}) => {
  // defines redux dispatch
  const dispatch = useDispatch();

  //
  const navigation = useNavigation();

  //
  const language = Language();

  // defines socket server
  const socket = useSocket();

  // defines link from url
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  // copy id
  const [copySuccess, setCopySuccess] = useState(null);
  const copyToClipboard = () => {
    Clipboard.setString(item?.bookingNumber);
    setCopySuccess("Id copied!");
  };

  useEffect(() => {
    if (copySuccess) {
      setTimeout(() => setCopySuccess(null), 2000); // Remove the message after 2 seconds
    }
  }, [copySuccess]);

  // defines beautyverse procedures
  const proceduresOptions = ProceduresOptions();

  // defines confirm dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // edit request
  const [editRequest, setEditRequest] = useState(false);

  // defines date and time
  const [dateAndTime, setDateAndTime] = useState(item.date);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Delete booking function
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

      if (item.seller?.pushNotificationToken) {
        if (body?.status.seller) {
          await sendNotification(
            item.seller?.pushNotificationToken,
            currentUser.name,
            "has changed booking status to - " + body.status.seller,
            { type: "booking", status: body.status.seller }
          );
        }
        socket.emit("updateBookings", {
          targetId: item.seller?._id,
        });
      }
      dispatch(setRerenderBookings());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * Edit returned booking
   */

  // defines all bookings
  const bookings = useSelector((state) => state.storeSentBookings.sentBookings);

  const ReturnRequest = async (val) => {
    try {
      dispatch(
        setSentBookings(
          bookings.map((booking) =>
            booking._id === item._id
              ? {
                  ...booking,
                  date: dateAndTime.date,
                  status: { client: "pending", seller: "new" },
                }
              : booking
          )
        )
      );
      await axios.patch(
        backendUrl +
          "/api/v1/bookings/booking/" +
          item.bookingNumber +
          "?return=true",
        {
          ...item,
          client: {
            id: currentUser._id,
            phone: currentUser.phone,
            name: currentUser.name,
          },
          seller: {
            id: item.seller?._id,
            phone: item.seller?.phone,
            name: item.seller?.name,
          },
          date: dateAndTime,
          status: { client: "pending", seller: "new" },
        }
      );

      let lab = proceduresOptions?.find(
        (it) =>
          it?.value?.toLowerCase() === item?.bookingProcedure?.toLowerCase()
      );
      if (item.seller?.pushNotificationToken) {
        await sendNotification(
          item.seller?.pushNotificationToken,
          currentUser.name,
          "return you an appointment request!",
          { type: "booking", status: "new" }
        );
      }
      dispatch(setRerenderBookings());
      socket.emit("updateBookings", {
        targetId: item.seller._id,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // status option
  const [selectedItem, setSelectedItem] = useState(item.status.client);
  const [openStatusOption, setOpenStatusOption] = useState(false);

  // define some style

  let font = currentTheme.font;

  // navigate to chat
  const rooms = useSelector((state) => state.storeChat.rooms);

  let chatDefined =
    currentUser._id !== item.seller._id &&
    rooms.find(
      (r) =>
        (r.members.member1 === currentUser._id ||
          r.members.member1 === item.seller._id) &&
        (r.members.member2 === currentUser._id ||
          r.members.member2 === item.seller._id)
    );

  // get chat room
  const GetNewChatRoom = async () => {
    let newChat = {
      room: currentUser?._id + item.seller._id,
      members: {
        member1: currentUser._id,
        member2: item.seller._id,
        member2Cover: item.seller.cover,
        member2Name: item.seller.name,
      },
      lastMessage: "",
      lastSender: "",
      status: "read",
      lastMessageSeen: "",
    };
    try {
      navigation.navigate("Room", {
        newChat,
        user: item.seller,
      });
      const response = await axios.post(backendUrl + "/api/v1/chats/", {
        room: currentUser?._id + item.seller._id,
        members: {
          member1: currentUser._id,
          member2: item.seller._id,
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
        user: item?.seller,
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

  /**
   * Give rating function
   */
  const [rating, setRating] = useState(0);
  useEffect(() => {
    setRating(item?.rating);
  }, []);
  const GiveRating = async (val) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      setRating(val);
      await axios.patch(
        backendUrl +
          "/api/v1/bookings/booking/" +
          item.bookingNumber +
          "?user=" +
          item.seller._id,
        {
          rating: val,
        }
      );
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      {openDeleteDialog && (
        <View style={{ zIndex: 1000, position: "absolute" }}>
          <DeleteConfirm
            title="Are you sure to want to delete this booking?"
            isVisible={openDeleteDialog}
            cancel="Cancel"
            delet="Delete"
            onClose={() => setOpenDeleteDialog(false)}
            onDelete={DeleteBooking}
          />
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => {
          setOpenDeleteDialog(true);
          Vibration.vibrate();
        }}
        delayLongPress={200}
        style={{
          padding: 15,
          paddingVertical: 10,
          borderRadius: 10,
          height: 420,
          gap: 5,
          borderWidth: 1,
          borderColor: currentTheme.line,
        }}
      >
        <View
          style={{
            padding: 5,
            paddingHorizontal: 0,
            borderRadius: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          {editRequest ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <ItemDateAndTimePicker
                targetUser={item.seller}
                dateAndTime={dateAndTime}
                setDateAndTime={setDateAndTime}
                bookingId={item.bookingNumber}
                bookingDuration={item.duration}
                bookingDate={item.date}
              />
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontWeight: "bold", color: font, letterSpacing: 0.2 }}
              >
                Date:{" "}
              </Text>
              {(() => {
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
                  initialDate =
                    language?.language?.Bookings?.bookings?.yesterday;
                } else if (dt === tomorrow) {
                  initialDate =
                    language?.language?.Bookings?.bookings?.tomorrow;
                } else {
                  initialDate = dt;
                }

                return (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{ color: currentTheme.pink, letterSpacing: 0.3 }}
                    >
                      {initialDate}
                    </Text>
                    <Text
                      style={{ color: currentTheme.pink, letterSpacing: 0.3 }}
                    >
                      {" - " + tm}
                    </Text>
                  </View>
                );
              })()}
            </View>
          )}

          {!editRequest && (
            <StatusPopup
              currentTheme={currentTheme}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              UpdateBooking={UpdateBooking}
              Delete={DeleteBooking}
              from="sentBookings"
              setEditRequest={setEditRequest}
            />
          )}
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 50,
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Text style={{ fontWeight: "bold", color: font, letterSpacing: 0.2 }}>
            Procedure:{" "}
          </Text>
          <Text style={{ color: font, letterSpacing: 0.2 }}>
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
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 50,
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Text style={{ fontWeight: "bold", color: font, letterSpacing: 0.2 }}>
            Price:{" "}
          </Text>
          {item.bookingSum ? (
            <>
              <Text style={{ color: font, letterSpacing: 0.2 }}>
                {item.bookingSum}{" "}
              </Text>
              {item?.currency === "Dollar" ? (
                <FontAwesome
                  name="dollar"
                  color={currentTheme.font}
                  size={14}
                />
              ) : item?.currency === "Euro" ? (
                <FontAwesome name="euro" color={currentTheme.font} size={14} />
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
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 50,
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Text style={{ fontWeight: "bold", color: font, letterSpacing: 0.2 }}>
            Duration:{" "}
          </Text>

          <Text
            style={{
              color: font,
              fontSize: 14,
            }}
          >
            {item?.duration < 60
              ? item?.duration + " min."
              : item?.duration >= 60
              ? Math.floor(item?.duration / 60) +
                "h" +
                (item?.duration % 60 > 0
                  ? " " + (item?.duration % 60) + " min."
                  : "")
              : "N/A"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={copyToClipboard}
          style={{ paddingHorizontal: 10, padding: 5 }}
        >
          <Text style={{ color: font, letterSpacing: 0.3, fontWeight: "bold" }}>
            Id:{" "}
            <Text style={{ fontWeight: "normal" }}>
              {item.bookingNumber.length > 5
                ? item.bookingNumber.substring(0, 10) + "..."
                : item.bookingNumber}
            </Text>
          </Text>
          {copySuccess ? (
            <View
              style={{
                position: "absolute",
                top: -5,
                left: 20,
                zIndex: 20000,
                padding: 5,
                paddingHorizontal: 7.5,
                backgroundColor: currentTheme.disabled,
                borderRadius: 50,
                width: 80,
                opacity: 0.9,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                }}
              >
                {copySuccess}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={{ marginTop: 10, gap: 10 }}>
          <Text style={{ color: font, letterSpacing: 0.3, fontWeight: "bold" }}>
            Specialist:
          </Text>
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 10,
              paddingVertical: 5,
              borderRadius: 50,
              gap: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={
                item.seller?._id
                  ? () =>
                      navigation.navigate("User", {
                        user: item.seller,
                      })
                  : undefined
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              {item.seller.cover ? (
                <CacheableImage
                  style={{
                    width: 40,
                    aspectRatio: 0.95,
                    resizeMode: "cover",
                    borderRadius: 50,
                  }}
                  source={{
                    uri: item?.seller?.cover,
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
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome name="user" size={24} color={font} />
                </TouchableOpacity>
              )}
              <Text
                style={{ color: font, letterSpacing: 0.3, fontWeight: "bold" }}
              >
                {item.seller.name}
              </Text>
            </TouchableOpacity>
            {item.seller?._id && (
              <TouchableOpacity
                style={{ padding: 5, paddingHorizontal: 10 }}
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
          {item?.seller?.phone && (
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() =>
                handleLinkPress(`tel:${item?.seller?.phone.phone}`)
              }
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <MaterialCommunityIcons name="phone" size={22} color={font} />
              <Text style={{ color: font, letterSpacing: 0.3 }}>
                {item?.seller?.phone.phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {selectedItem === "completed" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
              width: "100%",
              paddingVertical: 8,
            }}
          >
            <Pressable onPress={() => GiveRating(1)}>
              <FontAwesome
                name="heart"
                size={22}
                color={rating > 0 ? currentTheme.pink : currentTheme.disabled}
              />
            </Pressable>
            <Pressable onPress={() => GiveRating(2)}>
              <FontAwesome
                name="heart"
                size={22}
                color={rating > 1 ? currentTheme.pink : currentTheme.disabled}
              />
            </Pressable>
            <Pressable onPress={() => GiveRating(3)}>
              <FontAwesome
                name="heart"
                size={22}
                color={rating > 2 ? currentTheme.pink : currentTheme.disabled}
              />
            </Pressable>
            <Pressable onPress={() => GiveRating(4)}>
              <FontAwesome
                name="heart"
                size={22}
                color={rating > 3 ? currentTheme.pink : currentTheme.disabled}
              />
            </Pressable>
            <Pressable onPress={() => GiveRating(5)}>
              <FontAwesome
                name="heart"
                size={22}
                color={rating > 4 ? currentTheme.pink : currentTheme.disabled}
              />
            </Pressable>
          </View>
        )}

        <View
          style={{
            // flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 5,
              paddingHorizontal: 10,
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
              marginTop: 5,
            }}
          >
            <Text
              style={{
                color: font,
                letterSpacing: 0.3,
                fontWeight: "bold",
                fontSize: 12,
                fontStyle: "italic",
              }}
            >
              Bookinged At:{" "}
              <Text
                style={{
                  color: font,
                  letterSpacing: 0.2,
                  fontSize: 12,
                  fontWeight: "normal",
                }}
              >
                {(() => {
                  let formattedDateInTimezone = moment(item.bookingAt)
                    .tz(Localization.timezone)
                    .format("DD MMMM YYYY - HH:mm");

                  return formattedDateInTimezone;
                })()}
              </Text>
            </Text>
          </View>

          {item.status.client === "new" && !editRequest ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 45,
                backgroundColor: currentTheme.background2,
                borderRadius: 50,
                padding: 5,
                paddingHorizontal: 15,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  UpdateBooking({
                    status: { client: "rejected", seller: "rejected" },
                  });
                  dispatch(setRerenderBookings());
                }}
              >
                <FontAwesome size={20} name="remove" color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setEditRequest(true);
                }}
              >
                <FontAwesome
                  size={18}
                  name="edit"
                  color="orange"
                  style={{ marginTop: 3, marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  UpdateBooking({
                    status: { client: "active", seller: "active" },
                  });
                }}
              >
                <FontAwesome size={20} name="check" color="green" />
              </TouchableOpacity>
            </View>
          ) : editRequest ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 45,
                backgroundColor: currentTheme.background2,
                borderRadius: 50,
                padding: 5,
                paddingHorizontal: 15,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setEditRequest(false);
                  setDateAndTime(item.date);
                }}
              >
                <Text style={{ fontWeight: "bold", color: "red" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  ReturnRequest();
                  // dispatch(setRerenderBookings());
                }}
              >
                <Text style={{ fontWeight: "bold", color: "green" }}>Send</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </>
  );
};
