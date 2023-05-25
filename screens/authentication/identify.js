import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import { setRerenderCurrentUser } from "../../redux/rerenders";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/auth";
import VerifyCodePopup from "../../components/inputPopup";
import GoogleAutocomplete from "../../components/mapAutocomplete";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Language } from "../../context/language";
import { lightTheme, darkTheme } from "../../context/theme";
import CountryCodePicker from "../../components/countryCodePicker";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Identify = ({ navigation }) => {
  const dispatch = useDispatch();
  const language = Language();
  const [name, setName] = useState("");
  const type = useSelector((state) => state.storeAuth.userType);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({});

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // verify email
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");

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
        await AsyncStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(newUser)
        );
        dispatch(setRerenderCurrentUser());
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAddress("");
        setPhone("");
        setName("");
      } else {
        dispatch(setCurrentUser(newUser));
        navigation.navigate("Business");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAddress("");
        setPhone("");
        setName("");
      }
    } catch (err) {
      Alert.alert(err.response.data.message);
      console.log(err.response.data.message.toString());
    }
  }

  /**
   * Registration
   */

  const Register = async (e) => {
    try {
      // Signup user
      const response = await axios.post(
        "https://beautyverse.herokuapp.com/api/v1/signup",
        {
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
          subscription: { status: "inactive" },
          notifications: [
            {
              senderId: "Beautyverse",
              text: "Welcome Beautyverse",
              // text: `${language?.language.Auth.auth.successRegister}`,
              date: new Date(),
              type: "welcome",
              status: "unread",
              feed: "",
            },
          ],
        }
      );
      Alert.alert(language?.language?.Auth?.auth?.successRegister);
      await setVerify(true);
    } catch (err) {
      console.log("error");
      console.log(err);
      Alert.alert(err.response.data.message);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={{ position: "absolute" }}>
          {verify && (
            <VerifyCodePopup
              code={code}
              setCode={setCode}
              setFunction={Verify}
              open={verify}
              setOpen={setVerify}
            />
          )}
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.name}
          </Text>
          <TextInput
            placeholder={language?.language?.Auth?.auth?.name}
            placeholderTextColor={currentTheme.disabled}
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.background2,
                color: currentTheme.font,
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
            setAddress={setAddress}
            currentTheme={currentTheme}
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.email}
          </Text>
          <TextInput
            placeholder={language?.language?.Auth?.auth?.email}
            placeholderTextColor={currentTheme.disabled}
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.background2,
                color: currentTheme.font,
              },
            ]}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        {/* <CountryCodePicker /> */}
        <View style={[styles.itemContainer, { marginTop: 0 }]}>
          <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.phone}
          </Text>
          <TextInput
            placeholder="ex: +000000000"
            placeholderTextColor={currentTheme.disabled}
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.background2,
                color: currentTheme.font,
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
              style={[
                [
                  styles.input,
                  {
                    backgroundColor: currentTheme.background2,
                    color: currentTheme.font,
                  },
                ],
                { width: "100%" },
              ]}
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
              style={[
                [
                  styles.input,
                  {
                    backgroundColor: currentTheme.background2,
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
    borderRadius: 50,
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
    textDecorationLine: "underline",
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
