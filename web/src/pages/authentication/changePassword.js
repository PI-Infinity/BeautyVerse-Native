import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Language } from "../../context/language";
import { TextField } from "@mui/material";
// import Error from '../../snackBars/success';

export default function ChangePassword() {
  const navigate = useNavigate();
  const language = Language();
  const [alert, setAlert] = useState(false);
  const [showPassword, setShowPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const path = window.location.pathname.split("/");
  const token = path[path?.length - 1];

  // change password

  async function Changing() {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/resetPassword/${token}`,
        {
          password: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      setAlert({
        active: true,
        title: "Password changed succesfully!",
        type: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      // If there's an error, display an alert
      setAlert({
        active: true,
        title: error.response.data.message,
        type: "error",
      });
    }
  }

  return (
    <Container>
      {/* {alert?.active && (
        <Error
          open={alert?.active}
          setOpen={setAlert}
          type={alert?.type}
          title={alert?.title}
        />
      )} */}
      <Title>{language?.language.User.userPage.newPassword}</Title>
      <InputWrapper>
        <TextField
          placeholder={language?.language.User.userPage.newPassword}
          value={newPassword}
          type={showPassword === "new" ? "text" : "password"}
          onChange={(e) => setNewPassword(e.target.value)}
          id="outlined-basic"
          label="New Password"
          variant="outlined"
          sx={{
            width: "70%",
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

        {showPassword === "new" ? (
          <AiOutlineEye
            className="eye"
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword("")}
          />
        ) : (
          <AiOutlineEyeInvisible
            className="eye"
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword("new")}
          />
        )}
      </InputWrapper>
      <InputWrapper>
        <TextField
          placeholder={language?.language.User.userPage.confirmPassword}
          value={confirmPassword}
          type={showPassword === "confirm" ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="outlined-basic"
          label="Confirm Password"
          variant="outlined"
          sx={{
            width: "70%",
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

        {showPassword === "confirm" ? (
          <AiOutlineEye
            className="eye"
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword("")}
          />
        ) : (
          <AiOutlineEyeInvisible
            className="eye"
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword("confirm")}
          />
        )}
      </InputWrapper>
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          boxSizing: "border-box",
        }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: "#888",
            color: "white",
            borderRadius: "100px",
            width: "100%",
          }}
          onClick={() => {
            setNewPassword("");
            setConfirmPassword("");
            navigate("/login");
          }}
          //   {...props}
        >
          {language?.language.User.userPage.cancel}
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#f866b1",
            color: "white",
            borderRadius: "100px",
            width: "100%",
          }}
          onClick={Changing}
          //   {...props}
        >
          {language?.language.User.userPage.change}
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 80vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Title = styled.h3`
  color: ${(props) => props.theme.font};
`;

const InputWrapper = styled.div`
  box-shadow: 0 0.2vw 0.6vw ${(props) => props.theme.shadowColor};
  border-radius: 1.5vw;
  padding-left: 2vw;
  font-size: 16px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in 200ms;
  color: ${(props) => (props.back ? "#ccc" : "green")};
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  font-size: 14px;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;
