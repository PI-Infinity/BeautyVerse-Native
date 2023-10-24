import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useMatch,
  useLocation,
} from "react-router-dom";
import { setLoading, setScrollYUser } from "../../../redux/user";
import { BounceLoader } from "react-spinners";
import { FadeInImage } from "./fadeInIFeedmage";
import { FadeInVideo } from "./fadeInFeedVideo";
import { setOpenedFeed } from "../../../redux/feed";

export const UserFeeds = () => {
  // get outlet props context
  const [targetUser] = useOutletContext();

  // navigate
  const navigate = useNavigate();

  // location
  const location = useLocation();

  // redux dispatch
  const dispatch = useDispatch();

  // loading state
  const [feedsLoading, setFeedsLoading] = useState(true);

  // user feeds
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(1);

  // get user feeds
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  useEffect(() => {
    async function GetFeeds(id) {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/feeds/${id}/feeds?page=1&limit=8&check=`
        );

        setFeeds(response.data.data?.feeds);
        setPage(1);
        // setFeedsLength(response.data.result);
        setFeedsLoading(false);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    if (targetUser) {
      GetFeeds(targetUser?._id);
    }
  }, []);

  // add feeds
  async function AddFeeds(p) {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/${targetUser._id}/feeds?page=${p}&limit=8&check=`
      );
      setFeeds((prev) => {
        const newFeeds = response.data.data?.feeds;
        if (newFeeds) {
          const uniqueNewFeeds = newFeeds.filter(
            (newFeed) => !prev.some((prevFeed) => prevFeed._id === newFeed._id)
          );

          return [...prev, ...uniqueNewFeeds];
        } else {
          return [...prev];
        }
      });
      setPage(p);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYUser(scrollY));

      if (scrollY + innerHeight >= scrollHeight - 200) {
        await AddFeeds(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  return (
    <Container>
      {feedsLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "50vh",
          }}
        >
          <BounceLoader color={"#f866b1"} loading={feedsLoading} size={50} />
        </div>
      ) : (
        <>
          {feeds?.length > 0 ? (
            feeds?.map((item, index) => {
              return (
                <FeedItem
                  onClick={() => {
                    dispatch(setOpenedFeed(item));
                    if (location.pathname?.startsWith("/profile")) {
                      navigate(`/profile/feeds/${item._id}`);
                    } else {
                      navigate(
                        `/${location.pathname?.split("/")[1]}/user/${
                          targetUser?._id
                        }/feeds/${item._id}`
                      );
                    }
                  }}
                  key={index}
                >
                  {item?.fileFormat === "img" ? (
                    <FadeInImage src={item?.images[0]?.url} />
                  ) : (
                    <FadeInVideo src={item?.video} />
                  )}
                </FeedItem>
              );
            })
          ) : (
            <div
              style={{
                color: "red",
                width: "100vw",
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
              }}
            >
              No feeds found!
            </div>
          )}
        </>
      )}
      <Outlet />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5vw;
  padding: 0 2.25vw 0 2.25vw;
`;

const FeedItem = styled.div`
  width: 47vw;
  aspect-ratio: 1;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.9;
  }
`;
