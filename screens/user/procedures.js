// ProceduresList.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import ConfirmDialog from "../../components/confirmDialog";
import { ProceduresOptions } from "../../datas/registerDatas";
import { Language } from "../../context/language";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { lightTheme, darkTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";

export const ProceduresList = ({ targetUser, addOrder }) => {
  const language = Language();
  const [category, setCategory] = useState("");
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const proceduresOptions = ProceduresOptions();

  const filterProcedures = (category) => {
    setCategory(category);
  };

  const filteredProcedures = targetUser.procedures.filter(
    (item) => !category || item.value.split(" - ")[0] === category
  );

  const cats = Array.from(
    new Set(targetUser.procedures.map((item) => item.value.split(" - ")[0]))
  );
  const categories = cats.map((item, index) => {
    let lab = proceduresOptions.find((it) => {
      return it?.value?.toLowerCase().includes(item?.toLowerCase());
    });
    return lab;
  });

  const [active, setActive] = useState("all");

  const handleLongPress = (item) => {
    setConfirmDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      {categories?.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navigator}
          contentContainerStyle={{
            flexDirection: "row",
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
                { color: active === "all" ? "#111" : "#ccc" },
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
                        ? "#111"
                        : "#ccc",
                  },
                ]}
              >
                {cat?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={{ gap: 10, alignItems: "center" }}>
        {targetUser.procedures
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
                activeOpacity={addOrder ? 0.5 : 1}
                key={index}
                style={{
                  width: "95%",
                  backgroundColor: currentTheme.background2,
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
                        backgroundColor: currentTheme.pink,
                      }}
                    ></View>
                    <Text
                      style={{ color: currentTheme.font, letterSpacing: 0.2 }}
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
                    <Text style={{ color: currentTheme.font }}>
                      {item?.price}
                    </Text>
                    {item?.price > 0 && (
                      <>
                        {targetUser?.currency === "Dollar" ? (
                          <FontAwesome
                            name="dollar"
                            color={currentTheme.pink}
                            size={16}
                          />
                        ) : targetUser?.currency === "Euro" ? (
                          <FontAwesome
                            name="euro"
                            color={currentTheme.pink}
                            size={16}
                          />
                        ) : (
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: currentTheme.pink,
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
                        style={{ color: currentTheme.disabled, fontSize: 12 }}
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
                        color={currentTheme.pink}
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
    borderRadius: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    height: 25,
    justifyContent: "center",
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
