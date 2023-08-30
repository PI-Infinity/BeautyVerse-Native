import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/socketContext";
import { darkTheme, lightTheme } from "../../context/theme";
import { setRerenderOrders } from "../../redux/rerenders";
import { Calendar } from "../../screens/orders/calendar";
import { ProceduresList } from "../../screens/orders/procedures";
import { Language } from "../../context/language";
import { ProceduresOptions } from "../../datas/registerDatas";
import { BackDrop } from "../../components/backDropLoader";
import { sendNotification } from "../../components/pushNotifications";

/**
 * Send order component to specialist or to salon
 */

export const SendOrder = ({ route }) => {
  // loading state
  const [isLoaded, setIsLoaded] = useState(true); // new state variable

  // defines navigation state
  const navigation = useNavigation();

  // define target specialist or salon
  const targetUser = route.params.user;

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines socket server
  const socket = useSocket();

  // defines language
  const language = Language();

  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // loading when sending request
  const [sending, setSending] = useState(false);

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines procedure date
  const [date, setDate] = useState(new Date());

  // defines procedure time
  const [time, setTime] = useState(null);

  // defines procedure
  const [procedure, setProcedure] = useState(null);

  // defines pricedure price
  const [price, setPrice] = useState("");

  // defines procedure currency
  const [currency, setCurrency] = useState(targetUser.currency);

  // defines procedure duration
  const [duration, setDuration] = useState(null);

  // time loader state
  const [timeLoader, setTimeLoader] = useState(false);

  /// get orders by date
  const [orders, setOrders] = useState([]);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Get orders function
   */
  const GetOrders = async () => {
    setTimeLoader(true);
    try {
      const response = await axios.get(
        backendUrl + "/api/v1/users/" + targetUser._id + `/orders?date=${date}`
      );
      setOrders(response.data.data.orders);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    GetOrders();
  }, [date, time]);

  const t = new Date(date);

  // subtract one day from today's date
  const td = new Date(t.getTime() - 1000 * 60 * 60 * 24);

  const isToday = td
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    ?.split(",")[1];
  const isTodayDay = td
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    ?.split(",")[0];

  const wDay = targetUser?.workingDays.find(
    (item) =>
      item.value.toLowerCase() === "everyday" ||
      item.value.toLowerCase() === "workingdays" ||
      item.value.toLowerCase() === isTodayDay.toLowerCase()
  );

  let workingHoursInThisDay;

  if (wDay) {
    if (wDay.hours) {
      workingHoursInThisDay = wDay.hours?.split(" - ");
    } else {
      workingHoursInThisDay = ["10:00", "21:00"];
    }
  } else {
    workingHoursInThisDay = ["10:00", "21:00"];
  }

  let startHour;
  let endHour;
  if (workingHoursInThisDay) {
    startHour = workingHoursInThisDay[0];
    endHour = workingHoursInThisDay[1];
  }

  // define procedure time
  let procedureTime;
  if (procedure?.duration) {
    procedureTime = procedure.duration;
  } else {
    procedureTime = 60;
  }

  // Assuming orders is defined elsewhere in your code and each order has a `date` (a timestamp) and `duration` (in minutes)
  let activeHours = orders?.map((order, index) => {
    // Parse the order date as a UTC moment
    let startTime = moment.utc(order.date);

    let duration = order.duration;

    // Compute endTime as startTime + duration
    let endTime = moment.utc(startTime).add(duration, "minutes");

    return {
      // Format the times as UTC
      startTime: startTime.utc().format("HH:mm"),
      duration: duration,
      endTime: endTime.utc().format("HH:mm"),
    };
  });

  // Function to generate a time list
  function generateTimeList(startHour, endHour, interval) {
    let list = [];
    for (let i = startHour * 60; i < endHour * 60; i += interval) {
      let hh = Math.floor(i / 60);
      let mm = i % 60;
      // Formatting the time string with leading zeros
      hh = hh.toString().padStart(2, "0");
      mm = mm.toString().padStart(2, "0");
      list.push(`${hh}:${mm}`);
    }
    return list;
  }

  // Generate a list of times, each 15 minutes apart
  let tmlst = generateTimeList(parseInt(startHour), parseInt(endHour), 15);
  var currentTime = new Date().getHours() * 60 + new Date().getMinutes(); // Convert current time to minutes

  // Filter out the times that are less than the current time
  let timeList;
  if (
    isToday ===
    new Date()
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      ?.split(",")[1]
  ) {
    timeList = tmlst.filter((time) => {
      var [hours, minutes] = time.split(":"); // Split the time string into hours and minutes
      var totalMinutes = hours * 60 + Number(minutes); // Convert time to minutes

      return totalMinutes >= currentTime; // Keep the time if it's not less than the current time
    });
  } else {
    timeList = tmlst;
  }

  let result = timeList.map((time) => {
    // Check if the time is within any active hour plus its duration
    let isBooked = activeHours.some(({ startTime, endTime }) => {
      // Convert time to Date for comparison
      let [hh, mm] = time.split(":");
      let timeDate = new Date();
      timeDate.setHours(hh, mm);

      // Convert startTime and endTime to Date for comparison
      let [startHH, startMM] = startTime.split(":");
      let startTimeDate = new Date();
      startTimeDate.setHours(startHH, startMM);

      let [endHH, endMM] = endTime.split(":");
      let endTimeDate = new Date();
      endTimeDate.setHours(endHH, endMM);

      // Subtract procedureTime from startTimeDate for comparison
      let preBookingTime = new Date(startTimeDate.getTime());
      preBookingTime.setMinutes(preBookingTime.getMinutes() - procedureTime);

      // Check if the timeDate falls within the pre-booking period or the active booking
      return (
        (timeDate >= preBookingTime && timeDate < startTimeDate) ||
        (timeDate >= startTimeDate && timeDate < endTimeDate)
      );
    });

    // If it is, mark it as booked
    if (isBooked) {
      return {
        time: time,
        status: language?.language?.Bookings?.bookings?.notAvailable,
      };
    } else {
      // If it isn't, leave it as available
      return {
        time: time,
        status: language?.language?.Bookings?.bookings?.available,
      };
    }
  });

  // defines beautyverse procedures list
  const proceduresOptions = ProceduresOptions();

  /// send order request function
  const SendOrderRequest = async () => {
    if (!time || !procedure) {
      return Alert.alert("Procedure, date or time are undefined!");
    } else {
      // Create a new Date object
      const newDate = new Date(date);

      // Split the time from the object
      const [hours, minutes] = time?.time.split(":");

      // Set the time
      newDate.setUTCHours(hours, minutes);

      let orderId = uuid.v4();
      setSending(true);
      try {
        await axios.post(
          backendUrl + "/api/v1/users/" + targetUser._id + "/orders",
          {
            orderNumber: orderId,
            user: {
              id: currentUser._id,
              phone: currentUser.phone,
              name: currentUser.name,
            },
            orderedProcedure: procedure.value,
            orderedSpecialist: "",
            orderSum: procedure?.price,
            currency: currency,
            duration: procedure?.duration ? procedure.duration : 60,
            date: newDate.toISOString(),
            status: "new",
            comment: "",
          }
        );
        await axios.post(
          backendUrl + "/api/v1/users/" + currentUser._id + "/sentorders",
          {
            orderNumber: orderId,
            user: {
              id: targetUser._id,
              phone: targetUser.phone,
              name: targetUser.name,
            },
            orderedProcedure: procedure.value,
            orderedSpecialist: "",
            orderSum: procedure?.price,
            currency: currency,
            duration: procedure?.duration,
            date: newDate.toISOString(),
            status: "pending",
            comment: "",
          }
        );

        let lab = proceduresOptions?.find(
          (it) => it?.value?.toLowerCase() === procedure?.value?.toLowerCase()
        );
        if (targetUser?.pushNotificationToken) {
          await sendNotification(
            targetUser?.pushNotificationToken,
            currentUser.name,
            "sent you an appointment request",
            targetUser
          );
        }
        socket.emit("updateOrders", {
          targetId: targetUser?._id,
        });
        dispatch(setRerenderOrders());
        Alert.alert("The request has been sent successfully!");
        setTimeout(() => {
          navigation.navigate("BMSSent");
        }, 200);
        setSending(false);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(false);
      setTimeLoader(false);
    }, 200);
  }, [result]);

  return (
    <>
      {sending && <BackDrop loading={sending} setLoading={setSending} />}
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
        <ScrollView
          bounces={Platform.OS === "ios" ? false : undefined}
          overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
          style={{
            flex: 1,
            borderTopWidth: 1,
            borderTopColor: currentTheme.line,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              paddingHorizontal: 15,
            }}
          >
            <MaterialIcons name="done" color={currentTheme.pink} size={18} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: currentTheme.font,
                letterSpacing: 0.3,
              }}
            >
              {language?.language?.Bookings?.bookings?.choiceProcedure}:
            </Text>
          </View>
          <ProceduresList
            targetUser={targetUser}
            addOrder={true}
            procedure={procedure}
            setProcedure={setProcedure}
            price={price}
            setPrice={setPrice}
            duration={duration}
            setDuration={setDuration}
            send={true}
            setDate={setDate}
            setTime={setTime}
          />
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: currentTheme.line,
              marginBottom: 20,
            }}
          ></View>

          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              paddingHorizontal: 15,
            }}
          >
            <FontAwesome5 name="calendar" color={currentTheme.pink} size={18} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: currentTheme.font,
                letterSpacing: 0.3,
              }}
            >
              {language?.language?.Bookings?.bookings?.choiceDate}:
            </Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Calendar
              setDate={setDate}
              date={date}
              targetUser={targetUser}
              setTime={setTime}
            />
          </View>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: currentTheme.line,
              marginBottom: 20,
            }}
          ></View>
          {workingHoursInThisDay && (
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                paddingHorizontal: 15,
              }}
            >
              <FontAwesome5 name="clock" color={currentTheme.pink} size={18} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: currentTheme.font,
                  letterSpacing: 0.3,
                }}
              >
                {language?.language?.Bookings?.bookings?.choiceTime}:
              </Text>
            </View>
          )}
          {!time ? (
            <View style={{ marginTop: 15, alignItems: "center" }}>
              {timeLoader ? (
                <View
                  style={{
                    height: 200,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator color={currentTheme.pink} />
                </View>
              ) : (
                <>
                  {result?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          width: "95%",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginVertical: 8,
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          borderWidth: 1,
                          borderColor:
                            time?.time === item?.time
                              ? currentTheme.pink
                              : currentTheme.line,
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              time?.time === item?.time
                                ? currentTheme.pink
                                : currentTheme.font,
                            letterSpacing: 0.2,
                            fontWeight: "bold",
                          }}
                        >
                          {item?.time}
                        </Text>
                        <Pressable
                          onPress={
                            item.status === "Available"
                              ? () => setTime(item)
                              : () => Alert.alert("This time isn't Available!")
                          }
                        >
                          <Text
                            style={{
                              color:
                                item.status === "Available"
                                  ? currentTheme.pink
                                  : currentTheme.font,
                              letterSpacing: 0.2,
                              fontWeight: "bold",
                            }}
                          >
                            {item.status}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          ) : (
            <View
              style={{ width: "100%", alignItems: "center", marginTop: 15 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "95%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 8,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: currentTheme.pink,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: currentTheme.pink,

                    letterSpacing: 0.2,
                    fontWeight: "bold",
                  }}
                >
                  {time?.time}
                </Text>
                <Pressable onPress={() => setTime(null)}>
                  <Text
                    style={{
                      color: currentTheme.pink,
                      letterSpacing: 0.2,
                      fontWeight: "bold",
                    }}
                  >
                    {language?.language?.Bookings?.bookings?.cancel}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: currentTheme.line,
              marginBottom: 20,
              marginTop: 10,
            }}
          ></View>
          <View
            style={{ width: "100%", alignItems: "center", marginBottom: 30 }}
          >
            <Pressable
              onPress={SendOrderRequest}
              style={{
                width: "45%",
                backgroundColor: currentTheme.pink,
                height: 40,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#f1f1f1" }}>
                {language?.language?.Bookings?.bookings?.send}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </>
  );
};
