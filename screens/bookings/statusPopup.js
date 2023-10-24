import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Language } from "../../context/language";

/**
 * Status popup for bookings item
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const StatusPopup = ({
  currentTheme,
  selectedItem,
  setSelectedItem,
  UpdateBooking,
  Delete,
  from,
  setEditRequest,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  // defines language
  const language = Language();

  const items = [
    { label: language?.language?.Bookings?.bookings?.active, value: "active" },
    { label: language?.language?.Bookings?.bookings?.new, value: "new" },
    {
      label: language?.language?.Bookings?.bookings?.pending,
      value: "pending",
    },
    {
      label: language?.language?.Bookings?.bookings?.completed,
      value: "completed",
    },
    {
      label: language?.language?.Bookings?.bookings?.canceled,
      value: "canceled",
    },
    {
      label: language?.language?.Bookings?.bookings?.rejected,
      value: "rejected",
    },
    { label: language?.language?.Bookings?.bookings?.edit, value: "edit" },
    { label: language?.language?.Bookings?.bookings?.delete, value: "delete" },
  ];

  const handleSelect = (value) => {
    UpdateBooking({ status: { client: value, seller: value } });
    setSelectedItem(value);
    setModalVisible(false);
  };

  // define some style
  let bg;
  let font;
  if (selectedItem === "new") {
    bg = "green";
    font = "green";
  } else if (selectedItem === "pending") {
    bg = "orange";
    font = "orange";
  } else if (selectedItem === "canceled" || selectedItem === "rejected") {
    bg = "#777";
    font = "#777";
  } else if (selectedItem === "active") {
    bg = currentTheme.pink;
    font = currentTheme.pink;
  } else if (selectedItem === "edit") {
    bg = "yellow";
    font = "yellow";
  } else {
    bg = currentTheme.font;
    font = currentTheme.font;
  }

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const activeStatus = capitalizeFirstLetter(selectedItem);

  return (
    <View style={[styles.container, {}]}>
      <TouchableOpacity
        onPress={
          activeStatus !== "New" && activeStatus !== "Pending"
            ? () => setModalVisible(true)
            : undefined
        }
        activeOpacity={0.8}
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: 5,
          paddingHorizontal: 10,
          borderRadius: 50,
        }}
      >
        <Text style={{ color: font, letterSpacing: 0.3, fontWeight: "bold" }}>
          {
            items.find(
              (i) =>
                i.value.toLocaleLowerCase() === selectedItem.toLocaleLowerCase()
            )?.label
          }
        </Text>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: SCREEN_WIDTH - 40,
        }}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropColor="black"
        backdropOpacity={0.7}
      >
        <View
          style={{
            gap: 8,
            backgroundColor: currentTheme.background,
            // height: 220,
            width: 300,
            borderRadius: 10,
            padding: 15,
            alignItems: "center",
          }}
        >
          {items.map((item) => {
            if (from === "listItem" && item.value === "edit") {
              return;
            }
            if (item.value === "pending") {
              return;
            }
            if (from === "sentBookings" && item.value === "new") {
              return;
            }
            if (
              selectedItem.toLocaleLowerCase() !== "new" &&
              item.value === "new"
            ) {
              return;
            }
            if (
              selectedItem.toLocaleLowerCase() === "active" &&
              (item.value === "pending" ||
                item.value === "new" ||
                item.value === "rejected")
            ) {
              return;
            }
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.item,
                  {
                    backgroundColor: currentTheme.background2,
                    borderWidth: 1,
                    borderColor: currentTheme.line,

                    alignItems: "center",
                  },
                ]}
                onPress={
                  item.value === "delete"
                    ? Delete
                    : item.value === "edit"
                    ? () => setEditRequest(true)
                    : () => handleSelect(item.value)
                }
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
                          : item.value === "delete"
                          ? "red"
                          : item.value === "edit"
                          ? "yellow"
                          : item.value === "pending"
                          ? "orange"
                          : item.value === "new"
                          ? "green"
                          : currentTheme.disabled,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "100%",
    padding: 10,
    borderRadius: 50,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
    letterSpacing: 0.2,
  },
});
