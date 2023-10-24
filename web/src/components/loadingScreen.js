import React from "react";
import coverImg from "../../../assets/logo.png";
import styled from "styled-components";

export const LoadingScreen = () => {
  return <AnimatedImage src={coverImg} alt="BeautyVerse" />;
};

const AnimatedImage = styled.img`
  width: 600px;
  position: relative;
  right: 50px;
  animation: ${fadeIn} 1s ease-in-out; /* Adjust animation duration and easing as needed */

  @media only screen and (max-width: 600px) {
    width: 100%;
    right: 0px;
    bottom: 20px;
  }
`;
