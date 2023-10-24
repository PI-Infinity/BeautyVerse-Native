import React from "react";
import styled from "styled-components";

export const FullDescription = ({ product }) => {
  return (
    <Container>
      <div style={{ whiteSpace: "nowrap" }}>Full Description:</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <p
          style={{
            letterSpacing: "0.5px",
            margin: 0,
            fontSize: "14px",
            color: "#f866b1",
            fontWeight: "normal",
          }}
        >
          {product.description.en ||
            product.description.ka ||
            product.description.ru}
        </p>
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
