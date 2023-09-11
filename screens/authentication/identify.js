import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
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
          phone: {},
          password: password,
          confirmPassword: confirmPassword,
          cover: "",
          address: {},
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
        console.log(err.response);
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
    <>
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
        style={styles.keyboardAvoidingContainer}
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
            <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.email}
            </Text>
            <TextInput
              placeholder="email@gmail.com"
              placeholderTextColor={currentTheme.disabled}
              value={email}
              style={[
                styles.input,
                {
                  color: currentTheme.font,
                  borderColor: currentTheme.line,
                },
              ]}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View style={styles.itemContainer}>
            <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.password}
            </Text>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <TextInput
                placeholder={language?.language?.Auth?.auth?.min8symbols}
                placeholderTextColor={currentTheme.disabled}
                value={password}
                style={[
                  [
                    styles.input,
                    {
                      borderColor: currentTheme.line,
                      color: currentTheme.font,
                    },
                  ],
                  { width: "100%" },
                ]}
                secureTextEntry={!showPassword}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "relative", right: 30 }}
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
            <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.confirmPassword}
            </Text>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <TextInput
                placeholder={language?.language?.Auth?.auth?.confirmPassword}
                placeholderTextColor={currentTheme.disabled}
                value={confirmPassword}
                style={[
                  [
                    styles.input,
                    {
                      borderColor: currentTheme.line,
                      color: currentTheme.font,
                    },
                  ],
                  { width: "100%" },
                ]}
                secureTextEntry={!showConfirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "relative", right: 30 }}
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
    </>
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
  itemContainer: { gap: 15, width: "80%", alignItems: "center", zIndex: 100 },
  itemTitle: {
    fontSize: 14,
    zIndex: 100,
  },
  input: {
    width: "100%",
    height: 40,
    padding: 10,
    fontSize: 14,
    // borderRadius: 50,
    borderBottomWidth: 1,
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
