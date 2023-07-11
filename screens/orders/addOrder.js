import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Localization from "expo-localization";
import moment from "moment";
import "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { BackDrop } from "../../components/backDropLoader";
import ProcedureDurationPicker from "../../components/durationList";
import { darkTheme, lightTheme } from "../../context/theme";
import { setRerenderOrders } from "../../redux/rerenders";
import DateAndTimePicker from "../../screens/orders/dateAndTimePicker";
import { ProceduresList } from "../../screens/orders/procedures";

/**
 * Add new order manualy from OMS
 */

export const AddOrder = ({ route, navigation }) => {
  // defines redux dispatch
  const dispatch = useDispatch();

  // defines theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines loading state
  const [isLoaded, setIsLoaded] = useState(true); // new state variable

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // If you have a date object and want to convert it to a specific timezone:
  let myDate = new Date();

  // If you want to keep the format consistent with JavaScript's Date object, you can format it like so:
  let formattedDateInTimezone = moment(myDate)
    .tz(Localization.timezone)
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  // define date and time
  const [dateAndTime, setDateAndTime] = useState(formattedDateInTimezone);

  /**
   * states to create order
   */
  // defines procedure
  const [procedure, setProcedure] = useState(null);
  // defines procedure price
  const [price, setPrice] = useState("");
  // defines currency
  const [currency, setCurrency] = useState(currentUser.currency);
  // defines procedure duration
  const [duration, setDuration] = useState(null);
  // defines client
  const [user, setUser] = useState({
    id: "",
    name: "",
    phone: "",
    addationalInfo: "",
  });
  // defines comment
  const [comment, setComment] = useState("");

  // defines loader
  const [loader, setLoader] = useState(false);

  /**
   * Add order to db
   */
  const AddOrderToDb = async () => {
    if (
      procedure &&
      price?.toString()?.length > 0 &&
      user.name?.length > 0 &&
      duration > 0
    ) {
      setLoader(true);
      let orderId = uuid.v4();

      try {
        await axios.post(
          "https://beautyverse.herokuapp.com/api/v1/users/" +
            currentUser._id +
            "/orders",
          {
            orderNumber: orderId,
            user: { id: user.id, phone: user.phone, name: user.name },
            orderedProcedure: procedure?.value,
            orderedSpecialist: "",
            orderSum: price,
            currency: currency,
            duration: duration,
            date: dateAndTime,
            status: "active",
            comment: "",
          }
        );

        dispatch(setRerenderOrders());
        navigation.goBack();
        setLoader(false);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } else {
      Alert.alert(
        "Please add procedure, procedure price, procedure duration and User info"
      );
    }
  };

  // open duration popup
  const [visible, setVisible] = useState(false);

  // animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const showDurationModal = () => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // edit procedure
  const EditProcedure = (val) => {
    setDuration(val.duration);
  };

  // finish loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(false);
    }, 200);
  }, []);

  return (
    <>
      {isLoaded ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: 500,
          }}
        >
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
          // style={{ flex: 1 }}
        >
          <ScrollView
            style={{}}
            contentContainerStyle={{
              padding: 15,
              alignItems: "center",
              gap: 15,
            }}
            bounces={Platform.OS === "ios" ? false : undefined}
            overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          >
            <BackDrop loading={loader} setLoading={setLoader} />
            <View style={{ width: "100%", alignItems: "center" }}>
              <DateAndTimePicker
                dateAndTime={dateAndTime}
                setDateAndTime={setDateAndTime}
              />
            </View>
            <View
              style={{
                width: "100%",
                flex: 1,
                paddingTop: 20,
                borderTopWidth: 1,
                borderTopColor: currentTheme.line,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <MaterialIcons
                  name="done"
                  color={currentTheme.pink}
                  size={18}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: currentTheme.font,
                    letterSpacing: 0.3,
                  }}
                >
                  Choice Procedure:
                </Text>
              </View>
              <ProceduresList
                targetUser={currentUser}
                addOrder={true}
                procedure={procedure}
                setProcedure={setProcedure}
                price={price}
                setPrice={setPrice}
                duration={duration}
                setDuration={setDuration}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: "90%",
                borderBottomWidth: 1,
                borderBottomColor: currentTheme.line,
                paddingBottom: 15,
              }}
            >
              <View
                style={{
                  backgroundColor: "red",
                  padding: 5,
                  borderRadius: 50,
                  backgroundColor: "#151515",
                  width: "30%",
                  alignItems: "center",
                  backgroundColor: currentTheme.background2,
                  borderWidth: 1,
                  borderColor: currentTheme.line,
                }}
              >
                <TextInput
                  placeholder="Price"
                  placeholderTextColor={currentTheme.disabled}
                  value={price?.toString()}
                  style={{ color: currentTheme.font, fontSize: 16 }}
                  onChangeText={setPrice}
                />
              </View>
              <Text style={{ color: currentTheme.font, fontSize: 16 }}>
                {currency === "Dollar" ? (
                  <FontAwesome
                    name="dollar"
                    color={currentTheme.pink}
                    size={16}
                  />
                ) : currency === "Euro" ? (
                  <FontAwesome
                    name="euro"
                    color={currentTheme.pink}
                    size={16}
                  />
                ) : (
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: currentTheme.pink,
                      fontSize: 16,
                    }}
                  >
                    {"\u20BE"}
                  </Text>
                )}
              </Text>
              <View
                style={{
                  marginLeft: "auto",
                  backgroundColor: currentTheme.pink,
                  borderRadius: 50,
                  width: 25,
                  height: 25,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {currency === "Lari" ? (
                    <TouchableOpacity
                      style={{
                        width: 50,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => setCurrency("Dollar")}
                    >
                      <Text style={{ color: currentTheme.font, fontSize: 16 }}>
                        <FontAwesome name="dollar" color={"#111"} size={16} />
                      </Text>
                    </TouchableOpacity>
                  ) : currency === "Dollar" ? (
                    <TouchableOpacity
                      onPress={() => setCurrency("Euro")}
                      style={{
                        width: 50,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: currentTheme.font, fontSize: 16 }}>
                        <FontAwesome name="euro" color={"#111"} size={16} />
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setCurrency("Lari")}
                      style={{
                        width: 50,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#111",
                          fontSize: 16,
                        }}
                      >
                        {"\u20BE"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: "90%",
                borderBottomWidth: 1,
                borderBottomColor: currentTheme.line,
                paddingBottom: 15,
              }}
            >
              <View
                style={{
                  backgroundColor: "red",
                  padding: 5,
                  borderRadius: 50,
                  backgroundColor: "#151515",
                  width: "30%",
                  alignItems: "center",
                  backgroundColor: currentTheme.background2,
                  borderWidth: 1,
                  borderColor: currentTheme.line,
                }}
              >
                {duration > 0 ? (
                  <TouchableOpacity onPress={showDurationModal}>
                    <Text style={{ color: currentTheme.font, fontSize: 16 }}>
                      {duration < 60
                        ? duration + " min."
                        : duration >= 60
                        ? Math.floor(duration / 60) +
                          "h" +
                          (duration % 60 > 0
                            ? " " + (duration % 60) + " min."
                            : "")
                        : "0h"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={showDurationModal}>
                    <Text
                      style={{ color: currentTheme.disabled, fontSize: 16 }}
                    >
                      Duration
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={{ color: currentTheme.font, fontSize: 16 }}>
                <FontAwesome5
                  name="clock"
                  color={currentTheme.pink}
                  size={14}
                />
              </Text>
            </View>

            <View style={{ gap: 10, marginTop: 15, width: "95%" }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <FontAwesome name="user" color={currentTheme.pink} size={18} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: currentTheme.font,
                    letterSpacing: 0.3,
                  }}
                >
                  Client:
                </Text>
              </View>
              <TextInput
                placeholder="Name"
                placeholderTextColor={currentTheme.disabled}
                value={user.name}
                style={{
                  color: currentTheme.font,
                  borderBottomWidth: 1,
                  borderBottomColor: currentTheme.line,
                  padding: 10,
                }}
                onChangeText={(val) => setUser({ ...user, name: val })}
              />
              <TextInput
                placeholder="Phone Number (optional)"
                placeholderTextColor={currentTheme.disabled}
                value={user.phone}
                style={{
                  color: currentTheme.font,
                  borderBottomWidth: 1,
                  borderBottomColor: currentTheme.line,
                  padding: 10,
                }}
                onChangeText={(val) => setUser({ ...user, phone: val })}
              />
              <TextInput
                placeholder="Addationl info (optional)"
                placeholderTextColor={currentTheme.disabled}
                value={user.addationalInfo}
                style={{
                  color: currentTheme.font,
                  borderBottomWidth: 1,
                  borderBottomColor: currentTheme.line,

                  padding: 10,
                }}
                onChangeText={(val) =>
                  setUser({ ...user, addationalInfo: val })
                }
              />
              <TextInput
                placeholder="Comment (optional)"
                placeholderTextColor={currentTheme.disabled}
                value={comment}
                style={{
                  color: currentTheme.font,
                  borderBottomWidth: 1,
                  borderBottomColor: currentTheme.line,

                  padding: 10,
                }}
                onChangeText={setComment}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={AddOrderToDb}
              style={{
                marginVertical: 15,
                borderRadius: 50,
                width: "45%",
                backgroundColor: currentTheme.pink,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#f1f1f1", fontWeight: "bold" }}>
                Add Order
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <ProcedureDurationPicker
            currentTheme={currentTheme}
            visible={visible}
            setVisible={setVisible}
            fadeAnim={fadeAnim}
            EditProcedure={EditProcedure}
          />
        </KeyboardAvoidingView>
      )}
    </>
  );
};
