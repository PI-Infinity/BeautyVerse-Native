import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { BounceLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { setTargetUser } from "../../../redux/user";

export const Reviews = ({ item }) => {
  const [loading, setLoading] = useState(true);
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsLength, setReviewsLength] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  useEffect(() => {
    const GetReviews = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/v1/feeds/${item?._id}/reviews?page=${1}`
        );
        setReviewsList(response.data.data.reviews);
        setReviewsLength(response.data.result);
        setLoading(false);
      } catch (error) {
        console.log("error");
        console.log(error.response.data.message);
      }
    };

    GetReviews();
  }, [item]);
  return (
    <>
      {loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "15px 0",
          }}
        >
          <BounceLoader color={"#f866b1"} loading={loading} size={30} />
        </div>
      ) : (
        <>
          {reviewsLength > 0 && (
            <Container>
              <div
                style={{
                  color: "#ccc",
                  fontSize: "14px",
                  letterSpacing: "0.3px",
                }}
              >
                Comments: ({reviewsLength})
              </div>
              <div style={{ marginTop: "15px" }}>
                {reviewsList?.map((itm, x) => {
                  return (
                    <div key={x} style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <div
                          onClick={() => {
                            dispatch(setTargetUser(item.owner));
                            navigate(
                              `/feeds/user/${item.owner._id}/${
                                item.owner.type === "shop"
                                  ? "products"
                                  : "feeds"
                              }`
                            );
                          }}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50px",
                            overflow: "hidden",
                            background: "rgba(255,255,255,0.1)",
                          }}
                        >
                          <img
                            src={itm.reviewer?.cover}
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div
                          onClick={() => {
                            dispatch(setTargetUser(item.owner));
                            navigate(
                              `/feeds/user/${item.owner._id}/${
                                item.owner.type === "shop"
                                  ? "products"
                                  : "feeds"
                              }`
                            );
                          }}
                          style={{
                            color: "#ccc",
                            fontSize: "14px",
                            fontWeight: "bold",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {itm.reviewer.name}
                        </div>
                      </div>
                      <p
                        style={{
                          color: "#ccc",
                          background: "rgba(255,255,255,0.1)",
                          boxSizing: "border-box",
                          padding: "4px 15px",
                          borderRadius: "50px",
                          fontSize: "14px",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {itm.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Container>
          )}
        </>
      )}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 300px;
  min-height: 300px;
  box-sizing: border-box;
  padding: 15px;
  margin-bottom: 50px;
`;
