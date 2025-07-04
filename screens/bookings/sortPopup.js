import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { setStatusFilter } from "../../redux/bookings";
import { setStatusFilterSentBookings } from "../../redux/sentBookings";
import { Language } from "../../context/language";

/**
 * bookings status Sort popup
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const SortPopup = ({ currentTheme, from, setPage }) => {
  // redux dispatch
  const dispatch = useDispatch();

  // defines language
  const language = Language();
  const lang = useSelector((state) => state.storeApp.language);

  // filtered result
  const fBookings = useSelector((state) => state.storeBookings.statusFilter);

  // recieved bookings totals by status
  const allRecieved = useSelector((state) => state.storeBookings.totalResult);
  const newBookings = useSelector((state) => state.storeBookings.new);
  const pendingRecieved = useSelector((state) => state.storeBookings.pending);
  const completedRecieved = useSelector(
    (state) => state.storeBookings.completed
  );
  const activeRecieved = useSelector((state) => state.storeBookings.active);
  const rejectedRecieved = useSelector((state) => state.storeBookings.rejected);
  const canceledRecieved = useSelector((state) => state.storeBookings.canceled);

  // sent bookings totals by status
  const allSent = useSelector((state) => state.storeSentBookings.totalResult);
  const newSentBookings = useSelector((state) => state.storeSentBookings.new);
  const pendingSent = useSelector((state) => state.storeSentBookings.pending);
  const completedSent = useSelector(
    (state) => state.storeSentBookings.completed
  );
  const activeSent = useSelector((state) => state.storeSentBookings.active);
  const rejectedSent = useSelector((state) => state.storeSentBookings.rejected);
  const canceledSent = useSelector((state) => state.storeSentBookings.canceled);
  const fSentBookings = useSelector(
    (state) => state.storeSentBookings.statusFilter
  );

  // defines filter where comes from
  let filter;
  if (from === "bookings") {
    filter = fBookings;
  } else {
    filter = fSentBookings;
  }

  // picker open/hide state
  const [isPickerVisible, setPickerVisibility] = useState(false);

  const items = [
    { label: language?.language?.Bookings?.bookings?.all, value: "" },
    { label: language?.language?.Bookings?.bookings?.new, value: "new" },
    { label: language?.language?.Bookings?.bookings?.active, value: "active" },
    {
      label: language?.language?.Bookings?.bookings?.pending,
      value: "pending",
    },
    {
      label: language?.language?.Bookings?.bookings?.completed,
      value: "completed",
    },
    {
      label: language?.language?.Bookings?.bookings?.canceled,
      value: "canceled",
    },
    {
      label: language?.language?.Bookings?.bookings?.rejected,
      value: "rejected",
    },
  ];

  const openPicker = () => {
    setPickerVisibility(true);
  };

  const handleSelect = (value) => {
    setPage(1);
    if (from === "bookings") {
      dispatch(setStatusFilter(value));
    } else {
      dispatch(setStatusFilterSentBookings(value));
    }
    setPickerVisibility(false);
  };

  // defines some styles
  let bg;
  let font;
  if (filter === "New") {
    bg = "green";
    font = "#ccc";
  } else if (filter === "Pending") {
    bg = "orange";
    font = "#111";
  } else if (filter === "canceled" || filter === "Rejected") {
    bg = currentTheme.disabled;
    font = "#ccc";
  } else if (filter === "Active") {
    bg = currentTheme.pink;
    font = "#111";
  } else {
    bg = currentTheme.disabled;
    font = "#ccc";
  }

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
          width: "130%",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={openPicker}
          style={{
            padding: 5,
            borderWidth: 1.5,
            borderColor: currentTheme.line,
            width: "100%",
            borderRadius: 50,
            // padding: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Text
            style={{
              color:
                filter.toLowerCase() === "new"
                  ? "green"
                  : filter.toLowerCase() === "pending"
                  ? "orange"
                  : filter.toLowerCase() === "active"
                  ? currentTheme.pink
                  : filter.toLowerCase() === ""
                  ? currentTheme.font
                  : filter.toLowerCase() === "new"
                  ? currentTheme.font
                  : currentTheme.disabled,
              letterSpacing: 0.3,
              fontWeight: "bold",
            }}
          >
            {filter
              ? items?.find((i) => i.value === filter).label
              : language?.language?.Bookings?.bookings?.all}{" "}
          </Text>

          {(from === "bookings" ? newBookings > 0 : newSentBookings > 0) && (
            <View
              style={{
                width: 15,
                height: 15,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                backgroundColor: "green",
              }}
            >
              <Text
                style={{
                  color: currentTheme.font,
                  letterSpacing: 0.3,
                  fontWeight: "bold",
                  fontSize: 10,
                }}
              >
                {from === "bookings" ? newBookings : newSentBookings}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isPickerVisible} // Set this to a boolean state to control the visibility of the modal
        onBackdropPress={() => setPickerVisibility(false)} // Handle backdrop press event
        style={{
          alignItems: "center",
          width: SCREEN_WIDTH - 40,
          marginRight: 15,
        }}
        animationType="slide"
        backdropColor="black"
        backdropOpacity={0.7}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: currentTheme.background },
          ]}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.item,
                {
                  borderWidth: 1.5,
                  borderColor:
                    filter === item.value
                      ? currentTheme.pink
                      : currentTheme.line,

                  alignItems: "center",
                  flexDirection: "row",
                },
              ]}
              onPress={() => handleSelect(item.value)}
            >
              <Text
                style={[
                  styles.itemText,
                  {
                    color:
                      item.value === "active"
                        ? currentTheme.pink
                        : item.value === "completed"
                        ? currentTheme.font
                        : item.value === "new"
                        ? "green"
                        : item.value === "pending"
                        ? "orange"
                        : item.value === ""
                        ? currentTheme.font
                        : currentTheme.disabled,
                  },
                ]}
              >
                {item.label}
              </Text>
              {item.value === "new" && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 16,
                    height: 16,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.value === "active"
                          ? currentTheme.pink
                          : item.value === "completed"
                          ? currentTheme.font
                          : item.value === "new"
                          ? "green"
                          : item.value === "pending"
                          ? "orange"
                          : item.value === ""
                          ? currentTheme.font
                          : currentTheme.disabled,
                      fontSize: 12,
                    }}
                  >
                    {from === "bookings"
                      ? newBookings
                      : from === "sentBookings"
                      ? newSentBookings
                      : null}
                  </Text>
                </View>
              )}
              {item.value === "active" && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 16,
                    height: 16,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.value === "active"
                          ? currentTheme.pink
                          : item.value === "completed"
                          ? currentTheme.font
                          : item.value === "new"
                          ? "green"
                          : item.value === "pending"
                          ? "orange"
                          : item.value === ""
                          ? currentTheme.font
                          : currentTheme.disabled,
                      fontSize: 12,
                    }}
                  >
                    {from === "bookings"
                      ? activeRecieved
                      : from === "sentBookings"
                      ? activeSent
                      : null}
                  </Text>
                </View>
              )}
              {item.value === "rejected" && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 16,
                    height: 16,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.value === "active"
                          ? currentTheme.pink
                          : item.value === "completed"
                          ? currentTheme.font
                          : item.value === "new"
                          ? "green"
                          : item.value === "pending"
                          ? "orange"
                          : item.value === ""
                          ? currentTheme.font
                          : currentTheme.disabled,
                      fontSize: 12,
                    }}
                  >
                    {from === "bookings"
                      ? rejectedRecieved
                      : from === "sentBookings"
                      ? rejectedSent
                      : null}
                  </Text>
                </View>
              )}
              {item.value === "completed" && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 16,
                    height: 16,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.value === "active"
                          ? currentTheme.pink
                          : item.value === "completed"
                          ? currentTheme.font
                          : item.value === "new"
                          ? "green"
                          : item.value === "pending"
                          ? "orange"
                          : item.value === ""
                          ? currentTheme.font
                          : currentTheme.disabled,
                      fontSize: 12,
                    }}
                  >
                    {from === "bookings"
                      ? completedRecieved
                      : from === "sentBookings"
                      ? completedSent
                      : null}
                  </Text>
                </View>
              )}
              {item.value === "" && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 16,
                    height: 16,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.value === "active"
                          ? currentTheme.pink
                          : item.value === "completed"
                          ? currentTheme.font
                          : item.value === "new"
                          ? "green"
                          : item.value === "pending"
                          ? "orange"
                          : item.value === ""
                          ? currentTheme.font
                          : currentTheme.disabled,
                      fontSize: 12,
                    }}
                  >
                    {from === "bookings"
                      ? allRecieved
                      : from === "sentBookings"
                      ? allSent
                      : null}
                  </Text>
                </View>
              )}
              {item.value === "pending" && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 16,
                    height: 16,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.value === "active"
                          ? currentTheme.pink
                          : item.value === "completed"
                          ? currentTheme.font
                          : item.value === "new"
                          ? "green"
                          : item.value === "pending"
                          ? "orange"
                          : item.value === ""
                          ? currentTheme.font
                          : currentTheme.disabled,
                      fontSize: 12,
                    }}
                  >
                    {from === "bookings"
                      ? pendingRecieved
                      : from === "sentBookings"
                      ? pendingSent
                      : null}
                  </Text>
                </View>
              )}

              {item.value === "canceled" && (
                <View
                  style={{
                    width: "auto",
                    minWidth: 16,
                    height: 16,
                    backgroundColor: currentTheme.background2,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.value === "active"
                          ? currentTheme.pink
                          : item.value === "completed"
                          ? currentTheme.font
                          : item.value === "new"
                          ? "green"
                          : item.value === "pending"
                          ? "orange"
                          : item.value === ""
                          ? currentTheme.font
                          : currentTheme.disabled,
                      fontSize: 12,
                    }}
                  >
                    {from === "bookings"
                      ? canceledRecieved
                      : from === "sentBookings"
                      ? canceledSent
                      : null}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: "70%",
    borderRadius: 10,
    backgroundColor: "red",
    gap: 8,
    marginTop: 10,
  },
  item: {
    width: "100%",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
});
