import { useState, useEffect } from "react";
import { Linking } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const GetSharedFeed = () => {
  const navigation = useNavigation();
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  useEffect(() => {
    // Extracts and handles data from URL
    async function fetchDataFromURL(url) {
      let splited = url?.split("?");
      let userId = splited[1]?.split("/")[3];
      let feedId = splited[1]?.split("/")[5];

      if (userId) {
        try {
          const userResponse = await axios.get(
            backendUrl + "/api/v1/users/" + userId
          );

          if (feedId) {
            const feedResponse = await axios.get(
              backendUrl +
                "/api/v1/feeds/" +
                feedId +
                "?check=" +
                currentUser._id
            );

            if (feedResponse.data.data.feed) {
              navigation.navigate("UserFeed", {
                feed: feedResponse.data.data.feed,
                user: userResponse.data.data.user,
              });
            }
          }
        } catch (error) {
          console.error(error.response?.data?.message || "An error occurred");
        }
      }
    }

    // Initial URL fetch
    const initialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        fetchDataFromURL(url);
      }
    };

    // Event listener for deep link changes
    const handleDeepLink = (event) => {
      fetchDataFromURL(event.url);
    };

    Linking.addEventListener("url", handleDeepLink);
    initialURL();

    // // Cleanup: Remove event listener on component unmount
    // return () => {
    //   Linking.removeEventListener("url", handleDeepLink);
    // };
  }, [backendUrl, navigation]);

  // ... rest of your component logic

  return null; // Note: This component currently doesn't render anything to the screen
};

export default GetSharedFeed;
