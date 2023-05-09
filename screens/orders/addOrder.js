import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
import React from "react";
import TimePicker from "../../screens/orders/timePicker";
import { ProceduresList } from "../../screens/orders/procedures";
import { useSelector, useDispatch } from "react-redux";

export const AddOrder = () => {
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const [datAndTime, setDateAndTime] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [price, setPrice] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <ScrollView
      style={{}}
      contentContainerStyle={{ padding: 15, alignItems: "center", gap: 15 }}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? undefined : false}
    >
      <View>
        <TimePicker />
      </View>
      <View style={{ width: "100%", flex: 1 }}>
        <ProceduresList targetUser={currentUser} addOrder={true} />
      </View>
      <View>
        <TextInput placeholder="Price" placeholderTextColor="#ccc" />
      </View>
      <View>
        <Text>Client:</Text>
        <TextInput placeholder="Name" placeholderTextColor="#ccc" />
        <TextInput placeholder="Phone Number" placeholderTextColor="#ccc" />
        <TextInput
          placeholder="Addationl info (optional)"
          placeholderTextColor="#ccc"
        />
        <TextInput
          placeholder="Comment (optional)"
          placeholderTextColor="#ccc"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});
