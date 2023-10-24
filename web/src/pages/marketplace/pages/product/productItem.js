import React from "react";
import styled from "styled-components";
import Gallery from "../product/components/gallery";
import { useSelector } from "react-redux";
import { Shop } from "../product/components/shop";
import { Brand } from "../product/components/brand";
import { Categories } from "../product/components/categories";
import { Price } from "../product/components/price";
import { InStock } from "../product/components/inStock";
import { Type } from "../product/components/type";
import { ShortDescription } from "../product/components/shortDescription";
import { Variants } from "../product/components/variants";
import { FullDescription } from "../product/components/fullDescription";
import { HowToUse } from "../product/components/howToUse";
import { Compositions } from "../product/components/compositions";

export const ProductItem = ({ item, to }) => {
  const product =
    useSelector((state) => state.storeMarketplace.openedProduct) || item;

  return (
    <Container>
      <Gallery product={product} />
      <Info>
        {product?.owner && <Shop product={product} to={to} />}
        {product?.brand && <Brand product={product} />}
        {product?.categories && <Categories product={product} />}
        {product?.price && <Price product={product} />}
        {product?.inStock && <InStock product={product} />}
        {product?.type === "professionals" && <Type product={product} />}
        {(product?.shortDescription?.en?.length > 0 ||
          product?.shortDescription?.ru?.length > 0 ||
          product?.shortDescription?.ka?.length > 0) && (
          <ShortDescription product={product} />
        )}
        {product?.variants?.length > 0 && <Variants product={product} />}
        {(product?.description?.en?.length > 0 ||
          product?.description?.ru?.length > 0 ||
          product?.description?.ka?.length > 0) && (
          <FullDescription product={product} />
        )}
        {(product?.howToUse?.en?.length > 0 ||
          product?.howToUse?.ru?.length > 0 ||
          product?.howToUse?.ka?.length > 0) && <HowToUse product={product} />}
        {(product?.composition?.en?.length > 0 ||
          product?.composition?.ru?.length > 0 ||
          product?.composition?.ka?.length > 0) && (
          <Compositions product={product} />
        )}
      </Info>
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 30px;
`;

const Info = styled.div`
  box-sizing: border-box;
  padding: 15px 25px;
  font-size: 16px;
  color: #ccc;
  letter-spacing: 0.5px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 15px;

  div {
    display: flex;
    gap: 15px;
  }
`;
