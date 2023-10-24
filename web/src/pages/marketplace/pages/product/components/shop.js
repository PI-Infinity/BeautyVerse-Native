import React from "react";
import styled from "styled-components";
import { BiSolidShoppingBags } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTargetUser } from "../../../../../redux/user";

export const Shop = ({ product, to }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <Container
      onClick={() => {
        if (
          location.pathname?.includes("/user") ||
          location.pathname?.includes("/profile")
        ) {
          return undefined;
        } else {
          navigate(
            `${to}/${product.owner._id}/${
              product.owner.type === "shop" ? "showroom" : "feeds"
            }`
          );
          dispatch(setTargetUser(product.owner));
        }
      }}
    >
      <span>Shop:</span>
      <div
        style={{
          width: 25,
          height: 25,
          borderRadius: 50,
          objectFit: "cover",
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {product.owner?.cover ? (
          <img
            src={product.owner?.cover}
            style={{
              width: 25,
              height: 25,
              borderRadius: 50,
              objectFit: "cover",
            }}
          />
        ) : (
          <BiSolidShoppingBags size={20} color="#aaa" />
        )}
      </div>
      <h2
        style={{
          letterSpacing: "0.5px",
          margin: 0,
          fontSize: "14px",
          color: "#f866b1",
        }}
      >
        {product?.owner.name}
      </h2>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 0 10px 0;
  font-size: 14px;
`;
