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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import { setCurrentUser } from "../../../redux/user";
import { ListItem, Icon, Button } from "react-native-elements";
import { Language } from "../../../context/language";
import { Currency } from "../../../screens/user/settings/currency";
import { lightTheme, darkTheme } from "../../../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const WorkingInfo = () => {
  const language = Language();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [workingHours, setWorkingHours] = useState("");
  const [add, setAdd] = useState(false);
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const handleOptionPress = (option) => {
    if (selectedOptions.includes(option.value)) {
      setSelectedOptions(
        selectedOptions.filter((selected) => selected !== option.value)
      );
    } else {
      setSelectedOptions([...selectedOptions, option.value]);
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
    try {
      if (!workingHours || workingHours === "") {
        setSelectedOptions([]);
        setWorkingHours("");
      } else {
        const newHours = {
          ...currentUser,
          workingDays: currentUser.workingDays.map((workingDay) =>
            workingDay._id === itemId
              ? { ...workingDay, hours: workingHours }
              : workingDay
          ),
        };
        dispatch(setCurrentUser(newHours));
        setSelectedOptions([]);
        const response = await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/workingdays/${itemId}`,
          {
            value: itemValue,
            hours: workingHours,
          }
        );
        dispatch(setRerenderCurrentUser());
        setWorkingHours("");
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

  const UpdateExperience = async () => {
    try {
      if (experience?.length < 1) {
        return setOpenExperience(false);
      }
      dispatch(
        setCurrentUser({
          ...currentUser,
          experience: experience,
        })
      );
      setOpenExperience(false);
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
        {
          experience,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          }}
        >
          {language?.language?.User?.userPage?.workingDays}:
        </Text>
        {!add ? (
          <Pressable onPress={() => setAdd(true)} style={{ padding: 10 }}>
            <Icon name="add" type="MaterialIcons" color="green" size={24} />
          </Pressable>
        ) : (
          <Pressable onPress={() => setAdd(false)} style={{ padding: 10 }}>
            <Icon name="times" type="font-awesome-5" color="red" size={24} />
          </Pressable>
        )}
        {add && (
          <View
            style={{
              width: SCREEN_WIDTH - 60,
              gap: 5,
              marginBottom: 15,
              marginHorizontal: 20,
            }}
          >
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("workingDays")}
            >
              Working Days
            </Text>
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("everyDay")}
            >
              Everyday
            </Text>
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("monday")}
            >
              Monday
            </Text>
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("tuesday")}
            >
              Tuesday
            </Text>
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("wednesday")}
            >
              Wednesday
            </Text>
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("thursday")}
            >
              Thursday
            </Text>
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("friday")}
            >
              Friday
            </Text>
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("saturday")}
            >
              Saturday
            </Text>
            <Text
              style={[styles.dayOption, { color: currentTheme.font }]}
              onPress={() => AddWorkingDay("sunday")}
            >
              Sunday
            </Text>
          </View>
        )}

        <View style={{ width: "100%" }}>
          {currentUser.workingDays?.map((option, index) => (
            <View
              key={option.value}
              style={{ width: "100%", alignItems: "center" }}
            >
              <TouchableOpacity
                key={option._id}
                style={
                  [
                    styles.option,
                    selectedOptions.includes(option.value)
                      ? styles.selected
                      : null,
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
                    {option.value}
                  </Text>
                  <Text
                    style={[styles.optionText, { color: currentTheme.font }]}
                  >
                    {option?.hours}
                  </Text>
                </View>
                {selectedOptions.includes(option.value) && (
                  <TextInput
                    style={styles.input}
                    onChangeText={(value) => setWorkingHours(value)}
                    value={workingHours}
                    placeholder="example: 10:00 - 20:00"
                  />
                )}
              </TouchableOpacity>
              {selectedOptions.includes(option.value) && (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: "green",
                    width: "50%",
                    alignItems: "center",
                  }}
                  onPress={() =>
                    AddWorkingDayHours(option._id, option.value, index)
                  }
                >
                  <Text style={{ color: "#e5e5e5" }}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
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
                borderWidth: 1,
                borderColor: currentTheme.disabled,
                width: "100%",
                color: currentTheme.font,
                fontSize: 14,
                minHeight: 40,
                lineHeight: 22,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.3}
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: currentTheme.pink,
                width: "45%",
                marginTop: 15,
                alignItems: "center",
              }}
              onPress={experience.length < 501 ? UpdateExperience : undefined}
            >
              <Text style={{ color: currentTheme.font }}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            activeOpacity={0.3}
            style={{
              width: "100%",
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.1)",
              marginTop: 20,
              marginBottom: 5,
              padding: 10,
            }}
            onPress={() => {
              setExperience(currentUser.experience);
              setOpenExperience(true);
            }}
          >
            <Text
              style={{
                color: currentTheme.font,
                lineHeight: 22,
              }}
            >
              {currentUser?.experience}
            </Text>
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
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  option: {
    width: (Dimensions.get("window").width * 85) / 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  selected: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  optionText: {
    fontSize: 14,
    color: "#e5e5e5",
  },
  input: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
  },
});
