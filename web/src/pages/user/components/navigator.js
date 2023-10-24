import React from "react";
import { Location, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

export const Navigator = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active =
    location.pathname.split("/")[location.pathname.split("/")?.length - 1];

  return (
    <Container>
      {NavigatorItems?.map((item, index) => {
        if (item.title === "Showroom" && user?.type !== "shop") {
          return;
        }
        if (item.title === "Procedures" && user?.type === "shop") {
          return;
        }
        if (
          (item.title === "Feeds" ||
            item.title === "Procedures" ||
            item.title === "Products" ||
            item.title === "Statistics" ||
            item.title === "Working Info") &&
          user?.type === "user"
        ) {
          return;
        }
        return (
          <Item
            active={active}
            path={item.path}
            key={index}
            onClick={
              active === item.path ? undefined : () => navigate(item.path)
            }
          >
            {item.title}
          </Item>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  height: 40px;
  // width: 100%;
  overflow-x: scroll;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 3vw 0 1vw 0;
  padding-left: 10px;
  padding-right: 20px;

  &::-webkit-scrollbar {
    display: none !important;
  }
`;

const Item = styled.div`
  color: #ccc;
  letter-spacing: 0.5px;
  font-size: 16px;
  font-weight: bold;
  border: 1.5px solid
    ${(props) =>
      props.active === props.path ? "#f866b1" : "rgba(255,255,255,0.01)"};
  border-radius: 50px;
  padding: 4px 10px;
  white-space: nowrap;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    opacity: 0.8;
  }
`;

const NavigatorItems = [
  {
    title: "Showroom",
    icon: "",
    path: "showroom",
  },
  {
    title: "Feeds",
    icon: "",
    path: "feeds",
  },
  {
    title: "Contact",
    icon: "",
    path: "contact",
  },
  {
    title: "Procedures",
    icon: "",
    path: "procedures",
  },
  {
    title: "Working Info",
    icon: "",
    path: "workinginfo",
  },
];
