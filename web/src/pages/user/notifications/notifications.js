import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Header } from "./header";
import { List } from "./list";
import {
  setScrollYNotifications,
  setUnreadNotidications,
} from "../../../redux/notifications";
import { useDispatch, useSelector } from "react-redux";
import Headroom from "react-headroom";
import { Configs } from "./configPopup";
import { Outlet } from "react-router-dom";

export const Notifications = ({
  notifications,
  setNotifications,
  currentUser,
}) => {
  // redux dispatch
  const dispatch = useDispatch();

  // animation
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    setAnimation(true);
  }, []);

  // fo to saved scroll y position
  const scrollYPosition = useSelector(
    (state) => state.storeNotifications.scrollY
  );

  useEffect(() => {
    window.scrollTo(0, scrollYPosition);
  }, []);

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYNotifications(scrollY));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // open notification config
  const [openConfig, setOpenConfig] = useState({});

  return (
    <>
      <Headroom downTolerance={10} upTolerance={10}>
        <Header
          back={`/profile/${
            currentUser?.type === "shop"
              ? "showroom"
              : currentUser?.type === "user"
              ? "contact"
              : "feeds"
          }`}
        />
      </Headroom>
      <Container transition={animation ? "true" : "false"}>
        <List
          list={notifications}
          setList={setNotifications}
          currentUser={currentUser}
          setOpenConfig={setOpenConfig}
        />
      </Container>
      {openConfig.active && (
        <Configs
          currentUser={currentUser}
          openConfig={openConfig}
          setOpenConfig={setOpenConfig}
          setList={setNotifications}
        />
      )}
      <Outlet />
    </>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  right: ${(props) => (props.transition === "true" ? 0 : "-100vw")};
  opacity: ${(props) => (props.transition === "true" ? "1" : "0")};
  transition: ease-in 200ms;
  padding-bottom: 50px;
`;
