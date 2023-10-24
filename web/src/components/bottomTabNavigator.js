import React from "react";
import styled from "styled-components";
import { CgFeed } from "react-icons/cg";
import { BiUserPin } from "react-icons/bi";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRerenderFeeds, setScrollYFeeds } from "../redux/feeds";
import { setRerenderCards, setScrollYCards } from "../redux/cards";
import { setScrollToTop } from "../redux/app";
import {
  setRerenderMarketplace,
  setScrollYMarketplace,
} from "../redux/marketplace";
import { setRerenderCurrentUser, setScrollYUser } from "../redux/user";
import axios from "axios";
import { setRerenderNotifications } from "../redux/notifications";

export const BottomTabNavigator = () => {
  const navigate = useNavigate();
  const scrollYFeeds = useSelector((state) => state.storeFeeds.scrollY);
  const scrollYCards = useSelector((state) => state.storeCards.scrollY);
  const scrollYMarketplace = useSelector(
    (state) => state.storeMarketplace.scrollY
  );
  const scrollYUser = useSelector((state) => state.storeUser.scrollY);
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = localStorage.getItem("Beautyverse:currentUser");

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const GetUser = async () => {
    try {
      // Make a request to get the current user's data from the server
      const response = await axios.get(
        `${backendUrl}/api/v1/users/${JSON.parse(currentUser)._id}`
      );

      // Set the current user in the user's Redux store
      if (response.data.data.user) {
        localStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(response.data.data.user)
        );
        dispatch(setRerenderNotifications());
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Container>
      <div
        onClick={() => {
          if (location.pathname === "/feeds") {
            if (scrollYFeeds > 0) {
              dispatch(setScrollToTop());
              dispatch(setScrollYFeeds(0));
            } else {
              dispatch(setRerenderFeeds());
            }
          } else {
            navigate("/feeds");
          }
        }}
      >
        <CgFeed
          size={30}
          color={
            window.location.pathname.startsWith("/feeds") ? "#f866b1" : "#ccc"
          }
        />
      </div>
      <div
        onClick={() => {
          if (location.pathname === "/cards") {
            if (scrollYCards > 0) {
              dispatch(setScrollToTop());
              dispatch(setScrollYCards(0));
            } else {
              dispatch(setRerenderCards());
            }
          } else {
            navigate("/cards");
          }
        }}
      >
        <BiUserPin
          size={28}
          color={
            window.location.pathname.startsWith("/cards") ? "#f866b1" : "#ccc"
          }
        />
      </div>
      <div
        onClick={() => {
          if (location.pathname === "/marketplace") {
            if (scrollYMarketplace > 0) {
              dispatch(setScrollToTop());
              dispatch(setScrollYMarketplace(0));
            } else {
              dispatch(setRerenderMarketplace());
            }
          } else {
            navigate("/marketplace");
          }
        }}
      >
        <RiShoppingBag2Fill
          size={23}
          color={
            window.location.pathname.startsWith("/marketplace")
              ? "#f866b1"
              : "#ccc"
          }
        />
      </div>
      <div
        onClick={() => {
          if (
            location.pathname?.includes("notifications") ||
            location.pathname?.includes("settings")
          ) {
            navigate(
              `/profile/${
                JSON.parse(currentUser).type === "shop"
                  ? "showroom"
                  : JSON.parse(currentUser).type === "user"
                  ? "contact"
                  : "feeds"
              }`
            );
          } else if (location.pathname?.includes("/profile")) {
            if (scrollYUser === 0) {
              dispatch(setRerenderCurrentUser());
              GetUser();
            } else {
              dispatch(setScrollToTop());
              dispatch(setScrollYUser(0));
            }
          } else {
            if (currentUser) {
              navigate(
                `/profile/${
                  JSON.parse(currentUser).type === "shop"
                    ? "showroom"
                    : JSON.parse(currentUser).type === "user"
                    ? "contact"
                    : "feeds"
                }`
              );
            } else {
              navigate("/login");
            }
          }
        }}
      >
        {JSON.parse(currentUser)?.cover?.length > 0 ? (
          <img
            src={JSON.parse(currentUser).cover}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50px",
              border: `1.5px solid ${
                window.location.pathname.startsWith("/profile")
                  ? "#f866b1"
                  : "#ccc"
              }`,
            }}
          />
        ) : (
          <FaUserCircle
            size="22px"
            color={
              window.location.pathname.startsWith("/profile") ||
              window.location.pathname.includes("/register") ||
              window.location.pathname.startsWith("/login")
                ? "#f866b1"
                : "#ccc"
            }
          />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 10;
  height: 6vh;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 8vw;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1.5px solid rgba(255, 255, 255, 0.1);
`;
