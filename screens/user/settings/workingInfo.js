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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import { setCurrentUser } from "../../../redux/user";
import { ListItem, Icon, Button } from "react-native-elements";
import { Language } from "../../../context/language";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const WorkingInfo = () => {
  const language = Language();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [workingHours, setWorkingHours] = useState("");
  const [add, setAdd] = useState(false);
  const dispatch = useDispatch();

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
        dispatch(
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
  };

  return (
    <View style={styles.container}>
      <Text
        style={{ color: "#e5e5e5", marginVertical: 10, fontWeight: "bold" }}
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
            style={styles.dayOption}
            onPress={() => AddWorkingDay("workingDays")}
          >
            Working Days
          </Text>
          <Text
            style={styles.dayOption}
            onPress={() => AddWorkingDay("everyDay")}
          >
            Everyday
          </Text>
          <Text
            style={styles.dayOption}
            onPress={() => AddWorkingDay("monday")}
          >
            Monday
          </Text>
          <Text
            style={styles.dayOption}
            onPress={() => AddWorkingDay("tuesday")}
          >
            Tuesday
          </Text>
          <Text
            style={styles.dayOption}
            onPress={() => AddWorkingDay("wednesday")}
          >
            Wednesday
          </Text>
          <Text
            style={styles.dayOption}
            onPress={() => AddWorkingDay("thursday")}
          >
            Thursday
          </Text>
          <Text
            style={styles.dayOption}
            onPress={() => AddWorkingDay("friday")}
          >
            Friday
          </Text>
          <Text
            style={styles.dayOption}
            onPress={() => AddWorkingDay("saturday")}
          >
            Saturday
          </Text>
          <Text
            style={styles.dayOption}
            onPress={() => AddWorkingDay("sunday")}
          >
            Sunday
          </Text>
        </View>
      )}

      <View>
        {currentUser.workingDays?.map((option, index) => (
          <View
            key={option.value}
            style={{ width: "100%", alignItems: "center" }}
          >
            <TouchableOpacity
              key={option._id}
              style={[
                styles.option,
                selectedOptions.includes(option.value) ? styles.selected : null,
              ]}
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
                <Text style={styles.optionText}>{option.value}</Text>
                <Text style={styles.optionText}>{option?.hours}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 20,
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
    width: (Dimensions.get("window").width * 80) / 100,
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
