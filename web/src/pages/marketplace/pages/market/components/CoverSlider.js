import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Img1 from "../../../../../assets/sbts.jpg";
import Img2 from "../../../../../assets/dcolor.jpg";
import Img3 from "../../../../../assets/supersonic.jpg";

export const CoverSlider = () => {
  return (
    <div style={{ width: "96vw", borderRadius: "20px", overflow: "hidden" }}>
      <Carousel
        autoPlay={true}
        interval={3000}
        infiniteLoop={true}
        showArrows={false}
        showThumbs={false}
      >
        <div
          style={{
            width: window.innerWidth,
            height: window.innerWidth,
            overflow: "hidden",
          }}
        >
          <img
            src={Img1}
            style={{
              width: window.innerWidth,
              height: window.innerWidth,

              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            overflow: "hidden",
            width: window.innerWidth,
            height: window.innerWidth,
          }}
        >
          <img
            src={Img2}
            style={{
              width: window.innerWidth,
              height: window.innerWidth,

              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            overflow: "hidden",
            width: window.innerWidth,
            height: window.innerWidth,
          }}
        >
          <img
            src={Img3}
            style={{
              width: window.innerWidth,
              height: window.innerWidth,

              objectFit: "cover",
            }}
          />
        </div>
      </Carousel>
    </div>
  );
};
