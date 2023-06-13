import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { setUsers } from "../redux/app";

/**
 * Import all type users from firestore
 * send to redux
 */

export const ImportUsers = () => {
  const dispatch = useDispatch();
  useEffect(
    () => {
      async function GetUsersWithOneFeed() {
        // await dispatch(setLoadFeeds(true));
        const response = await fetch(
          `https://beautyverse.herokuapp.com/api/v1/feeds?type=specialist&district=vake-saburtalo`
        )
          .then((response) => response.json())
          .then((data) => {
            // dispatch(setUsers(JSON.stringify(data.data.feedList)));
            // dispatch(setUserList(data.data.feedList));
          })
          // .then(() => {
          //   setTimeout(() => {
          //     dispatch(setLoadFeeds(false));
          //   }, 200);
          // })
          .catch((error) => {
            console.log("Error fetching data:", error);
          });
      }
      GetUsersWithOneFeed();
    },
    [
      // currentUser,
      // search,
      // filter,
      // city,
      // district,
      // specialist,
      // beautyCenter,
      // rerenderUserList,
      // page,
    ]
  );
};
