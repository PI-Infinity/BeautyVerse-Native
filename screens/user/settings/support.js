import React, { useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  ImageBackground,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Language } from "../../../context/language";
import { darkTheme, lightTheme } from "../../../context/theme";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Header } from "./header";
import { useState } from "react";
import AlertMessage from "../../../components/alertMessage";
import { BackDrop } from "../../../components/backDropLoader";
import { BlurView } from "expo-blur";

const Support = ({ hideModal }) => {
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  // defines loading backdrop
  const [loading, setLoading] = useState(false);
  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  const inputRef = useRef();
  const onSubmit = async () => {
    // inputRef.current.blur();

    try {
      if (!currentUser && (email?.length < 3 || !email?.includes("@"))) {
        return setAlert({
          active: true,
          text: "Please write email address...",
          type: "error",
        });
      }
      if (text?.length < 10) {
        return setAlert({
          active: true,
          text: "To send the message, the text must be more than 10 symbols...",
          type: "error",
        });
      }
      setLoading(true);
      let em = currentUser ? currentUser.email : email;
      await axios.post(backendUrl + "/support/sendEmail", {
        message: text + " / User Email: " + em,
        email: em,
      });
      setEmail("");
      setText("");
      setAlert({
        active: true,
        text: "The message has sent succesfully!",
        type: "success",
      });
      setLoading(false);
    } catch (error) {
      // setAlert({
      //   active: true,
      //   text: error.response.data.message,
      //   type: "error",
      // });
      console.log(error.response);
      setLoading(false);
    }
  };

  // define language
  const language = Language();
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <>
      {!currentUser ? (
        <ImageBackground
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
          }}
          source={theme ? require("../../../assets/background.jpg") : null}
        >
          <BlurView
            intensity={30}
            tint="dark"
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(1,2,0,0.5)",
            }}
          >
            <BackDrop loading={loading} setLoading={setLoading} />
            <AlertMessage
              isVisible={alert.active}
              type={alert.type}
              text={alert.text}
              onClose={() => setAlert({ active: false, text: "" })}
              Press={() => setAlert({ active: false, text: "" })}
            />

            <View style={{ padding: 20 }}>
              <TextInput
                ref={inputRef}
                onChangeText={(value) => setEmail(value)}
                value={email}
                placeholder="Write email..."
                placeholderTextColor={currentTheme.disabled}
                style={{
                  borderWidth: 1,
                  borderColor: currentTheme.line,
                  marginBottom: 10,
                  padding: 15,
                  paddingTop: 15,
                  borderRadius: 10,
                  color: currentTheme.font,
                  minHeight: 50,
                }}
              />

              <TextInput
                onChangeText={(value) => setText(value)}
                value={text}
                placeholder="Write text here..."
                multiline
                placeholderTextColor={currentTheme.disabled}
                style={{
                  borderWidth: 1,
                  borderColor: currentTheme.line,
                  marginBottom: 10,
                  padding: 15,
                  paddingTop: 15,
                  borderRadius: 10,
                  color: currentTheme.font,
                  minHeight: 200,
                }}
              />

              <Button
                title="Send"
                color={currentTheme.pink}
                onPress={onSubmit}
              />
            </View>
          </BlurView>
        </ImageBackground>
      ) : (
        <>
          <BackDrop loading={loading} setLoading={setLoading} />
          <AlertMessage
            isVisible={alert.active}
            type={alert.type}
            text={alert.text}
            onClose={() => setAlert({ active: false, text: "" })}
            Press={() => setAlert({ active: false, text: "" })}
          />

          <Header onBack={hideModal} title="Support" />
          <View style={{ padding: 20 }}>
            <TextInput
              onChangeText={(value) => setText(value)}
              value={text}
              placeholder="Write text here..."
              multiline
              placeholderTextColor={currentTheme.disabled}
              style={{
                borderWidth: 1,
                borderColor: currentTheme.line,
                marginBottom: 10,
                padding: 15,
                paddingTop: 15,
                borderRadius: 10,
                color: currentTheme.font,
                minHeight: 200,
              }}
            />

            <Button title="Send" color={currentTheme.pink} onPress={onSubmit} />
          </View>
        </>
      )}
    </>
  );
};

export default Support;
