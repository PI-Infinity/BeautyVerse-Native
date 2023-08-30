import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment-timezone";
import * as Localization from "expo-localization";
import { useState, useEffect, useRef } from "react";
import { lightTheme, darkTheme } from "../../context/theme";
import { Language } from "../../context/language";

/**
 * Date and time picket
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CustomDatePicker = ({ from, dateAndTime, setDateAndTime }) => {
  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines language
  const language = Language();

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // cdefines active date
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

  const [selectedDay, setSelectedDay] = useState(date.getDate());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const savePicker = () => {
    let newDate = new Date(
      selectedYear,
      selectedMonth - 1,
      selectedDay,
      selectedHour,
      selectedMinute
    );
    let formattedDateInTimezone = moment(newDate)
      .tz(Localization.timezone)
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    setDateAndTime(formattedDateInTimezone);

    setPickerVisibility(false);
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
    Array?.from({ length: 31 }, (_, i) => i + 1)
  );
  const [monthsArray, setMonthsArray] = useState(MONTHS);
  const [yearsArray, setYearsArray] = useState(
    Array?.from({ length: 28 }, (_, i) => i + 2023)
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

  /**
   * generate time picker
   *
   */
  const today = new Date();
  const isToday = today
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    ?.split(",")[0];
  const workingDays = currentUser.workingDays.find(
    (item) =>
      item.value?.toLowerCase() === "everyday" ||
      item.value?.toLowerCase() === "workingdays" ||
      item.value?.toLowerCase() === isToday.toLowerCase()
  );

  let timePeriod;
  if (
    workingDays?.value.toLowerCase() === "everyday" ||
    workingDays?.value.toLowerCase() === "workingdays"
  ) {
    if (workingDays.hours) {
      timePeriod = workingDays.hours;
    } else {
      timePeriod = "01:00 - 24:00";
    }
  }

  let splited = timePeriod?.split(" - ");
  let startHour;
  let endHour;
  if (splited) {
    startHour = splited[0];
    endHour = splited[1];
  } else {
    startHour = "01:00";
    endHour = "00:00";
  }

  // Generate hours array for 24 hours
  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  // Generate minutes array for 60 minutes with 15 minutes interval
  const minutesArray = Array.from({ length: 4 }, (_, i) =>
    String(i * 15).padStart(2, "0")
  );

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 10,
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingRight: 0,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={currentTheme.pink}
          />
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
        <TouchableOpacity
          onPress={openPicker}
          style={{
            // backgroundColor: currentTheme.background2,
            width: "48%",
            borderRadius: 50,
            padding: 5,
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: currentTheme.pink,
            marginLeft: "auto",
          }}
        >
          <Text
            style={{
              color: currentTheme.font,
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
        }}
        animationIn="zoomIn" // animate in with a zoom
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              overflow: "hidden",
              paddingHorizontal: 15,
              gap: 8,
            }}
          >
            <Picker
              selectedValue={selectedHour}
              style={{
                width: Platform.OS === "ios" ? "24%" : "100%",
                backgroundColor: currentTheme.pink,
                borderRadius: 10,
                height: Platform.OS === "ios" ? 150 : 50,
                justifyContent: "center",
                width: Platform.OS === "ios" ? "35%" : "60%",
              }}
              onValueChange={(itemValue) => setSelectedHour(itemValue)}
            >
              {hoursArray
                // .filter(({ status }) => status === "Available")
                .map((item, index) => (
                  <Picker.Item label={item} value={item} key={index} />
                ))}
            </Picker>
            <Picker
              selectedValue={selectedMinute}
              style={{
                width: Platform.OS === "ios" ? "24%" : "100%",
                backgroundColor: currentTheme.pink,
                borderRadius: 10,
                height: Platform.OS === "ios" ? 150 : 50,
                justifyContent: "center",
                width: Platform.OS === "ios" ? "35%" : "60%",
              }}
              onValueChange={(itemValue) => setSelectedMinute(itemValue)}
            >
              {minutesArray
                // .filter(({ status }) => status === "Available")
                .map((item, index) => (
                  <Picker.Item label={item} value={item} key={index} />
                ))}
            </Picker>
          </View>
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
              onPress={savePicker}
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
