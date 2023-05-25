// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   Dimensions,
//   TouchableOpacity,
// } from "react-native";
// import moment from "moment";

// const DATE_ITEM_WIDTH = Dimensions.get("window").width / 5;

// const DateItem = ({ item, index, selectedIndex, onPress }) => {
//   let opacity;
//   const distance = Math.abs(selectedIndex - index);
//   switch (distance) {
//     case 0:
//       opacity = 1;
//       break;
//     case 1:
//       opacity = 0.7;
//       break;
//     default:
//       opacity = 0.4;
//       break;
//   }

//   const isToday = moment().isSame(item, "day");

//   return (
//     <TouchableOpacity
//       style={[styles.item, { opacity }]}
//       onPress={() => onPress(index)}
//     >
//       <Text style={styles.date}>{item.format("DD")}</Text>
//       {!isToday && <Text style={styles.month}>{item.format("MMM")}</Text>}
//       {isToday && <Text style={styles.today}>Today</Text>}
//     </TouchableOpacity>
//   );
// };

// const DateComponent = () => {
//   const [dates, setDates] = useState(getDates(365)); // get dates for a year
//   const [selectedIndex, setSelectedIndex] = useState(dates.length / 2); // start with the current date
//   const flatListRef = useRef();

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setDates(getDates(365));
//     }, 1000 * 60 * 60 * 24); // update dates every day

//     return () => clearInterval(timer);
//   }, []);

//   function getDates(days) {
//     const now = moment();
//     let dates = [];
//     for (let i = -days / 2; i <= days / 2; i++) {
//       dates.push(moment(now).add(i, "days"));
//     }
//     return dates;
//   }

//   const selectDate = (index) => {
//     setSelectedIndex(index);
//     if (flatListRef.current) {
//       flatListRef.current.scrollToIndex({ index });
//     }
//   };

//   const onViewRef = React.useRef(({ viewableItems }) => {
//     if (viewableItems && viewableItems.length > 0) {
//       setSelectedIndex(viewableItems[0].index);
//     }
//   });

//   const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

//   return (
//     <FlatList
//       ref={flatListRef}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       data={dates}
//       keyExtractor={(item, index) => index.toString()}
//       renderItem={({ item, index }) => (
//         <DateItem
//           item={item}
//           index={index}
//           selectedIndex={selectedIndex}
//           onPress={selectDate}
//         />
//       )}
//       onViewableItemsChanged={onViewRef.current}
//       viewabilityConfig={viewConfigRef.current}
//       initialScrollIndex={dates.length / 2}
//       getItemLayout={(data, index) => ({
//         length: DATE_ITEM_WIDTH,
//         offset: DATE_ITEM_WIDTH * index,
//         index,
//       })}
//       snapToInterval={DATE_ITEM_WIDTH}
//       snapToAlignment="center"
//       decelerationRate="fast"
//       contentContainerStyle={{
//         paddingHorizontal:
//           Dimensions.get("window").width / 2 - DATE_ITEM_WIDTH / 2,
//       }}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     // flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     width: DATE_ITEM_WIDTH,
//   },
//   date: {
//     fontSize: 24,
//     color: "#ccc",
//   },
//   month: {
//     fontSize: 14,
//     color: "#ccc",
//   },
//   today: {
//     fontSize: 16,
//     color: "#ccc",
//   },
// });

// export default DateComponent;
