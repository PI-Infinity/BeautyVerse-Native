import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { workingDaysOptions } from "../../datas/registerDatas";

/**
 * Working info component in user screen
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const WorkingInfo = ({ targetUser, navigation }) => {
  // define some context
  const language = Language();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // define some states
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const lang = useSelector((state) => state.storeApp.language);

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
                    // backgroundColor: currentTheme.background2,
                    borderWidth: 1,
                    borderColor: currentTheme.line,
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
              <Ionicons name="add-circle" color={currentTheme.pink} size={30} />
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
      {(targetUser?.experience?.length > 0 ||
        targetUser._id === currentUser._id) && (
        <>
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
                paddingHorizontal: 15,
                borderRadius: 5,
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
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
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
