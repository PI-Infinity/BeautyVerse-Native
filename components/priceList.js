import React, { useState } from "react";
import { Modal, View, Button, Text, TextInput, Alert } from "react-native";

// price list component

const PricePickerPopup = ({
  isVisible,
  closeModal,
  oldPrice,
  currentTheme,
  setEditPrice,
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
            placeholder={oldPrice ? oldPrice?.toString() : "eg: 50"}
            placeholderTextColor="gray"
            style={{
              color: currentTheme.font,
              width: "80%",
              paddingLeft: 10,
              height: 40,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: currentTheme.line,
              backgroundColor: currentTheme.line,
            }}
            onChangeText={(text) => setSelectedValue(text)}
            value={selectedValue?.toString()}
            keyboardType="numeric"
          />
          <Button
            title="Save"
            color={currentTheme.pink}
            onPress={
              selectedValue
                ? () => {
                    closeModal({ price: selectedValue });
                    setTimeout(() => {
                      setSelectedValue("");
                    }, 1000);
                  }
                : () => setEditPrice(false)
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default PricePickerPopup;
