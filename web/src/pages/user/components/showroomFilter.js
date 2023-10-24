import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { ProceduresOptions } from "../../../datas/registerDatas";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { FormControl, Radio, RadioGroup, TextField } from "@mui/material";
import { BounceLoader } from "react-spinners";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  setCategories,
  setMaxPrice,
  setMinPrice,
  setBrands,
  setDiscounts,
  setSex,
  setType,
} from "../../../redux/showroom";

export const Filter = ({
  openFilter,
  setOpenFilter,
  categories,
  brands,
  minPrice,

  maxPrice,

  categoryFilter,

  discounts,

  type,

  sex,

  brand,

  total,
}) => {
  // dispatch
  const dispatch = useDispatch();
  // categories
  const categoriesList = ProceduresOptions();
  // loading categories
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // This function handles changes for both checkboxes.
  const handleCheckboxChange = (newDiscount) => {
    if (discounts === newDiscount) {
      // If clicking the already checked box, uncheck it.
      dispatch(setDiscounts(""));
    } else {
      // Otherwise, check the new box.
      dispatch(setDiscounts(newDiscount));
    }
  };
  // This function handles changes for both checkboxes.
  const handleCheckboxChangeSex = (newSex) => {
    if (sex === newSex) {
      // If clicking the already checked box, uncheck it.
      dispatch(setSex("all"));
    } else {
      // Otherwise, check the new box.
      dispatch(setSex(newSex));
    }
  };

  return (
    <div
      style={{
        width: "95%",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Container
        style={{
          transition: "ease-in 300ms",
          overflow: "hidden",
          height: openFilter ? "60vh" : "0",
          width: openFilter ? "100%" : "0",
          overflowY: "scroll",
          border: "1.5px solid rgba(255,255,255,0.05)",
          padding: openFilter ? "15px 8px" : "0",
          boxShadow:
            "inset 0 30px 30px -10px rgba(0,0,0,0.4), inset 0 -30px 30px -10px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "35px",
            top: "15px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            opacity: openFilter ? 1 : 0,
            transition: "ease-in 200ms",
          }}
        >
          {total > 0 && (
            <div
              style={{
                color: "#ccc",
                letterSpacing: "0.5px",
                fontSize: "14px",
              }}
              onClick={() => {
                dispatch(setCategories([]));
                dispatch(setBrands(""));
                dispatch(setDiscounts(""));
                dispatch(setMinPrice(""));
                dispatch(setMaxPrice(""));
                dispatch(setSex("all"));
                dispatch(setType("everyone"));
              }}
            >
              Clear
            </div>
          )}
          {total > 0 && (
            <div
              style={{
                position: "absolute",
                color: "#ccc",
                right: "30px",
                top: "-5px",
                background: "red",
                borderRadius: "50px",
                width: "15px",
                height: "15px",
                fontSize: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                dispatch(setCategories([]));
                dispatch(setBrands(""));
                dispatch(setDiscounts(""));
                dispatch(setMinPrice(""));
                dispatch(setMaxPrice(""));
                dispatch(setSex("all"));
                dispatch(setType("everyone"));
              }}
            >
              {total}
            </div>
          )}
          <MdOutlineCloseFullscreen
            onClick={() => setOpenFilter(false)}
            size={20}
            color="#ccc"
          />
        </div>
        <div
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                color: "#f866b1",
                letterSpacing: "0.5px",
                fontSize: "16px",
              }}
            >
              Categories:
            </span>
          </div>
          {loading ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: "8px 0",
              }}
            >
              <BounceLoader color={"#f866b1"} loading={loading} size={20} />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                margin: "10px 0 0 0",
              }}
            >
              {categories?.map((item, index) => {
                let lab = categoriesList.find(
                  (i, x) =>
                    i.value?.toLocaleLowerCase() === item?.toLocaleLowerCase()
                ).label;
                return (
                  <div
                    key={index}
                    onClick={
                      categoryFilter?.includes(item)
                        ? () =>
                            dispatch(
                              setCategories(
                                categoryFilter.filter((i, x) => i !== item)
                              )
                            )
                        : () =>
                            dispatch(setCategories([...categoryFilter, item]))
                    }
                    style={{
                      padding: "6px 10px",

                      borderRadius: "50px",
                      border: `1px solid  ${
                        categoryFilter.includes(item)
                          ? "#f866b1"
                          : "rgba(255,255,255,0.1)"
                      }`,
                      width: "85%",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        letterSpacing: "0.3px",
                        color: "#ccc",
                        fontSize: "14px",
                      }}
                    >
                      {lab}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                color: "#f866b1",
                letterSpacing: "0.5px",
                fontSize: "16px",
              }}
            >
              Type:
            </span>
          </div>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="everyone"
              name="radio-buttons-group"
              onChange={(e) => dispatch(setType(e.target.value))}
            >
              <FormControlLabel
                value="everyone"
                sx={{
                  color: "#ccc",
                  "&.Mui-checked": {
                    color: "#ccc",
                  },
                }}
                control={
                  <Radio
                    sx={{
                      color: "#f866b1",
                      "&.Mui-checked": {
                        color: "#f866b1",
                      },
                    }}
                  />
                }
                label="For Everyone"
              />
              <FormControlLabel
                value="professionals"
                sx={{
                  color: "#ccc",
                  "&.Mui-checked": {
                    color: "#ccc",
                  },
                }}
                control={
                  <Radio
                    sx={{
                      color: "#f866b1",
                      "&.Mui-checked": {
                        color: "#f866b1",
                      },
                    }}
                  />
                }
                label="For Professionals"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                color: "#f866b1",
                letterSpacing: "0.5px",
                fontSize: "16px",
              }}
            >
              Brands:
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              margin: "10px 0 0 0",
            }}
          >
            {brands?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={
                    brand?.includes(item) && brands?.length > 1
                      ? () =>
                          dispatch(
                            setBrands(brand.filter((i, x) => i !== item))
                          )
                      : brands?.length > 1
                      ? () => dispatch(setBrands([...brand, item]))
                      : undefined
                  }
                  style={{
                    padding: "4px 8px",
                    paddingHorizontal: "15px",
                    borderRadius: "50px",
                    border: `1px solid  ${
                      brand.includes(item) ? "#f866b1" : "rgba(0,0,0,0)"
                    }`,
                    width: "85%",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      letterSpacing: "0.3px",
                      color: brands?.length > 1 ? "#ccc" : "#888",
                      fontSize: "14px",
                    }}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                color: "#f866b1",
                letterSpacing: "0.5px",
                fontSize: "16px",
              }}
            >
              Price Range:
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              width: "100%",
              margin: "12px 0 0 0",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Min price"
              variant="outlined"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              onChange={(e) => dispatch(setMinPrice(e.target.value))}
              sx={{
                width: "43%",
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
                },
                "& label.Mui-focused": {
                  color: "#ccc",
                  fontSize: "14px",
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Max price"
              variant="outlined"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              onChange={(e) => dispatch(setMaxPrice(e.target.value))}
              sx={{
                width: "43%",

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
                },
                "& label.Mui-focused": {
                  color: "#ccc",
                  fontSize: "14px",
                },
              }}
            />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                color: "#f866b1",
                letterSpacing: "0.5px",
                fontSize: "16px",
              }}
            >
              Discounts:
            </span>
          </div>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={discounts === "with"}
                  onChange={() => handleCheckboxChange("with")}
                  sx={{
                    color: "#f866b1",
                    "&.Mui-checked": {
                      color: "#f866b1",
                    },
                  }}
                />
              }
              label="Only With"
              sx={{
                color: "#ccc",
                "&.Mui-checked": {
                  color: "#ccc",
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={discounts === "without"}
                  onChange={() => handleCheckboxChange("without")}
                  sx={{
                    color: "#f866b1",
                    "&.Mui-checked": {
                      color: "#f866b1",
                    },
                  }}
                />
              }
              label="Only Without"
              sx={{
                color: "#ccc",
                "&.Mui-checked": {
                  color: "#ccc",
                },
              }}
            />
          </FormGroup>
        </div>
        <div
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                color: "#f866b1",
                letterSpacing: "0.5px",
                fontSize: "16px",
              }}
            >
              Sex:
            </span>
          </div>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sex === "women"}
                  onChange={() => handleCheckboxChangeSex("women")}
                  sx={{
                    color: "#f866b1",
                    "&.Mui-checked": {
                      color: "#f866b1",
                    },
                  }}
                />
              }
              label="Women"
              sx={{
                color: "#ccc",
                "&.Mui-checked": {
                  color: "#ccc",
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={sex === "men"}
                  onChange={() => handleCheckboxChangeSex("men")}
                  sx={{
                    color: "#f866b1",
                    "&.Mui-checked": {
                      color: "#f866b1",
                    },
                  }}
                />
              }
              label="Men"
              sx={{
                color: "#ccc",
                "&.Mui-checked": {
                  color: "#ccc",
                },
              }}
            />
          </FormGroup>
        </div>
      </Container>
    </div>
  );
};

const Container = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
  border-radius: 20px;
  margin-bottom: 8px;
`;
