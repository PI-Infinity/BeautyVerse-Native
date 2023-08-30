import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Main = () => {
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

  // const latestList = useSelector((state) => state.storeMarketplace.latestList);
  // const bestSellers = useSelector(
  //   (state) => state.storeMarketplace.bestSellersList
  // );

  // search
  const [search, setSearch] = useState("");

  return (
    <ScrollView
      contentContainerStyle={{ gap: 0, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
    >
      <CoverSlider />
      {/*  */}
      <ListComponent
        list={randomList}
        navigation={navigation}
        currentTheme={currentTheme}
        title="Popular Products"
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
    </ScrollView>
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
                    borderRadius: 10,
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
                    {item.owner.cover?.url ? (
                      <Pressable
                        style={{ padding: 8 }}
                        onPress={() =>
                          navigation.navigate("User", {
                            user: item.owner,
                          })
                        }
                      >
                        <CacheableImage
                          key={item.owner.cover?.url}
                          source={{ uri: item.owner.cover?.url }}
                          style={{ width: 40, height: 40, borderRadius: 50 }}
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
                        borderRadius: 5,
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
