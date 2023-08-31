import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";
import { CacheableImage } from "../../components/cacheableImage";
import { Feather, FontAwesome, Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ProceduresOptions } from "../../datas/registerDatas";
import axios from "axios";
import { setRandomProductsList } from "../../redux/Marketplace";
import { Circle } from "../../components/skeltons";

const List = ({ route }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(route.params.list);
  }, []);

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

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  //  pages
  const [page, setPage] = useState(1);

  // add products on scroll
  const AddProducts = async () => {
    // Helper function to merge two arrays while ensuring uniqueness based on _id
    try {
      const response = await axios.get(
        backendUrl + "/api/v1/marketplace" + "?page=" + parseInt(page + 1)
      );
      if (response.data.data.products.random) {
        const newProducts = response.data.data.products.random;
        if (newProducts?.length > 0) {
          const updatedUserProducts = mergeUniqueProducts(list, newProducts);
          setList(updatedUserProducts);
          setPage(page + 1);
        }
      }
    } catch (error) {
      console.log("Error fetching user products:", error);
    }
  };
  // merge all and new list
  const mergeUniqueProducts = (oldList, newList) => {
    const mergedList = [...oldList];
    newList.forEach((newProduct) => {
      if (!oldList.some((oldProduct) => oldProduct._id === newProduct._id)) {
        mergedList.push(newProduct);
      }
    });
    return mergedList;
  };

  // on scroll getting new data
  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    const isBottom = offsetY + layoutHeight >= contentHeight - 200;
    // const canLoadMore = feedsLength > feeds.length;

    // if (route.name === "UserProfile") {
    //   setScrollY(offsetY);
    // }
    if (isBottom) {
      AddProducts();
    }
  };

  return (
    <ScrollView
      onScroll={onScroll}
      scrollEventThrottle={1}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 4,
        paddingHorizontal: 8,
        paddingBottom: 15,
      }}
    >
      {list?.map((item, index) => {
        return (
          <ProductItem
            key={index}
            item={item}
            navigation={navigation}
            currentTheme={currentTheme}
          />
        );
      })}
    </ScrollView>
  );
};

export default List;

const styles = StyleSheet.create({});

const ProductItem = ({ item, navigation, currentTheme }) => {
  // categories
  const categoriesList = ProceduresOptions();

  //
  const [loading, setLoading] = useState(true);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("Product", {
          product: item,
        })
      }
      style={{
        width: "100%",
        // height: 200,
        borderWidth: 1,
        borderColor: currentTheme.line,
        padding: 10,
        borderRadius: 10,
        gap: 10,
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
          }}
        >
          <Text
            style={{
              color: currentTheme.pink,
              fontWeight: "bold",
              letterSpacing: 0.3,
            }}
          >
            {item.owner.name}
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          //   width: "100%",
          //   borderWidth: 1,
          //   borderColor: currentTheme.line,
          //   padding: 15,
          //   borderRadius: 10,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: 130,
            aspectRatio: 1,
            overflow: "hidden",
            borderRadius: 5,
          }}
        >
          {loading && <Circle />}

          <CacheableImage
            key={item.gallery[item.cover]?.url}
            style={{ width: 130, aspectRatio: 1, borderRadius: 5 }}
            source={{ uri: item.gallery[item.cover]?.url }}
            onLoad={() => setLoading(false)}
          />
        </View>

        <View style={{ flex: 2, paddingHorizontal: 15, gap: 8 }}>
          <Text
            style={{
              color: currentTheme.pink,
              letterSpacing: 0.3,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {item.title}
          </Text>
          <View>
            <Text
              style={{
                color: currentTheme.font,
                letterSpacing: 0.3,
                fontSize: 12,
              }}
            >
              {item.brand}
            </Text>
          </View>
          <View>
            {item.categories?.map((it, x) => {
              let lab = categoriesList?.find((itm) => itm.value === it);
              if (x === 0) {
                return (
                  <Text
                    key={x}
                    style={{
                      color: currentTheme.disabled,
                      letterSpacing: 0.3,
                      fontSize: 12,
                    }}
                  >
                    {lab.label}
                  </Text>
                );
              }
            }, [])}
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: currentTheme.font,
                letterSpacing: 0.3,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {item?.sale
                ? (item?.price - (item.price / 100) * item.sale).toFixed(2)
                : item.price}
            </Text>
            {item.currency === "dollar" ? (
              <FontAwesome name="dollar" color={currentTheme.font} size={16} />
            ) : item.currency === "euro" ? (
              <FontAwesome name="euro" color={currentTheme.font} size={16} />
            ) : (
              <Text
                style={{
                  fontWeight: "bold",
                  color: currentTheme.font,
                  fontSize: 16,
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
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {item.price}
                  {item.currency === "dollar" ? (
                    <FontAwesome
                      name="dollar"
                      color={currentTheme.disabled}
                      size={16}
                    />
                  ) : item.currency === "euro" ? (
                    <FontAwesome
                      name="euro"
                      color={currentTheme.disabled}
                      size={16}
                    />
                  ) : (
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: currentTheme.disabled,
                        fontSize: 16,
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
    </TouchableOpacity>
  );
};
