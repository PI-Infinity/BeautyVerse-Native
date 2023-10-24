import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { ProceduresOptions } from "../../../../datas/registerDatas";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { BsListUl } from "react-icons/bs";

export const Search = ({
  search,
  setSearch,
  openFilter,
  setOpenFilter,
  total,
}) => {
  const location = useLocation();
  const source = location.state;
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  }, []);
  return (
    <div
      style={{
        width: animation ? "100%" : "30px",
        transition: "ease-in 200ms",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        opacity: animation ? 1 : 0,
      }}
    >
      <SearchContainer>
        <BsFillSearchHeartFill size={18} color="#ccc" />
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          autoFocus={source === "search" ? true : false}
          value={search}
        />
        {!openFilter && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <BsListUl
              color="#ccc"
              size={20}
              style={{
                opacity: animation ? 1 : 0,
                transition: "ease-in 500ms",
              }}
              onClick={() => setOpenFilter(!openFilter)}
            />
            {total > 0 && (
              <div
                style={{
                  color: "#ccc",
                  background: "red",
                  borderRadius: "50px",
                  width: "15px",
                  height: "15px",
                  fontSize: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {total}
              </div>
            )}
          </div>
        )}
      </SearchContainer>
    </div>
  );
};

const SearchContainer = styled.div`
  width: 90%;
  min-height: 30px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  @media only screen and (max-width: 600px) {
    margin-bottom: 0px;
  }
`;

const Input = styled.input`
  background: none;
  width: 100%;
  height: 30px;
  border-radius: 50px;
  padding: 0;
  border: none;
  font-size: 16px;
  padding-left: 10px;
  letter-spacing: 0.5px;
  color: #ccc;

  @media only screen and (max-width: 600px) {
    width: 90%;
    margin-bottom: 0px;
  }

  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
  &::placeholder {
    font-size: 14px;
  }
`;
