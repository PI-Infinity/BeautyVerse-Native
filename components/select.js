import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const options = [
  "Everyday",
  "Monday-Friday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Select = ({ state, setState }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      // If the option is already selected, remove it from the array
      const newSelectedOptions = selectedOptions.filter((o) => o !== option);
      setSelectedOptions(newSelectedOptions);
      setState(newSelectedOptions);
    } else {
      // If the option is not selected, add it to the array
      const newSelectedOptions = [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      setState(newSelectedOptions);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOptions.includes(option) && styles.selectedOption,
          ]}
          onPress={() => handleSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOptions.includes(option) && styles.selectedOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "70%",
    zIndex: 5,
    gap: 5,
  },
  option: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOption: {
    backgroundColor: "#F866B1",
  },
  selectedOptionText: {
    color: "#fff",
  },
});

export default Select;
