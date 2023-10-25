import React, { useState, useRef } from "react";
import { View, Text, Button, Modal, Animated, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5 } from "@expo/vector-icons";

export default function App({
  currentTheme,
  visible,
  setVisible,
  fadeAnim,
  setDuration,
  EditProcedure,
}) {
  const [selectedDuration, setSelectedDuration] = useState(15);

  const durations = [];
  for (let i = 15; i <= 420; i += 15) {
    durations.push(i);
  }
  durations.push(24 * 60);

  const hideModal = () => {
    EditProcedure({ duration: selectedDuration });
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  return (
    <View style={styles.container}>
      <Modal visible={visible} transparent>
        <Animated.View
          style={{
            ...styles.modal,
            opacity: fadeAnim,
          }}
        >
          <View
            style={[
              styles.pickerContainer,
              { backgroundColor: currentTheme.background2 },
            ]}
          >
            <Picker
              selectedValue={selectedDuration}
              onValueChange={(itemValue) => setSelectedDuration(itemValue)}
            >
              {durations.map((duration) => {
                if (duration === 24 * 60) {
                  return (
                    <Picker.Item
                      key={duration}
                      label="All day long"
                      value={duration}
                      color={currentTheme.font}
                    />
                  );
                }
                const hours = Math.floor(duration / 60);
                const minutes = duration % 60;
                let label = `${minutes} min`;
                if (hours > 0) {
                  label = `${hours} hr`;
                  if (minutes > 0) {
                    label += ` ${minutes} min`;
                  }
                }
                return (
                  <Picker.Item
                    key={duration}
                    label={label}
                    value={duration}
                    color={currentTheme.font}
                  />
                );
              })}
            </Picker>
            <Button
              title="Save"
              onPress={hideModal}
              color={currentTheme.pink}
            />
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    marginHorizontal: 20,
  },
});
