import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { ProceduresOptions } from "../../../datas/registerDatas";
import { setSearch } from "../../../redux/cards";
import { useDispatch, useSelector } from "react-redux";

export const Search = () => {
  // redux dispatch
  const dispatch = useDispatch();

  // category filter
  const search = useSelector((state) => state.storeCards.search);

  // procedures list
  const procedures = ProceduresOptions();

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: animation ? 1 : 0,
      }}
    >
      <SearchContainer>
        <BsFillSearchHeartFill size={18} color="#ccc" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />

        {search?.length > 0 && (
          <MdClear
            size={18}
            color="red"
            onClick={() => dispatch(setSearch(""))}
          />
        )}
      </SearchContainer>
      {/* {search?.length > 0 && ( */}
      <AutoCompleteList
        style={{
          height:
            search?.length > 0 &&
            procedures?.filter((i) =>
              i.value?.toLowerCase().includes(search.toLowerCase())
            )?.length > 0 &&
            procedures?.filter((i) =>
              i.value?.toLowerCase().includes(search.toLowerCase())
            )?.length < 2
              ? "50px"
              : search?.length > 0 &&
                procedures?.filter((i) =>
                  i.value?.toLowerCase().includes(search.toLowerCase())
                )?.length > 1 &&
                procedures?.filter((i) =>
                  i.value?.toLowerCase().includes(search.toLowerCase())
                )?.length < 3
              ? "100px"
              : search?.length > 0 &&
                procedures?.filter((i) =>
                  i.value?.toLowerCase().includes(search.toLowerCase())
                )?.length > 3
              ? "150px"
              : "0",
        }}
      >
        {procedures
          ?.filter((i) =>
            i?.value?.toLowerCase()?.includes(search?.toLowerCase())
          )
          ?.map((item, index) => {
            return (
              <div key={index} onClick={() => dispatch(setSearch(item.label))}>
                <h4>{item.label}</h4>
              </div>
            );
          })}
      </AutoCompleteList>
      {/* )} */}
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
`;
const AutoCompleteList = styled.div`
  background: none;
  width: 90%;
  height: ${(props) => props.height};
  max-height: 150px;
  overflow-y: scroll;
  border-radius: 50px;
  padding: 0;
  border: none;
  font-size: 16px;
  padding-left: 10px;
  letter-spacing: 0.5px;
  color: #ccc;
  transition: ease 200ms;

  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`;
