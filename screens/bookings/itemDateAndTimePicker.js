import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment-timezone";
import * as Localization from "expo-localization";
import { useState, useEffect, useRef } from "react";
import { lightTheme, darkTheme } from "../../context/theme";
import axios from "axios";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const CustomDatePicker = ({
  from,
  dateAndTime,
  setDateAndTime,
  bookingId,
  bookingDuration,
  targetUser,
}) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // const define state
  const dateState = dateAndTime;

  const [date, setdate] = useState(new Date(dateState));

  useEffect(() => {
    setdate(new Date(dateState));
  }, [dateState]);

  const initialDate = moment.utc(date).format("DD MMMM YYYY - HH:mm");

  /**
   * open close functions
   */
  const [isPickerVisible, setPickerVisibility] = useState(false);

  const openPicker = () => {
    setPickerVisibility(true);
  };

  const closePicker = () => {
    setPickerVisibility(false);
  };

  const [selectedDay, setSelectedDay] = useState(date.getUTCDate());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

  const [time, setTime] = useState(null);

  const savePicker = () => {
    if (!time) {
      Alert.alert("The time isn't defined!");
    } else {
      const [hours, minutes] = time?.time?.split(":");

      // Set the time
      let newDate = new Date(selectedYear, selectedMonth - 1, selectedDay + 1);
      newDate.setUTCHours(hours, minutes);

      setDateAndTime(newDate);

      setPickerVisibility(false);
    }
  };

  /// define months
  const MONTHS = [
    { label: "Jan", value: 1 },
    { label: "Feb", value: 2 },
    { label: "Mar", value: 3 },
    { label: "Apr", value: 4 },
    { label: "May", value: 5 },
    { label: "Jun", value: 6 },
    { label: "Jul", value: 7 },
    { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    { label: "Nov", value: 11 },
    { label: "Dec", value: 12 },
  ];

  const [daysArray, setDaysArray] = useState(
    Array.from({ length: 31 }, (_, i) => i + 1)
  );
  const [monthsArray, setMonthsArray] = useState(MONTHS);
  const [yearsArray, setYearsArray] = useState(
    Array.from({ length: 28 }, (_, i) => i + 2023)
  );

  const isFirstRender = useRef(true); // add this line

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let daysInMonth;
    const isLeap = (year) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    if (selectedMonth === 2) {
      // February
      daysInMonth = isLeap(selectedYear) ? 29 : 28;
    } else if (
      selectedMonth === 4 ||
      selectedMonth === 6 ||
      selectedMonth === 9 ||
      selectedMonth === 11
    ) {
      // April, June, September and November have 30 days
      daysInMonth = 30;
    } else {
      // The rest of the months have 31 days
      daysInMonth = 31;
    }
    setDaysArray(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    if (dateState) {
      setSelectedDay(1);
    }
  }, [selectedMonth, selectedYear]);

  /// get bookings by date
  const [bookings, setBookings] = useState([]);

  const [loader, setLoader] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const GetBookings = async () => {
    setLoader(true);
    let newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    try {
      const response = await axios.get(
        backendUrl + "/api/v1/bookings/" + targetUser._id + `?date=${newDate}`
      );
      setBookings(response.data.data.bookings);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    GetBookings();
  }, [selectedDay, selectedMonth, selectedYear]);

  // define free hours
  const today = new Date(selectedYear, selectedMonth - 1, selectedDay);
  const isToday = today
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    ?.split(",")[0];

  const wDay = targetUser?.workingDays.find(
    (item) =>
      item.value.toLowerCase() === "everyday" ||
      item.value.toLowerCase() === "workingdays" ||
      item.value.toLowerCase() === isToday.toLowerCase()
  );

  let workingHoursInThisDay;
  if (wDay) {
    workingHoursInThisDay = wDay.hours?.split(" - ");
  } else {
    workingHoursInThisDay = "09:00 - 21:00";
  }

  let startHour;
  let endHour;
  if (workingHoursInThisDay) {
    startHour = workingHoursInThisDay[0];
    endHour = workingHoursInThisDay[1];
  } else {
    startHour = "09:00";
    endHour = "21:00";
  }

  // define procedure time
  const procedureTime = bookingDuration;

  // Assuming bookings is defined elsewhere in your code and each booking has a `date` (a timestamp) and `duration` (in minutes)
  let activeHours = bookings
    .filter((b) => b.bookingNumber !== bookingId)
    ?.map((booking, index) => {
      // Parse the booking date as a UTC moment
      let startTime = moment.utc(booking.date);

      let duration = booking.duration;

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
  let timeList = generateTimeList(parseInt(startHour), parseInt(endHour), 15);

  let result = timeList.map((time) => {
    // Check if the time is within any active hour plus its duration
    let isBooked = activeHours.some(({ startTime, endTime }) => {
      // Convert time to Date for comparison
      let [hh, mm] = time?.split(":");
      let timeDate = new Date();
      timeDate.setHours(hh, mm);

      // Convert startTime and endTime to Date for comparison
      let [startHH, startMM] = startTime?.split(":");
      let startTimeDate = new Date();
      startTimeDate.setHours(startHH, startMM);

      let [endHH, endMM] = endTime?.split(":");
      let endTimeDate = new Date();
      endTimeDate.setHours(endHH, endMM);

      // Subtract procedureTime from startTimeDate for comparison
      let preBookingTime = new Date(startTimeDate.getTime());
      preBookingTime.setMinutes(preBookingTime.getMinutes() - procedureTime);

      // Check if the timeDate falls within the pre-booking period or the active booking
      return (
        (timeDate > preBookingTime && timeDate < startTimeDate) ||
        (timeDate >= startTimeDate && timeDate <= endTimeDate)
      );
    });

    // If it is, mark it as booked
    if (isBooked) {
      return { time: time, status: "Not Available" };
    } else {
      // If it isn't, leave it as available
      return { time: time, status: "Available" };
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 200);
  }, [result]);

  return (
    <View
      style={{
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          paddingRight: 0,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons
            name="calendar"
            size={18}
            color={currentTheme.pink}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#f1f1f1",
              letterSpacing: 0.3,
            }}
          >
            Choice Date:
          </Text>
        </View>
        <TouchableOpacity
          onPress={openPicker}
          style={{
            backgroundColor: currentTheme.background2,
            width: "60%",
            borderRadius: 50,
            padding: 5,
            alignItems: "center",
            borderWidth: 1,
            borderColor: currentTheme.pink,
            marginLeft: "auto",
          }}
        >
          <Text
            style={{
              color: "#f1f1f1",
              fontSize: 14,
            }}
          >
            {initialDate}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isPickerVisible}
        onBackdropPress={closePicker}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: SCREEN_WIDTH - 40,
          marginRight: 15,
        }} // center the modal
        animationIn="zoomIn" // animate in with a zoom
        // animationOut="fadeOut" // animate out with a zoom
        backdropColor="black" // make the backdrop black
        backdropOpacity={0.7}
      >
        <View
          style={{
            backgroundColor: currentTheme.background,
            borderRadius: 10,
            width: "100%",
            paddingVertical: 15,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: Platform.OS === "ios" ? "row" : "column",
              height: Platform.OS === "ios" ? 240 : 200,
              width: "100%",
              gap: 8,
              paddingHorizontal: 15,
              justifyContent: "center",
            }}
          >
            <Picker
              selectedValue={selectedDay}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDay(itemValue)
              }
              style={{
                width: Platform.OS === "ios" ? "32%" : "100%",
                backgroundColor: currentTheme.pink,
                borderRadius: 10,
              }}
            >
              {daysArray.map((day, index) => (
                <Picker.Item key={index} label={String(day)} value={day} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedMonth}
              style={{
                width: Platform.OS === "ios" ? "32%" : "100%",
                backgroundColor: currentTheme.pink,
                borderRadius: 10,
              }}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              {monthsArray.map((month, index) => (
                <Picker.Item
                  key={index}
                  label={month.label}
                  value={month.value}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedYear}
              style={{
                width: Platform.OS === "ios" ? "32%" : "100%",
                backgroundColor: currentTheme.pink,
                borderRadius: 10,
              }}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              {yearsArray.map((year, index) => (
                <Picker.Item key={index} label={String(year)} value={year} />
              ))}
            </Picker>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              marginTop: 8,
            }}
          >
            <MaterialCommunityIcons
              name="clock"
              size={18}
              color={currentTheme.pink}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                letterSpacing: 0.3,
                color: currentTheme.font,
                marginVertical: 10,
              }}
            >
              Select Time:{" "}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", height: 200 }}
            contentContainerStyle={{
              marginTop: 10,
              paddingHorizontal: 8,
              alignItems: "center",
            }}
          >
            {loader ? (
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
            ) : result?.length > 0 ? (
              result?.map((item, index) => {
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
              })
            ) : (
              <View
                style={{
                  height: 200,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: currentTheme.disabled,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Day off
                </Text>
              </View>
            )}
          </ScrollView>
          <View style={{ alignItems: "center", width: "100%" }}>
            <Pressable
              style={{
                marginTop: 20,
                backgroundColor: currentTheme.pink,
                width: "45%",
                borderRadius: 50,
                padding: 10,
                alignItems: "center",
              }}
              onPress={result?.length > 0 ? savePicker : closePicker}
            >
              <Text
                style={{
                  color: "#f1f1f1",
                  fontWeight: "bold",
                  letterSpacing: 0.2,
                }}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDatePicker;
