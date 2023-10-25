import {
  View,
  Button,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { lightTheme, darkTheme } from "../../context/theme";
import axios from "axios";
import { ProceduresOptions } from "../../datas/registerDatas";

/**
 *
 *
 * @returns Clock
 */

export const DateScreen = ({ route }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const proceduresOptions = ProceduresOptions();

  // define active hours in this day
  let activedate = route.params.date;
  const date = new Date(activedate);
  const activeDates = date.toString();
  const activeDate = date.toLocaleDateString("en-US", { weekday: "long" });
  const activeDatename = activeDate?.split(",");
  const activeDateName = activeDatename[0]?.toLowerCase();
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const dayObj = currentUser?.workingDays?.find(
    (item) =>
      item.value?.toLowerCase() === activeDateName ||
      item.value?.toLowerCase() === "workingdays" ||
      item.value?.toLowerCase() === "everyday"
  );
  const dayHours = dayObj.hours?.split(" - ");
  const startHour = dayHours[0];
  const endHour = dayHours[1];

  // hours list
  const [hoursList, setHoursList] = useState([]);

  useEffect(() => {
    const startTime = new Date(`2000-01-01T${startHour}`);
    const endTime = new Date(`2000-01-01T${endHour}`);

    const list = [];
    let currentHour = startTime;

    while (currentHour <= endTime) {
      const hour = currentHour.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
      list.push(hour);
      currentHour.setMinutes(currentHour.getMinutes() + 15);
    }

    setHoursList(list);
  }, [startHour, endHour]);

  // get bookings in this date
  const [loader, setLoader] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [bookingsResult, setBookingsResult] = useState(null);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  useEffect(() => {
    const GetBookings = async () => {
      try {
        setLoader(true);
        const response = await axios.get(
          backendUrl +
            "/api/v1/bookings/" +
            currentUser._id +
            `?date=${activedate}&page=1`
        );
        setBookings(response.data.data.bookings);
        setBookingsResult(response.data.filterResult);
        setTimeout(() => {
          setLoader(false);
        }, 200);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    if (currentUser) {
      GetBookings();
    }
  }, []);

  return (
    <>
      {loader ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: 500,
          }}
        >
          <ActivityIndicator color={currentTheme.pink} size="large" />
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: 10,
            flex: 1,
          }}
        >
          <Text style={{ color: currentTheme.font, marginVertical: 8 }}>
            Total Bookings: {bookingsResult}
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            style={{ width: "100%", marginTop: 15 }}
          >
            {hoursList.map((hour) => {
              const [hours, minutes] = hour.split(":");

              const foundItem = bookings?.find((item) => {
                const itemDate = new Date(item.date);
                const itemHours = itemDate.getHours();
                const itemMinutes = itemDate.getMinutes();

                if (
                  parseInt(hours) === parseInt(itemHours) &&
                  parseInt(minutes) === parseInt(itemMinutes)
                ) {
                  return itemHours + ":" + itemMinutes;
                }
              });

              if (foundItem) {
                let lab = proceduresOptions?.find(
                  (pr) =>
                    pr.value?.toLowerCase() ===
                    foundItem.bookingProcedure?.value?.toLowerCase()
                );
                return (
                  <View
                    key={hour}
                    style={{
                      width: "100%",
                      borderWidth: 1,
                      borderColor: currentTheme.line,
                      padding: 10,
                      borderRadius: 8,
                      flexDirection: "row",
                      gap: 10,
                      backgroundColor:
                        foundItem.status === "active"
                          ? currentTheme.pink
                          : currentTheme.background,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          foundItem.status === "active"
                            ? "#111"
                            : currentTheme.disabled,
                        letterSpacing: 0.2,
                        fontWeight: "bold",
                      }}
                    >
                      {hour}
                    </Text>
                    <Text
                      style={{
                        color:
                          foundItem.status === "active"
                            ? "#111"
                            : currentTheme.disabled,
                        letterSpacing: 0.2,
                        fontWeight: "bold",
                      }}
                    >
                      {lab.label}
                    </Text>
                    <Text
                      style={{
                        color:
                          foundItem.status === "active"
                            ? "#111"
                            : currentTheme.disabled,
                        letterSpacing: 0.2,
                        fontWeight: "bold",
                      }}
                    >
                      {foundItem.user.name}
                    </Text>
                    <Text
                      style={{
                        color:
                          foundItem.status === "active"
                            ? "#111"
                            : currentTheme.disabled,
                        letterSpacing: 0.2,
                        fontWeight: "bold",
                        marginLeft: "auto",
                      }}
                    >
                      {foundItem.status}
                    </Text>
                  </View>
                );
              }
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
};
