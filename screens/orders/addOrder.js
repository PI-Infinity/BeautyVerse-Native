import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import TimePicker from "../../screens/orders/timePicker";
import { ProceduresList } from "../../screens/orders/procedures";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import uuid from "react-native-uuid";
import { setOrders } from "../../redux/orders";
import { setRerenderOrders } from "../../redux/rerenders";
import { BackDrop } from "../../components/backDropLoader";

export const AddOrder = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.storeOrders.orders);
  const lastOrderNumber = orders[orders?.length - 1]?.orderNumber;

  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const [dateAndTime, setDateAndTime] = useState(new Date());
  const [procedure, setProcedure] = useState(null);
  const [price, setPrice] = useState("");
  const [user, setUser] = useState({
    id: "",
    name: "",
    phone: "",
    addationalInfo: "",
  });
  const [comment, setComment] = useState("");

  const [loader, setLoader] = useState(false);

  const [page, setPage] = useState(1);

  const AddOrderToDb = async () => {
    if (procedure && price?.toString()?.length > 0 && user.name?.length > 0) {
      setLoader(true);
      let orderId = uuid.v4();
      try {
        await axios.post(
          "https://beautyverse.herokuapp.com/api/v1/users/" +
            currentUser._id +
            "/orders" +
            "?page=" +
            page,
          {
            orderNumber: parseInt(lastOrderNumber) + 1,
            user: { id: user.id, phone: user.phone, name: user.name },
            orderedProcedure: procedure,
            orderedSpecialist: "",
            orderSum: price,
            date: dateAndTime,
            status: "active",
            comment: "",
          }
        );
        dispatch(setRerenderOrders());
        navigation.goBack();
        setLoader(false);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  return (
    <ScrollView
      style={{}}
      contentContainerStyle={{ padding: 15, alignItems: "center", gap: 15 }}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
    >
      <BackDrop loading={loader} setLoading={setLoader} />
      <View>
        <TimePicker dateAndTime={dateAndTime} setDateAndTime={setDateAndTime} />
      </View>
      <View style={{ width: "100%", flex: 1 }}>
        <ProceduresList
          targetUser={currentUser}
          addOrder={true}
          procedure={procedure}
          setProcedure={setProcedure}
          price={price}
          setPrice={setPrice}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          width: "90%",
        }}
      >
        <View
          style={{
            backgroundColor: "red",
            padding: 10,
            borderRadius: 50,
            backgroundColor: "#151515",
            width: "30%",
            alignItems: "center",
            backgroundColor: "green",
          }}
        >
          <TextInput
            placeholder="Price"
            placeholderTextColor="#888"
            value={price?.toString()}
            style={{ color: "#ccc", fontSize: 16 }}
            onChangeText={setPrice}
          />
        </View>
        <Text style={{ color: "#ccc", fontSize: 16 }}>
          {currentUser.currency}
        </Text>
      </View>
      <View style={{ gap: 10, width: "90%", marginTop: 15 }}>
        <Text style={{ fontSize: 16, color: "#ccc" }}>Client:</Text>
        <TextInput
          placeholder="Name"
          placeholderTextColor="#888"
          value={user.name}
          style={{
            color: "#ccc",
            backgroundColor: "#222",
            borderRadius: 50,
            padding: 10,
          }}
          onChangeText={(val) => setUser({ ...user, name: val })}
        />
        <TextInput
          placeholder="Phone Number (optional)"
          placeholderTextColor="#888"
          value={user.phone}
          style={{
            color: "#ccc",
            backgroundColor: "#222",
            borderRadius: 50,
            padding: 10,
          }}
          onChangeText={(val) => setUser({ ...user, phone: val })}
        />
        <TextInput
          placeholder="Addationl info (optional)"
          placeholderTextColor="#888"
          value={user.addationalInfo}
          style={{
            color: "#ccc",
            backgroundColor: "#222",
            borderRadius: 50,
            padding: 10,
          }}
          onChangeText={(val) => setUser({ ...user, addationalInfo: val })}
        />
        <TextInput
          placeholder="Comment (optional)"
          placeholderTextColor="#888"
          value={comment}
          style={{
            color: "#ccc",
            backgroundColor: "#222",
            borderRadius: 50,
            padding: 10,
          }}
          onChangeText={setComment}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={AddOrderToDb}
        style={{
          marginVertical: 15,
          borderRadius: 50,
          backgroundColor: "pink",
          padding: 10,
        }}
      >
        <Text style={{ color: "red" }}>Add Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});
