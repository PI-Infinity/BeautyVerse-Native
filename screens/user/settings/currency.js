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
import { FontAwesome } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Currency = ({ currentTheme }) => {
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
  const AddCurrency = async (curr) => {
    try {
      setAdd((prevState) => !prevState);
      dispatch(
        setCurrentUser({
          ...currentUser,
          currency: curr,
        })
      );
      const response = await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" + currentUser._id,
        {
          currency: curr,
        }
      );
      dispatch(setRerenderCurrentUser());
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: currentTheme.font,
          marginVertical: 10,
          marginBottom: 15,
          fontWeight: "bold",
          fontSize: 16,
          letterSpacing: 0.3,
        }}
      >
        {language?.language?.User?.userPage?.currency}:
      </Text>

      {add && (
        <View
          style={{
            width: SCREEN_WIDTH - 60,
            gap: 5,
            marginBottom: 15,
            marginHorizontal: 20,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.3}
            style={[
              styles.itemOption,
              { backgroundColor: currentTheme.background },
            ]}
            onPress={() => AddCurrency("Dollar")}
          >
            <Text style={[styles.optionText, { color: currentTheme.font }]}>
              Dollar
            </Text>
            <FontAwesome name="dollar" color={currentTheme.pink} size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.3}
            style={[
              styles.itemOption,
              { backgroundColor: currentTheme.background },
            ]}
            onPress={() => AddCurrency("Euro")}
          >
            <Text style={[styles.optionText, { color: currentTheme.font }]}>
              Euro
            </Text>
            <FontAwesome name="euro" color={currentTheme.pink} size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.3}
            style={[
              styles.itemOption,
              { backgroundColor: currentTheme.background },
            ]}
            onPress={() => AddCurrency("Lari")}
          >
            <Text style={[styles.optionText, { color: currentTheme.font }]}>
              Lari{" "}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                color: currentTheme.pink,
                fontSize: 16,
              }}
            >
              {"\u20BE"}
            </Text>
            {/* <FontAwesome name="gel" color={currentTheme.pink} size={16} /> */}
          </TouchableOpacity>
        </View>
      )}
      {!add && (
        <TouchableOpacity
          onPress={() => setAdd(!add)}
          style={[
            [styles.itemOption, { backgroundColor: currentTheme.background }],
            {
              width: "30%",
              justifyContent: "center",
              backgroundColor: currentTheme.background,
              borderRadius: 50,
            },
          ]}
        >
          <Text style={[styles.optionText, { color: currentTheme.font }]}>
            {currentUser?.currency}{" "}
            {currentUser.currency === "Dollar" ? (
              <FontAwesome name="dollar" color={currentTheme.pink} size={16} />
            ) : currentUser.currency === "Euro" ? (
              <FontAwesome name="euro" color={currentTheme.pink} size={16} />
            ) : (
              <Text
                style={{
                  fontWeight: "bold",
                  color: currentTheme.pink,
                  fontSize: 16,
                }}
              >
                {"\u20BE"}
              </Text>
            )}
          </Text>
          {/* <FontAwesome name="gel" color={currentTheme.pink} size={16} /> */}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 20,
    width: SCREEN_WIDTH - 25,
    gap: 10,
  },
  itemOption: {
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    padding: 10,
    borderRadius: 50,
  },
  option: {
    width: (Dimensions.get("window").width * 85) / 100,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  selected: {
    // backgroundColor: "rgba(255,255,255,0.1)",
  },
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
