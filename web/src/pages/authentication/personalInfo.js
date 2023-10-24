import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Language } from "../../context/language";
import { MapAutoComplete } from "./mapAutocomplete";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import axios from "axios";
import SimpleBackdrop from "../../components/backdrop";
import Alert from "@mui/material/Alert";

export const PersonalInfo = () => {
  // redux toolkit dispatch
  const dispatch = useDispatch();

  // navigation
  const navigate = useNavigate();

  // if not defined registered user lets navigate to login
  const currentUser = useSelector((state) => state.storeAuth.currentUser);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  // language
  const language = Language();

  // identify states
  const [name, setName] = useState("");
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("995");

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // backdrop loader
  const [openBackdrop, setOpenBackdrop] = useState(false);

  /**
   * add info function
   */

  const AddPresonalInfo = async (e) => {
    if (!name || !phone || !address) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.pleaseInput,
        type: "error",
      });
    }
    if (name?.length < 2 || name?.length > 35) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.nameWarning,
        type: "error",
      });
    }
    if (phone?.includes("+")) {
      return setAlert({
        status: true,
        text: "Phone number doesn't need country code +" + countryCode,
        type: "error",
      });
    }
    if (phone?.length < 8 || phone?.length > 35) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.wrongPhoneNumber,
        type: "error",
      });
    }

    if (!address.street) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.wrongAddress,
        type: "error",
      });
    }

    // if hone includes country code continue, if not alert error

    try {
      setOpenBackdrop(true);
      // Signup user
      await axios.patch(backendUrl + "/api/v1/users/" + currentUser._id, {
        name: name,
        phone: {
          phone: phone,
          callingCode: countryCode,
          countryCode: address?.country,
        },
        address: {
          country: address?.country,
          region: address?.region && address.region,
          city: address?.city && address.city,
          district: address?.district && address.district,
          street: address?.street && address.street,
          number: address?.number && address.number,
          latitude: address?.latitude,
          longitude: address?.longitude,
        },
      });
      navigate("/register/type");
      setOpenBackdrop(false);
    } catch (err) {
      console.log(err.response);
      // error handlers
      if (err.response.data.message?.includes("E11000")) {
        setAlert({
          status: true,
          text: language?.language?.Auth?.auth?.usedPhone,
          type: "error",
        });
      } else {
        console.log(err.response.data.message);
        setAlert({
          status: true,
          text: err.response.data.message,
          type: "error",
        });
      }
    }
  };

  // page animation transition
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
  }, []);

  // phone input styled

  const containerStyle = {
    width: "40%",
    borderRadius: "4px",
    background: "none",
  };

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "red",
  };

  const inputStyle = {
    background: "none",
    color: "#f866b1",
    width: "100%",
    border: "none",
  };
  const searchStyle = {
    width: "90%",
    fontSize: "16px",
    borderRadius: "50px",
  };

  const dropdownStyle = {
    width: "75vw",
    background: "rgba(1, 2, 12, 1)",
    color: "#f866b1",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    border: "2px solid #f866b1",
    borderRadius: "20px",
  };

  return (
    <Container transition={transition ? "true" : "false"}>
      <SimpleBackdrop open={openBackdrop} setOpen={setOpenBackdrop} />
      <Inputs>
        <h3 style={{ color: "#ccc", letterSpacing: "0.5px", margin: 0 }}>
          Add Personal Info
        </h3>
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
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

        <div style={{ display: "flex", width: "75%" }}>
          <PhoneInput
            enableSearch={true}
            value={countryCode}
            onChange={(phone) => setCountryCode(phone)}
            containerStyle={containerStyle}
            searchStyle={searchStyle}
            inputStyle={inputStyle}
            dropdownStyle={dropdownStyle}
            buttonStyle={buttonStyle}
            country={"ge"}
          />

          <TextField
            id="outlined-basic"
            label="phone"
            variant="outlined"
            value={phone}
            type="text"
            onChange={(e) => setPhone(e.target.value)}
            sx={{
              width: "60%",
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
        </div>

        <MapAutoComplete address={address} setAddress={setAddress} />

        <Button
          variant="contained"
          style={{ backgroundColor: "#f866b1", color: "white" }}
          sx={{ width: "40%", borderRadius: "50px", marginTop: "10px" }}
          onClick={AddPresonalInfo}
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
  height: 80vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  right: ${(props) => (props.transition === "true" ? 0 : "-100vw")};
  opacity: ${(props) => (props.transition === "true" ? "1" : "0")};
  transition: ease-in-out 200ms;
`;
const Inputs = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;

  .button {
    &:hover {
      filter: brightness(1.1);
    }
  }
`;
