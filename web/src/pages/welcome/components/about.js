import React from "react";
import styled, { keyframes } from "styled-components";
import App1Image from "../../../assets/app1.png";
import App2Image from "../../../assets/app2.png";
import App3Image from "../../../assets/app3.png";

export const About = () => {
  return (
    <Container>
      <h2>The social media app, designed for Beauty industry!</h2>
      <div>
        <AppImage src={App1Image} />
        <AppImage src={App2Image} />
        <AppImage src={App3Image} />
      </div>
    </Container>
  );
};

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15vh;
  box-sizing: border-box;

  animation: ${slideInFromRight} 0.75s forwards;

  @media only screen and (max-width: 600px) {
    width: 90%;
    padding-top: 8vh;
    padding-horizontal: 5vw;
  }

  div {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
    padding: 10px;

    @media only screen and (max-width: 600px) {
      overflow-x: scroll;
      justify-content: start;
      gap: 15px;
    }
  }

  h2 {
    color: #ccc;
    letter-spacing: 1px;
    padding: 0;
    margin: 0;

    @media only screen and (max-width: 600px) {
      text-align: center;
      line-height: 7.5vw;
      font-size: 5.5vw;
    }
  }
`;

const AppImage = styled.img`
  width: 250px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  @media only screen and (max-width: 600px) {
    width: 65%;
  }
`;
