import React from "react";
import styled from "styled-components";
import { ProceduresOptions } from "../../../../../datas/registerDatas";

export const Categories = ({ product }) => {
  const categoriesList = ProceduresOptions();
  return (
    <Container>
      <div>Categories:</div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {product.categories?.map((i, x) => {
          let lab = categoriesList?.find((it, ix) => it.value === i).label;
          return (
            <h2
              key={x}
              style={{
                letterSpacing: "0.5px",
                margin: 0,
                fontSize: "14px",
                color: "#f866b1",
              }}
            >
              - {lab}
            </h2>
          );
        })}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 0 10px 0;
  font-size: 14px;
`;
