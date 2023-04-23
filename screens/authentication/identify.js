import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { setRerenderCurrentUser } from "../../redux/rerenders";
import { useSelector, useDispatch } from "react-redux";
import { setType, setCurrentUser } from "../../redux/auth";
import VerifyCodePopup from "../../components/inputPopup";
import GoogleAutocomplete from "../../components/mapAutocomplete";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListItem, Icon, Button } from "react-native-elements";
import CountryCodePicker from "../../components/countryCodes";
import { Language } from "../../context/language";
const Identify = ({ navigation }) => {
  const dispatch = useDispatch();
  const language = Language();
  const [name, setName] = useState("");
  const type = useSelector((state) => state.storeAuth.userType);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState();

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
      // console.log(err);
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
          <Text style={styles.itemTitle}>
            {language?.language?.Auth?.auth?.name}
          </Text>
          <TextInput
            placeholder={language?.language?.Auth?.auth?.name}
            placeholderTextColor="#555"
            style={styles.input}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>
            {language?.language?.Auth?.auth?.address}
          </Text>
          <GoogleAutocomplete setAddress={setAddress} />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>
            {language?.language?.Auth?.auth?.email}
          </Text>
          <TextInput
            placeholder={language?.language?.Auth?.auth?.email}
            placeholderTextColor="#555"
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={[styles.itemContainer, { marginTop: 0 }]}>
          <Text style={styles.itemTitle}>
            {language?.language?.Auth?.auth?.phone}
          </Text>
          {/* <View
            style={[
              styles.input,
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 0,
              },
            ]}
          >
            <CountryCodePicker
              countrycode={countrycode}
              onSelect={setCountrycode}
            /> */}
          <TextInput
            placeholder="ex: +000000000"
            placeholderTextColor="#555"
            style={styles.input}
            onChangeText={(text) => setPhone(text)}
          />
          {/* </View> */}
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>
              {language?.language?.Auth?.auth?.password}
            </Text>
            <View
              style={[
                styles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  padding: 5,
                },
              ]}
            >
              <TextInput
                placeholder="min 8 symbols"
                placeholderTextColor="#555"
                style={[styles.input, { width: "90%" }]}
                secureTextEntry={!showPassword}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showPasswordText}>
                  {showPassword ? (
                    <Icon
                      name="remove-red-eye"
                      type="MaterialIcons"
                      color="#e5e5e5"
                      size={16}
                    />
                  ) : (
                    <Icon
                      name="panorama-fisheye"
                      type="MaterialIcons"
                      color="#e5e5e5"
                      size={16}
                    />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>
            {language?.language?.Auth?.auth?.confirmPassword}
          </Text>
          <View
            style={[
              styles.input,
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 5,
              },
            ]}
          >
            <TextInput
              placeholder={language?.language?.Auth?.auth?.confirmPassword}
              placeholderTextColor="#555"
              style={[styles.input, { width: "90%" }]}
              secureTextEntry={!showConfirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.showPasswordText}>
                {showConfirmPassword ? (
                  <Icon
                    name="remove-red-eye"
                    type="MaterialIcons"
                    color="#e5e5e5"
                    size={16}
                  />
                ) : (
                  <Icon
                    name="panorama-fisheye"
                    type="MaterialIcons"
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
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    zIndex: 100,
    marginBottom: 20,
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
  itemContainer: { gap: 10, width: "100%", alignItems: "center", zIndex: 100 },
  itemTitle: {
    fontSize: 14,
    color: "#e5e5e5",
    zIndex: 100,
  },
  input: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 10,
    fontSize: 14,
    color: "#fff",
    borderRadius: 5,
  },
  showPasswordText: {
    fontSize: 12,
    color: "#e5e5e5",
    textAlign: "right",
    textDecorationLine: "underline",
    marginTop: 5,
  },
  button: {
    width: "40%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "green",
    marginTop: 20,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  loginQuestion: {
    color: "#fff",
    textAlign: "center",
  },
  login: {
    color: "yellow",
    textAlign: "center",
  },
});

export default Identify;
