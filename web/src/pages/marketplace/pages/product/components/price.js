import React from "react";
import styled from "styled-components";

export const Price = ({ product }) => {
  return (
    <Container>
      <div>Price:</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "4px",
          color: "#f866b1",
        }}
      >
        <h2
          style={{
            letterSpacing: "0.5px",
            margin: 0,
            fontSize: "14px",
            color: "#f866b1",
          }}
        >
          {product?.sale
            ? (product?.price - (product.price / 100) * product.sale).toFixed(2)
            : product.price}
        </h2>
        {product.currency === "dollar" ? (
          "Dollar"
        ) : product.currency === "euro" ? (
          "Euro"
        ) : (
          <div
            style={{
              fontWeight: "bold",
              color: "#f866b1",
              fontSize: 14,
            }}
          >
            {"\u20BE"}
          </div>
        )}
        {product?.sale && (
          <div style={{ flexDirection: "row", marginLeft: 5 }}>
            <div
              style={{
                color: "#888",
                textDecorationLine: "line-through",
                letterSpacing: 0.3,
                fontWeight: "bold",
                gap: "4px",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              {product.price}
              {product.currency === "dollar" ? (
                "Dollar"
              ) : product.currency === "euro" ? (
                "Euro"
              ) : (
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#888",
                    fontSize: "14px",
                  }}
                >
                  {"\u20BE"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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
