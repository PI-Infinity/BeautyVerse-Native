import { TextField, Button } from "@mui/material";
import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import styled from "styled-components";

export const ResetPassword = ({
  openReset,
  setOpenReset,
  email,
  setEmail,
  SendEmail,
}) => {
  return (
    <Container openreset={openReset === true ? "true" : "false"}>
      <Header>
        <div></div>
        <div
          onClick={() => {
            setOpenReset(false);
          }}
          style={{
            padding: "5px",

            zIndex: 1000,
          }}
        >
          <IoMdArrowDropdown size={30} color="#f866b1" />
        </div>
      </Header>
      <h3 style={{ color: "#ccc", margin: 0, padding: 0 }}>Reset Password</h3>
      <p
        style={{
          fontSize: "14px",
          color: "#ccc",
          letterSpacing: "0.5px",
          textAlign: "center",
          lineHeight: "24px",
        }}
      >
        After sending, you will get link on email for to reset password!{" "}
      </p>
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={email}
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          width: "75%",
          "& .MuiOutlinedInput-root": {
            height: "53px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.1)",
              borderRadius: "15px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f866b1",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f866b1",
            },
          },
          "& .MuiOutlinedInput-input": {
            borderRadius: "15px",
            color: "#ccc",
          },
          "& label": {
            color: "#888",
            fontSize: "14px",
          },
          "& label.Mui-focused": {
            color: "#ccc",
            fontSize: "14px",
          },
        }}
      />
      <Button
        variant="contained"
        style={{ backgroundColor: "#f866b1", color: "white" }}
        sx={{ width: "40%", borderRadius: "50px", marginTop: "10px" }}
        onClick={SendEmail}
        //   {...props}
      >
        Send
      </Button>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 0 15px 50px 15px;
  z-index: 1000;
  box-sizing: border-box;
  background: rgba(1, 2, 12, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateY(
    ${(props) => (props.openreset === "true" ? 0 : "100vh")}
  );
  transition: ease-in 300ms;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  gap: 15px;
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 15px;
  right: 15px;
`;
