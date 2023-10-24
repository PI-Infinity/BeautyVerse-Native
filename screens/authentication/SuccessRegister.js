import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";

export const SuccessRegister = ({ navigation }) => {
  // redux toolkit dispatch
  const dispatch = useDispatch();
  //language context
  const language = Language();

  // theme redux state and context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <MaterialIcons name="done" size={52} color={currentTheme.pink} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              color: currentTheme.font,
              letterSpacing: 0.5,
            }}
          >
            {language?.language?.Auth?.auth?.successRegister}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("PersonalInfo")}
          >
            <Text style={styles.buttonText}>
              {language?.language?.Auth?.auth?.continue}
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
    justifyContent: "center",
    gap: 15,
    zIndex: 100,
    height: "80%",
    paddingTop: 80,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: "100%",
    gap: 15,
    zIndex: 100,
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
