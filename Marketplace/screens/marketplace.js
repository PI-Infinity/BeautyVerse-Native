import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  ImageBackground,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import React, { useState, useEffect, useRef } from "react";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import {
  Feather,
  FontAwesome,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CoverSlider from "../../Marketplace/components/coverSlider";
import { setRerenderProducts } from "../../redux/Marketplace";
import { TextInput } from "react-native-gesture-handler";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Main = ({ setScrollY, scrollY }) => {
  // language state
  const language = Language();

  // dispatch
  const dispatch = useDispatch();

  // navigation
  const navigation = useNavigation();

  // Get currentUser from global Redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const randomList = useSelector(
    (state) => state.storeMarketplace.randomProductsList
  );

  // search
  const [search, setSearch] = useState("");

  // on scroll getting new data
  const scrollRef = useRef();

  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    setScrollY(offsetY);
  };

  const zoomToTop = useSelector((state) => state.storeApp.zoomToTop);

  let firstRend = useRef();

  useEffect(() => {
    if (firstRend.current) {
      firstRend.current = false;
      return;
    }

    if (scrollY > 0) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [zoomToTop]);

  // useEffect for rerenderCurrentUser
  const [refresh, setRefresh] = useState(false);
  const rerenderProducts = useSelector(
    (state) => state.storeMarketplace.rerenderProducts
  );

  const marketplaceClearFirstRender = useRef(true);

  useEffect(() => {
    if (marketplaceClearFirstRender.current) {
      marketplaceClearFirstRender.current = false;
      return;
    }
    openLoading();
    const timer = setTimeout(() => {
      closeLoading();
    }, 1300);
    return () => clearTimeout(timer); // clear the timer if the component is unmounted
  }, [rerenderProducts]);

  // refresh inidcator animation
  const opacityValue = useRef(new Animated.Value(0)).current;
  const transformScroll = useRef(new Animated.Value(0)).current;

  const openLoading = () => {
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(transformScroll, {
        toValue: 60,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeLoading = () => {
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(transformScroll, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ImageBackground
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      source={theme ? require("../../assets/background.jpg") : null}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme ? "rgba(0,0,0,0.6)" : currentTheme.background,
        }}
      >
        <Animated.View
          style={{
            opacity: opacityValue,
            transform: [{ scale: 1.2 }],
            alignItems: "center",
            width: "100%",
          }}
        >
          <ActivityIndicator
            color={currentTheme.pink}
            style={{ position: "absolute", top: 15, zIndex: -1 }}
            size={20}
          />
        </Animated.View>
        <Animated.ScrollView
          contentContainerStyle={{ gap: 0, paddingBottom: 30, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          ref={scrollRef}
          style={{
            flex: 1,
            transform: [{ translateY: transformScroll }],
          }}
        >
          <Pressable onPress={() => navigation.navigate("Search")}>
            <View
              style={{
                paddingHorizontal: 15,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: currentTheme.line,
                  flexDirection: "row",
                  alignItems: "center",
                  // justifyContent: "center",
                  paddingHorizontal: 15,
                  // marginLeft: "3%",
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome
                      name="search"
                      size={20}
                      color={currentTheme.pink}
                    />
                    <TextInput
                      placeholder={
                        language?.language?.Marketplace?.marketplace?.search
                      }
                      placeholderTextColor={currentTheme.disabled}
                      style={{
                        width: "90%",
                        height: "100%",
                        color: currentTheme.font,
                        letterSpacing: 0.3,
                      }}
                      editable={false}
                      onPressIn={() => navigation.navigate("Search")}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
          <CoverSlider />
          {/*  */}
          <ListComponent
            list={randomList}
            navigation={navigation}
            currentTheme={currentTheme}
            title={
              language?.language?.Marketplace?.marketplace?.popularProducts
            }
          />

          {/* <ListComponent
        list={randomList}
        navigation={navigation}
        currentTheme={currentTheme}
        title="Popular"
      /> */}
          {/* <ListComponent
        list={latestList}
        navigation={navigation}
        currentTheme={currentTheme}
        title="Latest"
      /> */}
          {/* <ListComponent
        list={randomList}
        navigation={navigation}
        currentTheme={currentTheme}
        title="Last Solds"
      /> */}
        </Animated.ScrollView>
      </View>
    </ImageBackground>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  row: {
    flex: 1,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    // backgroundColor: "red",
    // gap: 8,
  },
  column: {
    flex: 1, // to account for the space in between
    alignItems: "center",
    justifyContent: "center",
    // margin: 5,
    // padding: 10,
  },
});

const ListComponent = ({ currentTheme, list, navigation, title }) => {
  // Helper function to group items into pairs
  const chunkArray = (array, size) => {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
  };

  // Create array of pairs
  const groupedItems = chunkArray(list, 2);
  return (
    <View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          // margin: 10,
          paddingHorizontal: 15,
          marginVertical: 15,
        }}
      >
        <View
          style={{ flex: 1, height: 1.5, backgroundColor: currentTheme.line }}
        ></View>
        <View style={{ flex: 3, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              letterSpacing: 0.3,
              color: currentTheme.disabled,

              fontWeight: "bold",
            }}
          >
            {title}:
          </Text>
        </View>
        <View
          style={{ flex: 1, height: 1.5, backgroundColor: currentTheme.line }}
        ></View>
      </View>
      <View style={styles.container}>
        {groupedItems.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.row}>
            {group.map((item, index) => (
              <View key={index} style={styles.column}>
                <View
                  key={index}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: currentTheme.line,
                    borderRadius: 20,
                    // padding: 8,
                    gap: 10,
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      paddingHorizontal: 4,
                    }}
                  >
                    {item.owner.cover?.length > 0 ? (
                      <Pressable
                        onPress={() =>
                          navigation.navigate("User", {
                            user: item.owner,
                          })
                        }
                      >
                        <CacheableImage
                          key={item.owner.cover}
                          source={{ uri: item.owner.cover }}
                          style={{ width: 25, height: 25, borderRadius: 50 }}
                        />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() =>
                          navigation.navigate("User", {
                            user: item.owner,
                          })
                        }
                        style={{
                          padding: 8,
                          borderRadius: 50,
                          backgroundColor: currentTheme.line,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Fontisto
                          name="shopping-bag-1"
                          size={18}
                          color={currentTheme.disabled}
                        />
                      </Pressable>
                    )}
                    <Pressable
                      onPress={() =>
                        navigation.navigate("User", {
                          user: item.owner,
                        })
                      }
                      style={{
                        overflow: "hidden",
                        width: 110,
                      }}
                    >
                      <Text
                        style={{
                          color: currentTheme.pink,
                          fontWeight: "bold",
                          letterSpacing: 0.3,
                        }}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                      >
                        {item.owner.name}
                      </Text>
                    </Pressable>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("Product", {
                        product: item,
                      })
                    }
                  >
                    <CacheableImage
                      key={item?.gallery[item?.cover]?.url}
                      source={{ uri: item?.gallery[item?.cover]?.url }}
                      style={{
                        width: "97%",
                        aspectRatio: 1,
                        borderRadius: 10,
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: currentTheme.pink,
                      fontWeight: "bold",
                      letterSpacing: 0.3,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: currentTheme.font,
                      letterSpacing: 0.3,
                      fontSize: 12,
                    }}
                  >
                    {item.brand}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: currentTheme.font,
                        letterSpacing: 0.3,
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      {item?.sale
                        ? (
                            item?.price -
                            (item.price / 100) * item.sale
                          ).toFixed(2)
                        : item.price}
                    </Text>
                    {item.currency === "dollar" ? (
                      <FontAwesome
                        name="dollar"
                        color={currentTheme.font}
                        size={14}
                      />
                    ) : item.currency === "euro" ? (
                      <FontAwesome
                        name="euro"
                        color={currentTheme.font}
                        size={14}
                      />
                    ) : (
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: currentTheme.font,
                          fontSize: 14,
                        }}
                      >
                        {"\u20BE"}
                      </Text>
                    )}

                    {item?.sale && (
                      <View style={{ flexDirection: "row", marginLeft: 4 }}>
                        <Text
                          style={{
                            color: currentTheme.disabled,
                            textDecorationLine: "line-through",
                            letterSpacing: 0.3,
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          {item.price}
                          {item.currency === "dollar" ? (
                            <FontAwesome
                              name="dollar"
                              color={currentTheme.disabled}
                              size={14}
                            />
                          ) : item.currency === "euro" ? (
                            <FontAwesome
                              name="euro"
                              color={currentTheme.disabled}
                              size={14}
                            />
                          ) : (
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: currentTheme.disabled,
                                fontSize: 14,
                              }}
                            >
                              {"\u20BE"}
                            </Text>
                          )}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            // margin: 10,
            paddingHorizontal: 15,
            marginVertical: 15,
          }}
        >
          <View
            style={{ flex: 1, height: 1.5, backgroundColor: currentTheme.line }}
          ></View>
          <Pressable
            onPress={() =>
              navigation.navigate("List", { title: title, list: list })
            }
            style={{
              paddingHorizontal: 15,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                letterSpacing: 0.3,
                color: currentTheme.disabled,
              }}
            >
              See all
            </Text>
            <MaterialIcons
              name="arrow-right"
              size={18}
              color={currentTheme.disabled}
            />
          </Pressable>
          <View
            style={{ flex: 1, height: 1.5, backgroundColor: currentTheme.line }}
          ></View>
        </View>
      </View>
    </View>
  );
};
