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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../../components/alertMessage";
import VerifyCodePopup from "../../components/inputPopup";
import GoogleAutocomplete from "../../components/mapAutocomplete";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { setCurrentUser } from "../../redux/auth";
import { setRerenderCurrentUser } from "../../redux/rerenders";

const Identify = ({ navigation }) => {
  // redux toolkit dispatch
  const dispatch = useDispatch();
  //language context
  const language = Language();

  // theme redux state and context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // identify states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({});
  const [phone, setPhone] = useState("");
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

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  /**
   * email verify function after succesfully register
   * Veryify function verifes email by 6 random numbers
   */

  async function Verify() {
    try {
      const response = await axios.post(
        "https://beautyverse.herokuapp.com/api/v1/verifyEmail",
        {
          email: email,
          code: code,
        }
      );
      // get user info after register
      const newUser = response.data.data.newUser;

      if (newUser?.type === "user") {
        // if user type is "user", save info in asyncstorage, rerender user info and get all data from db
        await AsyncStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(newUser)
        );
        // after rerender system navigates to main content
        dispatch(setRerenderCurrentUser());
      } else {
        // if user type isnt "user", save user info in redux for after using in business register screen
        dispatch(setCurrentUser(newUser));
        // navigate to register screen
        navigation.navigate("Business");
        // close verifying popup
        setVerify(false);
        // clear input states
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAddress("");
        setPhone("");
        setName("");
      }
    } catch (err) {
      // error handlers
      setAlert({
        active: true,
        text: err.response.data.message,
        type: "error",
      });
      console.log(err.response.data.message.toString());
    }
  }

  /**
   * Registration
   */

  const Register = async (e) => {
    if (phone?.includes("+")) {
      // if hone includes country code continue, if not alert error
      try {
        // Signup user
        await axios.post("https://beautyverse.herokuapp.com/api/v1/signup", {
          name: name,
          type: type,
          email: email,
          phone: phone,
          password: password,
          confirmPassword: confirmPassword,
          cover: "",
          address: {
            country: address.country,
            region: address.region,
            city: address.city,
            district: address.district,
            street: address.street,
            number: address.number,
            latitude: address.latitude,
            longitude: address.longitude,
          },
          media: {
            facebook: "",
            instagram: "",
            tiktok: "",
            youtube: "",
            telegram: false,
            whatsapp: false,
          },
          experience: "",
          orders: [],
          subscription: { status: "active" },
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
        });
        // after send data to db, open email verify popup
        setVerify(true);
      } catch (err) {
        // error handlers
        console.log(err.response.data.message);
        setAlert({
          active: true,
          text: err.response.data.message,
          type: "error",
        });
      }
    } else {
      // error if iphone number without country code
      setAlert({
        active: true,
        text: "Invalid phone number! Please include your country code at the beginning. An example of a correct format is +995 555 555 555.",
        type: "error",
      });
    }
  };
  return (
    <>
      <View style={{ position: "absolute" }}>
        {verify && (
          <VerifyCodePopup
            code={code}
            setCode={setCode}
            setFunction={Verify}
            open={verify}
            setOpen={setVerify}
            registerMessages={true}
          />
        )}
      </View>

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
          <View style={{ position: "absolute", zIndex: 20000 }}></View>
          <View style={styles.itemContainer}>
            <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.name}
            </Text>
            <TextInput
              placeholder="Your or Business name"
              placeholderTextColor={currentTheme.disabled}
              value={name}
              style={[
                styles.input,
                {
                  color: currentTheme.font,
                  borderColor: currentTheme.line,
                },
              ]}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.address}
            </Text>
            <GoogleAutocomplete
              address={address}
              setAddress={setAddress}
              currentTheme={currentTheme}
            />
          </View>
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
          <View style={[styles.itemContainer, { marginTop: 0 }]}>
            <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
              {language?.language?.Auth?.auth?.phone}
            </Text>
            <TextInput
              placeholder="ex: +000000000"
              placeholderTextColor={currentTheme.disabled}
              value={phone}
              style={[
                styles.input,
                {
                  color: currentTheme.font,
                  borderColor: currentTheme.line,
                },
              ]}
              onChangeText={(text) => setPhone(text)}
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
                placeholder="min 8 symbols"
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
          <TouchableOpacity style={styles.button} onPress={Register}>
            <Text style={styles.buttonText}>
              {type === "user"
                ? language?.language?.Auth?.auth?.register
                : language?.language?.Auth?.auth?.next}
            </Text>
          </TouchableOpacity>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // negative value places shadow on top
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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

export default Identify;
