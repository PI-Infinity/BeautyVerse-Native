import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Language } from "../../context/language";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const WorkingInfo = ({ targetUser }) => {
  const language = Language();
  return (
    <View style={{ width: SCREEN_WIDTH, alignItems: "center" }}>
      <Text
        style={{ marginVertical: 15, color: "#e5e5e5", fontWeight: "bold" }}
      >
        {language?.language?.User.userPage.workingDays}
      </Text>
      {targetUser.workingDays?.map((option, index) => (
        <View
          key={option._id}
          style={{ width: SCREEN_WIDTH - 40, alignItems: "center" }}
        >
          <View key={option._id} style={styles.option}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.optionText}>{option.value}</Text>
              <Text style={styles.optionText}>{option?.hours}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    width: "100%",
  },

  optionText: {
    fontSize: 14,
    color: "#e5e5e5",
  },
});
