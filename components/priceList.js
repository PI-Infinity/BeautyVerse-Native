import React, { useState } from "react";
import { Modal, View, Button, Text, TextInput } from "react-native";

const PricePickerPopup = ({
  isVisible,
  closeModal,
  oldPrice,
  currentTheme,
}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: currentTheme.background2,
            padding: 20,
            borderRadius: 10,
            width: 200,
            alignItems: "center",
            gap: 15,
          }}
        >
          <Text style={{ color: currentTheme.font }}>Enter a price:</Text>
          <TextInput
            placeholder={oldPrice?.toString()}
            placeholderTextColor="gray"
            style={{
              color: currentTheme.font,
              width: "80%",
              paddingLeft: 10,
              height: 40,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: currentTheme.line,
            }}
            onChangeText={(text) => setSelectedValue(text)}
            value={selectedValue?.toString()}
            keyboardType="numeric"
          />
          <Button
            title="Save"
            color={currentTheme.pink}
            onPress={() => {
              closeModal({ price: selectedValue ? selectedValue : oldPrice });
              setTimeout(() => {
                setSelectedValue("");
              }, 1000);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PricePickerPopup;
