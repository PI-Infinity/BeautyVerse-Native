import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Pressable,
  Vibration,
  ScrollView,
  Platform,
  Picker,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import { setCurrentUser } from "../../../redux/user";
import { ListItem, Icon, Button } from "react-native-elements";
import { Language } from "../../../context/language";
import { Currency } from "../../../screens/user/settings/currency";
import { lightTheme, darkTheme } from "../../../context/theme";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { workingDaysOptions } from "../../../datas/registerDatas";
import TimePickerComponent from "../../../components/startEndTimePicker";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const WorkingInfo = () => {
  const language = Language();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [startHour, setStartHour] = useState("10:00");
  const [endHour, setEndHour] = useState("20:00");
  const [add, setAdd] = useState(false);
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const lang = useSelector((state) => state.storeApp.language);
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const handleOptionPress = (option) => {
    if (option?.hours) {
      let definedHours = option?.hours?.split(" - ");
      setStartHour(definedHours[0]);
      setEndHour(definedHours[1]);
      if (selectedOptions.includes(option.value)) {
        setSelectedOptions(
          selectedOptions.filter((selected) => selected !== option.value)
        );
      } else {
        setSelectedOptions([...selectedOptions, option.value]);
      }
    } else {
      if (selectedOptions.includes(option.value)) {
        setSelectedOptions(
          selectedOptions.filter((selected) => selected !== option.value)
        );
      } else {
        setSelectedOptions([...selectedOptions, option.value]);
      }
    }
  };

  // add service to firebase
  const AddWorkingDay = async (v) => {
    var val = currentUser?.workingDays?.find((item) => item.value === v);
    if (!v) {
      setAdd(false);
    } else {
      if (val) {
        Alert.alert(
          "Working day with same name already added in your working days list!"
        );
      } else {
        try {
          await dispatch(
            setCurrentUser({
              ...currentUser,
              workingDays: [...currentUser.workingDays, { value: v }],
            })
          );
          const response = await axios.post(
            `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/workingdays`,
            {
              value: v,
            }
          );
          dispatch(setRerenderCurrentUser());
        } catch (error) {
          console.log(error.response.data.message);
        }
      }
    }
  };

  const AddWorkingDayHours = async (itemId, itemValue, indx) => {
    let workingHours = startHour + " - " + endHour;
    try {
      if (!workingHours || startHour === "" || endHour === "") {
        setSelectedOptions([]);
        setWorkingHours("");
      } else {
        const newHours = {
          ...currentUser,
          workingDays: currentUser.workingDays.map((workingDay) => {
            return workingDay._id === itemId
              ? { ...workingDay, hours: workingHours }
              : workingDay;
          }),
        };
        dispatch(setCurrentUser(newHours));
        setSelectedOptions([]);
        const response = await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/workingdays/${itemId}`,
          {
            value: itemValue,
            hours: workingHours?.toString(),
          }
        );
        dispatch(setRerenderCurrentUser());
        setStartHour("");
        setEndHour("");
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  // delete service
  const Deleting = async (itemId, val) => {
    try {
      dispatch(
        setCurrentUser({
          ...currentUser,
          workingDays: currentUser.workingDays.filter(
            (workingDay) => workingDay.value !== val
          ),
        })
      );
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/workingdays/${itemId}`;
      const response = await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => dispatch(setRerenderCurrentUser()))
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * experience
   */
  const [openExperience, setOpenExperience] = useState(false);
  const [experience, setExperience] = useState("");

  const UpdateExperience = async (value) => {
    try {
      dispatch(
        setCurrentUser({
          ...currentUser,
          experience: value,
        })
      );
      setOpenExperience(false);
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
        {
          experience: value,
        }
      );
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
    >
      <View
        style={{
          backgroundColor: currentTheme.background2,
          width: "90%",
          alignItems: "center",
          borderRadius: 10,
          padding: 10,
        }}
      >
        <Text
          style={{
            color: currentTheme.font,
            marginVertical: 10,
            fontWeight: "bold",
            fontSize: 16,
            letterSpacing: 0.3,
          }}
        >
          {language?.language?.User?.userPage?.workingDays}:
        </Text>
        {!add ? (
          <Pressable onPress={() => setAdd(true)} style={{ padding: 10 }}>
            <MaterialIcons name="add" color={currentTheme.pink} size={24} />
          </Pressable>
        ) : (
          <Pressable onPress={() => setAdd(false)} style={{ padding: 10 }}>
            <FontAwesome5 name="times" color="red" size={24} />
          </Pressable>
        )}
        {add && (
          <View
            style={{
              width: SCREEN_WIDTH - 60,
              gap: 5,
              marginHorizontal: 20,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.length < 1
                  ? () => AddWorkingDay("workingDays")
                  : () =>
                      Alert.alert(
                        "You can only add the value 'Working Days' and cannot combine it with any other variants."
                      )
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Working Days
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.length < 1
                  ? () => AddWorkingDay("everyDay")
                  : () =>
                      Alert.alert(
                        "You can only add the value 'Every Days' and cannot combine it with any other variants."
                      )
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Everyday
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.some(
                  (item) =>
                    item.value === "everyDay" ||
                    item.value === "workingDays" ||
                    item.value === "monday"
                )
                  ? () =>
                      Alert.alert(
                        "You can only add the value 'Every Day', 'Working Day' or 'Monday' separately. You cannot combine them with any other variants."
                      )
                  : () => AddWorkingDay("monday")
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Monday
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.some(
                  (item) =>
                    item.value === "everyDay" ||
                    item.value === "workingDays" ||
                    item.value === "tuesday"
                )
                  ? () =>
                      Alert.alert(
                        "You can only add the value 'Every Day', 'Working Day' or 'Tuesday' separately. You cannot combine them with any other variants."
                      )
                  : () => AddWorkingDay("tuesday")
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Tuesday
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.some(
                  (item) =>
                    item.value === "everyDay" ||
                    item.value === "workingDays" ||
                    item.value === "wednesday"
                )
                  ? () =>
                      Alert.alert(
                        "You can only add the value 'Every Day', 'Working Day' or 'Wednesday' separately. You cannot combine them with any other variants."
                      )
                  : () => AddWorkingDay("wednesday")
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Wednesday
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.some(
                  (item) =>
                    item.value === "everyDay" ||
                    item.value === "workingDays" ||
                    item.value === "thursday"
                )
                  ? () =>
                      Alert.alert(
                        "You can only add the value 'Every Day', 'Working Day' or 'Thursday' separately. You cannot combine them with any other variants."
                      )
                  : () => AddWorkingDay("thursday")
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Thursday
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.some(
                  (item) =>
                    item.value === "everyDay" ||
                    item.value === "workingDays" ||
                    item.value === "friday"
                )
                  ? () =>
                      Alert.alert(
                        "You can only add the value 'Every Day', 'Working Day' or 'Friday' separately. You cannot combine them with any other variants."
                      )
                  : () => AddWorkingDay("friday")
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Friday
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.some(
                  (item) =>
                    item.value === "everyDay" ||
                    item.value === "workingDays" ||
                    item.value === "saturday"
                )
                  ? () =>
                      Alert.alert(
                        "You can only add the value 'Every Day', 'Working Day' or 'Saturday' separately. You cannot combine them with any other variants."
                      )
                  : () => AddWorkingDay("saturday")
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Saturday
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.dayOption,
                {
                  backgroundColor: currentTheme.background,
                  width: "100%",
                  alignItems: "center",
                  borderRadius: 50,
                },
              ]}
              onPress={
                currentUser.workingDays.some(
                  (item) =>
                    item.value === "everyDay" ||
                    item.value === "workingDays" ||
                    item.value === "sunday"
                )
                  ? () =>
                      Alert.alert(
                        "You can only add the value 'Every Day', 'Working Day' or 'Sunday' separately. You cannot combine them with any other variants."
                      )
                  : () => AddWorkingDay("sunday")
              }
            >
              <Text style={{ color: currentTheme.pink, letterSpacing: 0.2 }}>
                Sunday
              </Text>
            </Pressable>
          </View>
        )}

        <View style={{ width: "100%" }}>
          {currentUser.workingDays?.map((option, index) => {
            let lab = workingDaysOptions.find(
              (item) => item.value === option.value
            );

            return (
              <View
                key={option.value}
                style={{ width: "100%", alignItems: "center" }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  style={
                    [
                      styles.option,
                      selectedOptions.includes(option.value)
                        ? styles.selected
                        : null,
                      {
                        backgroundColor: currentTheme.background,
                        borderRadius: selectedOptions.includes(option.value)
                          ? 10
                          : 50,
                        paddingLeft: 20,
                      },
                    ]
                    // { backgroundColor: currentTheme.background2 })
                  }
                  onPress={() => handleOptionPress(option)}
                  onLongPress={() => {
                    Vibration.vibrate();
                    Deleting(option._id, option.value);
                  }}
                  delayLongPress={300}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={[styles.optionText, { color: currentTheme.font }]}
                    >
                      {lang === "en"
                        ? lab?.en
                        : lang === "ka"
                        ? lab?.ka
                        : lab?.ru}
                    </Text>
                    <Text
                      style={[styles.optionText, { color: currentTheme.font }]}
                    >
                      {option?.hours}
                    </Text>
                  </View>
                  {selectedOptions.includes(option.value) && (
                    <TimePickerComponent
                      currentTheme={currentTheme}
                      setStartHour={setStartHour}
                      setEndHour={setEndHour}
                      startHour={startHour}
                      endHour={endHour}
                    />
                  )}
                </TouchableOpacity>
                {selectedOptions.includes(option.value) && (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderRadius: 50,
                      backgroundColor: currentTheme.pink,
                      width: "45%",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                    onPress={() =>
                      AddWorkingDayHours(option._id, option.value, index)
                    }
                  >
                    <Text style={{ color: "#fff" }}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </View>
      <View
        style={{
          backgroundColor: currentTheme.background2,
          width: "90%",
          alignItems: "center",
          borderRadius: 10,
          padding: 15,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: currentTheme.font,
            letterSpacing: 0.3,
          }}
        >
          Experience:
        </Text>

        {openExperience ? (
          <>
            <Text
              style={{
                color: currentTheme.disabled,
                marginVertical: 12.5,
                height: 16,
                letterSpacing: 0.2,
              }}
            >
              {experience.length} (max 500 symbols)
            </Text>
            <TextInput
              placeholder="Add experience"
              placeholderTextColor={currentTheme.disabled}
              multiline
              numOfLines={10}
              onChangeText={setExperience}
              value={experience}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                width: "100%",
                color: currentTheme.font,
                fontSize: 14,
                minHeight: 150,
                lineHeight: 22,
                backgroundColor: currentTheme.background,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 3, // negative value places shadow on top
                },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.3}
              style={{
                padding: 10,
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                width: "45%",
                marginTop: 15,
                alignItems: "center",
              }}
              onPress={
                experience.length < 501
                  ? () => UpdateExperience(experience)
                  : undefined
              }
            >
              <Text style={{ color: "#fff", letterSpacing: 0.2 }}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            activeOpacity={0.3}
            style={{
              width: "100%",
              borderRadius: 10,
              // backgroundColor: "rgba(255,255,255,0.1)",
              marginTop: 20,
              marginBottom: 5,
              // padding: 10,
              alignItems: "center",
            }}
            onLongPress={() => {
              UpdateExperience("");
              Vibration.vibrate();
            }}
            delayLongPress={200}
            onPress={() => {
              setExperience(currentUser.experience);
              setOpenExperience(true);
            }}
          >
            {currentUser.experience?.length > 0 ? (
              <Text
                style={{
                  color: currentTheme.font,
                  lineHeight: 22,
                }}
              >
                {currentUser?.experience}
              </Text>
            ) : (
              <Pressable
                onPress={() => {
                  setExperience(currentUser.experience);
                  setOpenExperience(true);
                }}
                style={{ padding: 10 }}
              >
                <MaterialIcons name="add" color={currentTheme.pink} size={24} />
              </Pressable>
            )}
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          backgroundColor: currentTheme.background2,
          width: "90%",
          alignItems: "center",
          borderRadius: 10,
          padding: 10,
        }}
      >
        <Currency currentTheme={currentTheme} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 20,
    gap: 20,
  },
  dayOption: {
    fontSize: 14,
    color: "#e5e5e5",
    fontWeight: "bold",
    padding: 10,
    borderRadius: 5,
    letterSpacing: 0.2,
  },
  option: {
    width: (Dimensions.get("window").width * 85) / 100,

    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  selected: {},
  optionText: {
    fontSize: 14,
    color: "#e5e5e5",
    letterSpacing: 0.2,
  },
  input: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    letterSpacing: 0.2,
  },
});
