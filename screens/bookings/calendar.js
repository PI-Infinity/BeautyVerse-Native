import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";

/**
 * Calendar
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

export const Calendar = ({ date, setDate, targetUser, setTime }) => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines language
  const language = Language();

  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = getDaysInMonth(month + 1, year);
  let firstDayOfWeek = new Date(year, month, 1).getDay();

  // Adjusting first day of week for locale where week starts on Monday
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  let daysArray = Array(firstDayOfWeek)
    .fill(null)
    .map((_, i) => getDaysInMonth(month, year) - firstDayOfWeek + i + 1);
  daysArray = [
    ...daysArray,
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const remainingDays = 7 - (daysArray.length % 7);
  daysArray = [
    ...daysArray,
    ...Array.from({ length: remainingDays }, (_, i) => i + 1),
  ];

  const rows = [];
  while (daysArray.length) rows.push(daysArray.splice(0, 7));

  // define target user working days and time

  let workingDays;
  if (targetUser.workingDays?.length > 0) {
    workingDays = targetUser.workingDays;
  } else {
    workingDays = [{ value: "everyday" }];
  }

  // define day offs
  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Assuming workingDays is set elsewhere in your code.
  let dayOffs;
  if (workingDays[0]?.value.toLowerCase() === "workingdays") {
    dayOffs = ["Saturday", "Sunday"];
  } else if (workingDays[0]?.value.toLowerCase() === "everyday") {
    dayOffs = [];
  } else if (Array.isArray(workingDays)) {
    dayOffs = days.filter(
      (day) =>
        !workingDays.some(
          (workingDay) => workingDay.value?.toLowerCase() === day.toLowerCase()
        )
    );
  } else {
    console.log("Unexpected value for workingDays");
  }

  return (
    <View style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 7.5,
            paddingHorizontal: 15,
            borderBottom: 1,
            borderColor: currentTheme.line,
            borderRadius: 50,
            backgroundColor: currentTheme.background2,
            width: "30%",
            alignItems: "center",
          }}
          onPress={() =>
            setCurrentDate(
              (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
            )
          }
        >
          <Text
            numberOfLines={1}
            style={{ fontSize: 14, color: currentTheme.pink }}
          >
            {language?.language?.Bookings?.bookings?.prev}
          </Text>
        </TouchableOpacity>
        <Text style={{ color: "#f1f1f1" }}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity
          style={{
            padding: 7.5,
            paddingHorizontal: 15,
            borderBottom: 1,
            borderColor: currentTheme.line,
            borderRadius: 50,
            backgroundColor: currentTheme.background2,
            width: "30%",
            alignItems: "center",
          }}
          onPress={() =>
            setCurrentDate(
              (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
            )
          }
        >
          <Text
            style={{ fontSize: 14, color: currentTheme.pink }}
            numberOfLines={1}
          >
            {language?.language?.Bookings?.bookings?.next}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 5,
        }}
      >
        {daysNames.map((day, index) => (
          <View
            key={index}
            style={{ width: SCREEN_WIDTH / 7, alignItems: "center" }}
          >
            <Text style={{ color: currentTheme.font }}>{day}</Text>
          </View>
        ))}
      </View>
      <View style={{ gap: 5 }}>
        {rows.map((week, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-around",
            }}
          >
            {week.map((day, j) => {
              const isDisabled = (i === 0 && day > 7) || (i > 2 && day <= 7);

              return (
                <DayItem
                  key={j}
                  day={day}
                  isDisabled={isDisabled}
                  currentTheme={currentTheme}
                  currentMonth={month}
                  currentYear={year}
                  navigation={navigation}
                  date={date}
                  setDate={setDate}
                  targetUser={targetUser}
                  dayOffs={dayOffs}
                  setTime={setTime}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const DayItem = ({
  day,
  isDisabled,
  currentMonth,
  currentYear,
  currentTheme,
  navigation,
  date,
  setDate,
  targetUser,
  dayOffs,
  setTime,
}) => {
  const today = new Date();
  const isToday =
    today.getDate() === day &&
    today.getMonth() === currentMonth &&
    today.getFullYear() === currentYear;

  const dateValue = new Date(currentYear, currentMonth, day + 1);

  // define day offs
  const dateToday = new Date(currentYear, currentMonth, day);
  const activeDate = dateToday.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const activeDayName = activeDate?.split(",");

  useEffect(() => {
    if (isToday) {
      setDate(dateValue.toISOString());
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={
        !isDisabled &&
        new Date() < dateValue &&
        !dayOffs.includes(activeDayName[0])
          ? () => {
              setDate(dateValue.toISOString());
              setTime(null);
            }
          : undefined
      }
      activeOpacity={
        !dayOffs.includes(activeDayName[0]) &&
        !isDisabled &&
        new Date() < dateValue
          ? 0.8
          : 1
      }
      style={{
        width: SCREEN_WIDTH / 8,
        aspectRatio: 1,
        backgroundColor: isDisabled ? currentTheme.disabled : currentTheme.pink,
        padding: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderColor:
          date === dateValue.toISOString() && !isDisabled
            ? "#fff"
            : isDisabled
            ? currentTheme.disabled
            : currentTheme.pink,
        alignItems: "center",
      }}
    >
      {isToday && !isDisabled && (
        <View
          style={{
            width: 7,
            height: 7,
            backgroundColor: "#fff",
            borderRadius: 10,
            position: "absolute",
            right: 5,
            top: 5,
          }}
        ></View>
      )}
      <Text style={{ color: isDisabled ? "#f1f1f1" : "white", fontSize: 12 }}>
        {day}
      </Text>
      {(dayOffs.includes(activeDayName[0]) || new Date() > dateValue) &&
        !isDisabled && <MaterialIcons name="close" color="red" size={22} />}
    </TouchableOpacity>
  );
};
