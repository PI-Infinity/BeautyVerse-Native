import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Styled from "styled-components";
import { setTargetUser } from "../../../redux/user";
import { useDispatch } from "react-redux";
import GetTimesAgo from "../../../functions/getTimesAgo";
import { Language } from "../../../context/language";
import { GiStarShuriken, GiEarthAmerica } from "react-icons/gi";
import { AnimationSkelton } from "../../../components/animationSkelton";
import { VscVerifiedFilled } from "react-icons/vsc";

export const TopSection = ({ item }) => {
  // dnavigation
  const navigate = useNavigate();
  // redux dispatch
  const dispatch = useDispatch();
  // location
  const location = useLocation();
  // language
  const language = Language();

  const currentPostTime = GetTimesAgo(new Date(item.createdAt).getTime());

  let definedTime;
  if (currentPostTime?.includes("min")) {
    definedTime =
      currentPostTime?.slice(0, -3) + language?.language.Main.feedCard.min;
  } else if (currentPostTime?.includes("h")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.h;
  } else if (currentPostTime?.includes("d")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.d;
  } else if (currentPostTime?.includes("j")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.justNow;
  } else if (currentPostTime?.includes("w")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.w;
  } else if (currentPostTime?.includes("mo")) {
    definedTime =
      currentPostTime?.slice(0, -2) + language?.language.Main.feedCard.mo;
  } else if (currentPostTime?.includes("y")) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.y;
  }

  // image loading opacity
  const [opacity, setOpacity] = useState(false);

  // capitalize first letters function
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // capitalize and define user's type
  const t = capitalizeFirstLetter(item?.owner.type);

  let type;
  if (item.owner.type === "specialist") {
    type = t;
  } else if (item.owner.type === "shop") {
    type = t;
  } else {
    type = "Beauty Salon";
  }

  return (
    <Container>
      <ImageContainer
        onClick={() => {
          if (
            location.pathname?.includes("/user") ||
            location.pathname?.includes("/profile")
          ) {
            return undefined;
          } else {
            dispatch(setTargetUser(item.owner));
            navigate(
              `/feeds/user/${item.owner._id}/${
                item.owner.type === "shop" ? "showroom" : "feeds"
              }`
            );
          }
        }}
      >
        <AnimationSkelton height="45px" width="45px" borderRadius={50} />

        <Image
          src={item.owner?.cover}
          style={{ opacity: opacity ? 1 : 0, transition: "ease-in 500ms" }}
          onLoad={() => setOpacity(true)}
        />
      </ImageContainer>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <h3
              onClick={() => {
                if (
                  location.pathname?.includes("/user") ||
                  location.pathname?.includes("/profile")
                ) {
                  return undefined;
                } else {
                  dispatch(setTargetUser(item.owner));
                  navigate(
                    `/feeds/user/${item.owner._id}/${
                      item.owner.type === "shop" ? "showroom" : "feeds"
                    }`
                  );
                }
              }}
              style={{
                color: "#ccc",
                letterSpacing: "0.5px",
                padding: 0,
                margin: 0,
                fontSize: "16px",
              }}
            >
              {item.owner.name}
            </h3>
            {item.owner.subscription.status === "active" && (
              <VscVerifiedFilled color="#f866b1" size={14} />
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <GiStarShuriken size={10} color="#ccc" />
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <GiEarthAmerica size={12} color="#ccc" />
              <span
                style={{
                  color: "#ccc",
                  letterSpacing: "0.5px",
                  fontSize: "12px",
                }}
              >
                {definedTime}.
              </span>
            </div>
            <GiStarShuriken size={10} color="#ccc" />
          </div>
        </div>
        <span
          style={{ color: "#ccc", letterSpacing: "0.5px", fontSize: "14px" }}
        >
          {type}
        </span>
      </div>
    </Container>
  );
};

const Container = Styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  box-sizing: border-box;
  padding: 0 10px;
`;

const ImageContainer = Styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid #f866b1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = Styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  object-fit: cover;
  opacity: ${(props) => (props.opacity ? "1" : "0")};
`;
