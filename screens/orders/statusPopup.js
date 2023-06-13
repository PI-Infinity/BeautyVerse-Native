import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const StatusPopup = ({
  currentTheme,
  selectedItem,
  setSelectedItem,
  UpdateOrder,
  Delete,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const items = [
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Canceled", value: "canceled" },
    { label: "Delete", value: "delete" },
  ];

  const handleSelect = (value) => {
    UpdateOrder(value);
    setSelectedItem(value);
    setModalVisible(false);
  };

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
          {activeStatus}
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
            height: 220,
            width: 300,
            borderRadius: 10,
            padding: 15,
            alignItems: "center",
          }}
        >
          {items.map((item) => {
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
  container: {
    // padding: 15,
    // width: 190,
    // borderRadius: 10,
    // backgroundColor: "red",
    // gap: 5,
  },
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
