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
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import DeleteConfirm from "../../components/confirmDialog";
import { useSocket } from "../../context/socketContext";
import { ProceduresOptions } from "../../datas/registerDatas";
import { setOrders } from "../../redux/orders";
import { setRerenderOrders } from "../../redux/rerenders";
import ItemDateAndTimePicker from "../../screens/orders/itemDateAndTimePicker";
import { StatusPopup } from "../../screens/orders/statusPopup";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  setRooms,
  setCurrentChat,
  setRerederRooms,
  setRerenderScroll,
} from "../../redux/chat";

/**
 * Order card item
 */

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Card = ({
  item,
  currentUser,
  currentTheme,
  navigation,
  setLoader,
}) => {
  // defines socket server
  const socket = useSocket();

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines all orders
  const orders = useSelector((state) => state.storeOrders.orders);

  // creates link by url
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  // copy item id
  const [copySuccess, setCopySuccess] = useState(null);
  const copyToClipboard = () => {
    Clipboard.setString(item?.orderNumber);
    setCopySuccess("Id copied!");
  };

  useEffect(() => {
    if (copySuccess) {
      setTimeout(() => setCopySuccess(null), 2000); // Remove the message after 2 seconds
    }
  }, [copySuccess]);

  // edit request
  const [editRequest, setEditRequest] = useState(false);

  // If you want to keep the format consistent with JavaScript's Date object, you can format it like so:
  const [dateAndTime, setDateAndTime] = useState(item.date);

  // defines beautyverse procedures list
  const proceduresOptions = ProceduresOptions();

  // delete confirm state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  /**
   * Delete order
   */
  const DeleteOrder = async () => {
    try {
      setLoader(true);
      await axios.delete(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/orders/" +
          item._id
      );
      dispatch(setRerenderOrders());
      setTimeout(() => {
        setLoader(false);
      }, 200);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  // change status
  const UpdateOrder = async (val) => {
    try {
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/orders/" +
          item.orderNumber,
        {
          status: val,
        }
      );
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          item.user._id +
          "/sentorders/" +
          item.orderNumber,
        {
          status: val,
        }
      );
      socket.emit("updateOrders", {
        targetId: item.user?._id,
      });
      dispatch(setRerenderOrders());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * Edit item when client returns request you sent before
   */
  const ReturnRequest = async (val) => {
    try {
      dispatch(
        setOrders(
          orders.map((order) =>
            order._id === item._id
              ? { ...order, date: dateAndTime.date, status: "pending" }
              : order
          )
        )
      );
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/orders/" +
          item.orderNumber +
          "?return=true",
        {
          ...item,
          user: {
            id: item.user._id,
            phone: item.user.phone,
            name: item.user.name,
          },
          date: dateAndTime,
          status: "pending",
        }
      );

      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          item.user._id +
          "/sentorders/" +
          item.orderNumber +
          "?return=true",
        {
          ...item,
          user: {
            id: currentUser._id,
            phone: currentUser.phone,
            name: currentUser.name,
          },
          date: dateAndTime,
          status: "new",
        }
      );
      dispatch(setRerenderOrders());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // status option
  const [selectedItem, setSelectedItem] = useState(item.status);

  // define some style for item
  let bg;
  let font;
  if (selectedItem === "new") {
    bg = "green";
    font = "#ccc";
  } else if (selectedItem === "pending") {
    bg = "orange";
    font = "#111";
  } else if (selectedItem === "canceled" || selectedItem === "rejected") {
    bg = currentTheme.disabled;
    font = "#ccc";
  } else if (selectedItem === "active") {
    bg = currentTheme.pink;
    font = "#111";
  } else {
    bg = currentTheme.background2;
    font = "#ccc";
  }

  // navigate to chat
  const rooms = useSelector((state) => state.storeChat.rooms);

  let chatDefined =
    currentUser._id !== item.user?._id &&
    rooms.find(
      (r) =>
        (r.members.member1 === currentUser._id ||
          r.members.member1 === item.user?._id) &&
        (r.members.member2 === currentUser._id ||
          r.members.member2 === item.user?._id)
    );

  // get chat room
  const GetNewChatRoom = async () => {
    let newChat = {
      room: currentUser?._id + item.user?._id,
      members: {
        member1: currentUser._id,
        member2: item.user?._id,
        member2Cover: item.user?.cover,
        member2Name: item.user?.name,
      },
      lastMessage: "",
      lastSender: "",
      status: "read",
    };
    try {
      navigation.navigate("Room", {
        newChat,
        user: item.user,
      });
      const response = await axios.post(
        "https://beautyverse.herokuapp.com/api/v1/chats/",
        {
          room: currentUser?._id + item.user?._id,
          members: {
            member1: currentUser._id,
            member2: item.user?._id,
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
        user: item?.user,
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
      console.log(error);
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <>
      {openDeleteDialog && (
        <View style={{ zIndex: 1000, position: "absolute" }}>
          <DeleteConfirm
            title="Are you sure to want to delete this order?"
            isVisible={openDeleteDialog}
            cancel="Cancel"
            delet="Delete"
            onClose={() => setOpenDeleteDialog(false)}
            onDelete={DeleteOrder}
          />
        </View>
      )}
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={() => {
          setOpenDeleteDialog(true);
          Vibration.vibrate();
        }}
        delayLongPress={200}
        style={{
          padding: 15,
          paddingVertical: 10,
          borderRadius: 10,
          backgroundColor: bg,
          gap: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              padding: 5,
              paddingHorizontal: 0,
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            {editRequest ? (
              <View style={{ width: "100%", alignItems: "center" }}>
                <ItemDateAndTimePicker
                  targetUser={currentUser}
                  dateAndTime={dateAndTime}
                  setDateAndTime={setDateAndTime}
                  orderId={item.orderNumber}
                  orderDuration={item.duration}
                  orderDate={item.date}
                />
              </View>
            ) : (
              <>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: font,
                    letterSpacing: 0.2,
                  }}
                >
                  Date:{" "}
                </Text>
                <Text style={{ color: font, letterSpacing: 0.2 }}>
                  {(() => {
                    let formattedDateWithMonthName = moment
                      .utc(item.date)
                      .format("DD MMMM YYYY - HH:mm");
                    return formattedDateWithMonthName;
                  })()}
                </Text>
              </>
            )}
          </View>
          {!editRequest && (
            <StatusPopup
              currentTheme={currentTheme}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              UpdateOrder={UpdateOrder}
              Delete={DeleteOrder}
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
            overflow: "hidden",
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
                  item?.orderedProcedure?.toLowerCase()
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
          {item.orderSum ? (
            <>
              <Text style={{ color: font, letterSpacing: 0.2 }}>
                {item.orderSum}{" "}
              </Text>
              {item?.currency === "Dollar" ? (
                <FontAwesome name="dollar" color={font} size={14} />
              ) : item?.currency === "Euro" ? (
                <FontAwesome name="euro" color={font} size={14} />
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
              {item.orderNumber.length > 5
                ? item.orderNumber.substring(0, 10) + "..."
                : item.orderNumber}
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
            Client:
          </Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.1)",
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
                item.user?._id
                  ? () =>
                      navigation.navigate("UserVisit", {
                        user: item.user,
                      })
                  : undefined
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              {item.user.cover ? (
                <CacheableImage
                  style={{
                    width: 40,
                    aspectRatio: 0.95,
                    resizeMode: "cover",
                    borderRadius: 50,
                  }}
                  source={{
                    uri: item?.user?.cover,
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
                {item.user.name}
              </Text>
            </TouchableOpacity>
            {item.user?._id && (
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
          {item?.user?.phone && (
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() => handleLinkPress(`tel:${item?.user?.phone}`)}
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <MaterialCommunityIcons name="phone" size={22} color={font} />
              <Text style={{ color: font, letterSpacing: 0.3 }}>
                {item?.user?.phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
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
              Ordered At:{" "}
              <Text
                style={{
                  color: font,
                  letterSpacing: 0.2,
                  fontSize: 12,
                  fontWeight: "normal",
                }}
              >
                {(() => {
                  let formattedDateInTimezone = moment(item.orderedAt)
                    .tz(Localization.timezone)
                    .format("DD MMMM YYYY - HH:mm");

                  return formattedDateInTimezone;
                })()}
              </Text>
            </Text>
          </View>
          {item.status === "new" && !editRequest ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 25,
                backgroundColor: currentTheme.background2,
                borderRadius: 50,
                padding: 5,
                paddingHorizontal: 15,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  UpdateOrder("rejected");
                  dispatch(setRerenderOrders());
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
                  UpdateOrder("active");
                  dispatch(setRerenderOrders());
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
                gap: 25,
                backgroundColor: currentTheme.background2,
                borderRadius: 50,
                padding: 5,
                paddingHorizontal: 15,
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
                  dispatch(setRerenderOrders());
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
