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
export const ProceduresList = ({ targetUser }) => {
  const language = Language();
  const [category, setCategory] = useState("");
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onLongPress={() => handleLongPress(item)}
      style={styles.item}
    >
      <Text style={styles.text}>{item.value}</Text>
      <Text style={styles.text}>{`${item.price}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.navigator}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "start",
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
          <Text style={styles.buttonText}>
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
            <Text style={styles.buttonText}>{cat?.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
                activeOpacity={0.5}
                key={index}
                style={{
                  width: "90%",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 5,
                  padding: 15,
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: "#fff" }}>{label.label}</Text>
                <Text style={{ color: "#fff" }}>{item?.price}</Text>
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
  },
  navigator: {
    width: "100%",
    marginTop: 10,
    paddingLeft: 15,
  },
  categoryButton: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "rgba(255,255,255,0)",
    padding: 10,
  },
  categoryButtonActive: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 10,
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
