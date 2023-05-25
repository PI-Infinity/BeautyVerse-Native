import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setStatusFilter } from "../../redux/orders";

export const SortPopup = ({ currentTheme, setOpenSortPopup }) => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.storeOrders.statusFilter);

  const items = [
    { label: "All", value: "" },
    { label: "New", value: "new" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Canceled", value: "canceled" },
    { label: "Rejected", value: "rejected" },
  ];

  const handleSelect = (value) => {
    dispatch(setStatusFilter(value));
    setOpenSortPopup(false);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background2 }]}
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
              color: filter === item.value ? "#ccc" : currentTheme.font,
              alignItems: "center",
            },
          ]}
          onPress={() => handleSelect(item.value)}
        >
          <Text style={[styles.itemText, { color: currentTheme.font }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: 190,
    borderRadius: 10,
    backgroundColor: "red",
    gap: 5,
  },
  item: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
});
