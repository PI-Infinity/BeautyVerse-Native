import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setRerenderNotifications } from "../../../redux/notifications";

export const Configs = ({
  openConfig,
  setOpenConfig,
  currentUser,
  setList,
}) => {
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // redux dispatch
  const dispatch = useDispatch();

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const DeleteNotification = async (id) => {
    try {
      // Update local state list if it exists
      setList((prev) => {
        return prev.filter((item) => item?._id !== id); // Keep all notifications that don't have the current id
      });

      // Check if the current user and the notifications list exist
      if (currentUser && currentUser.notifications) {
        // Filter out the deleted notification
        currentUser.notifications = currentUser.notifications.filter(
          (notification) => notification?._id !== id
        );

        // Save the updated user back to local storage
        localStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(currentUser)
        );
        dispatch(setRerenderNotifications());
      }

      setTransition(true);
      setTimeout(() => {
        setOpenConfig({ active: false, id: null });
      }, 300);

      // Send a request to the backend to delete the notification
      await axios.delete(
        `${backendUrl}/api/v1/users/${currentUser?._id}/notifications/${id}`
      );
    } catch (error) {
      console.error(
        error?.response?.data?.message ||
          "An error occurred while deleting the notification."
      );
    }
  };

  return (
    <div
      onClick={() => {
        setTransition(true);
        setTimeout(() => {
          setOpenConfig({ active: false, id: null });
        }, 300);
      }}
      style={{
        background: !openConfig.active
          ? "rgba(1, 2, 12, 0.2)"
          : "rgba(1, 2, 12, 0)",
        backdropFilter: "blur(10px)",
        webkitBackdropFilter: "blur(10px)",
        zIndex: 1001,
        position: "fixed",
        top: "0",
        left: "0",
        transition: "ease-in-out 220ms",
        width: "100%",
        height: "100%",
      }}
    >
      <Container
        openConfig={transition ? "true" : "false"}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 style={{ color: "#ccc", letterSpacing: "0.5px", margin: 0 }}>
          Delete Notification
        </h3>
        <Buttons
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Button
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setOpenConfig({ active: false, id: null });
              }, 300);
            }}
            variant="contained"
            className="button"
            style={{ background: "#888" }}
            sx={{
              width: "40%",
              borderRadius: "50px",
              marginTop: "10px",
              height: "35px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => DeleteNotification(openConfig.id)}
            variant="contained"
            className="button"
            style={{ background: "#f866b1" }}
            sx={{
              width: "40%",
              borderRadius: "50px",
              marginTop: "10px",
              height: "35px",
              fontWeight: "bold",
            }}
          >
            Delete
          </Button>
        </Buttons>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 20vh;
  background: rgba(255, 255, 255, 0.1);
  position: absolute;
  bottom: ${(props) => (props.openConfig === "false" ? 0 : "-20vh")};
  border-radius: 30px 30px 0 0;
  z-index: 1000;
  transition: ease-in 300ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const Buttons = styled.div`
  .button {
    &:hover {
      filter: brightness(1.1);
    }
  }
`;
