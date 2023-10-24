import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCards, setLoading, setPage } from "../redux/cards";

export const GetCards = () => {
  // getting feeds
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  // dispatch
  const dispatch = useDispatch();

  // define desktop or not
  const isDesktop = window.innerWidth >= 768;

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

  const GetCards = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/cards?search=${search}&filter=${categoryFilter}&type=${
          specialist ? "specialist" : ""
        }${beautyCenter ? "beautycenter" : ""}${
          shop ? "shop" : ""
        }&city=${city}&district=${district}&page=1&limit=${
          isDesktop ? "16" : "4"
        }&country=Georgia`
      );
      dispatch(setCards(response.data.data.cards));
      dispatch(setPage(1));
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    GetCards();
  }, [search, categoryFilter, city, district, specialist, shop, beautyCenter]);
};
