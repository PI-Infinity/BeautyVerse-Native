import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Language } from "../../context/language";
import { useEffect, useState } from "react";
import { setUserType } from "../../redux/auth";

export const Type = () => {
  // use redux toolkit dispatch
  const dispatch = useDispatch();

  //language context
  const language = Language();

  // navigation
  const navigate = useNavigate();

  // if not defined registered user lets navigate to login
  const currentUser = useSelector((state) => state.storeAuth.currentUser);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  // page animation transition
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
  }, []);

  return (
    <Container transition={transition ? "true" : "false"}>
      <Inputs>
        <Box
          onClick={() => {
            dispatch(setUserType("user"));
            navigate("/register/accept");
          }}
        >
          <h3>{language?.language?.Auth?.auth?.user}</h3>
          <p>{language?.language?.Auth?.auth?.userText}</p>
        </Box>
        <Box
          onClick={() => {
            dispatch(setUserType("specialist"));
            navigate("/register/services");
          }}
        >
          <h3>{language?.language?.Auth?.auth?.specialist}</h3>
          <p>{language?.language?.Auth?.auth?.specText}</p>
        </Box>
        <Box
          onClick={() => {
            dispatch(setUserType("beautycenter"));
            navigate("/register/services");
          }}
        >
          <h3>{language?.language?.Auth?.auth?.beautySalon}</h3>
          <p>{language?.language?.Auth?.auth?.salonText}</p>
        </Box>
        <Box
          onClick={() => {
            dispatch(setUserType("shop"));
            navigate("/register/accept");
          }}
        >
          <h3>{language?.language?.Auth?.auth?.shop}</h3>
          <p>{language?.language?.Auth?.auth?.shopText}</p>
        </Box>
      </Inputs>
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  right: ${(props) => (props.transition === "true" ? 0 : "-100vw")};
  opacity: ${(props) => (props.transition === "true" ? "1" : "0")};
  transition: ease-in-out 200ms;
`;
const Inputs = styled.div`
  width: 100%;
  height: 80vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const Box = styled.div`
  width: 75%;
  height: 100px;
  border-radius: 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  letter-spacing: 0.5px;
  background: rgba(1, 2, 12, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  & > h3 {
    color: #f866b1;
    margin: 0;
  }
  & > p {
    margin: 0;
    color: #888;
    font-size: 14px;
  }
`;
