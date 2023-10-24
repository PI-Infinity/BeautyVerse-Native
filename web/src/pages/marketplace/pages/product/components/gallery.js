import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  width: 100%;
  padding-bottom: 15px;
`;

const ScrollView = styled.div`
  display: flex;
  overflow-x: scroll;
  width: 96vw;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  border-radius: 20px;
`;

const Image = styled.img`
  flex: 0 0 auto;
  width: 100vw;
  aspect-ratio: 1;
  scroll-snap-align: start;
`;

const DotsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 100%;
`;

const Dot = styled.div`
  width: ${(props) => (props.active === "true" ? "9px" : "7px")};
  height: ${(props) => (props.active === "true" ? "9px" : "7px")};
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const Gallery = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();

  const handleScroll = (event) => {
    const offsetX = event.target.scrollLeft;
    const index = Math.round(offsetX / window.innerWidth);
    if (index !== activeIndex) setActiveIndex(index);
  };

  useEffect(() => {
    const scrollView = scrollRef.current;
    const handleScrollEnd = () => {
      const offsetX = scrollView.scrollLeft;
      const index = Math.round(offsetX / window.innerWidth);
      const offset = index * window.innerWidth;
      scrollView.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    };
    scrollView.addEventListener("scrollend", handleScrollEnd);
    return () => scrollView.removeEventListener("scrollend", handleScrollEnd);
  }, []);

  const [opacity, setOpacity] = useState(true);

  useEffect(() => {
    setOpacity(false);
  }, []);

  return (
    <Container>
      <ScrollView ref={scrollRef} onScroll={handleScroll}>
        <Image
          src={product?.gallery[product?.cover]?.url}
          alt=""
          style={{
            opacity: opacity ? 0 : 1,
            transition: "ease-in 700ms",
            objectFit: "cover",
          }}
        />
        {product?.gallery?.map((item, index) => {
          if (index !== product?.cover)
            return (
              <Image
                src={item.url}
                alt=""
                key={item.url}
                style={{ objectFit: "cover" }}
              />
            );
        })}
      </ScrollView>
      {product?.gallery?.length > 1 && (
        <DotsContainer>
          {product?.gallery?.map((item, index) => {
            if (index < 15) {
              return (
                <Dot
                  key={index}
                  active={activeIndex === index ? "true" : "false"}
                  color="#ccc"
                />
              );
            }
          })}
        </DotsContainer>
      )}
    </Container>
  );
};

export default Gallery;
