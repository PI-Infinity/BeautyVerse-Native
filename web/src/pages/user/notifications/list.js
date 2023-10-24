import React from "react";
import styled from "styled-components";
import { NotificationItem } from "./item";

export const List = ({ list, setList, currentUser, setOpenConfig }) => {
  return (
    <Container>
      {list?.map((item, index) => {
        if (item) {
          return (
            <NotificationItem
              item={item}
              key={index}
              currentUser={currentUser}
              setList={setList}
              setOpenConfig={setOpenConfig}
            />
          );
        }
      })}
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px;
`;
