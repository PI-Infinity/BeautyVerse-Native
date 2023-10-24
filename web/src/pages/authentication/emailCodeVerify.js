import { TextField, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import { MdDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Language } from "../../context/language";

export const Verify = ({
  active,
  setActive,
  activeState,
  setActiveState,
  codeInput,
  setCodeInput,
  Register,
  code,
}) => {
  // language
  const language = Language();
  const navigate = useNavigate("");
  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  return (
    <Container
      active={active ? "true" : "false"}
      style={{
        background: activeState ? "rgba(1, 2, 12, 0.7)" : "rgba(1, 2, 12, 0.9)",
      }}
    >
      {activeState && (
        <Inputs>
          <h4
            style={{
              color: "#ccc",
              letterSpacing: "0.5px",
              textAlign: "center",
              lineHeight: "24px",
            }}
          >
            The verification code has sent to your email! Please Check it!
          </h4>
          <TextField
            id="outlined-basic"
            label="Enter Code"
            variant="outlined"
            value={codeInput}
            type="number"
            onChange={(e) => setCodeInput(e.target.value)}
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
                letterSpacing: "0.5px",
              },
              "& label.Mui-focused": {
                color: "#ccc",
                fontSize: "14px",
                letterSpacing: "0.5px",
              },
            }}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: "#f866b1", color: "white" }}
            sx={{ width: "40%", borderRadius: "50px", marginTop: "10px" }}
            onClick={() => {
              code === codeInput
                ? Register()
                : setAlert({
                    status: true,
                    text: language?.language?.Auth?.auth?.wrongVerifyCode,
                    type: "error",
                  });
            }}
            className="button"
          >
            Confirm
          </Button>
        </Inputs>
      )}
      <Inputs
        style={{
          transition: "ease-in 200ms",
          transform: `scale(${activeState ? "0" : "1"})`,
          opacity: `${activeState ? "0" : "1"}`,
          position: "absolute",
        }}
      >
        <MdDone size={50} color="lightgreen" />
        <h2
          style={{
            color: "#ccc",
            letterSpacing: "0.5px",
            textAlign: "center",
            margin: 0,
          }}
        >
          Congretulation!{" "}
        </h2>
        <span
          style={{
            color: "#ccc",
            letterSpacing: "0.5px",
            textAlign: "center",
            fontWeight: "normal",
          }}
        >
          You are registered Successfully!
        </span>
        <Button
          variant="contained"
          style={{ backgroundColor: "#f866b1", color: "white" }}
          sx={{ width: "40%", borderRadius: "50px", marginTop: "10px" }}
          onClick={() => navigate("/register/personalinfo")}
          className="button"
        >
          Continue
        </Button>
      </Inputs>
      {alert?.status && (
        <Alert
          onClick={() => setAlert({ type: "", text: "", status: false })}
          style={{
            position: "absolute",
            bottom: "10px",
            width: "60vw",
          }}
          severity={alert?.type}
        >
          {alert?.text}
        </Alert>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 90vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: ease-in 200ms;
  position: fixed;
  top: ${(props) => (props.active === "true" ? "0" : "100vh")};
  z-index: 1000;
  background: rgba(1, 2, 12, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Inputs = styled.div`
  width: 90%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  .button {
    &:hover {
      filter: brightness(1.1);
    }
  }
`;
