import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  Image,
  View,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector } from "react-redux";
import { Circle } from "../../components/skeltons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CoverSlider = () => {
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();

  const images = [
    require("../../assets/supersonic.jpg"),
    require("../../assets/sbts.jpg"),
    require("../../assets/dcolor.jpg"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % (images.length + 1);
      scrollRef.current.scrollTo({
        x: (SCREEN_WIDTH - 20) * nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);
    const isNoMansLand = 0.1 < distance;

    if (roundIndex === images.length && !isNoMansLand) {
      setActiveIndex(0);
      scrollRef.current.scrollTo({
        x: 0,
        animated: false,
      });
    } else {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ borderRadius: 20 }}
      >
        {images.map((image, index) => (
          <Img image={image} key={index} />
        ))}
        {/* Duplicate First Image */}
        <View style={{ width: SCREEN_WIDTH - 20, height: SCREEN_WIDTH }}>
          <Image
            source={images[0]}
            style={{ width: SCREEN_WIDTH - 20, height: SCREEN_WIDTH }}
          />
        </View>
      </ScrollView>
      <View style={styles.dotContainer}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  activeIndex === i ? currentTheme.pink : currentTheme.font,
                width: 8,
                height: 8,
                borderRadius: 5,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: SCREEN_WIDTH - 20,
    paddingBottom: 0,
    overflow: "hidden",
    marginLeft: 10,
    paddingTop: 10,
  },
  image: {
    width: SCREEN_WIDTH - 20,
    aspectRatio: 1,
  },
  dotContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
    height: 10,
    opacity: 0.9,
  },
  dot: {
    marginHorizontal: 5,
    height: 10,
  },
});

export default CoverSlider;

const Img = ({ image }) => {
  const [loading, setLoading] = useState(true);
  return (
    <View
      style={{
        width: SCREEN_WIDTH - 20,
        height: SCREEN_WIDTH,
        overflow: "hidden",
      }}
    >
      {loading && <Circle />}
      <Image
        source={image}
        style={{ width: SCREEN_WIDTH - 20, height: SCREEN_WIDTH }}
        onLoad={() => setLoading(false)}
      />
    </View>
  );
};
