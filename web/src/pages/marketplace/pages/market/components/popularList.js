import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProductCard } from "./productCard";
import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import { setActiveList } from "../../../../../redux/marketplace";

export const PopularList = () => {
  const randomProductsList = useSelector(
    (state) => state.storeMarketplace.randomProductsList
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <Container>
      <div
        style={{
          width: "100%",
          color: "#ccc",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "1.5px",
            width: "25vw",
            background: "rgba(255,255,255,0.1)",
          }}
        ></div>
        Popular Products
        <div
          style={{
            height: "1.5px",
            width: "25vw",
            background: "rgba(255,255,255,0.1)",
          }}
        ></div>
      </div>
      <List>
        {randomProductsList?.map((item, index) => {
          return (
            <ProductCard
              item={item}
              key={index}
              to={`/marketplace/${item._id}`}
            />
          );
        })}
      </List>
      <div
        onClick={() => {
          navigate("/marketplace/list");
          dispatch(setActiveList(randomProductsList));
        }}
        style={{
          width: "100%",
          color: "#ccc",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "1.5px",
            width: "30vw",
            background: "rgba(255,255,255,0.1)",
          }}
        ></div>
        See All
        <div
          style={{
            height: "1.5px",
            width: "30vw",
            background: "rgba(255,255,255,0.1)",
          }}
        ></div>
      </div>
      <Outlet />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 25px 0;
`;

const List = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 15px 15px;
  gap: 15px;
`;
