import React, { useEffect, useState } from "react";
import { ServicesOptions } from "./servicesOptions";
import { Alert, Button } from "@mui/material";
import { Language } from "../../context/language";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { WDOptions } from "./wdOptions";

export const Services = () => {
  // language context
  const language = Language();
  // redux toolkit dispatch
  const dispatch = useDispatch();

  // navigate
  const navigate = useNavigate();

  // procedures state
  const [procedures, setProcedures] = useState([]);

  // working days state
  const [wd, setWd] = useState([]);

  // if not defined registered user lets navigate to login
  const currentUser = useSelector((state) => state.storeAuth.currentUser);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);
  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  /**
   * this function completes register process for specialists and salons
   */
  const FillUp = async (e) => {
    try {
      if (procedures?.length > 0) {
        // Signup user and add procedures and working infos
        await axios.patch(backendUrl + "/api/v1/users/" + currentUser?._id, {
          procedures: procedures?.map((item) => {
            return { value: item.value };
          }),
          workingDays: wd?.map((item) => {
            return { value: item };
          }),
        });

        navigate("/register/accept");
      } else {
        setAlert({
          status: true,
          text: language?.language?.Auth?.auth?.pleaseInput,
          type: "error",
        });
      }
    } catch (err) {
      setAlert({
        status: true,
        text: language?.language?.Auth?.auth?.pleaseInput,
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "15px 0 100px 0",
        boxSizing: "border-box",
        gap: "15px",
        position: "relative",
        right: transition ? 0 : "-100vw",
        opacity: transition ? "1" : "0",
        transition: "ease-in-out 200ms",
      }}
    >
      <h3 style={{ color: "#ccc", letterSpacing: "0.5px" }}>Services</h3>
      <ServicesOptions value={procedures} setValue={setProcedures} />
      <h3 style={{ color: "#ccc", letterSpacing: "0.5px" }}>Working Days</h3>

      <WDOptions value={wd} setValue={setWd} />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: "#f866b1",
            color: "white",
          }}
          className="button"
          sx={{
            width: "40%",
            borderRadius: "50px",
            marginTop: "10px",
            height: "40px",
          }}
          onClick={FillUp}
        >
          Accept
        </Button>
      </div>
      {alert?.status && (
        <Alert
          onClick={() => setAlert({ type: "", text: "", status: false })}
          style={{
            width: "60vw",
            marginTop: "20px",
          }}
          severity={alert?.type}
        >
          {alert?.text}
        </Alert>
      )}
    </div>
  );
};
