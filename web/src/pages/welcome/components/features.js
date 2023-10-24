import React from "react";
import styled from "styled-components";

export const Features = () => {
  return (
    <Container>
      <h2
        style={{
          color: "rgba(230,227,234,1)",
          letterSpacing: "1px",
          fontWeight: "normal",
          padding: 0,
          margin: 0,
        }}
      >
        For whom?
      </h2>
      <div>
        <h2
          style={{
            color: "rgba(230,227,234,1)",
            letterSpacing: "1px",
            fontWeight: "normal",
            padding: 0,
            margin: 0,
          }}
        >
          Beauty Specialists
        </h2>
        <h2
          style={{
            color: "rgba(230,227,234,1)",
            letterSpacing: "1px",
            fontWeight: "normal",
            padding: 0,
            margin: 0,
          }}
        >
          Beauty Salons
        </h2>
        <h2
          style={{
            color: "rgba(230,227,234,1)",
            letterSpacing: "1px",
            fontWeight: "normal",
            padding: 0,
            margin: 0,
          }}
        >
          Shops
        </h2>
        <h2
          style={{
            color: "rgba(230,227,234,1)",
            letterSpacing: "1px",
            fontWeight: "normal",
            padding: 0,
            margin: 0,
          }}
        >
          Users
        </h2>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
