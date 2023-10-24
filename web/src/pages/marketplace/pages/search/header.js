import React from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import styled from "styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

/**
 *
 * user page
 * @returns
 */

export const Header = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container>
      <IoMdArrowRoundBack
        size={30}
        className="back"
        color="#f866b1"
        onClick={() => {
          setTimeout(() => {
            navigate("/marketplace");
          }, 500);
        }}
        style={{ position: "relative", left: "15px" }}
      />

      <LogoTitle>Find what you need!</LogoTitle>
      <div style={{ width: "30px" }}></div>
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
  justify-content: space-between;
  align-items: center;
  display: flex;
  z-index: 10001;

  @media only screen and (max-width: 600px) {
    height: 8vh;
  }

  .back {
    &:hover {
      opacity: 0.8;
    }
  }
`;

const LogoTitle = styled.h1`
  color: ${(props) => (props.part === 1 ? "#f866b1" : "#ccc")};
  letter-spacing: 1.2px;

  @media only screen and (max-width: 600px) {
    font-size: 4.5vw;
  }
`;
