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
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useNavigation } from "@react-navigation/native";
import { ProceduresOptions } from "../../datas/registerDatas";
import { CacheableImage } from "../../components/cacheableImage";
import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import axios from "axios";
import {
  setRerenderProducts,
  setUserProductListingPage,
  setUserProducts,
} from "../../redux/Marketplace";
import { ActivityIndicator } from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Products = () => {
  // language state
  const language = Language();

  // loading state
  const [loading, setLoading] = useState(true);

  // categories
  const categoriesList = ProceduresOptions();

  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines dispatch
  const dispatch = useDispatch();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // naviagtion
  const navigation = useNavigation();

  // search state
  const [search, setSearch] = useState("");

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // add products when scrolling
  const userProducts = useSelector(
    (state) => state.storeMarketplace.userProducts
  );
  const page = useSelector(
    (state) => state.storeMarketplace.userProductListingPage
  );

  /**
   * get user products
   */
  const rerenderProducts = useSelector(
    (state) => state.storeMarketplace.rerenderProducts
  );

  useEffect(() => {
    const GetUserProducts = async () => {
      // setLoading(true);
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/marketplace/" +
            currentUser._id +
            "/products?page=1&search=" +
            search +
            "&from=settings"
        );
        if (response.data.data.products) {
          dispatch(setUserProductListingPage(1));
          dispatch(setUserProducts(response.data.data.products));
          setLoading(false);
        }
      } catch (error) {
        console.log("Error fetching user products:", error);
      }
    };

    try {
      if (currentUser) {
        GetUserProducts();
      }
    } catch (error) {
      console.log("Error in useEffect:", error);
    }
  }, [currentUser, rerenderProducts, search]);

  const AddUserProducts = async (p) => {
    // Helper function to merge two arrays while ensuring uniqueness based on _id
    try {
      const response = await axios.get(
        backendUrl +
          "/api/v1/marketplace/" +
          currentUser._id +
          "/products?page=" +
          parseInt(page + 1) +
          "&search=" +
          search +
          "&from=settings"
      );
      if (response.data.data.products) {
        const newProducts = response.data.data.products;
        const updatedUserProducts = mergeUniqueProducts(
          userProducts,
          newProducts
        );
        dispatch(setUserProducts(updatedUserProducts));
        dispatch(setUserProductListingPage(page + 1));
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
  return (
    <>
      <View style={{ paddingHorizontal: 15 }}>
        <View
          style={{
            width: "100%",
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
          {search?.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Text style={{ color: "red" }}>X</Text>
            </Pressable>
          )}
        </View>
      </View>
      {loading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: SCREEN_HEIGHT - 200,
          }}
        >
          <ActivityIndicator color={currentTheme.pink} size="large" />
        </View>
      ) : (
        <>
          <FlatList
            data={userProducts}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => {
              console.log(item.gallery[item.cover]?.url);
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("EditProduct", {
                      product: item,
                    })
                  }
                  key={index}
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: currentTheme.line,
                    padding: 15,
                    borderRadius: 10,
                    flexDirection: "row",
                  }}
                >
                  <CacheableImage
                    key={item.gallery[item.cover]?.url}
                    style={{ flex: 1, aspectRatio: 1, borderRadius: 5 }}
                    source={{ uri: item.gallery[item.cover]?.url }}
                  />
                  <View style={{ flex: 2, paddingHorizontal: 15, gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: item.active
                            ? currentTheme.pink
                            : currentTheme.disabled,
                          letterSpacing: 0.3,
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        {item.title}
                      </Text>
                      <Octicons
                        name={item.active ? "eye" : "eye-closed"}
                        size={16}
                        color={
                          item.active
                            ? currentTheme.pink
                            : currentTheme.disabled
                        }
                      />
                    </View>
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
                        let lab = categoriesList?.find(
                          (itm) => itm.value === it
                        );
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
                          size={16}
                        />
                      ) : item.currency === "euro" ? (
                        <FontAwesome
                          name="euro"
                          color={currentTheme.font}
                          size={16}
                        />
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
            }}
            onEndReached={AddUserProducts} // Triggered when reaching the end of the list
            onEndReachedThreshold={0.1} // Define how close to the end to trigger the callback
            contentContainerStyle={{
              alignItems: "center",
              padding: 15,
              paddingTop: 8,
              gap: 8,
            }}
          />
          {userProducts?.length < 1 && (
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
        </>
      )}
    </>
  );
};

export default Products;

const styles = StyleSheet.create({});
