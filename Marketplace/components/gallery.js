import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useState } from "react";
import { CacheableImage } from "../../components/cacheableImage";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector } from "react-redux";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Gallery = ({ product }) => {
  // language state
  const language = Language();

  // Get currentUser from global Redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // Define the active index state
  const [activeIndex, setActiveIndex] = useState(0);

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // Handle scroll event to determine active index based on scroll position
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={{ alignItems: "center", width: "100%", paddingBottom: 15 }}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={200} // Adjust throttle value as needed
        showsHorizontalScrollIndicator={false}
        bounces={Platform.OS === "ios" ? false : undefined}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      >
        <CacheableImage
          source={{ uri: product.gallery[product.cover]?.url }}
          key={product.gallery[product.cover]?.url}
          style={{
            width: SCREEN_WIDTH,
            aspectRatio: 1,
          }}
        />
        {product.gallery?.map((item, index) => {
          if (index !== product.cover)
            return (
              <CacheableImage
                source={{ uri: item.url }}
                key={item.url}
                style={{
                  width: SCREEN_WIDTH,
                  aspectRatio: 1,
                }}
              />
            );
        })}
      </ScrollView>
      {product?.gallery?.length > 1 && (
        <View
          style={{
            marginTop: 10,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            flexDirection: "row",
          }}
        >
          {product.gallery?.map((item, index) => {
            if (index < 15) {
              return (
                <View
                  key={index}
                  style={{
                    width: activeIndex === index ? 9 : 7,
                    height: activeIndex === index ? 9 : 7,
                    borderRadius: 50,
                    backgroundColor: currentTheme.disabled,
                  }}
                >
                  <Text>{item.itemId}</Text>
                  {/* Render your content for each gallery item here */}
                </View>
              );
            }
          })}
        </View>
      )}
    </View>
  );
};

export default Gallery;

const styles = StyleSheet.create({});
