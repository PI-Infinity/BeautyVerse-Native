// components/DateTimePickerComponent.js
import React, { useState } from "react";
import { View, Button, Platform, TouchableOpacity, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateTimePickerComponent = ({ dateAndTime, setDateAndTime }) => {
  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDateAndTime(selectedDate);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#ccc",
        borderRadius: 50,
        padding: 5,
        paddingRight: 15,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        flexDirection: "row",
      }}
    >
      <Text style={{ fontSize: 16 }}>Choice time:</Text>
      <DateTimePicker
        value={dateAndTime}
        mode="datetime"
        is24Hour={true}
        display="default"
        onChange={onChange}
      />
    </View>
  );
};

export default DateTimePickerComponent;
