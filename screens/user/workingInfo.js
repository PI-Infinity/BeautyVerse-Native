import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import React from "react";
import { Language } from "../../context/language";
import { lightTheme, darkTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";
import { workingDaysOptions } from "../../datas/registerDatas";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const WorkingInfo = ({ targetUser, navigation }) => {
  const language = Language();
  const currentUser = useSelector((state) => state.storeUser.currentUser);
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
          letterSpacing: 0.3,
        }}
      >
        {language?.language?.User.userPage.workingDays}
      </Text>
      {targetUser.workingDays?.length > 0 ? (
        targetUser.workingDays?.map((option, index) => {
          let label = workingDaysOptions.find(
            (item) => item.value.toLowerCase() === option.value.toLowerCase()
          );
          let labelLang;
          if (lang === "en") {
            labelLang = label?.en;
          } else if (lang === "ka") {
            labelLang = label?.ka;
          } else {
            labelLang === label?.ru;
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
                  {
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                  },
                ]}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        backgroundColor: currentTheme.pink,
                      }}
                    ></View>
                    <Text
                      style={{ color: currentTheme.font, letterSpacing: 0.2 }}
                    >
                      {labelLang}
                    </Text>
                  </View>
                  <Text
                    style={[styles.optionText, { color: currentTheme.font }]}
                  >
                    {option?.hours}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      ) : (
        <>
          {targetUser._id === currentUser._id ? (
            <Pressable
              onPress={() => navigation.navigate("Working info")}
              style={{
                width: "30%",
                height: 35,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="add-circle"
                color={currentTheme.disabled}
                size={34}
              />
            </Pressable>
          ) : (
            <View>
              <Text
                style={{ color: currentTheme.disabled, letterSpacing: 0.2 }}
              >
                Not found
              </Text>
            </View>
          )}
        </>
      )}
      <Text
        style={{
          marginVertical: 15,
          color: currentTheme.font,
          fontWeight: "bold",
          marginTop: 25,
          letterSpacing: 0.3,
        }}
      >
        Experience
      </Text>
      {targetUser?.experience?.length > 0 ? (
        <View
          style={{
            width: "90%",
            backgroundColor: currentTheme.background2,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: currentTheme.font,
              lineHeight: 22,
              letterSpacing: 0.2,
            }}
          >
            {targetUser?.experience}
          </Text>
        </View>
      ) : (
        <>
          {targetUser._id === currentUser._id ? (
            <Pressable
              onPress={() => navigation.navigate("Working info")}
              style={{
                width: "30%",
                height: 35,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="add-circle" color={currentTheme.pink} size={30} />
            </Pressable>
          ) : (
            <View>
              <Text style={{ color: currentTheme.disabled }}>Not found</Text>
            </View>
          )}
        </>
      )}
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
    letterSpacing: 0.2,
  },
});
