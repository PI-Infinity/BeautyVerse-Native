import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/auth";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmailPopup from "../../components/inputPopup";
import { setRerenderCurrentUser } from "../../redux/rerenders";
import PasswordRessetPopup from "../../screens/authentication/resetPassword";
import { Language } from "../../context/language";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const language = Language();

  const dispatch = useDispatch();

  // verify email
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");

  const Login = async () => {
    try {
      await axios
        .post("https://beautyverse.herokuapp.com/api/v1/login", {
          email: email,
          password: password,
        })
        .then(async (data) => {
          if (data.data.filteredUser.verifiedEmail) {
            if (
              data.data.filteredUser.type !== "user" &&
              data.data.filteredUser.procedures?.length < 1
            ) {
              dispatch(setCurrentUser(data.data.filteredUser));
              navigation.navigate("Business");
            } else {
              await AsyncStorage.setItem(
                "Beautyverse:currentUser",
                JSON.stringify(data.data.filteredUser)
              );
              dispatch(setRerenderCurrentUser());
            }
          } else {
            setVerify(true);
          }
        });
    } catch (err) {
      console.log(err);
      Alert.alert("Warrning", err.response.data.message);
    }
  };

  async function Verify() {
    try {
      const response = await axios.post(
        "https://beautyverse.herokuapp.com/api/v1/verifyEmail",
        {
          email: email,
          code: code,
        }
      );

      const newUser = response.data.data.newUser;

      if (newUser?.type === "user") {
        await AsyncStorage.setItem("Beautyverse:currentUser", newUser);
        alert("navigate");
      } else {
        dispatch(setCurrentUser(newUser));
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      Alert.alert(err.resopnse.data.message);
      console.log(err);
    }
  }

  const [emailInput, setEmailInput] = useState("");
  const [resetPopup, setResetPopup] = useState(false);

  /**
   * send email to reset password
   */

  async function SendEmail() {
    try {
      const response = await axios.post(
        "https://beautyverse.herokuapp.com/api/v1/forgotPassword",
        {
          email: emailInput,
        }
      );
      // If the email is sent successfully, handle the response here
      Alert.alert(language?.language?.Auth?.auth?.requestSent);
    } catch (error) {
      Alert.alert(language?.language?.Auth?.auth?.wrongEmail);
    }
    setResetPopup(false);
  }

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute" }}>
        {verify && (
          <EmailPopup
            setFunction={Verify}
            code={code}
            setCode={setCode}
            open={verify}
            setOpen={setVerify}
          />
        )}
      </View>
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
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        secureTextEntry
        placeholder={language?.language?.Auth?.auth?.password}
        onChangeText={(text) => setPassword(text)}
        value={password}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={Login}>
        <Text style={styles.buttonText}>
          {language?.language?.Auth?.auth?.login}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setResetPopup(true)}>
        <Text style={styles.forgot}>
          {language?.language?.Auth?.auth?.forgot}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Text style={styles.registerQuestion}>
          {language?.language?.Auth?.auth?.dontHave}{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.register}>
            {language?.language?.Auth?.auth?.register}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    color: "#e5e5e5",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12.5,
    fontSize: 14,
    color: "#e5e5e5",
    borderRadius: 50,
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
    color: "#e5e5e5",
    textAlign: "center",
  },
  forgot: {
    color: "#e5e5e5",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  registerQuestion: {
    color: "#e5e5e5",
    textAlign: "center",
  },
  register: {
    color: "#F866B1",
    textAlign: "center",
  },
});
