import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import coverImg from "../../../assets/logo.png";
import DownloadAppStore from "../../../assets/downloadAppStore.png";
import DownloadPlayStore from "../../../assets/google.png";
import Button from "@mui/material/Button";
import { AiFillAppstore } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const Cover = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <LogoContainer>
        <AnimatedImage src={coverImg} alt="BeautyVerse" />
      </LogoContainer>
      <AnimatedContainer>
        <TextContainer>
          <h1>Where Beauty Meets Diversity</h1>
        </TextContainer>
        <TextContainer>
          <h2>Your beauty hub everywhere & anytime!</h2>
        </TextContainer>
        <GoButton variant="contained" onClick={() => navigate("/feeds")}>
          Go to App{" "}
          <AiFillAppstore
            // color="#ccc"
            size={24}
            style={{ marginLeft: "8px" }}
          />
        </GoButton>
        <StoreButtons>
          <TextContainer>
            <div>
              <a
                style={{ padding: "0", margin: "0" }}
                href="https://apps.apple.com/app/6448795980"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppStoreImage
                  src={DownloadAppStore}
                  alt="Download on the App Store"
                />
              </a>
            </div>
          </TextContainer>
          <TextContainer>
            <div>
              <a
                onClick={() =>
                  alert("Andorid not supported yet, we are working for it!")
                }
                style={{ padding: "0", margin: "0" }}
                // href="https://apps.apple.com/app/6448795980"
                // target="_blank"
                // rel="noopener noreferrer"
              >
                <AppStoreImage
                  style={{ height: "46px", width: "142px" }}
                  src={DownloadPlayStore}
                  alt="Download on the App Store"
                />
              </a>
            </div>
          </TextContainer>
        </StoreButtons>
      </AnimatedContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    justify-content: start;
  }
`;

// image
const fadeIn = keyframes`
from {
  opacity: 0;
  transform: scale(0.8) rotate(180deg);
}
to {
  opacity: 1;
  transform: scale(1) rotate(360deg);
}
`;

// title for mobile screens
const slideInMobile = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

// title
const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const LogoContainer = styled.div`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

const AnimatedImage = styled.img`
  width: 600px;
  position: relative;
  right: 40px;

  animation: ${fadeIn} 0.75s ease-in-out;

  @media only screen and (max-width: 600px) {
    width: 90%;
    right: 0px;
    bottom: 20px;
  }
`;

const AnimatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  animation: ${slideIn} 0.75s ease-in-out;

  position: relative;
  right: 100px;

  @media only screen and (max-width: 600px) {
    right: 0px;
    align-items: center;
    bottom: 40px;

    animation: ${slideInMobile} 0.75s ease-in-out;
  }
`;

const TextContainer = styled.div`
  div {
    height: 80px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
  }
  h1 {
    color: #ccc;
    letter-spacing: 1px;
    margin: 0;
    margin-bottom: 10px;

    @media only screen and (max-width: 600px) {
      text-align: center;
      font-size: 5.5vw;
    }
  }
  h2 {
    color: #ccc;
    letter-spacing: 1px;
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
    font-weight: normal;

    @media only screen and (max-width: 600px) {
      text-align: center;
      font-size: 4vw;
    }
  }
`;

const StoreButtons = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
  right: 7px;

  @media only screen and (max-width: 600px) {
    right: 4px;
  }
`;

const AppStoreImage = styled.img`
  width: 150px;
  @media only screen and (max-width: 600px) {
    width: 150px;
  }
`;

const GoButton = styled(Button)`
  && {
    background-color: #f866b1;
    color: #fff;
    font-weight: bold;
    margin-top: 20px;
    width: 50%;
    border-radius: 50px;

    @media only screen and (max-width: 600px) {
      width: 60%;
      margin-top: 30px;
    }

    &:hover {
      background-color: #fff; // change background color when hovered
      color: #f866b1;
      font-weight: bold;
    }
  }
`;
