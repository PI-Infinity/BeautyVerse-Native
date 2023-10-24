import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FeedCard } from "./components/feedCard";
import { BounceLoader } from "react-spinners";
import { Outlet } from "react-router-dom";
import { setPage, setScrollYFeeds, AddFeeds } from "../../redux/feeds";

export const FollowingsList = () => {
  // redux dispatch
  const dispatch = useDispatch();

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // feeds
  const loading = useSelector((state) => state.storeFeeds.loading);
  const page = useSelector((state) => state.storeFeeds.page);
  const feeds = useSelector((state) => state.storeFeeds.feeds);

  // adding feeds
  const AddUsersFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?page=${currentPage}&limit=3`
      );
      const newFeeds = response.data.data.feedlist;

      dispatch(AddFeeds(newFeeds));
      dispatch(setPage(currentPage));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYFeeds(scrollY));

      if (scrollY + innerHeight >= scrollHeight - 200) {
        await AddUsersFeeds(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  // scroll to top
  const scrollToTop = useSelector((state) => state.storeFeeds.scrollToTop);
  useEffect(() => {
    // Perform some action when scrollToTop is true
    window.scrollTo({ top: 0, behavior: "smooth" });

    // other logic you want to perform when scrollToTop changes
  }, [scrollToTop]);

  // refresh indicator
  const [refresh, setRefresh] = useState(false);
  const rerenderFeeds = useSelector((state) => state.storeFeeds.rerenderFeeds);
  useEffect(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  }, [rerenderFeeds]);

  return (
    <Container>
      <Outlet />
      {loading ? (
        <div
          style={{
            position: "fixed",
            top: "0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100vh",
          }}
        >
          <BounceLoader color={"#f866b1"} loading={loading} size={50} />
        </div>
      ) : (
        <>
          <div
            style={{
              height: refresh ? "60px" : 0,
              opacity: refresh ? 1 : 0,
              width: "100%",
              transition: "ease-in-out 300ms",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BounceLoader color={"#f866b1"} loading={refresh} size={30} />
          </div>

          {feeds?.map((item, index) => {
            return <FeedCard key={index} item={item} />;
          })}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-bottom: 8vh;
  overflow: hidden;
  box-sizing: border-box;
`;
