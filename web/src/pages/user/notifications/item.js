import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaComment,
  FaImage,
  FaShoppingBag,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setTargetUser } from "../../../redux/user";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { setRerenderNotifications } from "../../../redux/notifications";
import { BounceLoader } from "react-spinners";

export const NotificationItem = ({
  item,
  currentUser,
  setList,
  setOpenConfig,
}) => {
  // sender user state
  const [user, setUser] = useState(null);
  // navigator
  const navigate = useNavigate();
  // redux dispatch
  const dispatch = useDispatch();
  // loading
  const [loading, setLoading] = useState(true);
  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const GetUser = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/v1/users/" + item?.senderId
      );
      setUser(response.data.data.user);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * feed state
   * */
  const [feed, setFeed] = useState(null);
  // get feed from DB
  async function GetFeedObj() {
    try {
      if (item?.type !== "welcome" && item?.type !== "follow" && item.feed) {
        let response = await axios.get(
          backendUrl + `/api/v1/feeds/${feed}?check=${currentUser._id}`
        );

        setFeed(response.data.data.feed);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  /**
   * get product
   */

  const [product, setProduct] = useState(null);

  // Get product from DB
  async function GetProduct() {
    try {
      if (item?.type === "saveProduct") {
        let res = await axios.get(
          backendUrl + `/api/v1/marketplace/${item?.product}`
        );
        setProduct(res.data.data.product);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    GetUser();
    if (item?.feed) {
      GetFeedObj();
    } else if (item?.product) {
      GetProduct();
    }
  }, [item]);

  // define text
  const lang = useSelector((state) => state.storeApp.language);
  let text;
  if (item?.type === "star") {
    if (lang === "en") {
      text = "Added star on your feed";
    } else if (lang === "ru") {
      text = "Добавлена звезда к вашей ленте";
    } else if (lang === "ka") {
      text = "მიანიჭა ვარსკვლავი თქვენ პოსტს";
    }
  } else if (item?.type === "save") {
    if (lang === "en") {
      text = "Saved your feed";
    } else if (lang === "ru") {
      text = "Ваша лента сохранена";
    } else if (lang === "ka") {
      text = "შეინახა თქვენი პოსტი";
    }
  } else if (item?.type === "share") {
    if (lang === "en") {
      text = "Shared your feed";
    } else if (lang === "ru") {
      text = "Ваша лента поделилась";
    } else if (lang === "ka") {
      text = "გააზიარა თქვენი პოსტი";
    }
  } else if (item?.type === "review") {
    if (lang === "en") {
      text = "Reviewed your feed";
    } else if (lang === "ru") {
      text = "Ваша лента была просмотрена";
    } else if (lang === "ka") {
      text = "შეაფასა თქვენი პოსტი";
    }
  } else if (item?.type === "follow") {
    if (lang === "en") {
      text = "Started following you";
    } else if (lang === "ru") {
      text = "Начал следовать за вами";
    } else if (lang === "ka") {
      text = "გამოიწერა თქვენი გვერდი";
    }
  } else if (item?.type === "saveProduct") {
    if (lang === "en") {
      text = "Saved your product";
    } else if (lang === "ru") {
      text = "Сохранил ваш продукт";
    } else if (lang === "ka") {
      text = "შეინახა თქვენი პროდუქტი";
    }
  }

  const ReadNotification = async (id) => {
    try {
      setList((prev) => {
        return prev.map((item) => {
          // Check if the current item's _id matches the given id
          if (item?._id === id) {
            // Update the status of the matched notification to "read"
            return {
              ...item,
              status: "read",
            };
          }
          // If the item's _id doesn't match, return the item unchanged
          return item;
        });
      });
      // Check if the current user and the notifications list exist
      if (currentUser && currentUser.notifications) {
        // Update the specific notification's status to "read"
        currentUser.notifications = currentUser.notifications.map(
          (notification) => {
            if (notification?._id === id) {
              console.log(notification._id);
              return {
                ...notification,
                status: "read",
              };
            }
            return notification;
          }
        );

        // Save the updated user back to local storage
        localStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(currentUser)
        );
        dispatch(setRerenderNotifications());
      }

      // Send a request to the backend to update the notification's status
      await axios.patch(
        `${backendUrl}/api/v1/users/${currentUser?._id}/notifications/${id}`,
        {
          status: "read",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      onClick={() =>
        item?.status === "read" ? undefined : ReadNotification(item?._id)
      }
      style={{
        background:
          item?.status === "unread" ? "#f866b1" : "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Img
          onClick={
            !user
              ? undefined
              : () => {
                  dispatch(setTargetUser(user));
                  navigate(
                    "/profile/visit/" +
                      user?._id +
                      `${
                        user?.type === "shop"
                          ? "/showroom"
                          : user?.type === "user"
                          ? "/contact"
                          : "/feeds"
                      }`
                  );
                }
          }
        >
          {loading ? (
            <div>
              <BounceLoader color={"#f866b1"} loading={loading} size={30} />
            </div>
          ) : (
            <>
              {user?.cover?.length > 0 ? (
                <img
                  src={user?.cover}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <FaUserCircle size="40px" />
              )}
            </>
          )}
        </Img>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
            gap: "2px",
          }}
        >
          {loading ? (
            <div
              style={{
                height: "10px",
                width: "70%",
                background: "#f866b1",
                borderRadius: "10px",
                opacity: 0.5,
              }}
            ></div>
          ) : (
            <span
              onClick={
                !user
                  ? undefined
                  : () => {
                      dispatch(setTargetUser(user));
                      navigate(
                        "/profile/visit/" +
                          user?._id +
                          `${
                            user?.type === "shop"
                              ? "/showroom"
                              : user?.type === "user"
                              ? "/contact"
                              : "/feeds"
                          }`
                      );
                    }
              }
              style={{ color: "#ccc", fontWeight: "bold" }}
            >
              {user?.name ? user?.name : "Removed User"}
            </span>
          )}
          {loading ? (
            <div
              style={{
                height: "8px",
                width: "150px",
                background: "#f866b1",
                borderRadius: "10px",
                opacity: 0.5,
                margin: "2px 0 0 0",
              }}
            ></div>
          ) : (
            <span style={{ color: "#ccc", fontSize: "12px" }}>{text}</span>
          )}
        </div>
      </div>
      <div
        style={{
          marginRight: "8px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {(item?.type === "star" ||
          item?.type === "review" ||
          item?.type === "save" ||
          item?.type === "share") && (
          <FaImage
            size={16}
            color={item?.status === "unread" ? "#f1f1f1" : "#888"}
          />
        )}
        {item?.type === "saveProduct" && (
          <FaShoppingBag
            size={16}
            color={item?.status === "unread" ? "#f1f1f1" : "#888"}
          />
        )}

        <BiDotsVerticalRounded
          color="#888"
          size={18}
          onClick={() => setOpenConfig({ active: true, id: item._id })}
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px;
  box-sizing: border-box;
  width: 100%;
`;

const Img = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
