import React, { useEffect, useState } from "react";
import { Header } from "./components/header";
import styled from "styled-components";
import { Routers } from "./routers/router-main";
import { BottomTabNavigator } from "./components/bottomTabNavigator";
import { useLocation } from "react-router-dom";
import HeadRoom from "react-headroom";
import { useSelector } from "react-redux";
import axios from "axios";
import { setLoading } from "./redux/app";
import { GetFeeds } from "./hooks/getFeeds";
import { GetCards } from "./hooks/getCards";
import { GetProducts } from "./hooks/getProducts";

/**
 *
 * @returns Main content component in BeautyVerse Web
 * Used styled-components for styling
 * App component is rendered in index.js file
 */

const App = () => {
  const location = useLocation();

  return (
    <Container>
      {/** getting datas */}
      <GetFeeds />
      <GetCards />
      <GetProducts />
      {/** Main header of the app */}
      {!location.pathname.includes("user") &&
        !location.pathname.includes("/marketplace/search") &&
        !location.pathname.includes("/profile") && (
          <HeadRoom
            downTolerance={10}
            upTolerance={10}
            styles={{ zIndex: 1000 }}
          >
            <Header />
          </HeadRoom>
        )}
      {/** Routers of the app */}
      <Routers />
      {/** Bottom tab navigator */}
      {location.pathname !== "/" && <BottomTabNavigator />}
    </Container>
  );
};

export default App;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
