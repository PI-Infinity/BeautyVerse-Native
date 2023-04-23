import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import SelectAutocomplete from "../../components/autocomplete";
import Select from "../../components/select";
import { useSelector, useDispatch } from "react-redux";
import { ProceduresOptions } from "../../datas/registerDatas";
import { setRerenderCurrentUser } from "../../redux/rerenders";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "../../context/language";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Business = ({ navigation }) => {
  const proceduresOptions = ProceduresOptions();

  const language = Language();
  const dispatch = useDispatch();

  const [procedures, setProcedures] = useState([]);
  const [wd, setWd] = useState([]);

  const currentUser = useSelector((state) => state.storeAuth.currentUser);

  const FillUp = async (e) => {
    try {
      if (procedures) {
        // Signup user
        const response = await axios.patch(
          "https://beautyverse.herokuapp.com/api/v1/users/" + currentUser?._id,
          {
            procedures: procedures?.map((item, index) => {
              return { value: item.value };
            }),
            workingDays: wd?.map((item, index) => {
              return { value: item };
            }),
          }
        );
        await AsyncStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(response.data.data.updatedUser)
        );
        dispatch(setRerenderCurrentUser());
        // navigation.navigate(`/users/${currentUser?._id}`);
      } else {
        Alert.alert(language?.language?.Auth?.auth?.pleaseInput);
      }
    } catch (err) {
      Alert.alert(err.response.data.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>
            {" "}
            {language?.language?.Auth?.auth?.procedures}
          </Text>
          <SelectAutocomplete
            data={proceduresOptions}
            state={procedures}
            setState={setProcedures}
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>
            {" "}
            {language?.language?.Auth?.auth?.workingDays} (
            {language?.language?.Auth?.auth?.optional})
          </Text>
          <Select state={wd} setState={setWd} />
        </View>
        <TouchableOpacity style={styles.button} onPress={FillUp}>
          <Text style={styles.buttonText}>
            {" "}
            {language?.language?.Auth?.auth?.register}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Business;

const styles = StyleSheet.create({
  container: {
    // height: SCREEN_HEIGHT,
    width: "100%",
    gap: 20,
    alignItems: "center",
    justifyContent: "start",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemContainer: { gap: 10, width: "100%", alignItems: "center" },
  itemTitle: {
    fontSize: 14,
    color: "#fff",
  },
  button: {
    width: "40%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "green",
    marginTop: 10,
    justifyContent: "center",
    zIndex: 0,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
