import React, { useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { ProceduresOptions } from "../../../datas/registerDatas";
import axios from "axios";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import {
  setCurrentUser,
  UpdateCurrentUserProcedure,
  AddCurrentUserProcedure,
  RemoveCurrentUserProcedure,
} from "../../../redux/user";
import SearchableSelect from "../../../components/searchableSelect";
import Collapsible from "react-native-collapsible";
import { lightTheme, darkTheme } from "../../../context/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Procedures = () => {
  const dispatch = useDispatch();
  const proceduresOptions = ProceduresOptions();

  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const splited = proceduresOptions
    ?.map((item, index) => {
      let spltd = item?.value?.split(" - ");
      // Check if ' -' appears exactly 2 times
      if (spltd.length > 1) {
        return item;
      }
    })
    .filter(Boolean);

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const [add, setAdd] = useState(false);
  const [newProcedures, setNewProcedures] = useState([]);

  const [editPrice, setEditPrice] = useState(false);
  const [priceInput, setPriceInput] = useState("");

  // add procedure
  const AddProcedure = async (val) => {
    try {
      setAdd(false);
      dispatch(AddCurrentUserProcedure({ value: val }));
      const response = await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/procedures`,
        {
          value: val,
        }
      );

      dispatch(setRerenderCurrentUser());
    } catch (error) {
      Alert.alert(error.data.response.message);
    }
  };

  // edit procedure
  const EditProcedure = async () => {
    const updatedProcedure = {
      _id: editPrice.id,
      value: editPrice.value,
      price: priceInput?.length > 0 ? priceInput : editPrice.price,
    };
    dispatch(
      UpdateCurrentUserProcedure({
        procedureId: editPrice.id,
        updatedProcedure,
      })
    );
    try {
      setEditPrice(false);
      setPriceInput("");
      await axios.patch(
        "https://beautyverse.herokuapp.com/api/v1/users/" +
          currentUser._id +
          "/procedures/" +
          editPrice.id,
        {
          value: editPrice.value,
          price: priceInput?.length > 0 ? priceInput : editPrice.price,
        }
      );

      dispatch(setRerenderCurrentUser());
    } catch (error) {
      setEditPrice(false);
      Alert.alert(error.data.response.message);
    }
  };

  // delete service
  const Deleting = async (itemId) => {
    if (currentUser?.procedures?.length > 1) {
      dispatch(RemoveCurrentUserProcedure(itemId));
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/procedures/${itemId}`;
      const response = await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => dispatch(setRerenderCurrentUser()))
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    } else {
      Alert.alert("You cant delete last procedure");
    }
  };

  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        paddingBottom: 15,
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 20,
          color: currentTheme.font,
          letterSpacing: 0.3,
        }}
      >
        Add new procedure:
      </Text>
      <View style={{ width: "100%", marginTop: 10, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            height: SCREEN_HEIGHT / 3,
            letterSpacing: 0.2,
          }}
        >
          <SearchableSelect
            data={splited}
            onItemSelected={AddProcedure}
            currentTheme={currentTheme}
          />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 50,
            color: currentTheme.font,
            letterSpacing: 0.3,
          }}
        >
          Current procedures:
        </Text>
        <ScrollView
          style={{
            height: SCREEN_HEIGHT / 2.5,
            marginTop: 10,
            width: "100%",
          }}
          bounces={Platform.OS === "ios" ? false : undefined}
          overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {currentUser.procedures.map((item, index) => {
            const label = splited.find((c) => item.value === c.value);
            return (
              <View style={styles.item} key={index}>
                <View style={{ flex: 6 }}>
                  <Text
                    style={{ color: currentTheme.font, letterSpacing: 0.2 }}
                  >
                    {label?.label}
                  </Text>
                </View>
                {editPrice.index === index ? (
                  <TextInput
                    type="Number"
                    placeholder="Add price..."
                    placeholderTextColor={currentTheme.disabled}
                    style={[styles.input, { color: currentTheme.font }]}
                    value={priceInput}
                    onChangeText={(text) => setPriceInput(text)}
                  />
                ) : (
                  <Text
                    style={{
                      color: currentTheme.font,
                      padding: 5,
                      letterSpacing: 0.2,
                    }}
                  >
                    {item.price}
                  </Text>
                )}
                {editPrice.index === index ? (
                  <Pressable
                    style={{ flex: 1, marginLeft: 8 }}
                    onPress={EditProcedure}
                  >
                    <MaterialIcons
                      name="done"
                      color={currentTheme.pink}
                      size={20}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                    onPress={() => {
                      setEditPrice({
                        price: item?.price || "",
                        value: item.value,
                        index,
                        id: item._id,
                      });
                    }}
                  >
                    <MaterialIcons
                      name="attach-money"
                      color={currentTheme.pink}
                      size={20}
                    />

                    <MaterialIcons
                      name="edit"
                      type="Enypto"
                      color={currentTheme.pink}
                      size={16}
                    />
                  </Pressable>
                )}
                <TouchableOpacity
                  onPress={() => Deleting(item._id)}
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <FontAwesome5 name="times" color="red" size={20} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 0,
    marginTop: 5,
    height: 40,
  },
  input: {
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 14,
    letterSpacing: 0.2,
    // flex: 1,
  },
  text: {
    color: "white",
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
