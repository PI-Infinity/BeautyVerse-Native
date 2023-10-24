import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import Button from "@mui/material/Button";

export const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <Container>
      <h2 style={{ color: "#ccc", margin: 0 }}>Form</h2>
      <p
        style={{
          color: "#ccc",
          textAlign: "center",
          padding: "15px",
          letterSpacing: "0.5px",
        }}
      >
        If you are interested to work with BeautyVerse, let's send us your
        contact details!
      </p>
      <StyledTextField
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <StyledTextField
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <StyledTextField
        label="Phone"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <StyledTextField
        label="Message"
        multiline
        rows={4}
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <SubmitButton variant="contained">Submit</SubmitButton>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  padding-top: 12vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 20px;
    width: 50%;
    background: rgba(0, 0, 0, 0.5);

    @media only screen and (max-width: 600px) {
      width: 90%;
    }

    label {
      color: #f866b1 !important; // color of the label without focus
    }
    .MuiInputBase-input {
      color: #ccc; // color of the input text
    }
    .MuiOutlinedInput-notchedOutline {
      border-radius: 10px;
      border: 1px solid #ccc;
    }
    label.Mui-focused {
      color: #fff;
    }
    .MuiOutlinedInput-root {
      &.Mui-focused fieldset {
        border: 1px solid #f866b1; // color of the border when focused, change as per preference
      }
    }
    &:hover fieldset {
      border: 1px solid #ccc; // Keeps the border color the same as non-hovered state
    }
  }
`;

const SubmitButton = styled(Button)`
  && {
    background-color: #f866b1;
    color: #ccc;
    font-weight: bold;
    margin-top: 20px;
    width: 20%;
    border-radius: 50px;

    @media only screen and (max-width: 600px) {
      width: 50%;
    }

    &:hover {
      background-color: #ccc; // change background color when hovered
      color: #f866b1;
      font-weight: bold;
    }
  }
`;
