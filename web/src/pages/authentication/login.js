import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRerenderCurrentUser } from "../../redux/user";
import { setCurrentUser } from "../../redux/auth";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import styled from "styled-components";
import { ResetPassword } from "./resetPassword";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import SimpleBackdrop from "../../components/backdrop";
import Alert from "@mui/material/Alert";
import { BounceLoader } from "react-spinners";
import { Language } from "../../context/language";

export const Login = () => {
  //language context
  const language = Language();
  // login email and password states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // use redux toolkit dispatch
  const dispatch = useDispatch();

  // navigation
  const navigate = useNavigate();

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // backdrop loader
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // sending loading state
  const [sendingLoading, setSendingLoading] = useState(false);

  /**
   * Login function
   */
  const Login = async () => {
    try {
      setSendingLoading(true);
      // post login to backend
      await axios
        .post(backendUrl + "/api/v1/login", {
          email: email,
          password: password,
        })
        .then(async (data) => {
          setOpenBackdrop(true);
          if (
            data.data.filteredUser?.registerStage === "done" ||
            !data.data.filteredUser?.registerStage
          ) {
            localStorage.setItem(
              "Beautyverse:currentUser",
              JSON.stringify(data.data.filteredUser)
            );
            navigate("/feeds");
          } else {
            dispatch(setCurrentUser(data.data.filteredUser));
            navigate("/register/personalinfo");
          }
          setSendingLoading(false);
          setOpenBackdrop(false);
        });
    } catch (err) {
      console.log(err.response.data.message);
      setSendingLoading(false);
      // alert errors to be visible for users
      setAlert({
        status: true,
        text: err.response.data.message,
        type: "error",
      });
    }
  };

  /**
   * this is states for reset passwords.
   * email input and to open/close reset password popup
   */
  const [emailInput, setEmailInput] = useState("");
  const [resetPopup, setResetPopup] = useState(false);

  /**
   * send email to reset password
   * after send request, user gettings link to navigate to beautyverse web, where user can set new password
   */

  async function SendEmail() {
    try {
      setResetPopup(false);
      await axios.post(backendUrl + "/api/v1/forgotPassword", {
        email: emailInput,
      });
      // If the email is sent successfully, handle the response here
      setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.requestSent,
        type: "success",
      });
    } catch (error) {
      setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.wrongEmail,
        type: "error",
      });
    }
  }
  // this state used to show/hide password when input
  const [passwordFocused, setPasswordFocused] = useState(false);

  // page animation transition
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
  }, []);

  return (
    <Container transition={transition ? "true" : "false"}>
      <SimpleBackdrop open={openBackdrop} setOpen={setOpenBackdrop} />
      <ResetPassword
        openReset={resetPopup}
        setOpenReset={setResetPopup}
        email={emailInput}
        setEmail={setEmailInput}
        SendEmail={SendEmail}
      />

      <Inputs>
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
          onClick={Login}
          //   {...props}
        >
          {sendingLoading ? (
            <BounceLoader
              color={"#f866b1"}
              loading={sendingLoading}
              size={20}
            />
          ) : (
            "Login"
          )}
        </Button>
        <h4
          onClick={() => setResetPopup(true)}
          style={{
            letterSpacing: "0.5px",
            color: "#ccc",
            margin: "8px",
            textDecoration: "underline",
            fontSize: "14px",
            margin: 0,
          }}
        >
          Forgot Password?
        </h4>
        <h4
          onClick={() => navigate("/register/identify")}
          style={{
            letterSpacing: "0.5px",
            color: "#f866b1",
            margin: "4px",
            textDecoration: "underline",
            fontSize: "14px",
            margin: 0,
          }}
        >
          Create account
        </h4>
      </Inputs>
      {alert?.status && (
        <Alert
          onClick={() => setAlert({ type: "", text: "", status: false })}
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
  flex-direction: column;
  align-items: center;
  gap: 5vh;
  position: relative;
  top: 20vh;
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
