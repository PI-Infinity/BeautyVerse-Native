import React, { useState } from "react";
import { View } from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";

const countryCodes = [
  { id: 1, name: "+995 - Georgia" },
  { id: 2, name: "+374 - Armenia" },
  { id: 3, name: "+994 - Azerbaijan" },
  { id: 4, name: "+90 - Turkey" },
  { id: 5, name: "+7 - Russia" },
  { id: 6, name: "+380 - Ukraine" },
  { id: 7, name: "+48 - Poland" },
  { id: 8, name: "+49 - Germany" },
  { id: 9, name: "+39 - Italy" },
  { id: 10, name: "+34 - Spain" },
  { id: 11, name: "+1 - United States" },
  { id: 12, name: "+966 - Saudi Arabia" },
  { id: 13, name: "+971 - United Arab Emirates" },
  { id: 14, name: "+965 - Kuwait" },
  { id: 15, name: "+974 - Qatar" },
  { id: 16, name: "+973 - Bahrain" },
  { id: 17, name: "+968 - Oman" },
  { id: 18, name: "+962 - Jordan" },
  { id: 19, name: "+961 - Lebanon" },
  { id: 20, name: "+20 - Egypt" },
  { id: 21, name: "+212 - Morocco" },
  { id: 22, name: "+7 - Kazakhstan" },
];

const CountryCodePicker = ({ onSelect, countrycode }) => {
  const [codeValue, setCodeValue] = useState("+995");

  const handleSelect = (item) => {
    const code = item.name.split(" ")[0];
    setCodeValue(code);
    onSelect(code);
  };
  const handleChangeText = (text) => {
    setCodeValue(text);
    onSelect(text);
  };

  return (
    <View>
      <SearchableDropdown
        onItemSelect={handleSelect}
        containerStyle={{ padding: 0, width: 100 }}
        onRemoveItem={(item, index) => {}}
        itemStyle={{
          padding: 10,
          paddingVertical: 5,
          marginTop: 2,
          backgroundColor: "#ddd",
          borderColor: "#bbb",
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{ color: "#222" }}
        itemsContainerStyle={{ maxHeight: 150 }}
        items={countryCodes}
        defaultIndex={0}
        resetValue={false}
        textInputProps={{
          placeholder: "Cuntry code",
          underlineColorAndroid: "transparent",
          style: {
            padding: 7,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            color: "#e5e5e5",
          },
          value: countrycode,
          placeholderTextColor: "#999",
          onChangeText: handleChangeText,
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
    </View>
  );
};

export default CountryCodePicker;
