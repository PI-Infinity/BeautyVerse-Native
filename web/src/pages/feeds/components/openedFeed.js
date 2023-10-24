import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { FeedCard } from "../../feeds/components/feedCard";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Reviews } from "../../feeds/components/reviews";
import { IoMdArrowDropdown } from "react-icons/io";

export const OpenedFeed = () => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  //define paths
  let parts = location.pathname.split("/");
  // feed id
  let feedId = parts[1];

  // define feed context
  const activeFeedObj = useSelector((state) => state.storeFeed.openedFeed);

  // if outlet context isnt defined get feed from db. this usually happens when user loads feed by link and data does not come from Outlet context;
  const [feedObjs, setFeedObjs] = useState([]);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const GetFeed = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/v1/feeds/" + feedId);
      setFeedObjs((prev) => [...prev, response.data.data.feed]);
      GetUserFeeds(
        response.data.data.feed?._id,
        response.data.data.feed?.owner._id
      );
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  async function GetUserFeeds(feedId, userId) {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/${userId}/feeds?page=1&limit=3&check=`
      );

      if (response.data.data.feeds?.length > 0) {
        // Then, filter out any new feeds that have an ID already present in the set
        const newFeeds = response.data.data.feeds.filter(
          (feed) => feed?._id !== feedId
        );

        // Finally, set the state with the filtered new feeds
        setFeedObjs((prev) => [...prev, ...newFeeds]);
      }
      console.log();
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  // add feeds
  const [page, setPage] = useState(1);

  async function AddFeeds(p, userId) {
    console.log(p);
    console.log(userId);
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/${userId}/feeds?page=${p}&limit=3&check=`
      );
      if (response.data.data?.feeds?.length > 0) {
        setFeedObjs((prev) => {
          const newFeeds = response.data.data?.feeds;
          console.log(newFeeds);
          if (newFeeds) {
            const uniqueNewFeeds = newFeeds.filter(
              (newFeed) =>
                !prev.some((prevFeed) => prevFeed._id === newFeed._id)
            );

            return [...prev, ...uniqueNewFeeds];
          } else {
            return [...prev];
          }
        });
        setPage(p);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const scrollRef = useRef();

  useEffect(() => {
    const handleScroll = async () => {
      if (scrollRef.current) {
        const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
        // Triggered when we reach 200px above the bottom
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          // Here, you'd call your function to add more feeds
          await AddFeeds(page + 1, feedObjs[0]?.owner?._id); // Ensure 'AddFeeds' and 'page' are accessible here
        }
      }
    };

    // Assign the scroll event to the specific element
    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      // Cleanup - remove the event listener
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [page, feedObjs]);

  // with this state feeds open with scale and opacity
  const [openFeed, setOpenFeed] = useState(false);

  // if (openFeed) {
  //   document.body.style.overflow = "hidden";
  // } else {
  //   document.body.style.overflow = "visible";
  // }

  useEffect(() => {
    setOpenFeed(true);
    if (!activeFeedObj) {
      GetFeed();
    } else {
      setFeedObjs((prev) => [...prev, activeFeedObj]);
      GetUserFeeds(activeFeedObj?._id, activeFeedObj?.owner?._id);
    }
  }, []);

  /**
   * reviews
   */
  const [openReviews, setOpenReviews] = useState(true);

  useEffect(() => {
    // Disable body scroll when the component is open
    if (openFeed) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      // Re-enable body scroll when the component is closed
      document.body.style.overflow = "visible";
    };
  }, [openFeed]);

  return (
    <div
      style={{
        background: !openFeed ? "rgba(1, 2, 12, 0.2)" : "rgba(1, 2, 12, 0)",
        backdropFilter: "blur(10px)",
        webkitBackdropFilter: "blur(10px)",
        zIndex: 1001,
        position: "fixed",
        top: "0",
        left: "0",
        transition: "ease-in-out 220ms",
      }}
    >
      <Container openfeed={openFeed ? "true" : "false"} ref={scrollRef}>
        <Header>
          <div style={{ width: "30px" }}></div>
          <div>
            <h3 style={{ color: "#ccc", margin: 0, padding: 0 }}>Feeds</h3>
          </div>
          <div
            onClick={() => {
              setOpenFeed(false);
              setTimeout(() => {
                navigate("/feeds");
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

        {feedObjs?.map((item, index) => {
          return (
            <div key={index}>
              <FeedCard
                goToFeeds={() => {
                  setOpenFeed(false);
                  setTimeout(() => {
                    navigate("/feeds");
                  }, 300);
                }}
                item={item}
              />
              {openReviews && <Reviews item={item} />}
            </div>
          );
        })}
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 90vh;
  padding: 0 0 150px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateY(
    ${(props) => (props.openfeed === "true" ? 0 : "100vh")}
  );
  transition: ease-in 300ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
