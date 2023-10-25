import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
  Dimensions,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useNavigation } from "@react-navigation/native";
import { ProceduresOptions } from "../../datas/registerDatas";
import { CacheableImage } from "../../components/cacheableImage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import {
  setRerenderProducts,
  setUserProductListingPage,
  setUserProducts,
} from "../../redux/Marketplace";
import { ActivityIndicator } from "react-native-paper";
import FilterPopup from "./showroomFilter";
import { Circle } from "../../components/skeltons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Showroom = ({
  list,
  search,
  setSearch,
  targetUser,
  loading,
  categories,
  brands,
}) => {
  // language state
  const language = Language();

  // Get currentUser from global Redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // categories
  const categoriesList = ProceduresOptions();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // naviagtion
  const navigation = useNavigation();

  // filter state
  const [openFilter, setOpenFilter] = useState(false);

  /**
   * define filter totals
   */

  // State for minimum and maximum price range
  const minPrice = useSelector((state) => state.storeMarketplace.minPrice);
  const maxPrice = useSelector((state) => state.storeMarketplace.maxPrice);
  const categoryFilter = useSelector(
    (state) => state.storeMarketplace.categories
  );
  const discounts = useSelector((state) => state.storeMarketplace.discounts);
  const type = useSelector((state) => state.storeMarketplace.type);
  const sex = useSelector((state) => state.storeMarketplace.sex);
  const brand = useSelector((state) => state.storeMarketplace.brands);

  // badge options

  // const [total, setTotal] = useState(0);
  let minPriceTotal = minPrice === "" ? 0 : 1;
  let maxPriceTotal = maxPrice === "" ? 0 : 1;
  let typeTotal = type === "everyone" ? 0 : 1;
  let sexTotal = sex === "all" ? 0 : 1;
  let brandTotal = brand.length < 1 ? 0 : 1;
  let categoryTotal = categoryFilter?.length < 1 ? 0 : 1;
  let discountsTotal = discounts?.length < 1 ? 0 : 1;

  let total =
    minPriceTotal +
    maxPriceTotal +
    typeTotal +
    sexTotal +
    brandTotal +
    discountsTotal +
    categoryTotal;

  return (
    <View style={{ gap: 8, marginTop: 8 }}>
      <FilterPopup
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        categories={categories}
        brands={brands}
      />

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
            width: "90%",
            height: 40,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: currentTheme.line,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
          }}
        >
          <View>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <FontAwesome name="search" size={20} color={currentTheme.pink} />
              <TextInput
                value={search}
                placeholder="Search..."
                placeholderTextColor={currentTheme.disabled}
                style={{
                  width: "90%",
                  height: "100%",
                  color: currentTheme.font,
                  letterSpacing: 0.3,
                }}
                onChangeText={(val) => setSearch(val)}
              />
            </View>
          </View>

          {search?.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Text style={{ color: "red" }}>X</Text>
            </Pressable>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ padding: 5 }}
          onPress={() => setOpenFilter(true)}
        >
          {total > 0 && (
            <View
              style={{
                backgroundColor: currentTheme.pink,
                width: 15,
                height: 15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                position: "absolute",
                right: 0,
                zIndex: 1,
              }}
            >
              <Text style={{ fontSize: 10, color: "#fff" }}>{total}</Text>
            </View>
          )}
          <MaterialIcons color={currentTheme.disabled} name="list" size={22} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: SCREEN_HEIGHT - SCREEN_HEIGHT / 3,
          }}
        >
          <ActivityIndicator color={currentTheme.pink} size="large" />
        </View>
      ) : (
        <>
          <View style={{ gap: 8, paddingHorizontal: 8, paddingBottom: 15 }}>
            {list?.map((item, index) => {
              return (
                <ProductItem
                  key={index}
                  currentTheme={currentTheme}
                  item={item}
                  navigation={navigation}
                  categoriesList={categoriesList}
                />
              );
            })}

            {list?.length < 1 && (
              <View
                style={{
                  width: "100%",
                  paddingTop: 200,
                  height: SCREEN_HEIGHT,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: currentTheme.disabled }}>
                  No products found!
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default Showroom;

const styles = StyleSheet.create({});

const ProductItem = ({ item, navigation, currentTheme, categoriesList }) => {
  const [loading, setLoading] = useState(true);
  // backend url

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
        borderWidth: 1,
        borderColor: currentTheme.line,
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: 130,
          aspectRatio: 1,
          borderRadius: 5,
          overflow: "hidden",
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
    </TouchableOpacity>
  );
};
