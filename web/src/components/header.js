import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <LogoTitle onClick={() => navigate("/")} part={1}>
        Beauty
      </LogoTitle>
      <LogoTitle onClick={() => navigate("/")} part={2}>
        Verse
      </LogoTitle>
    </Container>
  );
};

const Container = styled.div`
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
  height: 10vh;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 10001;

  @media only screen and (max-width: 600px) {
    height: 8vh;
  }
`;

const LogoTitle = styled.h1`
  color: ${(props) => (props.part === 1 ? "#f866b1" : "#ccc")};
  letter-spacing: 1.2px;

  @media only screen and (max-width: 600px) {
    font-size: 7.5vw;
  }
`;
