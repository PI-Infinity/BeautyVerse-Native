// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Button,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
//   Pressable,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import Modal from "react-native-modal";
// import { lightTheme, darkTheme } from "../../context/theme";
// import { useSelector, useDispatch } from "react-redux";
// import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import { setDate } from "../../redux/orders";
// import { setDateSentOrders } from "../../redux/sentOrders";
// import moment from "moment";
// import "moment-timezone";
// import * as Localization from "expo-localization";
// import { floor } from "lodash";
// import axios from "axios";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const CustomDatePicker = ({
//   dateAndTime,
//   setDateAndTime,
//   from,
//   targetUser,
//   orderId,
//   orderDuration,
//   orderDate,
// }) => {
//   const dispatch = useDispatch();
//   let d;
//   if (from === "orders") {
//     d = useSelector((state) => state.storeOrders.date);
//   } else if (from === "sentOrders") {
//     d = useSelector((state) => state.storeSentOrders.date);
//   } else {
//     d = dateAndTime;
//   }

//   let myDate = new Date(orderDate);

//   // If you want to keep the format consistent with JavaScript's Date object, you can format it like so:
//   let formattedDateInTimezone = moment(myDate)
//     .tz(Localization.timezone)
//     .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

//   let momentDate;
//   if (from === "orders" || from === "sentOrders") {
//     momentDate = moment(d.date);
//   } else {
//     momentDate = moment(formattedDateInTimezone);
//   }

//   const [day, setDay] = useState(momentDate.date());
//   const [month, setMonth] = useState(momentDate.month());
//   const [year, setYear] = useState(momentDate.year());
//   const [fullTime, setFullTime] = useState(momentDate.format("HH:mm"));

//   let [hoursString, minutesString] = fullTime?.split(":");
//   let hours = parseInt(hoursString);
//   let minutes = parseInt(minutesString);

//   const [date, setdate] = useState(new Date(year, month, day, hours, minutes));

//   useEffect(() => {
//     setdate(new Date(year, month, day, hours, minutes));
//   }, [day, month, year, hours, minutes]);

//   // select day orders
//   const [onDayOrders, setOndayOrders] = useState([]);

//   const GetOrders = async () => {
//     try {
//       const response = await axios.get(
//         "https://beautyverse.herokuapp.com/api/v1/users/" +
//           targetUser._id +
//           `/orders?date=${date}`
//       );
//       setOndayOrders(response.data.data.orders);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (targetUser) {
//       GetOrders();
//     }
//   }, [date]);

//   const [isPickerVisible, setPickerVisibility] = useState(false);

//   const theme = useSelector((state) => state.storeApp.theme);
//   const currentTheme = theme ? darkTheme : lightTheme;

//   const [selectedDay, setSelectedDay] = useState(momentDate.date());
//   const [selectedMonth, setSelectedMonth] = useState(momentDate.month() + 1); // Initial month
//   const [selectedYear, setSelectedYear] = useState(momentDate.year()); // Initial year

//   // Updated useEffect to generate days based on the selectedMonth and selectedYear states
//   useEffect(() => {
//     // calculate the number of days in the selected month of the selected year
//     let daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

//     // generate days
//     let daysArray = [];
//     for (let i = 1; i <= daysInMonth; i++) {
//       daysArray.push(<Picker.Item label={i.toString()} value={i} key={i} />);
//     }

//     setSelectedDay(daysArray);
//   }, [selectedMonth, selectedYear]);

//   // Generate the correct number of days for the selected month
//   function generateDays(month, year) {
//     let numDays = 31;
//     if (month === 2) {
//       // February is the only month that can have 28 or 29 days
//       if (year % 4 === 0) {
//         if (year % 100 !== 0 || year % 400 === 0) {
//           numDays = 29;
//         } else {
//           numDays = 28;
//         }
//       } else {
//         numDays = 28;
//       }
//     } else if (month === 4 || month === 6 || month === 9 || month === 11) {
//       // These months have 30 days
//       numDays = 30;
//     }
//     return Array.from({ length: numDays }, (_, i) => i + 1); // Generate array of days
//   }

