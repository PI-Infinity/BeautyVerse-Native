import React from "react";
import { BiImageAdd } from "react-icons/bi";
import { IoMdArrowRoundBack, IoMdNotifications } from "react-icons/io";
import { MdSettings } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";

/**
 *
 * user page
 */

export const Header = ({ user, back }) => {
  const navigate = useNavigate();

  const unreadNotifications = useSelector(
    (state) => state.storeNotifications.unreadNotifications
  );

  return (
    <Container>
      {back && (
        <IoMdArrowRoundBack
          size={30}
          color="#f866b1"
          style={{ position: "relative", left: "15px" }}
          className="back"
          onClick={() => {
            setTimeout(() => {
              navigate(back);
            }, 500);
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: back ? "5px" : "20px",
        }}
      >
        <LogoTitle style={{ position: "relative", left: back ? 0 : "15px" }}>
          {user.name}{" "}
        </LogoTitle>
        {user.subscription.status === "active" && (
          <VscVerifiedFilled color="#f866b1" size={18} />
        )}
      </div>
      {back ? (
        <div style={{ width: "30px" }}></div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            position: "relative",
            right: "15px",
          }}
        >
          <div onClick={() => navigate("/profile/addfeed")}>
            <BiImageAdd color="#f866b1" size={25} />
          </div>
          <div
            onClick={() => navigate("/profile/notifications")}
            style={{ position: "relative", bottom: "1.5px" }}
          >
            <Badge
              badgeContent={unreadNotifications?.length}
              max={999}
              invisible={false}
              sx={{
                ".MuiBadge-badge": {
                  backgroundColor: "#f866b1",
                  color: "#ffffff",
                  minWidth: "16px",
                  width: "15px",
                  height: "15px",
                  borderRadius: "8px",
                  fontSize: "0.70rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            >
              <IoMdNotifications color="#ccc" size={23} />
            </Badge>
          </div>
          <div onClick={() => navigate("/profile/settings")}>
            <MdSettings color="#ccc" size={23} />
          </div>
        </div>
      )}
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
    font-size: 5.5vw;
  }
`;
