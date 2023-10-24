import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../../components/alertMessage";
import VerifyCodePopup from "../../components/inputPopup";
import GoogleAutocomplete from "../../components/mapAutocomplete";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { setCurrentUser } from "../../redux/auth";
import { setRerenderCurrentUser } from "../../redux/rerenders";
import { BackDrop } from "../../components/backDropLoader";
import uuid from "react-native-uuid";
import { TextInput } from "react-native-paper";

export const Identify = ({ navigation }) => {
  // redux toolkit dispatch
  const dispatch = useDispatch();
  //language context
  const language = Language();

  // theme redux state and context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // identify states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // this state used to show/hide password when input
  const [emailFocused, setEmailFocused] = useState(false);
  // this state used to show/hide password when input
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // type redux state already defined in register screen
  const type = useSelector((state) => state.storeAuth.userType);

  // show password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // verify email states
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const [loading, setLoading] = useState(false);

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  /**
   * Send verify email
   */

  const SendEmail = async () => {
    if (
      email?.length < 1 ||
      password?.length < 1 ||
      confirmPassword?.length < 1
    ) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.successRegister,
        type: "error",
      });
    }
    if (!email?.includes("@") || email?.length < 6 || email?.length > 40) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.pleaseInput,
        type: "error",
      });
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.wrongEmail,
        type: "error",
      });
    }

    if (password?.length < 8 || password?.length > 40) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.wrongPassword,
        type: "error",
      });
    }
    if (password !== confirmPassword) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.differentPasswords,
        type: "error",
      });
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/v1/sendVerifyEmail",
        {
          email: email,
        }
      );
      if (response.data.user) {
        dispatch(setCurrentUser(response.data.user));
      }
      setCode(response.data.code);
      setVerify(true);
    } catch (error) {
      setAlert({
        active: true,
        text: error.response.data.message,
        type: "error",
      });
    }
  };

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Registration
   */

  const Register = async (e) => {
    setLoading(true);
    // console.log(code);
    // if hone includes country code continue, if not alert error
    if (code === codeInput) {
      try {
        // Signup user
        const response = await axios.post(backendUrl + "/api/v1/signup", {
          name: "",
          type: "user",
          email: email,
          phone: { phone: uuid.v4(), callingCode: "", countryCode: "" },
          password: password,
          confirmPassword: confirmPassword,
          cover: "",
          address: [],
          media: {
            facebook: "",
            instagram: "",
            tiktok: "",
            youtube: "",
            telegram: false,
            whatsapp: false,
          },
          experience: "",
          subscription: { status: "active" },
          notifications: [],
          active: false,
          registerStage: "identify",
        });
        // after send data to db, open email verify popup
        setVerify(false);
        dispatch(setCurrentUser(response.data.newUser));
        setCode("");
        setCodeInput("");
        navigation.navigate("SuccessRegister");
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        setCode("");
        setCodeInput("");
        setLoading(false);
        // error handlers
        console.log(err.response.data.message);
        setAlert({
          active: true,
          text: err.response.data.message,
          type: "error",
        });
      }
    } else {
      Alert.alert(language?.language?.Auth?.auth?.wrongVerifyCode);
    }
  };
  return (
    <ImageBackground
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      source={theme ? require("../../assets/background.jpg") : null}
    >
      <View style={{ position: "absolute" }}>
        {verify && (
          <VerifyCodePopup
            code={codeInput}
            setCode={setCodeInput}
            setFunction={Register}
            open={verify}
            setOpen={setVerify}
            registerMessages={true}
          />
        )}
      </View>
      <BackDrop loading={loading} setLoading={setLoading} />
      <KeyboardAvoidingView
        style={[
          styles.keyboardAvoidingContainer,
          {
            backgroundColor: theme
              ? "rgba(0,0,0,0.6)"
              : currentTheme.background,
          },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ position: "absolute", zIndex: 19000 }}>
          <AlertMessage
            isVisible={alert.active}
            type={alert.type}
            text={alert.text}
            onClose={() => setAlert({ active: false, text: "" })}
            Press={() => setAlert({ active: false, text: "" })}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.itemContainer}>
            <TextInput
              label="email@gmail.com"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoFocus
              mode="outlined"
              outlineStyle={{
                borderRadius: 20,
                padding: 0,
                borderColor: emailFocused
                  ? currentTheme.pink
                  : currentTheme.line,
                backgroundColor: "transparent",
              }}
              style={[
                styles.input,
                {
                  color: currentTheme.pink,
                  borderColor: currentTheme.line,
                  backgroundColor: currentTheme.background,
                  height: 55,
                  padding: 0,
                  borderRadius: 50,
                  borderColor: currentTheme.line,
                },
              ]}
              textColor={currentTheme.font}
              theme={{ colors: { primary: currentTheme.pink } }}
              placeholderTextColor={currentTheme.pink}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <View style={styles.itemContainer}>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <TextInput
                secureTextEntry={!showPassword}
                label={language?.language?.Auth?.auth?.password}
                onChangeText={(text) => setPassword(text)}
                value={password}
                mode="outlined"
                theme={{
                  colors: {
                    primary: currentTheme.pink, // color of the underline and the outline
                  },
                }}
                outlineStyle={{
                  borderRadius: 20,
                  padding: 0,
                  backgroundColor: "transparent",
                  height: 55,
                  borderColor: passwordFocused
                    ? currentTheme.pink
                    : currentTheme.line,
                }}
                textColor={currentTheme.font}
                style={[
                  styles.input,
                  {
                    color: currentTheme.font,
                    borderColor: currentTheme.pink,
                    backgroundColor: currentTheme.background,
                    height: 55,
                    padding: 0,
                  },
                ]}
                placeholderTextColor={currentTheme.pink}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "relative", right: 40 }}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? (
                    <MaterialIcons
                      name="remove-red-eye"
                      color="#e5e5e5"
                      size={16}
                    />
                  ) : (
                    <MaterialIcons
                      name="panorama-fisheye"
                      color="#e5e5e5"
                      size={16}
                    />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.itemContainer}>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <TextInput
                secureTextEntry={!showConfirmPassword}
                label={language?.language?.Auth?.auth?.confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                mode="outlined"
                theme={{
                  colors: {
                    primary: currentTheme.pink, // color of the underline and the outline
                  },
                }}
                outlineStyle={{
                  borderRadius: 20,
                  padding: 0,
                  backgroundColor: "transparent",
                  height: 55,
                  borderColor: confirmPasswordFocused
                    ? currentTheme.pink
                    : currentTheme.line,
                }}
                textColor={currentTheme.font}
                style={[
                  styles.input,
                  {
                    color: currentTheme.font,
                    borderColor: currentTheme.pink,
                    backgroundColor: currentTheme.background,
                    height: 55,
                    padding: 0,
                  },
                ]}
                placeholderTextColor={currentTheme.pink}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "relative", right: 40 }}
              >
                <Text style={styles.showPasswordText}>
                  {showConfirmPassword ? (
                    <MaterialIcons
                      name="remove-red-eye"
                      color="#e5e5e5"
                      size={16}
                    />
                  ) : (
                    <MaterialIcons
                      name="panorama-fisheye"
                      color="#e5e5e5"
                      size={16}
                    />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={SendEmail}>
            <Text style={styles.buttonText}>
              {language?.language?.Auth?.auth?.register}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 10,
            }}
          >
            <Text style={[styles.loginQuestion, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.havea}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Login")}
            >
              <Text
                style={[
                  styles.login,
                  { color: currentTheme.pink, fontWeight: "bold" },
                ]}
              >
                {language?.language?.Auth?.auth?.login}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: 15,
    zIndex: 100,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    zIndex: 100,
    paddingBottom: 30,
  },
  itemContainer: { gap: 15, width: "75%", alignItems: "center", zIndex: 100 },
  itemTitle: {
    fontSize: 14,
    zIndex: 100,
  },
  input: {
    width: "100%",
    padding: 12.5,
    fontSize: 14,
    borderRadius: 50,
    letterSpacing: 0.2,
  },
  showPasswordText: {
    fontSize: 12,
    textAlign: "right",

    marginTop: 5,
  },
  button: {
    width: "45%",
    padding: 10,
    backgroundColor: "#F866B1",
    marginTop: 20,
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
