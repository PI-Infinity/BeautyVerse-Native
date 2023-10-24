import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsListCheck } from "react-icons/bs";
import { MdDone } from "react-icons/md";
import { VerseCategories } from "../../../datas/categories";
import { useDispatch, useSelector } from "react-redux";
import {
  setBeautyCenter,
  setCategoryFilter,
  setCity,
  setDistrict,
  setShop,
  setSpecialist,
} from "../../../redux/cards";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import { MdChecklistRtl } from "react-icons/md";
import { FiType } from "react-icons/fi";
import { GiModernCity, GiVillage } from "react-icons/gi";

export const Filter = ({ setFilter, filter }) => {
  // redux dispatch
  const dispatch = useDispatch();

  // category filter
  const categoryFilter = useSelector(
    (state) => state.storeCards.categoryFilter
  );

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // location filters
  const activeCity = useSelector((state) => state.storeCards.city);
  const district = useSelector((state) => state.storeCards.district);
  const specialist = useSelector((state) => state.storeCards.specialist);
  const beautyCenter = useSelector((state) => state.storeCards.beautyCenter);
  const shop = useSelector((state) => state.storeCards.shop);

  // define active cities in BeautyVerse
  const [cities, setCities] = useState([]);

  // get cities from db function
  async function GetCities() {
    await fetch(`${backendUrl}/api/v1/cities?country=Georgia`)
      .then((response) => response.json())
      .then((data) => {
        setCities([...data.data.cities]);
      })
      .then(() => {})
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }

  useEffect(() => {
    GetCities();
  }, []);

  // define BeautyVerse's active districts by city
  const [loadDistricts, setLoadDistricts] = useState(false);

  const [districts, setDistricts] = useState([]);

  async function GetDistricts() {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/districts?city=${activeCity}`
      );
      if (response.data.data.districts?.length > 0) {
        setLoadDistricts(true);
        setDistricts([...response.data.data.districts]);
      } else {
        setDistricts([]);
        dispatch(setDistrict(""));
      }
      setTimeout(() => {
        setLoadDistricts(false);
      }, 500);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    if (activeCity) {
      GetDistricts();
    }
  }, [activeCity]);

  let filterBadge;
  if (categoryFilter !== "") {
    filterBadge = 1;
  } else {
    filterBadge = 0;
  }
  // city state
  let cityBadge;
  if (activeCity?.length > 0) {
    cityBadge = 1;
  } else {
    cityBadge = 0;
  }

  // district state
  let districtBadge;
  if (district !== "") {
    districtBadge = 1;
  } else {
    districtBadge = 0;
  }
  // specialist state
  let specialistBadge;
  if (!specialist) {
    specialistBadge = 1;
  } else {
    specialistBadge = 0;
  }
  // salon state
  let objectBadge;
  if (!beautyCenter) {
    objectBadge = 1;
  } else {
    objectBadge = 0;
  }
  // salon state
  let shopBadge;
  if (!shop) {
    shopBadge = 1;
  } else {
    shopBadge = 0;
  }
  // total of active variants of filter and creating total of badge
  const sum =
    filterBadge +
    cityBadge +
    districtBadge +
    specialistBadge +
    objectBadge +
    shopBadge;

  return (
    <div style={{ width: "100%" }}>
      {filter && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: "0",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background: "rgba(0, 0, 0, 0.2)",
          }}
        />
      )}
      <Container filter={filter ? "true" : "false"}>
        <div
          onClick={() => setFilter(!filter)}
          style={{
            width: "100%",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,1))",
            borderBottom: "2px solid #f866b1",
            position: "relative",
            bottom: "62px",
          }}
        >
          <div
            style={{
              width: "35px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f866b1",
              borderRadius: "5px 5px 0 0",
              border: "1.5px solid rgba(255,255,255,0.3)",
              position: "relative",
              top: "2px",
              zIndex: "-1px",
            }}
          >
            {sum > 0 && (
              <div
                style={{
                  backgroundColor: "#ccc",
                  position: "absolute",
                  zIndex: 1,
                  top: "-5px",
                  right: "-5px",
                  borderRadius: "50px",
                  width: "15px",
                  height: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {sum}
              </div>
            )}

            <BsListCheck color="#ccc" size={24} />
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflowY: "scroll",
            position: "absolute",
            top: "15px",
            zIndex: 100,
            paddingBottom: "100px",
          }}
        >
          {sum > 0 && (
            <div
              onClick={() => {
                dispatch(setCategoryFilter(""));
                dispatch(setCity(""));
                dispatch(setDistrict(""));
                dispatch(setSpecialist(true));
                dispatch(setBeautyCenter(true));
                dispatch(setShop(true));
              }}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                color: "red",
                letterSpacing: "0.5px",
                marginBottom: "2vw",
              }}
            >
              Clear
            </div>
          )}
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "10px",
              padding: "8px 15px 25px 15px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiType size={20} color="#ccc" />

              <h4
                style={{
                  color: "#ccc",
                  margin: "10px 4px",
                  padding: 0,
                  letterSpacing: "0.5px",
                }}
              >
                Type:
              </h4>
            </div>
            <div
              onClick={
                specialist
                  ? () => dispatch(setSpecialist(false))
                  : () => dispatch(setSpecialist(true))
              }
              style={{
                width: "50%",
                color: specialist ? "#f866b1" : "#ccc",
                letterSpacing: "0.5px",
                borderRadius: "50px",
                border: `1.5px solid ${
                  specialist ? "#f866b1" : "rgba(0,0,0,0)"
                }`,
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                fontSize: "14px",
              }}
            >
              <div>Specialists</div>
              {specialist && (
                <MdDone
                  size={16}
                  color="#f866b1"
                  style={{ position: "relative", right: "10px" }}
                />
              )}
            </div>
            <div
              onClick={
                beautyCenter
                  ? () => dispatch(setBeautyCenter(false))
                  : () => dispatch(setBeautyCenter(true))
              }
              style={{
                width: "50%",
                color: beautyCenter ? "#f866b1" : "#ccc",
                border: `1.5px solid ${
                  beautyCenter ? "#f866b1" : "rgba(0,0,0,0)"
                }`,
                padding: "4px 8px",
                letterSpacing: "0.5px",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                fontSize: "14px",
              }}
            >
              <div>Beauty Salons</div>
              {beautyCenter && (
                <MdDone
                  size={16}
                  color="#f866b1"
                  style={{ position: "relative", right: "10px" }}
                />
              )}
            </div>
            <div
              onClick={
                shop
                  ? () => dispatch(setShop(false))
                  : () => dispatch(setShop(true))
              }
              style={{
                width: "50%",
                color: shop ? "#f866b1" : "#ccc",
                letterSpacing: "0.5px",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                fontSize: "14px",
                border: `1.5px solid ${shop ? "#f866b1" : "rgba(0,0,0,0)"}`,
                padding: "4px 8px",
              }}
            >
              <div>Shops</div>
              {shop && (
                <MdDone
                  size={16}
                  color="#f866b1"
                  style={{ position: "relative", right: "10px" }}
                />
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "15px",
            }}
          >
            <MdChecklistRtl size={20} color="#ccc" />

            <h4
              style={{
                color: "#ccc",
                margin: "10px 4px",
                padding: 0,
                letterSpacing: "0.5px",
              }}
            >
              Categories:
            </h4>
          </div>
          {VerseCategories?.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => dispatch(setCategoryFilter(item.value))}
                style={{
                  color: item.value === categoryFilter ? "#f866b1" : "#ccc",
                  letterSpacing: "0.5px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  padding: "8px",
                  paddingLeft: "20px",
                  borderRadius: "50px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                {item?.eng}
                {item.value === categoryFilter && (
                  <MdDone
                    size={16}
                    color="#f866b1"
                    style={{ position: "relative", right: "10px" }}
                  />
                )}
              </div>
            );
          })}
          {loadDistricts ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "15px 0",
              }}
            >
              <BounceLoader
                size={20}
                color={"#f866b1"}
                loading={loadDistricts}
              />
            </div>
          ) : (
            <>
              {districts?.length > 0 && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    marginTop: "10px",
                    boxSizing: "border-box",
                    padding: "8px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <GiVillage size={18} color="#ccc" />
                    <h4
                      style={{
                        color: "#ccc",
                        margin: "8px",
                        padding: 0,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Districts:
                    </h4>
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    {districts?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={
                            district?.length > 0
                              ? () => dispatch(setDistrict(""))
                              : () => dispatch(setDistrict(item))
                          }
                          style={{
                            color:
                              district?.toLowerCase() === item?.toLowerCase()
                                ? "#f866b1"
                                : "#ccc",
                            padding: "6px 15px",
                            borderRadius: "50px",
                            background: "rgba(0,0,0,0.5)",
                            margin: "10px",
                            fontSize: "14px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "10px",
              marginTop: "10px",
              boxSizing: "border-box",
              padding: "8px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <GiModernCity size={18} color="#ccc" />
              <h4
                style={{
                  color: "#ccc",
                  margin: "8px",
                  padding: 0,
                  letterSpacing: "0.5px",
                }}
              >
                City:
              </h4>
            </div>
            <div style={{ marginTop: "15px" }}>
              {cities?.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={
                      activeCity?.length > 0 &&
                      activeCity?.toLowerCase() === item?.toLowerCase()
                        ? () => {
                            dispatch(setCity(""));
                            setDistricts([]);
                          }
                        : () => dispatch(setCity(item))
                    }
                    style={{
                      color:
                        activeCity?.toLowerCase() === item?.toLowerCase()
                          ? "#f866b1"
                          : "#ccc",
                      padding: "6px 15px",
                      borderRadius: "50px",
                      background: "rgba(0,0,0,0.5)",
                      margin: "10px",
                      fontSize: "14px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100%;
  height: 65vh;
  background: rgba(0, 0, 0, 0.9);
  position: fixed;
  bottom: ${(props) => (props.filter === "true" ? "0" : "-59vh")};
  transition: ease-in-out 400ms;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding-bottom: ${(props) => (props.filter === "true" ? "50px" : "0")};
`;
