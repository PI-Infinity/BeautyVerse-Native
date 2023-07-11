// ProceduresList.js
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import ConfirmDialog from "../../components/confirmDialog";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { ProceduresOptions } from "../../datas/registerDatas";

/**
 * Defines procedure list
 */

export const ProceduresList = ({
  targetUser,
  addOrder,
  procedure,
  setProcedure,
  setPrice,
  setDuration,
  setTime,
}) => {
  // defines language context
  const language = Language();

  // defines confirm dialog
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  // defines theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines beautyverse procedures list
  const proceduresOptions = ProceduresOptions();

  const cats = Array.from(
    new Set(targetUser.procedures.map((item) => item.value.split(" - ")[0]))
  );
  const categories = cats.map((item, index) => {
    let lab = proceduresOptions.find((it) => {
      return it?.value?.toLowerCase().includes(item?.toLowerCase());
    });
    return lab;
  });

  // defines active procedure category
  const [active, setActive] = useState("all");

  return (
    <View style={styles.container}>
      {categories?.length > 1 && !procedure && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={Platform.OS === "ios" ? false : undefined}
          overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          style={styles.navigator}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 8,
            paddingRight: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => setActive("all")}
            style={
              active === "all"
                ? styles.categoryButtonActive
                : styles.categoryButton
            }
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: active === "all" ? "#e5e5e5" : "#ccc",
                  letterSpacing: 0.2,
                },
              ]}
            >
              {language?.language?.User?.userPage?.all}
            </Text>
          </TouchableOpacity>

          {categories?.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActive(cat?.value)}
              style={
                active.toLowerCase() === cat.value.toLowerCase()
                  ? styles.categoryButtonActive
                  : styles.categoryButton
              }
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      active.toLowerCase() === cat.value.toLowerCase()
                        ? "#e5e5e5"
                        : "#ccc",
                    letterSpacing: 0.2,
                  },
                ]}
              >
                {cat?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={{ gap: 10, alignItems: "center", marginTop: 8 }}>
        {targetUser.procedures
          .filter((pr) => {
            if (procedure) {
              return procedure?.value === pr?.value;
            } else {
              return pr;
            }
          })
          .filter((item) => {
            if (active === "all") {
              return item;
            } else if (
              item?.value.toLowerCase().includes(active.toLowerCase())
            ) {
              return item;
            }
          })
          .map((item, index) => {
            const label = proceduresOptions.find((c) => item.value === c.value);
            return (
              <TouchableOpacity
                onPress={
                  item.value !== procedure?.value
                    ? () => {
                        setProcedure(item);
                        setPrice(item?.price ? item.price : "");
                        setDuration(item?.duration ? item.duration : "");
                        setTime && setTime(null);
                      }
                    : () => {
                        setProcedure(null);
                        setPrice("");
                        setDuration("");
                        setTime && setTime(null);
                      }
                }
                activeOpacity={addOrder ? 0.5 : 1}
                key={index}
                style={{
                  width: "95%",
                  backgroundColor:
                    procedure?.value === item?.value
                      ? "#F866B1"
                      : currentTheme.background2,
                  borderRadius: 10,
                  padding: 15,
                  paddingVertical: 7.5,
                  justifyContent: "space-between",
                  // alignItems: "center",
                  gap: 5,
                  // flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        backgroundColor:
                          procedure?.value === item?.value
                            ? "#111"
                            : currentTheme.pink,
                      }}
                    ></View>
                    <Text
                      style={{
                        color:
                          procedure?.value === item?.value
                            ? "#111"
                            : currentTheme.font,
                        letterSpacing: 0.2,
                      }}
                    >
                      {label.label}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          procedure?.value === item?.value
                            ? "#111"
                            : currentTheme.font,
                      }}
                    >
                      {item?.price}
                    </Text>
                    {item?.price > 0 && (
                      <>
                        {targetUser?.currency === "Dollar" ? (
                          <FontAwesome
                            name="dollar"
                            color={
                              procedure?.value === item?.value
                                ? "#111"
                                : currentTheme.font
                            }
                            size={16}
                          />
                        ) : targetUser?.currency === "Euro" ? (
                          <FontAwesome
                            name="euro"
                            color={
                              procedure?.value === item?.value
                                ? "#111"
                                : currentTheme.font
                            }
                            size={16}
                          />
                        ) : (
                          <Text
                            style={{
                              fontWeight: "bold",
                              color:
                                procedure?.value === item?.value
                                  ? "#111"
                                  : currentTheme.font,
                              fontSize: 16,
                            }}
                          >
                            {"\u20BE"}
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  {item.duration && (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            procedure?.value === item?.value
                              ? "#111"
                              : currentTheme.disabled,
                          fontSize: 12,
                        }}
                      >
                        {item.duration < 60
                          ? item.duration + " min."
                          : item.duration >= 60
                          ? Math.floor(item.duration / 60) +
                            "h" +
                            (item.duration % 60 > 0
                              ? " " + (item.duration % 60) + " min."
                              : "")
                          : "0h"}
                      </Text>
                      <FontAwesome5
                        name="clock"
                        color={
                          procedure?.value === item?.value
                            ? "#111"
                            : currentTheme.pink
                        }
                        size={12}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
      <ConfirmDialog
        isVisible={confirmDialogVisible}
        onClose={() => setConfirmDialogVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    marginTop: 15,
    paddingBottom: 15,
  },
  navigator: {
    width: "100%",
    marginTop: 10,
    paddingLeft: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    alignItems: "center",
    height: 25,
    justifyContent: "center",
    borderRadius: 50,
  },
  categoryButtonActive: {
    paddingHorizontal: 15,
    alignItems: "center",
    height: 25,
    backgroundColor: "#F866B1",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginTop: 10,
  },
  text: {
    color: "white",
    fontSize: 14,
  },
});
