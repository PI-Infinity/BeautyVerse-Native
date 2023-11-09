import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  ImageBackground,
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
import { BlurView } from "expo-blur";

export const SuccessRegister = ({ navigation }) => {
  // redux toolkit dispatch
  const dispatch = useDispatch();
  //language context
  const language = Language();

  // theme redux state and context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <ImageBackground
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      source={theme ? require("../../assets/background.jpg") : null}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BlurView
          tint="dark"
          intensity={30}
          style={[
            styles.container,
            { flex: 1, backgroundColor: "rgba(1,2,0,0.5)" },
          ]}
        >
          <View
            style={{
              position: "relative",
              bottom: 35,
              width: "100%",
              alignItems: "center",
              gap: 5,
            }}
          >
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
        </BlurView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    zIndex: 100,
    height: "100%",
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
