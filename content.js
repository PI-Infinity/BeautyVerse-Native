import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BottomTabNavigator } from "./navigations/bottomTab";
import { AuthStack } from "./navigations/authStack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setUsers, setLoading } from "./redux/app";
import { setCurrentUser } from "./redux/user";
import { io } from "socket.io-client";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Content = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.storeApp.loading);

  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );
  const socket = useRef();
  useEffect(() => {
    socket.current = io("https://beautyverse.herokuapp.com");
  }, []);

  const socketRef = useRef(true);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current = false;
      return;
    }
    socket.current.emit("addUser", currentUser?._id);
    socket.current.on("getUsers", (users) => {
      // console.log(users);
    });
  }, [currentUser]);

  /**
   * Import current user
   */
  const [currUser, setCurrUser] = useState(null);
  useEffect(() => {
    const GetUser = async () => {
      var user = await AsyncStorage.getItem("Beautyverse:currentUser");
      if (user) {
        setCurrUser(JSON.parse(user));
      } else {
        dispatch(setCurrentUser(null));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 300);
      }
    };
    GetUser();
  }, [rerenderCurrentUser]);

  useEffect(() => {
    const GetUser = async () => {
      try {
        const response = await axios.get(
          `https://beautyverse.herokuapp.com/api/v1/users/${currUser?._id}`
        );
        dispatch(setCurrentUser(response.data.data.user));
      } catch (error) {
        console.log(error);
      }
    };
    if (currUser) {
      GetUser();
    }
  }, [currUser]);

  return (
    <>
      {loading && (
        <View style={styles.loading}>
          <Text style={{ color: "orange" }} style={styles.loadingText}>
            Beautyverse
          </Text>
        </View>
      )}
      {currentUser ? <BottomTabNavigator socket={socket} /> : <AuthStack />}
    </>
  );
};

export default Content;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#111",
    zIndex: 100000,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
});
