import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { IoMdArrowDropdown } from "react-icons/io";
import { ProductItem } from "../../../marketplace/pages/product/productItem";

export const OpenedProductFromList = () => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();

  //define paths
  let parts = location.pathname.split("/");
  // product id
  let productId = parts[3];

  // define product context
  const activeProductObj = useSelector(
    (state) => state.storeMarketplace.openedProduct
  );
  // if outlet context isnt defined get product from db. this usually happens when user loads product by link and data does not come from Outlet context;
  const [product, setProduct] = useState(null);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const GetProduct = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/v1/marketplace/" + productId
      );
      setProduct(response.data.data.product);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // with this state feeds open with scale and opacity
  const [openProduct, setOpenProduct] = useState(false);

  useEffect(() => {
    setOpenProduct(true);
    if (!activeProductObj) {
      GetProduct();
    } else {
      setProduct(activeProductObj);
    }
  }, [activeProductObj]);

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
      <Container openproduct={openProduct ? "true" : "false"}>
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
              {product?.title}
            </h3>
          </div>
          <div
            onClick={() => {
              setOpenProduct(false);
              setTimeout(() => {
                navigate("/marketplace/" + "list");
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
        <ProductItem item={product} to="/marketplace/list/user" />
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
    ${(props) => (props.openproduct === "true" ? 0 : "100vh")}
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
