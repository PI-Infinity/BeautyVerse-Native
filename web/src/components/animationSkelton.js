import React from "react";
import { styled, keyframes } from "@mui/system";

export const AnimationSkelton = ({ height, width, borderRadius }) => {
  const pulse = keyframes`
  0% {
    background-color: rgba(255,255,255,0.05); 
    
  }
  50% {
    background-color: rgba(255,255,255,0.2); 
    
  }
  100% {
    background-color: rgba(255,255,255,0.05); 
    
  }
  `;

  const ColoredAnimatedSkeleton = styled("div")`
    width: ${width};
    height: ${height};
    border-radius: ${borderRadius}px;
    animation: ${pulse} 1.5s ease-in-out infinite;
    position: absolute;
    transition: ease-in 1500ms;
    z-index: -1;
    max-height: 640px;
    overflow: hidden;
  `;
  return <ColoredAnimatedSkeleton />;
};
