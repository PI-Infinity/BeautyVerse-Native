import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Vibration,
} from "react-native";
import { CacheableImage } from "../../components/cacheableImage";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import DeleteConfirm from "../../components/confirmDialog";
import { useState, useEffect } from "react";
import { StatusPopup } from "../../screens/orders/statusPopup";
import { useSelector, useDispatch } from "react-redux";
import { setSentOrders } from "../../redux/sentOrders";
import { setRerenderOrders } from "../../redux/rerenders";
import { BackDrop } from "../../components/backDropLoader";
import { lightTheme, darkTheme } from "../../context/theme";
import { ProceduresOptions } from "../../datas/registerDatas";
import moment from "moment";
import "moment-timezone";
import * as Localization from "expo-localization";
import * as Clipboard from "expo-clipboard";
import ItemDateAndTimePicker from "../../screens/orders/itemDateAndTimePicker";

export const Card = ({
  item,
  currentUser,
  currentTheme,
  navigation,
  setLoader,
}) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.storeSentOrders.orders);
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const [copySuccess, setCopySuccess] = useState(null);
  const copyToClipboard = () => {
    Clipboard.setString(item?.orderNumber);
    setCopySuccess("Id copied!");
  };

  const proceduresOptions = ProceduresOptions();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // edit request
  const [editRequest, setEditRequest] = useState(false);

  const [dateAndTime, setDateAndTime] = useState(item.date);

  const DeleteOrder = async () => {
    try {
      setLoader(true);
      await axios.delete(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/sentOrders/" +
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
          item.user._id +
          "/orders/" +
          item.orderNumber,
        {
          status: val,
        }
      );
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/sentorders/" +
          item.orderNumber,
        {
          status: val,
        }
      );
      dispatch(setRerenderOrders());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const ReturnRequest = async (val) => {
    try {
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          item.user._id +
          "/orders/" +
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
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/sentorders/" +
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
      dispatch(setRerenderOrders());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // status option
  const [selectedItem, setSelectedItem] = useState(item.status);
  const [openStatusOption, setOpenStatusOption] = useState(false);

  // define some style
  let bg;
  let font;
  if (selectedItem === "pending") {
    bg = "orange";
    font = "#111";
  } else if (selectedItem === "new") {
    bg = "green";
    font = "#ccc";
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
          <Text style={{ color: font, letterSpacing: 0.3, fontWeight: "bold" }}>
            Id:{" "}
            {item.orderNumber.length > 5
              ? item.orderNumber.substring(0, 10) + "..."
              : item.orderNumber}
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
          <StatusPopup
            currentTheme={currentTheme}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setOpenStatusOption={setOpenStatusOption}
            UpdateOrder={UpdateOrder}
            Delete={DeleteOrder}
          />
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
          {editRequest ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <ItemDateAndTimePicker
                targetUser={item.user}
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
                style={{ fontWeight: "bold", color: font, letterSpacing: 0.2 }}
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
        <View style={{ marginTop: 10, gap: 10 }}>
          <Text style={{ color: font, letterSpacing: 0.3, fontWeight: "bold" }}>
            Specialist:
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
                  // onPress={
                  //   props.from !== "scrollGallery"
                  //     ? () =>
                  //         props.navigation.navigate("User", {
                  //           user: props.user,
                  //         })
                  //     : undefined
                  // }
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
