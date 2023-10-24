import React from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Support = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const onSubmit = async (data) => {
    try {
      await axios.post(backendUrl + "/support/sendEmail", data);
      reset({ email: "", message: "" });
    } catch (error) {
      console.log(error.response);
    }

    Alert.alert("Message sent succesfully!");
  };

  // define language
  const language = Language();
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  return (
    <View style={{ padding: 20 }}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            placeholder="Email"
            placeholderTextColor={currentTheme.disabled}
            style={{
              borderWidth: 1,
              borderColor: currentTheme.line,
              marginBottom: 10,
              padding: 15,
              borderRadius: 50,
              color: currentTheme.font,
            }}
          />
        )}
        name="email"
        rules={{
          required: true,
          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        }}
        defaultValue=""
      />
      {errors.email && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          This is required or not a valid email.
        </Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
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
        )}
        name="message"
        rules={{ required: true }}
        defaultValue=""
      />
      {errors.message && (
        <Text style={{ color: "red", marginBottom: 30 }}>
          This is required.
        </Text>
      )}

      <Button
        title="Send"
        color={currentTheme.pink}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

export default Support;
