import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Language } from "../../context/language";
import { lightTheme, darkTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";
import { workingDaysOptions } from "../../datas/registerDatas";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const WorkingInfo = ({ targetUser }) => {
  const language = Language();
  const lang = useSelector((state) => state.storeApp.language);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  return (
    <View style={{ width: SCREEN_WIDTH, alignItems: "center", marginTop: 15 }}>
      <Text
        style={{
          marginVertical: 15,
          color: currentTheme.font,
          fontWeight: "bold",
        }}
      >
        {language?.language?.User.userPage.workingDays}
      </Text>
      {targetUser.workingDays?.map((option, index) => {
        let label = workingDaysOptions.find(
          (item) => item.value.toLowerCase() === option.value.toLowerCase()
        );
        let labelLang;
        if (lang === "en") {
          labelLang = label.en;
        } else if (lang === "ka") {
          labelLang = label.ka;
        } else {
          labelLang === label.ru;
        }

        return (
          <View
            key={option._id}
            style={{ width: SCREEN_WIDTH - 40, alignItems: "center" }}
          >
            <View
              key={option._id}
              style={[
                styles.option,
                { backgroundColor: currentTheme.background2 },
              ]}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={[styles.optionText, { color: currentTheme.font }]}>
                  {labelLang}
                </Text>
                <Text style={[styles.optionText, { color: currentTheme.font }]}>
                  {option?.hours}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
      <Text
        style={{
          marginVertical: 15,
          color: currentTheme.font,
          fontWeight: "bold",
          marginTop: 25,
        }}
      >
        Experience
      </Text>
      <View
        style={{
          width: "90%",
          backgroundColor: currentTheme.background2,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: currentTheme.font, lineHeight: 22 }}>
          {targetUser?.experience}
        </Text>
      </View>
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
  },
});
