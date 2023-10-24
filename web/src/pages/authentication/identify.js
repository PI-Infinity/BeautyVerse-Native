import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Language } from "../../context/language";
import { setCurrentUser } from "../../redux/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Verify } from "./emailCodeVerify";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import SimpleBackdrop from "../../components/backdrop";
import Alert from "@mui/material/Alert";
import { BounceLoader } from "react-spinners";

export const Identify = () => {
  // redux toolkit dispatch
  const dispatch = useDispatch();

  // navigation
  const navigate = useNavigate();

  // language
  const language = Language();

  // identify states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // type redux state already defined in register screen
  const type = useSelector((state) => state.storeAuth.userType);

  // verify email states
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const [openBackdrop, setOpenBackdrop] = useState(false);

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // defines if activeState code input or succes register text
  const [activeState, setActiveState] = useState(true);

  /**
   * Send verify email
   */
  // sending loading state
  const [sendingLoading, setSendingLoading] = useState(false);

  const SendEmail = async () => {
    if (
      email?.length < 1 ||
      password?.length < 1 ||
      confirmPassword?.length < 1
    ) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.successRegister,
        type: "error",
      });
    }
    if (!email?.includes("@") || email?.length < 6 || email?.length > 40) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.pleaseInput,
        type: "error",
      });
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.wrongEmail,
        type: "error",
      });
    }

    if (password?.length < 8 || password?.length > 40) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.wrongPassword,
        type: "error",
      });
    }
    if (password !== confirmPassword) {
      return setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.differentPasswords,
        type: "error",
      });
    }
    try {
      setSendingLoading(true);
      const response = await axios.post(
        backendUrl + "/api/v1/sendVerifyEmail",
        {
          email: email,
        }
      );
      setVerify(true);
      setSendingLoading(false);
      setCode(response.data.code);
    } catch (error) {
      console.log(error.response);
      setSendingLoading(false);
      setAlert({
        status: true,
        text: error.response.data.message,
        type: "error",
      });
    }
  };

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Registration
   */

  const Register = async (e) => {
    setOpenBackdrop(true);
    // console.log(code);
    // if hone includes country code continue, if not alert error
    try {
      // Signup user
      const response = await axios.post(backendUrl + "/api/v1/signup", {
        name: "",
        type: "user",
        email: email,
        phone: { phone: uuidv4(), callingCode: "", countryCode: "" },
        password: password,
        confirmPassword: confirmPassword,
        cover: "",
        address: [],
        media: {
          facebook: "",
          instagram: "",
          tiktok: "",
          youtube: "",
          telegram: false,
          whatsapp: false,
        },
        experience: "",
        subscription: { status: "active" },
        notifications: [],
        active: false,
        registerStage: "identify",
      });
      // after send data to db, open email verify popup
      dispatch(setCurrentUser(response.data.newUser));
      setActiveState(false);
      setOpenBackdrop(false);
      setCode("");
      setCodeInput("");
    } catch (err) {
      setCode("");
      setCodeInput("");
      setOpenBackdrop(false);
      // error handlers
      console.log(err.response.data.message);
      setAlert({
        status: true,
        text: err.response.data.message,
        type: "error",
      });
    }
  };

  // page animation transition
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
  }, []);

  return (
    <Container transition={transition ? "true" : "false"}>
      <Inputs>
        <h3 style={{ color: "#ccc", letterSpacing: "0.5px", margin: 0 }}>
          Register
        </h3>
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
              letterSpacing: "0.5px",
            },
            "& label.Mui-focused": {
              color: "#ccc",
              fontSize: "14px",
              letterSpacing: "0.5px",
            },
          }}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? (
                    <MdVisibility color="#ccc" size={22} />
                  ) : (
                    <MdVisibilityOff color="#ccc" size={22} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
        <TextField
          id="outlined-basic"
          label="Confirm Password"
          variant="outlined"
          value={confirmPassword}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? (
                    <MdVisibility color="#ccc" size={22} />
                  ) : (
                    <MdVisibilityOff color="#ccc" size={22} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          style={{
            backgroundColor: sendingLoading ? "#ccc" : "#f866b1",
            color: "white",
          }}
          className="button"
          sx={{
            width: "40%",
            borderRadius: "50px",
            marginTop: "10px",
            height: "40px",
          }}
          onClick={SendEmail}
        >
          {sendingLoading ? (
            <BounceLoader
              color={"#f866b1"}
              loading={sendingLoading}
              size={20}
            />
          ) : (
            "Register"
          )}
        </Button>
        <h4
          onClick={() => navigate("/login")}
          style={{
            letterSpacing: "0.5px",
            color: "#f866b1",
            margin: "4px",
            textDecoration: "underline",
            fontSize: "14px",
            margin: 0,
          }}
        >
          Login
        </h4>
      </Inputs>
      <Verify
        active={verify}
        setActive={setVerify}
        activeState={activeState}
        setActiveState={setActiveState}
        codeInput={codeInput}
        setCodeInput={setCodeInput}
        Register={Register}
        code={code}
      />
      <SimpleBackdrop open={openBackdrop} setOpen={setOpenBackdrop} />
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
