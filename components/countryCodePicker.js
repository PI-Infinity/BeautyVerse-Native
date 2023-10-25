import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet } from "react-native";

const countryPhoneCodes = [
  { label: "🇺🇸 United States (+1)", value: "+1" },
  { label: "🇬🇧 United Kingdom (+44)", value: "+44" },
  { label: "🇦🇺 Australia (+61)", value: "+61" },
  { label: "🇨🇦 Canada (+1)", value: "+1" },
  { label: "🇫🇷 France (+33)", value: "+33" },
  // ... add more countries as needed
];

export default function CodePicker() {
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryPhoneCodes[0].value
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCountryCode}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedCountryCode(itemValue)
        }
      >
        {countryPhoneCodes.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "red",
  },
});
