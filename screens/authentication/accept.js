import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from "expo-notifications";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../../components/alertMessage";
import { BackDrop } from "../../components/backDropLoader";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { setRerenderCurrentUser } from "../../redux/rerenders";

/*
  Register Screen,
  in this screen user choice type of user and navigates to identify screen
*/

export const Accept = ({ navigation }) => {
  //language context
  const language = Language();
  // redux tpplkit dispatch
  const dispatch = useDispatch();
  // theme state and context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // accept state
  const [accept, setAccept] = useState(false);
  const [acceptP, setAcceptP] = useState(false);

  // current user
  const currentUser = useSelector((state) => state.storeAuth.currentUser);
  // user type
  const type = useSelector((state) => state.storeAuth.userType);

  // loading state
  const [loading, setLoading] = useState(false);

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * accept terms and rules and confirm register
   */

  const Confirm = async () => {
    setLoading(true);
    if (accept && acceptP) {
      try {
        const response = await axios.patch(
          backendUrl + "/api/v1/users/" + currentUser._id,
          {
            type: type,
            acceptPrivacy: true,
            acceptTerms: true,
            active: true,
            registerStage: "done",
            notifications: [
              {
                senderId: "Beautyverse",
                text: "Welcome Beautyverse",
                date: new Date(),
                type: "welcome",
                status: "unread",
                feed: "",
              },
            ],
            verifyedEmail: true,
          }
        );
        await AsyncStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(response.data.data.updatedUser)
        );
        // after save user to async storage, rerender user info to complete login and navigate to main content
        dispatch(setRerenderCurrentUser());
        setTimeout(async () => {
          setLoading(false);
          const showNotification = async () => {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Welcome to BeautyVerse!",
                body: "Discover the latest trends, tips, and more...",
                data: { someData: "goes here" },
              },
              trigger: null, // This means the notification will be sent right away
            });
          };
          setTimeout(() => {
            showNotification();
          }, 3000);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    } else {
      setLoading(false);
      setAlert({
        active: true,
        text: "You have to accept Tearms & Rules and Privacy Police to confirm Register",
        type: "error",
      });
    }
  };

  return (
    <View style={styles.container}>
      <AlertMessage
        isVisible={alert.active}
        type={alert.type}
        text={alert.text}
        onClose={() => setAlert({ active: false, text: "" })}
        Press={() => setAlert({ active: false, text: "" })}
      />
      <BackDrop loading={loading} setLoading={setLoading} />
      <View
        style={{
          width: "80%",

          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CheckBox
          title={language?.language?.Pages?.pages?.terms}
          checked={accept}
          onPress={() => {
            setAccept(!accept);
          }}
          containerStyle={[
            styles.checkboxContainer,
            {
              backgroundColor: currentTheme.background2,
              width: "80%",
              borderRadius: 50,
            },
          ]}
          textStyle={[
            styles.checkboxText,
            {
              color: currentTheme.font,
              fontWeight: "normal",
              letterSpacing: 0.3,
            },
          ]}
          checkedColor="#F866b1"
          checkedIcon={
            <MaterialIcons
              name="check-box" // Name of the checked icon
              color="#F866b1" // Color of the checked icon
              size={20} // Size of the checked icon
            />
          }
          uncheckedIcon={
            <MaterialIcons
              name="check-box-outline-blank" // Name of the unchecked icon
              color="#F866b1" // Color of the unchecked icon
              size={20} // Size of the unchecked icon
            />
          }
        />
        <TouchableOpacity
          style={{ marginRight: 25 }}
          onPress={() => navigation.navigate("Terms")}
        >
          <MaterialIcons
            name="arrow-right"
            size={30}
            color={currentTheme.pink}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "80%",
          //   backgroundColor: currentTheme.background2,
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CheckBox
          title={language?.language?.Pages?.pages?.privacy}
          checked={acceptP}
          onPress={() => {
            setAcceptP(!acceptP);
          }}
          containerStyle={[
            styles.checkboxContainer,
            {
              width: "80%",
              borderRadius: 50,
              backgroundColor: currentTheme.background2,
            },
          ]}
          textStyle={[
            styles.checkboxText,
            {
              color: currentTheme.font,
              fontWeight: "normal",
              letterSpacing: 0.3,
            },
          ]}
          checkedColor="#F866b1"
          checkedIcon={
            <MaterialIcons
              name="check-box" // Name of the checked icon
              color="#F866b1" // Color of the checked icon
              size={20} // Size of the checked icon
            />
          }
          uncheckedIcon={
            <MaterialIcons
              name="check-box-outline-blank" // Name of the unchecked icon
              color="#F866b1" // Color of the unchecked icon
              size={20} // Size of the unchecked icon
            />
          }
        />
        <TouchableOpacity
          style={{ marginRight: 25 }}
          onPress={() => navigation.navigate("Privacy")}
        >
          <MaterialIcons
            name="arrow-right"
            size={30}
            color={currentTheme.pink}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={Confirm}>
        <Text style={styles.buttonText}>
          {language?.language?.Auth?.auth?.confirm}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  box: {
    width: "80%",
    height: 120,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // negative value places shadow on top
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  boxText: {
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  loginQuestion: {
    textAlign: "center",
    marginTop: 15,
    letterSpacing: 0.2,
  },
  login: {
    color: "#F866B1",
    textAlign: "center",
    marginTop: 15,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  checkboxContainer: {
    backgroundColor: "#111",
    borderWidth: 0,
    borderRadius: 5,
  },
  checkboxText: {
    color: "#fff",
  },
  button: {
    width: "45%",
    padding: 10,
    backgroundColor: "#F866B1",
    marginTop: 10,
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    bottom: 80,
  },
  buttonText: {
    textAlign: "center",
    letterSpacing: 0.2,
    fontWeight: "bold",
    color: "#fff",
  },
});
