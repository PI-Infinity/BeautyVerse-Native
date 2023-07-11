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
} from "react-native";
import { useDispatch } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import DeleteConfirm from "../../components/confirmDialog";
import { useSocket } from "../../context/socketContext";
import { ProceduresOptions } from "../../datas/registerDatas";
import { setRerenderOrders } from "../../redux/rerenders";
import { StatusPopup } from "../../screens/orders/statusPopup";

/**
 *
 * @returns List view item
 */

export const ListItem = ({
  item,
  currentUser,
  currentTheme,
  navigation,
  setLoader,
}) => {
  // defines redux dispatch
  const dispatch = useDispatch();

  // defines socket server
  const socket = useSocket();

  // defines delete confirm dialog
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
      console.log(val);
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

  // status option
  const [selectedItem, setSelectedItem] = useState(item.status);
  const [openStatusOption, setOpenStatusOption] = useState(false);

  // defines beautyverse procedures list
  const proceduresOptions = ProceduresOptions();

  // define some style
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
        }}
        style={{
          // padding: 15,
          borderRadius: 10,
          backgroundColor: bg,
        }}
      >
        {openDeleteDialog && (
          <View style={{ zIndex: 10000, position: "absolute" }}>
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
        <View style={{ marginLeft: 8 }}>
          <StatusPopup
            currentTheme={currentTheme}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            UpdateOrder={UpdateOrder}
            Delete={DeleteOrder}
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
              height: "100%",
              borderRightWidth: 1,
              borderColor: currentTheme.disabled,
              padding: 5,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              {(() => {
                let formattedDateInTimezone = moment(item.date)
                  .tz(Localization.timezone)
                  .format("DD/MM/YYYY - HH:mm");

                return formattedDateInTimezone;
              })()}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              borderRightWidth: 1,
              borderColor: currentTheme.disabled,
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
                    item?.orderedProcedure?.toLowerCase()
                );

                return lab?.label;
              })()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRightWidth: 1,
              borderColor: currentTheme.disabled,
              padding: 5,
              // paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>Price: </Text>
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
              gap: 10,
              flexDirection: "row",
              alignItems: "center",
              padding: 5,
              paddingHorizontal: 10,
              height: "100%",
              borderRightWidth: 1,
              borderColor: currentTheme.disabled,
            }}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>Client:</Text>
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
                {item.user?.cover ? (
                  <CacheableImage
                    style={{
                      width: 30,
                      aspectRatio: 0.95,
                      resizeMode: "cover",
                      borderRadius: 50,
                    }}
                    source={{
                      uri: item.user?.cover,
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
          </View>
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => handleLinkPress(`tel:${item?.user?.phone}`)}
            style={{
              height: "100%",
              padding: 5,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              Phone: {item?.user?.phone}
            </Text>
          </TouchableOpacity>
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
            <Text style={{ color: font, letterSpacing: 0.3 }}>Ordered At:</Text>
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
