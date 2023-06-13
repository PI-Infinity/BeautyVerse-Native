import React, { useState } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const TimePickerComponent = ({
  currentTheme,
  setStartHour,
  setEndHour,
  startHour,
  endHour,
}) => {
  const minutesInADay = Array.from(
    { length: (24 * 60) / 15 },
    (_, i) => i * 15
  );
  const hoursAndMinutes = minutesInADay.map((minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return {
      label: `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`,
      value: `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`,
    };
  });

  return (
    <View style={{ padding: 20, paddingVertical: 30, alignItems: "center" }}>
      <Text style={{ color: currentTheme.pink }}>Start Hour:</Text>
      <View style={{ width: "100%" }}>
        <Picker
          selectedValue={startHour}
          onValueChange={(itemValue) => setStartHour(itemValue)}
        >
          {hoursAndMinutes.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color={currentTheme.font}
            />
          ))}
        </Picker>
      </View>

      <Text style={{ color: currentTheme.pink }}>End Hour:</Text>
      <View style={{ width: "100%" }}>
        <Picker
          selectedValue={endHour}
          onValueChange={(itemValue) => setEndHour(itemValue)}
        >
          {hoursAndMinutes.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color={currentTheme.font}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default TimePickerComponent;