//   const dates = generateDays(selectedMonth, selectedYear).map((day, index) => (
//     <Picker.Item label={day.toString()} value={day} key={index} />
//   ));

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const months = monthNames.map((month, index) => (
//     <Picker.Item label={month} value={index + 1} key={index} />
//   ));

//   // Updated to use a map instead of a for loop for consistency
//   const years = Array.from({ length: 108 }, (_, i) => 2023 + i).map((year) => (
//     <Picker.Item label={year.toString()} value={year} key={year} />
//   ));

//   // Updated openPicker function
//   const openPicker = () => {
//     setPickerVisibility(true);
//     setSelectedDay(day);
//     setSelectedMonth(month + 1);
//     setSelectedYear(year);
//   };

//   const closePicker = () => {
//     setPickerVisibility(false);
//     // If you have a date object and want to convert it to a specific timezone:
//     let DefinedDateInTimezone = moment(date).tz(Localization.timezone).format();

//     // If you want to keep the format consistent with JavaScript's Date object, you can format it like so:
//     let newformattedDateInTimezone = moment(date)
//       .tz(Localization.timezone)
//       .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
//     if (from === "orders") {
//       dispatch(setDate({ active: true, date: newformattedDateInTimezone }));
//     } else if (from === "sentOrders") {
//       dispatch(
//         setDateSentOrders({ active: true, date: newformattedDateInTimezone })
//       );
//     } else {
//       setDateAndTime({ active: true, date: newformattedDateInTimezone });
//     }
//   };

//   // define free hours
//   const today = new Date();
//   const isToday = today
//     .toLocaleDateString("en-US", {
//       weekday: "long",
//     })
//     ?.split(",")[0];

//   const wDay = targetUser?.workingDays.find(
//     (item) =>
//       item.value.toLowerCase() === "everyday" ||
//       item.value.toLowerCase() === "workingdays" ||
//       item.value.toLowerCase() === isToday.toLowerCase()
//   );
//   let workingHoursInThisDay;
//   if (wDay) {
//     workingHoursInThisDay = wDay.hours?.split(" - ");
//   }

//   let startHour;
//   let endHour;
//   if (workingHoursInThisDay) {
//     startHour = workingHoursInThisDay[0];
//     endHour = workingHoursInThisDay[1];
//   } else {
//     startHour = "01:00";
//     endHour = "24:00";
//   }

//   // define procedure time
//   const procedureTime = orderDuration;

//   // Assuming orders is defined elsewhere in your code and each order has a `date` (a timestamp) and `duration` (in minutes)
//   let activeHours = onDayOrders
//     ?.filter((order) => order.orderNumber !== orderId)
//     .map((order, index) => {
//       // Parse the order date as a UTC moment
//       let startTime = moment.utc(order.date);

//       let duration = order.duration;

//       // Compute endTime as startTime + duration
//       let endTime = moment.utc(startTime).add(duration, "minutes");

//       return {
//         // Format the times as UTC
//         startTime: startTime.utc().format("HH:mm"),
//         duration: duration,
//         endTime: endTime.utc().format("HH:mm"),
//       };
//     });

//   // Function to generate a time list
//   function generateTimeList(startHour, endHour, interval) {
//     let list = [];
//     for (let i = startHour * 60; i < endHour * 60; i += interval) {
//       let hh = Math.floor(i / 60);
//       let mm = i % 60;
//       // Formatting the time string with leading zeros
//       hh = hh.toString().padStart(2, "0");
//       mm = mm.toString().padStart(2, "0");
//       list.push(`${hh}:${mm}`);
//     }
//     return list;
//   }

//   // Generate a list of times, each 15 minutes apart
//   let timeList = generateTimeList(parseInt(startHour), parseInt(endHour), 15);

//   let result = timeList.map((time) => {
//     // Check if the time is within any active fullTime plus its duration
//     let isBooked = activeHours?.some(({ startTime, endTime }) => {
//       // Convert time to Date for comparison
//       let [hh, mm] = time?.split(":");
//       let timeDate = new Date();
//       timeDate.setHours(hh, mm);

//       // Convert startTime and endTime to Date for comparison
//       let [startHH, startMM] = startTime?.split(":");
//       let startTimeDate = new Date();
//       startTimeDate.setHours(startHH, startMM);

//       let [endHH, endMM] = endTime?.split(":");
//       let endTimeDate = new Date();
//       endTimeDate.setHours(endHH, endMM);

//       // Check if the timeDate falls within the active booking
//       return timeDate >= startTimeDate && timeDate < endTimeDate;
//     });

//     // If it is, mark it as booked
//     if (isBooked) {
//       return { time: time, status: "Not Available" };
//     } else {
//       // If it isn't, leave it as available
//       return { time: time, status: "Available" };
//     }
//   }); //

//   const [DATE, setDATE] = useState(null);

//   useEffect(() => {
//     if (from === "orders" || from === "sentOrders") {
//       if (d?.active) {
//         const D = moment(date).tz(Localization.timezone).format("DD MMMM YYYY");
//         setDATE(D);
//       }
//     } else {
//       if (dateAndTime?.active) {
//         const D = moment(date)
//           .tz(Localization.timezone)
//           .format("DD MMMM YYYY - HH:mm");
//         setDATE(D);
//       }
//     }
//   }, [d, dateAndTime]);

//   return (
//     <View
//       style={{
//         // flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         width: "100%",
//         marginTop: from === "orders" || from === "sentOrders" ? 10 : 0,
//       }}
//     >
//       <View
//         style={{
//           width: "100%",
//           alignItems: "center",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           paddingHorizontal:
//             from === "orders" || from === "sentOrders" ? 15 : 5,
//         }}
//       >
//         <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//           <MaterialCommunityIcons
//             name="calendar"
//             size={20}
//             color={currentTheme.pink}
//           />
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: "bold",
//               color: "#f1f1f1",
//               letterSpacing: 0.3,
//             }}
//           >
//             Choice Date:
//           </Text>
//         </View>
//         <TouchableOpacity
//           onPress={openPicker}
//           style={{
//             backgroundColor: currentTheme.background2,
//             width: from === "orders" || from === "sentOrders" ? "40%" : "45%",
//             borderRadius: 50,
//             padding: 5,
//             alignItems: "center",
//             borderWidth: 1,
//             borderColor: currentTheme.pink,
//             marginLeft: "auto",
//           }}
//         >
//           <Text
//             style={{
//               color: "#f1f1f1",
//               fontSize: from === "orders" || from === "sentOrders" ? 14 : 12,
//             }}
//           >
//             {!DATE ? "N/A" : DATE}
//           </Text>
//         </TouchableOpacity>
//         {(d?.active || dateAndTime?.active) && (
//           <TouchableOpacity
//             style={{ marginLeft: 5, padding: 2.5 }}
//             onPress={() => {
//               if (from === "orders") {
//                 dispatch(
//                   setDate({ active: false, date: formattedDateInTimezone })
//                 );
//                 setDATE(null);
//               } else if (from === "sentOrders") {
//                 dispatch(
//                   setDateSentOrders({
//                     active: false,
//                     date: formattedDateInTimezone,
//                   })
//                 );
//                 setDATE(null);
//               } else {
//                 setDateAndTime({
//                   active: false,
//                   date: formattedDateInTimezone,
//                 });
//                 setDATE(null);
//               }
//             }}
//           >
//             <MaterialCommunityIcons name="close" size={22} color="red" />
//           </TouchableOpacity>
//         )}
//       </View>
//       <Modal
//         isVisible={isPickerVisible}
//         onBackdropPress={closePicker}
//         style={{
//           justifyContent: "center",
//           alignItems: "center",
//           width: SCREEN_WIDTH - 40,
//           marginRight: 15,
//         }} // center the modal
//         animationIn="zoomIn" // animate in with a zoom
//         // animationOut="fadeOut" // animate out with a zoom
//         backdropColor="black" // make the backdrop black
//         backdropOpacity={0.7}
//       >
//         <View
//           style={{
//             backgroundColor: currentTheme.background,
//             borderRadius: 10,
//             width: "100%",
//             paddingVertical: 15,
//             alignItems: "center",
//           }}
//         >
//           <View
//             style={{
//               flexDirection: Platform.OS === "ios" ? "row" : "column",
//               height: Platform.OS === "ios" ? 240 : 200,
//               width: "100%",
//               gap: 8,
//               paddingHorizontal: 15,
//               justifyContent: "center",
//             }}
//           >
//             <Picker
//               selectedValue={selectedDay}
//               onValueChange={(itemValue, itemIndex) =>
//                 setSelectedDay(itemValue)
//               }
//               style={{
//                 width: Platform.OS === "ios" ? "32%" : "100%",
//                 backgroundColor: currentTheme.pink,
//                 borderRadius: 10,
//               }}
//             >
//               {dates}
//             </Picker>
//             <Picker
//               selectedValue={selectedMonth}
//               style={{
//                 width: Platform.OS === "ios" ? "32%" : "100%",
//                 backgroundColor: currentTheme.pink,
//                 borderRadius: 10,
//               }}
//               onValueChange={(itemValue) => setSelectedMonth(itemValue)}
//             >
//               {months}
//             </Picker>
//             <Picker
//               selectedValue={selectedYear}
//               style={{
//                 width: Platform.OS === "ios" ? "32%" : "100%",
//                 backgroundColor: currentTheme.pink,
//                 borderRadius: 10,
//               }}
//               onValueChange={(itemValue) => setSelectedYear(itemValue)}
//             >
//               {years}
//             </Picker>
//           </View>
//           {from !== "orders" && from !== "sentOrders" && (
//             <>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8,
//                   width: "100%",
//                 }}
//               >
//                 <MaterialCommunityIcons
//                   name="clock"
//                   size={18}
//                   color={currentTheme.pink}
//                 />
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "bold",
//                     letterSpacing: 0.3,
//                     color: currentTheme.font,
//                     marginVertical: 10,
//                   }}
//                 >
//                   Select Time:{" "}
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: "100%",
//                   overflow: "hidden",
//                   paddingHorizontal: 15,
//                   gap: 8,
//                 }}
//               >
//                 <Picker
//                   selectedValue={fullTime}
//                   style={{
//                     width: Platform.OS === "ios" ? "24%" : "100%",
//                     backgroundColor: currentTheme.pink,
//                     borderRadius: 10,
//                     height: Platform.OS === "ios" ? 150 : 50,
//                     justifyContent: "center",
//                     width: Platform.OS === "ios" ? "50%" : "60%",
//                   }}
//                   onValueChange={(itemValue) => setFullTime(itemValue)}
//                 >
//                   {result
//                     .filter(({ status }) => status === "Available")
//                     .map(({ time }, index) => (
//                       <Picker.Item label={time} value={time} key={index} />
//                     ))}
//                 </Picker>
//               </View>
//             </>
//           )}
//           <View style={{ alignItems: "center", width: "100%" }}>
//             <Pressable
//               style={{
//                 marginTop: 20,
//                 backgroundColor: currentTheme.pink,
//                 width: "45%",
//                 borderRadius: 50,
//                 padding: 10,
//                 alignItems: "center",
//               }}
//               onPress={closePicker}
//             >
//               <Text
//                 style={{
//                   color: "#f1f1f1",
//                   fontWeight: "bold",
//                   letterSpacing: 0.2,
//                 }}
//               >
//                 Save
//               </Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default CustomDatePicker;
