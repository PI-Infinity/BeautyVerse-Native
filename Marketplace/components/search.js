import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome, MaterialIcons, Fontisto } from "@expo/vector-icons";
import axios from "axios";
import { ProceduresOptions } from "../../datas/registerDatas";
import { CacheableImage } from "../../components/cacheableImage";
import FilterPopup from "./marketplaceFilter";
import { Circle } from "../../components/skeltons";
import { ActivityIndicator } from "react-native-paper";
import { setScreenModal, setUserScreenModal } from "../../redux/app";
import { Header } from "../../components/header";

const Search = ({ hideModal }) => {
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

  // loading
  const [loading, setLoading] = useState(true);

  // backend
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // search
  const [search, setSearch] = useState("");

  // filter
  const [openFilter, setOpenFilter] = useState(false);

  // filter categories list
  const [categories, setCategories] = useState([]);

  // filter brands list
  const [brandsList, setBrandsList] = useState([]);

  // list
  const [list, setList] = useState([]);

  // page
  const [page, setPage] = useState(1);

  // filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [discounts, setDiscounts] = useState("");
  const [type, setType] = useState("everyone");
  const [sex, setSex] = useState("all");
  const [brands, setBrands] = useState("");

  useEffect(() => {
    const Getting = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          backendUrl +
            "/api/v1/marketplace?limit=8&search=" +
            search +
            "&categories=" +
            categoryFilter +
            "&brand=" +
            brands +
            "&discounts=" +
            discounts +
            "&minPrice=" +
            minPrice +
            "&maxPrice=" +
            maxPrice +
            "&sex=" +
            sex +
            "&type=" +
            type +
            "&from=search"
        );
        setList(response.data.data.products.random);
        setCategories(response.data.categories);
        setBrandsList(response.data.brands);

        setLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    Getting();
  }, [
    search,
    minPrice,
    maxPrice,
    type,
    sex,
    categoryFilter,
    brands,
    discounts,
  ]);

  // add products on scroll
  const AddProducts = async () => {
    // Helper function to merge two arrays while ensuring uniqueness based on _id
    try {
      const response = await axios.get(
        backendUrl +
          "/api/v1/marketplace?page=" +
          parseInt(page + 1) +
          "&categories=" +
          categoryFilter +
          "&brand=" +
          brands +
          "&discounts=" +
          discounts +
          "&minPrice=" +
          minPrice +
          "&maxPrice=" +
          maxPrice +
          "&sex=" +
          sex +
          "&type=" +
          type
      );
      if (response.data.data.products.random) {
        const newProducts = response.data.data.products.random;
        if (newProducts?.length > 0) {
          const updatedUserProducts = mergeUniqueProducts(list, newProducts);
          setList(updatedUserProducts);
          setCategories(response.data.categories);
          setBrandsList(response.data.brands);
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

  // badge options

  let minPriceTotal = minPrice === "" ? 0 : 1;
  let maxPriceTotal = maxPrice === "" ? 0 : 1;
  let typeTotal = type === "everyone" ? 0 : 1;
  let sexTotal = sex === "all" ? 0 : 1;
  let brandTotal = brands.length < 1 ? 0 : 1;
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

  // focus effect for input
  const [focus, setFocus] = useState(false);

  return (
    <>
      <Header
        title={language?.language?.Main?.filter?.search}
        onBack={hideModal}
      />
      <View>
        <FilterPopup
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          categories={categories}
          brands={brandsList}
          brand={brands}
          setBrands={setBrands}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          discounts={discounts}
          setDiscounts={setDiscounts}
          sex={sex}
          setSex={setSex}
          type={type}
          setType={setType}
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
              borderColor: focus ? currentTheme.pink : currentTheme.line,
              flexDirection: "row",
              alignItems: "center",
              // justifyContent: "center",
              paddingHorizontal: 15,
              // marginLeft: "3%",
            }}
          >
            <View>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <FontAwesome
                  name="search"
                  size={20}
                  color={currentTheme.pink}
                />
                <TextInput
                  value={search}
                  placeholder={
                    language?.language?.Marketplace?.marketplace?.search
                  }
                  placeholderTextColor={currentTheme.disabled}
                  autoFocus
                  style={{
                    width: "90%",
                    height: "100%",
                    color: currentTheme.font,
                    letterSpacing: 0.3,
                  }}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
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
            <MaterialIcons
              color={currentTheme.disabled}
              name="list"
              size={26}
            />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={{ height: 500, justifyContent: "center" }}>
            <ActivityIndicator size="large" color={currentTheme.pink} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              gap: 4,
              paddingHorizontal: 8,
              paddingBottom: 60,
              marginTop: 15,
            }}
            onScroll={onScroll}
            scrollEventThrottle={1}
          >
            {list?.map((item, index) => {
              return (
                <ProductItem
                  key={index}
                  item={item}
                  currentTheme={currentTheme}
                  navigation={navigation}
                />
              );
            })}
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default Search;

const styles = StyleSheet.create({});

const ProductItem = ({ item, navigation, currentTheme }) => {
  // categories
  const categoriesList = ProceduresOptions();

  const route = useRoute();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        dispatch(
          setScreenModal({
            active: true,
            screen: "Product",
            data: item,
            route: route.name,
          })
        )
      }
      style={{
        width: "100%",
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
        {item.owner.cover?.length > 0 ? (
          <Pressable
            onPress={() =>
              navigation.navigate("UserVisit", {
                user: item?.owner,
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
              navigation.navigate("UserVisit", {
                user: item?.owner,
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
            navigation.navigate("UserVisit", {
              user: item?.owner,
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
      <View style={{ flexDirection: "row" }}>
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
      </View>
    </TouchableOpacity>
  );
};
