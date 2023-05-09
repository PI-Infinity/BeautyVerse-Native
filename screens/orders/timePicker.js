// components/DateTimePickerComponent.js
import React, { useState } from "react";
import { View, Button, Platform, TouchableOpacity, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateTimePickerComponent = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDateTimePicker = () => {
    setShow(true);
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#ccc",
        borderRadius: 50,
        padding: 5,
        paddingRight: 0,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        flexDirection: "row",
      }}
    >
      <Text style={{ fontSize: 16 }}>Choice time:</Text>
      <DateTimePicker
        value={date}
        mode="datetime"
        is24Hour={true}
        display="default"
        onChange={onChange}
      />
    </View>
  );
};

export default DateTimePickerComponent;
