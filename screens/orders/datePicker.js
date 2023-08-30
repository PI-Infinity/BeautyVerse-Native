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
import { setDate } from "../../redux/orders";
import { setDateSentOrders } from "../../redux/sentOrders";
import moment from "moment";
import "moment-timezone";
import * as Localization from "expo-localization";
import { useState, useEffect, useRef } from "react";
import { lightTheme, darkTheme } from "../../context/theme";
import { Language } from "../../context/language";

/**
 * Only date picker
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CustomDatePicker = ({ from, targetUser }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines language
  const language = Language();

  // const define state
  const dateState = useSelector((state) => {
    if (from === "orders") {
      return state.storeOrders.date;
    } else if (from === "sentOrders") {
      return state.storeSentOrders.date;
    }
  });

  const [date, setdate] = useState(new Date(dateState.date));

  useEffect(() => {
    setdate(new Date(dateState.date));
  }, [dateState]);

  let dt = moment(date).tz(Localization.timezone).format("DD MMMM YYYY");

  // For Today
  let today = moment().tz(Localization.timezone).format("DD MMMM YYYY");
  // For yesterday
  let yesterday = moment()
    .tz(Localization.timezone)
    .subtract(1, "days")
    .format("DD MMMM YYYY");

  // For tomorrow
  let tomorrow = moment()
    .tz(Localization.timezone)
    .add(1, "days")
    .format("DD MMMM YYYY");

  let initialDate;
  if (dt === today) {
    initialDate = language?.language?.Bookings?.bookings?.today;
  } else if (dt === yesterday) {
    initialDate = language?.language?.Bookings?.bookings?.yesterday;
  } else if (dt === tomorrow) {
    initialDate = language?.language?.Bookings?.bookings?.tomorrow;
  } else {
    initialDate = dt;
  }

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

  const savePicker = () => {
    let newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    let formattedDateInTimezone = moment(newDate)
      .tz(Localization.timezone)
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    if (from === "orders") {
      dispatch(setDate({ active: true, date: formattedDateInTimezone }));
    } else {
      dispatch(
        setDateSentOrders({ active: true, date: formattedDateInTimezone })
      );
    }
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
    if (dateState.active) {
      setSelectedDay(1);
    }
  }, [selectedMonth, selectedYear]);

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
            {language?.language?.Bookings?.bookings?.choiceDate}:{" "}
          </Text>
        </View>
        <TouchableOpacity
          onPress={openPicker}
          style={{
            // backgroundColor: currentTheme.background2,
            width: "40%",
            borderRadius: 50,
            padding: 5,
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: dateState.active
              ? currentTheme.pink
              : currentTheme.line,
            marginLeft: "auto",
          }}
        >
          <Text
            style={{
              color: dateState.active ? currentTheme.pink : currentTheme.font,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {dateState.active ? initialDate : "N/A"}
          </Text>
        </TouchableOpacity>
        {dateState?.active && (
          <TouchableOpacity
            style={{ padding: 2.5 }}
            onPress={() => {
              let newdate = new Date();
              let formattedDateInTimezone = moment(newdate)
                .tz(Localization.timezone)
                .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
              if (from === "orders") {
                dispatch(
                  setDate({ active: false, date: formattedDateInTimezone })
                );
              } else if (from === "sentOrders") {
                dispatch(
                  setDateSentOrders({
                    active: false,
                    date: formattedDateInTimezone,
                  })
                );
              }
            }}
          >
            <MaterialCommunityIcons name="close" size={22} color="red" />
          </TouchableOpacity>
        )}
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
