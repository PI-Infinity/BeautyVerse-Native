import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { IoMdArrowDropdown } from "react-icons/io";
import { FeedCard } from "../../feeds/components/feedCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const OpenedUserFeed = () => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  //define paths
  let parts = location.pathname.split("/");
  // feed id
  let feedId = parts[5];
  // back path
  parts.splice(5, 1);
  let backPath = parts.join("/");

  // define feed context
  const activeFeedObj = useSelector((state) => state.storeFeed.openedFeed);

  // if outlet context isnt defined get feed from db. this usually happens when user loads feed by link and data does not come from Outlet context;
  const [feedObj, setFeedObj] = useState(null);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const GetFeed = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/v1/feeds/" + feedId);
      setFeedObj(response.data.data.feed);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // with this state feeds open with scale and opacity
  const [openFeed, setOpenFeed] = useState(false);

  useEffect(() => {
    setOpenFeed(true);
    if (!activeFeedObj) {
      GetFeed();
    }
  }, []);

  let feed;
  if (activeFeedObj) {
    feed = activeFeedObj;
  } else {
    feed = feedObj;
  }

  return (
    <div
      style={{
        background: "rgba(1, 2, 12, 0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 1001,
        width: "100vw",
        height: "100%",
        position: "fixed",
        top: "0",
        left: "0",
      }}
    >
      <Container openFeed={openFeed ? "true" : "false"}>
        <Header>
          <div style={{ width: "30px" }}></div>
          <div>
            <h3
              style={{
                color: "#ccc",
                margin: 0,
                padding: 0,
                letterSpacing: "0.5px",
              }}
            >
              {feed.owner.name}
            </h3>
          </div>
          <div
            onClick={() => {
              setOpenFeed(false);
              setTimeout(() => {
                if (location.pathname?.startsWith("/profile")) {
                  navigate("/profile/feeds");
                } else {
                  navigate(backPath);
                }
              }, 300);
            }}
            style={{
              padding: "5px",

              zIndex: 1000,
            }}
          >
            <IoMdArrowDropdown size={30} color="#f866b1" />
          </div>
        </Header>
        <FeedCard item={feed} />
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 50px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateY(
    ${(props) => (props.openFeed === "true" ? 0 : "100vh")}
  );
  transition: ease-in 300ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
