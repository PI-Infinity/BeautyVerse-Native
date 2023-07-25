import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { workingDaysOptions } from "../datas/registerDatas";

/**
 * Select component
 */

const Select = ({ state, setState, currentTheme }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      // If the option is already selected, remove it from the array
      const newSelectedOptions = selectedOptions.filter((o) => o !== option);
      setSelectedOptions(newSelectedOptions);
      setState((prev) => prev.filter((item) => item !== option.value));
    } else {
      // If the option is "everyDay" or "workingDays", remove all other options
      if (option.value === "everyDay" || option.value === "workingDays") {
        setSelectedOptions([option]);
        setState([option.value]);
      } else {
        // If any other option is selected, remove "everyDay" and "workingDays" from the selection
        const newSelectedOptions = selectedOptions.filter(
          (o) => o.value !== "everyDay" && o.value !== "workingDays"
        );
        setSelectedOptions([...newSelectedOptions, option]);
        setState((prev) =>
          prev
            .filter((item) => item !== "everyDay" && item !== "workingDays")
            .concat(option.value)
        );
      }
    }
  };
  return (
    <View style={styles.container}>
      {workingDaysOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOptions.includes(option)
              ? {
                  backgroundColor: currentTheme.pink,
                }
              : { backgroundColor: currentTheme.background2 },
          ]}
          onPress={() => handleSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOptions.includes(option)
                ? { color: "#fff" }
                : { color: currentTheme.font },
            ]}
          >
            {option.en}
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
    borderRadius: 50,
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
