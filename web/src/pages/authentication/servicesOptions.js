import { TextField } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import { ProceduresOptions } from "../../datas/registerDatas";
import { MdClose, MdDone } from "react-icons/md";
import { BsArrowDownUp } from "react-icons/bs";

export const ServicesOptions = ({ value, setValue }) => {
  const [input, setInput] = useState("");
  const proceduresOptions = ProceduresOptions();
  const [listOpen, setListOpen] = useState(false);

  return (
    <Container>
      {value?.length > 0 && (
        <Choiced>
          {value?.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  maxWidth: "26%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  padding: "5px 8px",
                  border: "1px solid #f866b1",
                  borderRadius: "50px",
                  fontSize: "14px",
                  display: "flex",
                  letterSpacing: "0.5px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "red",
                    borderRadius: "50px",
                    marginLeft: "5px",
                  }}
                  onClick={() =>
                    setValue((prev) =>
                      prev.filter((f) => f.value !== item.value)
                    )
                  }
                >
                  <MdClose color="#ccc" size={16} />
                </div>
              </div>
            );
          })}
        </Choiced>
      )}
      <TextField
        id="outlined-basic"
        label="Choice Procedures..."
        variant="outlined"
        value={input}
        type="text"
        onChange={(e) => {
          setInput(e.target.value);
          setListOpen(true);
        }}
        onFocus={() => setListOpen(true)}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            height: "53px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.1)",
              borderRadius: "15px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f866b1",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f866b1",
            },
          },
          "& .MuiOutlinedInput-input": {
            borderRadius: "15px",
            color: "#ccc",
          },
          "& label": {
            color: "#888",
            fontSize: "14px",
            letterSpacing: "0.5px",
          },
          "& label.Mui-focused": {
            color: "#ccc",
            fontSize: "14px",
            letterSpacing: "0.5px",
          },
        }}
      />
      {listOpen &&
        proceduresOptions?.filter((i, x) =>
          i.label?.toLocaleLowerCase().includes(input?.toLowerCase())
        )?.length > 0 && (
          <ListWrapper>
            <div
              onClick={() => setListOpen(false)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BsArrowDownUp size={16} color="red" />
            </div>
            {proceduresOptions
              ?.filter((i, x) =>
                i.label?.toLocaleLowerCase().includes(input?.toLowerCase())
              )
              .map((item, index) => {
                return (
                  <ListItem
                    style={{
                      color: value.some((s) => s.value === item.value)
                        ? "#f866b1"
                        : "#ccc",
                    }}
                    key={index}
                    onClick={() => {
                      setValue(
                        (prev) =>
                          prev.some((s) => s.value === item.value)
                            ? prev.filter((f) => f.value !== item.value) // Remove 'item' if it's already in the array
                            : [...prev, item] // Add 'item' if it's not in the array
                      );
                    }}
                  >
                    {item.label}
                    {value.some((s) => s.value === item.value) && (
                      <MdDone size={18} color="#f866b1" />
                    )}
                  </ListItem>
                );
              })}
          </ListWrapper>
        )}
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  border: 1.5px solid #f866b1;
  border-radius: 10px;
  padding: 10px;
`;

const Choiced = styled.div`
  width: 100%;
  box-sizing: border-box;
  color: #ccc;
  letter-spacing: 0.5px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 5px 10px 5px;
`;

const ListWrapper = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #f866b1;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  margin-top: 10px;
  color: #ccc;
  letter-spacing: 0.5px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItem = styled.div`
  width: 100%;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;
