import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SelectAutocomplete from "../../components/autocomplete";
import Select from "../../components/select";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { ProceduresOptions } from "../../datas/registerDatas";
import { setRerenderCurrentUser } from "../../redux/rerenders";

/*
  Business register screen for specialists and beauty salons, to complete registere process
*/

const Business = () => {
  // defined procedure list
  const proceduresOptions = ProceduresOptions();
  // theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  // language context
  const language = Language();
  // redux toolkit dispatch
  const dispatch = useDispatch();

  // procedures state
  const [procedures, setProcedures] = useState([]);
  // working days state
  const [wd, setWd] = useState([]);

  // current user state which defined in prev auth screens
  const currentUser = useSelector((state) => state.storeAuth.currentUser);

  /**
   * this function completes register process for specialists and salons
   */
  const FillUp = async (e) => {
    try {
      if (procedures?.length > 0) {
        // Signup user and add procedures and working infos
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
        // complete register, save user info in async storage
        await AsyncStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(response.data.data.updatedUser)
        );
        // reload current user to navigate main content screen
        dispatch(setRerenderCurrentUser());
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
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: currentTheme.font,
            letterSpacing: 0.3,
            marginTop: 20,
          }}
        >
          Select procedures:
        </Text>
        <View style={styles.itemContainer}>
          <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
            {" "}
            {language?.language?.Auth?.auth?.procedures}
          </Text>

          <SelectAutocomplete
            data={proceduresOptions}
            state={procedures}
            setState={setProcedures}
            currentTheme={currentTheme}
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
            {" "}
            {language?.language?.Auth?.auth?.workingDays} (
            {language?.language?.Auth?.auth?.optional})
          </Text>
          <View style={{ marginTop: 20, width: "100%", alignItems: "center" }}>
            <Select state={wd} setState={setWd} currentTheme={currentTheme} />
          </View>
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
    width: "100%",
    alignItems: "center",
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemContainer: { gap: 10, width: "100%", alignItems: "center" },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    width: "45%",
    padding: 10,
    backgroundColor: "#F866B1",
    marginTop: 50,
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
