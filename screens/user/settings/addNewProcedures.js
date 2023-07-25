import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { ProceduresOptions } from "../../../datas/registerDatas";
import SearchableSelect from "../../../components/searchableSelect";
import { darkTheme, lightTheme } from "../../../context/theme";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import {
  AddCurrentUserProcedure,
  RemoveCurrentUserProcedure,
} from "../../../redux/user";
import { BackDrop } from "../../../components/backDropLoader";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const AddNewProcedures = () => {
  // defined procedure list
  const proceduresOptions = ProceduresOptions();
  console.log("add update");
  // procedures state
  const [procedures, setProcedures] = useState([]);
  // redux dispatch
  const dispatch = useDispatch();
  // loading state
  const [loading, setLoading] = useState(true);
  // theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // add procedure success message
  const [success, setSuccess] = useState(false);

  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // add procedure
  const AddProcedure = async (val) => {
    let ifInclude = currentUser?.procedures.find(
      (item) => item.value.toLowerCase() === val?.toLowerCase()
    );
    if (ifInclude) {
      Alert.alert("Procedure already defined in your list!");
    } else {
      console.log("added");
      try {
        dispatch(AddCurrentUserProcedure({ value: val }));
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/procedures`,
          {
            value: val,
          }
        );
        setSuccess(true);
        dispatch(setRerenderCurrentUser());
      } catch (error) {
        Alert.alert(error.data.response.message);
      }
    }
  };

  // delete procedure item
  const Deleting = async (val) => {
    const id = currentUser?.procedures?.find((i) => i.value === val);
    if (currentUser?.procedures?.length > 1) {
      dispatch(RemoveCurrentUserProcedure(val));
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/procedures/${id._id}`;
      const response = await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => dispatch(setRerenderCurrentUser()))
        // .then(() => setDeleteSuccess(true))
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
      console.log("doone");
    } else {
      Alert.alert("You cant delete last procedure");
    }
  };

  // split procedures value to find label
  const splited = proceduresOptions
    ?.map((item) => {
      let spltd = item?.value?.split(" - ");
      // Check if ' -' appears exactly 2 times
      if (spltd.length > 1) {
        return item;
      }
    })
    .filter(Boolean);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);
  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          height: "100%",
        }}
        style={{ width: "100%" }}
      >
        {loading ? (
          <View
            style={{
              flex: 1,

              alignItems: "center",
              justifyContent: "center",
              opacity: 0.8,
            }}
          >
            <ActivityIndicator size="large" color={currentTheme.pink} />
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              width: "90%",
              letterSpacing: 0.2,
            }}
          >
            <SearchableSelect
              data={splited}
              onItemSelected={AddProcedure}
              currentTheme={currentTheme}
              load={loading}
              setLoad={setLoading}
              Deleting={Deleting}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});
