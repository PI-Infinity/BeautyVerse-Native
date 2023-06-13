import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setStatusFilter } from "../../redux/orders";
import { setStatusFilterSentOrders } from "../../redux/sentOrders";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const SortPopup = ({ currentTheme, from }) => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.storeOrders.statusFilter);
  const newOrders = useSelector((state) => state.storeOrders.new);

  const [isPickerVisible, setPickerVisibility] = useState(false);

  const newSentOrders = useSelector((state) => state.storeSentOrders.new);

  const items = [
    { label: "All", value: "" },
    { label: "New", value: "new" },
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Canceled", value: "canceled" },
    { label: "Rejected", value: "rejected" },
  ];

  const openPicker = () => {
    setPickerVisibility(true);
  };

  const handleSelect = (value) => {
    if (from === "orders") {
      dispatch(setStatusFilter(value));
    } else {
      dispatch(setStatusFilterSentOrders(value));
    }
    setPickerVisibility(false);
  };
  const closePicker = () => {
    handleSelect();
  };

  return (
    <View
      style={{
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          // justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <TouchableOpacity
          onPress={openPicker}
          style={{
            backgroundColor: currentTheme.background2,
            width: "100%",
            borderRadius: 50,
            // padding: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Text
            style={{
              color: currentTheme.font,
              letterSpacing: 0.3,
            }}
          >
            {filter ? filter : "All"}{" "}
            <FontAwesome name="unsorted" size={18} color={currentTheme.pink} />
          </Text>
          {((from === "orders" && newOrders > 0) ||
            (from === "sentOrders" && newSentOrders > 0)) && (
            <View
              style={{
                height: 14,
                minWidth: 14,
                backgroundColor: "green",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
              }}
            >
              <Text style={{ fontSize: 10, color: "#f1f1f1" }}>
                {from === "orders" ? newOrders : newSentOrders}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isPickerVisible} // Set this to a boolean state to control the visibility of the modal
        onBackdropPress={() => setPickerVisibility(false)} // Handle backdrop press event
        style={{
          // justifyContent: "center",
          alignItems: "center",
          width: SCREEN_WIDTH - 40,
          marginRight: 15,
        }}
        animationIn="zoomIn"
        animationOut="fadeOut"
        backdropColor="black"
        backdropOpacity={0.7}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: currentTheme.background },
          ]}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.item,
                {
                  backgroundColor:
                    filter === item.value
                      ? currentTheme.pink
                      : currentTheme.background,
                  borderWidth: 1,
                  borderColor: currentTheme.line,
                  color: filter === item.value ? "#ccc" : currentTheme.font,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                },
              ]}
              onPress={() => handleSelect(item.label)}
            >
              <Text
                style={[
                  styles.itemText,
                  {
                    color:
                      item.value === "active"
                        ? currentTheme.pink
                        : item.value === "completed"
                        ? currentTheme.font
                        : item.value === "new"
                        ? "green"
                        : item.value === "pending"
                        ? "orange"
                        : item.value === ""
                        ? currentTheme.font
                        : currentTheme.disabled,
                  },
                ]}
              >
                {item.label}
              </Text>
              {item.value === "new" && (newOrders > 0 || newSentOrders > 0) && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 16,
                    height: 16,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    {from === "orders"
                      ? newOrders
                      : from === "sentOrders"
                      ? newSentOrders
                      : null}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: "70%",
    borderRadius: 10,
    backgroundColor: "red",
    gap: 8,
    marginTop: 10,
  },
  item: {
    width: "100%",
    padding: 10,
    borderRadius: 50,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
});
