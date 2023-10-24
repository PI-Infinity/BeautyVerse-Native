import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductCard } from "../../../marketplace/pages/market/components/productCard";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import { setScrollYList } from "../../../../redux/marketplace";

export const List = () => {
  // fo to saved scroll y position
  const scrollYPosition = useSelector(
    (state) => state.storeMarketplace.scrollYList
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (scrollYPosition > 100) {
        window.scrollTo(0, scrollYPosition);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [loading]);

  const [list, setList] = useState([]);

  const activeList = useSelector((state) => state.storeMarketplace.activeList);

  useEffect(() => {
    if (activeList?.length > 0) {
      setList(activeList);
    } else {
      const GetProducts = async () => {
        try {
          const response = await axios.get(
            backendUrl + "/api/v1/marketplace" + "?check=&page=1"
          );
          if (response.data.data.products?.random) {
            setList(response.data.data.products.random);
          }
        } catch (error) {
          console.log("Error fetching products:", error.response.data.message);
        }
      };
      GetProducts();
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  // dispatch
  const dispatch = useDispatch();

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  //  pages
  const [page, setPage] = useState(1);

  // add products on scroll
  const AddProducts = async (p) => {
    try {
      const response = await axios.get(
        backendUrl + "/api/v1/marketplace" + "?page=" + p
      );
      const newProducts = response.data.data.products.random;

      if (newProducts?.length > 0) {
        setList((prev) => {
          // Filter out new products that are already in the previous list
          const filteredNewProducts = newProducts.filter(
            (newProduct) =>
              !prev.some((prevProduct) => prevProduct._id === newProduct._id)
          );

          // Return the merged array
          return [...prev, ...filteredNewProducts];
        });

        setPage(p);
      }
    } catch (error) {
      console.log("Error fetching user products:", error);
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYList(scrollY));

      if (scrollY + innerHeight >= scrollHeight) {
        await AddProducts(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  return (
    <Container>
      <div
        style={{
          width: "100%",
          color: "#ccc",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "1.5px",
            width: "25vw",
            background: "rgba(255,255,255,0.1)",
          }}
        ></div>
        Popular Products
        <div
          style={{
            height: "1.5px",
            width: "25vw",
            background: "rgba(255,255,255,0.1)",
          }}
        ></div>
      </div>
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
        <ListContainer>
          {list?.map((item, index) => {
            return (
              <ProductCard
                item={item}
                key={index}
                to={`/marketplace/list/${item._id}`}
              />
            );
          })}
        </ListContainer>
      )}
      <Outlet />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 15px 0 50px 0;
`;

const ListContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 15px 15px 15px;
  gap: 15px;
`;
