import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../../components/alertMessage";
import EmailPopup from "../../components/inputPopup";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { setCurrentUser } from "../../redux/auth";
import { setRerenderCurrentUser } from "../../redux/rerenders";
import PasswordRessetPopup from "../../screens/authentication/resetPassword";
import { BackDrop } from "../../components/backDropLoader";

/**
 * Login Screen
 */

export const Login = ({ navigation }) => {
  // login email and password states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // define languuage context
  const language = Language();

  // use redux toolkit dispatch
  const dispatch = useDispatch();

  // define theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // defines loading backdrop
  const [loading, setLoading] = useState(false);

  // defines location
  const location = useSelector((state) => state.storeApp.location);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Login function
   */
  const Login = async () => {
    setLoading(true);
    try {
      // post login to backend
      await axios
        .post(backendUrl + "/api/v1/login", {
          email: email,
          password: password,
        })
        .then(async (data) => {
          if (
            data.data.filteredUser?.registerStage === "done" ||
            !data.data.filteredUser?.registerStage
          ) {
            await AsyncStorage.setItem(
              "Beautyverse:currentUser",
              JSON.stringify(data.data.filteredUser)
            );

            // after save user to async storage, rerender user info to complete login and navigate to main content
            dispatch(setRerenderCurrentUser());
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } else {
            dispatch(setCurrentUser(data.data.filteredUser));
            navigation.navigate("PersonalInfo");
            setLoading(false);
          }
        });
    } catch (err) {
      console.log(err.response.data.message);
      setLoading(false);
      // alert errors to be visible for users
      setAlert({
        active: true,
        text: err.response.data.message,
        type: "error",
      });
    }
  };

  // /**
  //  * if this function need to use, so user registered succesfully but not verified email yet
  //  * now when login, need complete register and need verify email
  //  * Veryify function verifes email by 6 random numbers
  //  */
  // async function Verify() {
  //   try {
  //     const response = await axios.post(
  //       backendUrl + "/api/v1/verifyEmail",
  //       {
  //         email: email,
  //         code: code,
  //       }
  //     );
  //     const newUser = response.data.data.newUser;
  //     // if user type is "user" complete register and navigate to main content
  //     if (newUser?.type === "user") {
  //       await AsyncStorage.setItem(
  //         "Beautyverse:currentUser",
  //         JSON.stringify(newUser)
  //       );
  //       setVerify(false);
  //       dispatch(setRerenderCurrentUser());
  //     } else {
  //       // if user type not "user", after verifying email navigate to business register screen
  //       dispatch(setCurrentUser(newUser));
  //       setVerify(false);
  //       navigation.navigate("Business");
  //     }
  //   } catch (err) {
  //     setAlert({
  //       active: true,
  //       text: err.response.data.message,
  //       type: "error",
  //     });
  //     console.log(err.response.data.message);
  //   }
  // }

  /**
   * this is states for reset passwords.
   * email input and to open/close reset password popup
   */
  const [emailInput, setEmailInput] = useState("");
  const [resetPopup, setResetPopup] = useState(false);

  /**
   * send email to reset password
   * after send request, user gettings link to navigate to beautyverse web, where user can set new password
   */

  async function SendEmail() {
    try {
      await axios.post(backendUrl + "/api/v1/forgotPassword", {
        email: emailInput,
      });
      // If the email is sent successfully, handle the response here
      setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.requestSent,
        type: "success",
      });
    } catch (error) {
      setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.wrongEmail,
        type: "error",
      });
    }
    setResetPopup(false);
  }

  // this state used to show/hide password when input
  const [passwordFocused, setPasswordFocused] = useState(false);

  /**
   * this functions below defines keyboard height of device
   */
  async function onKeyboardDidShow(e) {
    if (passwordFocused) {
      await AsyncStorage.setItem(
        "Beautyverse:keyboardHeight",
        JSON.stringify(e.endCoordinates.height + 45)
      );
    }
  }
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, [passwordFocused]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <BackDrop loading={loading} setLoading={setLoading} />
      <AlertMessage
        isVisible={alert.active}
        type={alert.type}
        text={alert.text}
        onClose={() => setAlert({ active: false, text: "" })}
        Press={() => setAlert({ active: false, text: "" })}
      />
      <View style={styles.container}>
        {/* <View style={{ position: "absolute" }}>
          {verify && (
            <EmailPopup
              setFunction={Verify}
              code={code}
              setCode={setCode}
              open={verify}
              setOpen={setVerify}
            />
          )}
        </View> */}
        <View style={{ position: "absolute" }}>
          {resetPopup && (
            <PasswordRessetPopup
              email={emailInput}
              setEmail={setEmailInput}
              isVisible={resetPopup}
              onClose={() => setResetPopup(false)}
              onSend={SendEmail}
            />
          )}
        </View>
        <TextInput
          placeholder={language?.language?.Auth?.auth?.email}
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoFocus
          style={[
            styles.input,
            {
              color: currentTheme.font,
              borderColor: currentTheme.line,
            },
          ]}
          placeholderTextColor={currentTheme.disabled}
        />
        <TextInput
          secureTextEntry
          placeholder={language?.language?.Auth?.auth?.password}
          onChangeText={(text) => setPassword(text)}
          value={password}
          style={[
            styles.input,
            {
              color: currentTheme.font,
              borderColor: currentTheme.line,
            },
          ]}
          placeholderTextColor={currentTheme.disabled}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: currentTheme.pink,
              borderWidth: 1,
              borderColor: currentTheme.line,
            },
          ]}
          onPress={Login}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            {language?.language?.Auth?.auth?.login}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setResetPopup(true)}>
          <Text style={[styles.forgot, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.forgot}
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={[styles.registerQuestion, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.dontHave}{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Identify")}>
            <Text style={[styles.register, { color: currentTheme.pink }]}>
              {language?.language?.Auth?.auth?.register}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    boxSizing: "border-box",
    paddingBottom: 30,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 12.5,
    fontSize: 14,
    borderBottomWidth: 1,
    letterSpacing: 0.2,
  },
  button: {
    width: "45%",
    padding: 10,
    backgroundColor: "#F866B1",
    marginTop: 10,
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    textAlign: "center",
    letterSpacing: 0.2,
    fontWeight: "bold",
    color: "#fff",
  },
  forgot: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: 0.2,
    textDecorationLine: "underline",
  },
  registerQuestion: {
    textAlign: "center",
    letterSpacing: 0.2,
  },
  register: {
    color: "#F866B1",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
});
