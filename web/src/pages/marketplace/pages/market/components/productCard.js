import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setOpenedProduct } from "../../../../../redux/marketplace";
import { useDispatch } from "react-redux";
import { BiSolidShoppingBags } from "react-icons/bi";
import { setTargetUser } from "../../../../../redux/user";

export const ProductCard = ({ item, to }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // page animation opacity
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);
  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "8px",
          gap: "8px",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        onClick={() => {
          navigate(
            `${location.pathname}/user/${item.owner._id}/${
              item.owner.type === "shop" ? "showroom" : "feeds"
            }`
          );
          dispatch(setTargetUser(item.owner));
        }}
      >
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
          {item.owner?.cover ? (
            <img
              src={item.owner?.cover}
              style={{
                width: 25,
                height: 25,
                borderRadius: 50,
                objectFit: "cover",
                opacity: opacity ? 1 : 0,
                transition: "ease-in 500ms",
              }}
            />
          ) : (
            <BiSolidShoppingBags size={16} color="#aaa" />
          )}
        </div>
        <h5
          style={{
            fontWeight: "bold",
            letterSpacing: 0.5,
            margin: 0,
            color: "#ccc",
          }}
        >
          {item?.owner.name}
        </h5>
      </div>
      <div
        onClick={() => {
          dispatch(setOpenedProduct(item));
          navigate(to);
        }}
        style={{
          width: "100%",
          aspectRatio: 1,
          overflow: "hidden",
          borderRadius: "15px",
        }}
      >
        <img
          src={item?.gallery[item?.cover]?.url}
          style={{
            width: "100%",
            aspectRatio: 1,
            objectFit: "cover",
            borderRadius: "15px",
            opacity: opacity ? 1 : 0,
            transition: "ease-in 500ms",
          }}
        />
      </div>
      <div
        style={{
          width: "100%",
          color: "#ccc",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
          gap: "8px",
          fontSize: "14px",
          letterSpacing: "0.5px",
        }}
      >
        <span style={{ color: "#f866b1" }}>{item.title}</span>
        <span style={{ fontWeight: "normal", fontSize: "12px" }}>
          {item.brand}
        </span>
        {item.sale > 0 ? (
          <span style={{}}>
            {item.price - item.price / item.sale}
            {item.currency}
            <span
              style={{
                textDecorationLine: "line-through",
                color: "#888",
                marginLeft: "8px",
                fontSize: "12px",
              }}
            >
              {item.price}
              {item.currency}
            </span>
          </span>
        ) : (
          <span>
            {item.price}
            {item.currency}
          </span>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  padding: 10px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:hover {
    opacity: 0.9;
  }
`;
