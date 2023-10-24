import React from "react";
import styled from "styled-components";

export const InStock = ({ product }) => {
  return (
    <Container>
      <div>InStock:</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "4px",
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
          {product?.InStock} pcs.
        </h2>
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
