import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import styled from "styled-components";
import { AddCards, setPage, setScrollYCards } from "../../redux/cards";
import { Card } from "./components/card";
import { Filter } from "./components/filter";
import { Search } from "./components/search";

/**
 *
 * @returns Feeds list page component
 */

export const Cards = () => {
  // loading state
  const loading = useSelector((state) => state.storeCards.loading);
  // redux dispatch
  const dispatch = useDispatch();
  // define desktop or not
  const isDesktop = window.innerWidth >= 768;
  // getting feeds list
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // fo to saved scroll y position
  const scrollYPosition = useSelector((state) => state.storeCards.scrollY);
  useEffect(() => {
    window.scrollTo(0, scrollYPosition);
  }, []);

  // getting data step by step page state
  const page = useSelector((state) => state.storeCards.page);

  const cards = useSelector((state) => state.storeCards.cards);

  // getting data step by step page state
  const search = useSelector((state) => state.storeCards.search);
  const categoryFilter = useSelector(
    (state) => state.storeCards.categoryFilter
  );
  const city = useSelector((state) => state.storeCards.city);
  const district = useSelector((state) => state.storeCards.district);
  const specialist = useSelector((state) => state.storeCards.specialist);
  const beautyCenter = useSelector((state) => state.storeCards.beautyCenter);
  const shop = useSelector((state) => state.storeCards.shop);

  const [filter, setFilter] = useState(false);

  // if filter active made body overflow hidden
  document.body.style.overflow = !filter ? "visible" : "hidden";

  // Function to add users with cards from the API
  const AddUsersCards = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/cards?search=${search}&filter=${categoryFilter}&type=${
          specialist ? "specialist" : ""
        }${beautyCenter ? "beautycenter" : ""}${
          shop ? "shop" : ""
        }&city=${city}&district=${district}&page=${currentPage}&limit=${
          isDesktop ? "16" : "4"
        }&country=Georgia`
      );

      const newCards = response.data.data.cards;

      dispatch(AddCards(newCards));
      dispatch(setPage(currentPage));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYCards(scrollY));

      if (scrollY + innerHeight >= scrollHeight) {
        await AddUsersCards(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  // scroll to top
  const scrolltoTop = useSelector((state) => state.storeApp.scrolltoTop);
  const firstLoadScroll = useRef(true);
  useEffect(() => {
    if (firstLoadScroll.current) {
      firstLoadScroll.current = false;
      return;
    }
    // Perform some action when scrolltoTop is true
    window.scrollTo({ top: 0, behavior: "smooth" });

    // other logic you want to perform when scrolltoTop changes
  }, [scrolltoTop]);

  // refresh indicator
  const [refresh, setRefresh] = useState(false);
  const rerenderCards = useSelector((state) => state.storeCards.rerenderCards);
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  }, [rerenderCards]);

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
              position: "relative",
              bottom: "10px",
            }}
          >
            <BounceLoader color={"#f866b1"} loading={refresh} size={30} />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              // justifyContent: "center",
            }}
          >
            <Search />
          </div>

          <ListComponent>
            {cards?.map((item, index) => {
              return <Card key={index} item={item} />;
            })}
          </ListComponent>
        </>
      )}

      {!loading && <Filter filter={filter} setFilter={setFilter} />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.3);

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    padding-top: 2vh;
    padding-bottom: 80px;
  }
`;
const ListComponent = styled.div`
  width: 90%;

  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  padding-bottom: 30px;
  align-items: start;

  @media only screen and (max-width: 600px) {
    width: 100%;
    overflow-y: scroll;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
    padding-horizontal: 3px;
    padding-bottom: 20px;
  }
`;
