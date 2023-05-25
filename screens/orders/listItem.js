import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Vibration,
} from "react-native";
import { CacheableImage } from "../../components/cacheableImage";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import DeleteConfirm from "../../components/confirmDialog";
import { useState } from "react";
import { StatusPopup } from "../../screens/orders/statusPopup";
import { useSelector, useDispatch } from "react-redux";
import { setOrders } from "../../redux/orders";
import { setRerenderOrders } from "../../redux/rerenders";

export const ListItem = ({ item, currentUser, currentTheme, navigation }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.storeOrders.orders);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const DeleteOrder = async () => {
    try {
      if (item._id) {
        dispatch(setOrders(orders.filter((order) => order._id !== item._id)));
      } else {
        dispatch(
          setOrders(orders.filter((order) => order.orderId !== item.orderId))
        );
      }
      await axios.delete(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/orders/" +
          item._id
      );
      dispatch(setRerenderOrders());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  // change status
  const UpdateOrder = async (val) => {
    try {
      dispatch(
        setOrders(
          orders.map((order) =>
            order._id === item._id ? { ...order, status: val } : order
          )
        )
      );
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/orders/" +
          item._id,
        {
          status: val,
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

  // define some styiling
  let bg;
  let font;
  if (selectedItem === "new") {
    bg = "green";
    font = "#ccc";
  } else if (selectedItem === "canceled" || selectedItem === "rejected") {
    bg = "red";
    font = "#ccc";
  } else if (selectedItem === "active") {
    bg = "orange";
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
          alignItems: openStatusOption ? "start" : "center",
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
        {openStatusOption && selectedItem !== "new" && (
          <View
            style={{ position: "absolute", top: 5, left: 5, zIndex: 10000 }}
          >
            <StatusPopup
              currentTheme={currentTheme}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              setOpenStatusOption={setOpenStatusOption}
              UpdateOrder={UpdateOrder}
            />
          </View>
        )}
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
              minWidth: 50,
            }}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              N{item.orderNumber}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setOpenStatusOption(true)}
            style={{
              // height: "100%",
              borderRightWidth: 1,
              borderColor: currentTheme.disabled,
              padding: 5,
              paddingHorizontal: 10,
              justifyContent: "center",
              minWidth: 150,
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Text
              style={{
                color: font,
                letterSpacing: 0.3,
              }}
            >
              Status: {selectedItem}
            </Text>
            {selectedItem === "new" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 30,
                  backgroundColor: currentTheme.background2,
                  borderRadius: 50,
                  padding: 5,
                  paddingHorizontal: 15,
                }}
              >
                <FontAwesome size={20} name="remove" color="red" />
                <FontAwesome size={20} name="check" color="green" />
              </View>
            )}
          </TouchableOpacity>
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
              Date: {item.date}
            </Text>
          </View>
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
              Procedure: {item.orderedProcedure}
            </Text>
          </View>
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
              Price: {item.orderSum} {currentUser.currency}
            </Text>
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
                        navigation.navigate("User", {
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
              height: "100%",
              padding: 5,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              Ordered At: {item.orderAt}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};
