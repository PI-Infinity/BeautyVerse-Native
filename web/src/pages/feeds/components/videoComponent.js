import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

const VideoComponent = ({ item, screenWidth, screenHeight, location }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    let observer;
    const currentRef = playerRef.current?.wrapper;

    if (currentRef) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const { isIntersecting, intersectionRatio } = entry;
            if (isIntersecting && intersectionRatio >= 0.33) {
              // Threshold is 1/3 visibility
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          });
        },
        { threshold: 0.33 } // Set the threshold to 1/3
      );

      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  // on click active controsl on video
  const [activeControls, setActiveControls] = useState(false);

  return (
    <div style={{ position: "relative", height: screenHeight }}>
      <ReactPlayer
        ref={playerRef} // Set ref to ReactPlayer
        url={item.video}
        width={screenWidth}
        height={screenHeight}
        playing={isPlaying}
        muted={true} // Ensure the video is muted, required for autoplaying on iOS
        loop={true}
        controls={activeControls}
        onClick={() => setActiveControls(true)}
        playsinline={true} // Required for autoplaying on iOS
        onReady={() => setIsLoading(false)}
        onError={() => setError("Error loading video")}
        style={{
          display: isLoading || error ? "none" : "block",
        }}
      />
    </div>
  );
};

export default VideoComponent;
