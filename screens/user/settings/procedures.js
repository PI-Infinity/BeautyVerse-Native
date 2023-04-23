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
} from "react-native";
import { ListItem, Icon, Button } from "react-native-elements";
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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Procedures = () => {
  const dispatch = useDispatch();
  const proceduresOptions = ProceduresOptions();
  const splited = proceduresOptions
    ?.map((item, index) => {
      let spltd = item?.value?.split(" - ");
      // Check if ' -' appears exactly 2 times
      if (spltd.length === 3) {
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
      <View style={{ width: "100%", marginTop: 30 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            height: SCREEN_HEIGHT / 3,
          }}
        >
          <SearchableSelect data={splited} onItemSelected={AddProcedure} />
        </View>
        {/* </Collapsible> */}
        <ScrollView style={{ height: SCREEN_HEIGHT / 2.5 }}>
          {currentUser.procedures.map((item, index) => {
            const label = splited.find((c) => item.value === c.value);
            return (
              <View style={styles.item} key={index}>
                <View style={{ flex: 6 }}>
                  <Text style={{ color: "#e5e5e5" }}>{label?.label}</Text>
                </View>
                {editPrice.index === index ? (
                  <TextInput
                    type="Number"
                    placeholder="Add price..."
                    style={styles.input}
                    value={priceInput}
                    onChangeText={(text) => setPriceInput(text)}
                  />
                ) : (
                  <Text style={{ color: "#e5e5e5", padding: 5 }}>
                    {item.price}
                  </Text>
                )}
                {editPrice.index === index ? (
                  <Pressable style={{ flex: 1 }} onPress={EditProcedure}>
                    <Icon
                      name="done"
                      type="MaterialIcons"
                      color="green"
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
                    <Icon
                      name="attach-money"
                      type="MaterialIcons"
                      color="green"
                      size={20}
                    />

                    <Icon name="edit" type="Enypto" color="orange" size={16} />
                  </Pressable>
                )}
                <TouchableOpacity
                  onPress={() => Deleting(item._id)}
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <Icon
                    name="times"
                    type="font-awesome-5"
                    color="red"
                    size={20}
                  />
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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 0,
    marginTop: 10,
    height: 40,
  },
  input: {
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 14,
    color: "#e5e5e5",
    flex: 1,
  },
  text: {
    color: "white",
    fontSize: 14,
  },
});
