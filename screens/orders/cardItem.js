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
import { useState } from "react";
import { StatusPopup } from "../../screens/orders/statusPopup";
import { useSelector, useDispatch } from "react-redux";
import { setOrders } from "../../redux/orders";
import { setRerenderOrders } from "../../redux/rerenders";
import { BackDrop } from "../../components/backDropLoader";

export const Card = ({
  item,
  currentUser,
  currentTheme,
  navigation,
  setLoader,
}) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.storeOrders.orders);
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
      }, 1000);
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
      // dispatch(setRerenderOrders());
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
          borderRadius: 10,
          backgroundColor: bg,
          gap: 5,
        }}
      >
        {openStatusOption && selectedItem !== "new" && (
          <View
            style={{ position: "absolute", top: 10, right: 10, zIndex: 10000 }}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: font, letterSpacing: 0.3, fontWeight: "bold" }}>
            N{item.orderNumber}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setOpenStatusOption(true)}
          >
            <Text style={{ color: font, letterSpacing: 0.3 }}>
              {selectedItem}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: font, letterSpacing: 0.3 }}>
          Procedure: {item.orderedProcedure}
        </Text>
        <Text style={{ color: font, letterSpacing: 0.3 }}>
          Date: {item.date.slice(0, 16)}
        </Text>
        <Text style={{ color: font, letterSpacing: 0.3 }}>
          Price: {item.orderSum} {currentUser.currency}
        </Text>
        <View style={{ marginTop: 10, gap: 10 }}>
          <Text style={{ color: font, letterSpacing: 0.3 }}>Client:</Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "#333",
              padding: 10,
              borderRadius: 10,
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
                      navigation.navigate("OrderUserVisit", {
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
              <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
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
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: font, letterSpacing: 0.3, marginTop: 10 }}>
            Ordered At: {item.orderAt}
          </Text>
          {item.status === "new" && (
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
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => UpdateOrder("rejected")}
              >
                <FontAwesome size={20} name="remove" color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => UpdateOrder("active")}
              >
                <FontAwesome size={20} name="check" color="green" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};
