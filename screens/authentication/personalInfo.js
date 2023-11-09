import axios from "axios";
import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../../components/alertMessage";
import GoogleAutocomplete from "../../components/mapAutocomplete";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { BlurView } from "expo-blur";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const PersonalInfo = ({ navigation }) => {
  // redux toolkit dispatch
  const dispatch = useDispatch();
  //language context
  const language = Language();

  // theme redux state and context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // identify states
  const [name, setName] = useState("");
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [callingCode, setCallingCode] = useState("1");

  // this state used to show/hide password when input
  const [nameFocused, setNameFocused] = useState(false);

  const [phoneFocused, setPhoneFocused] = useState(false);

  const onSelect = (country) => {
    if (country && country.callingCode && country.callingCode[0]) {
      setCountryCode(country.cca2);
      setCallingCode(country?.callingCode[0]);
      // setCountryCode(country?.callingCode[0]);
    } else {
      // Default to US if no calling code exists
      setCountryCode("US");
    }
  };

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  /**
   * Registration
   */

  const currentUser = useSelector((state) => state.storeAuth.currentUser);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const AddPresonalInfo = async (e) => {
    if (!name || !phone || !address) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.pleaseInput,
        type: "error",
      });
    }
    if (name?.length < 2 || name?.length > 35) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.nameWarning,
        type: "error",
      });
    }
    if (phone?.includes("+")) {
      return setAlert({
        active: true,
        text: "Phone number doesn't need country code +" + callingCode,
        type: "error",
      });
    }
    if (phone?.length < 8 || phone?.length > 35) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.wrongPhoneNumber,
        type: "error",
      });
    }

    if (!address.street) {
      return setAlert({
        active: true,
        text: language?.language?.Auth?.auth?.wrongAddress,
        type: "error",
      });
    }

    // if hone includes country code continue, if not alert error

    try {
      // Signup user
      await axios.patch(backendUrl + "/api/v1/users/" + currentUser._id, {
        name: name,
        phone: {
          phone: phone,
          callingCode: callingCode,
          countryCode: countryCode,
        },
        address: {
          country: address?.country,
          region: address?.region && address.region,
          city: address?.city && address.city,
          district: address?.district && address.district,
          street: address?.street && address.street,
          number: address?.number && address.number,
          latitude: address?.latitude,
          longitude: address?.longitude,
        },
      });
      navigation.navigate("Type");
    } catch (err) {
      // error handlers
      if (err.response.data.message?.includes("E11000")) {
        setAlert({
          active: true,
          text: language?.language?.Auth?.auth?.usedPhone,
          type: "error",
        });
      } else {
        console.log(err.response.data.message);
        setAlert({
          active: true,
          text: err.response.data.message,
          type: "error",
        });
      }
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
      <BlurView
        intensity={30}
        tint="dark"
        style={[
          styles.keyboardAvoidingContainer,
          {
            height: SCREEN_HEIGHT - 200,
            backgroundColor: "rgba(1,2,0,0.5)",
            flex: 1,
          },
        ]}
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
        <View style={styles.itemContainer}>
          <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.name}
          </Text>
          <TextInput
            placeholder={language?.language?.Main?.filter?.typeHere}
            placeholderTextColor={currentTheme.disabled}
            value={name}
            style={[
              styles.input,
              {
                color: currentTheme.font,
                borderColor: nameFocused
                  ? currentTheme.pink
                  : currentTheme.line,
              },
            ]}
            onChangeText={(text) => setName(text)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </View>
        <View style={[styles.itemContainer, { marginTop: 0 }]}>
          <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.phone}
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
            }}
          >
            <View>
              <CountryPicker
                {...{
                  countryCode,
                  onSelect,
                  withFilter: true,
                  withFlag: true,
                  withCountryNameButton: true,
                  withAlphaFilter: true,
                  withCallingCode: true,
                  textStyle: styles.countryName,
                  containerButtonStyle: styles.pickerButton,
                }}
                theme={{
                  backgroundColor: currentTheme.background,
                  onBackgroundTextColor: currentTheme.font,
                }}
              />
            </View>
            <TextInput
              placeholder={language?.language?.Auth?.auth?.eg + " 555000111222"}
              placeholderTextColor={currentTheme.disabled}
              value={phone}
              style={[
                styles.input,
                {
                  color: currentTheme.font,
                  borderColor: phoneFocused
                    ? currentTheme.pink
                    : currentTheme.line,

                  width: "67%",
                  paddingLeft: 15,
                },
              ]}
              onChangeText={(text) => setPhone(text)}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
            />
          </View>
        </View>
        <View style={styles.container}>
          <Text style={[styles.itemTitle, { color: currentTheme.font }]}>
            {language?.language?.Auth?.auth?.address}
          </Text>
          <View style={styles.itemContainer}>
            <GoogleAutocomplete
              address={address}
              setAddress={setAddress}
              currentTheme={currentTheme}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={AddPresonalInfo}>
          <Text style={styles.buttonText}>
            {language?.language?.Auth?.auth?.next}
          </Text>
        </TouchableOpacity>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    gap: 20,
    zIndex: 100,
    paddingTop: 50,
  },
  container: {
    width: "90%",
    alignItems: "center",
    gap: 15,
    zIndex: 100,
  },
  itemContainer: {
    gap: 15,
    width: "90%",
    alignItems: "center",
    zIndex: 100,
  },
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
    // position: "absolute",
    // bottom: 50,
    zIndex: 9999,
    width: "45%",
    padding: 10,
    backgroundColor: "#F866B1",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 60,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  countryName: {
    color: "#fff",
    fontSize: 16,
  },
  pickerButton: {
    backgroundColor: "#F866B1",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
