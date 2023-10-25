import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { CacheableImage } from "../../components/cacheableImage";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useDispatch, useSelector } from "react-redux";
import Gallery from "../components/gallery";
import { ProceduresOptions } from "../../datas/registerDatas";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import axios from "axios";
import { setRerenderProducts } from "../../redux/Marketplace";
import { useSocket } from "../../context/socketContext";
import { sendNotification } from "../../components/pushNotifications";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Product = ({ route }) => {
  // defines product
  const product = route.params.product;
  // language state
  const language = Language();
  const lang = useSelector((state) => state.storeApp.language);

  // navigation state
  const navigation = useNavigation();

  // redux dispatch
  const dispatch = useDispatch();

  // defines socket server
  const socket = useSocket();

  // Get currentUser from global Redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // categories
  const categoriesList = ProceduresOptions();

  const [variants, setVariants] = useState([]);
  const ProductVariants = async () => {
    try {
      // Map through the variants and return an array of promises
      const lstPromises = product.variants?.map((i) => {
        return axios.get(backendUrl + "/api/v1/marketplace/" + i._id);
      });

      // Wait for all the promises to resolve
      const responses = await Promise.all(lstPromises);

      // Extract the product from each response and log them
      const lst = responses.map((response) => response.data.data.product);
      setVariants(lst);
    } catch (error) {
      console.log(error);
    }
  };

  const [saved, setSaved] = useState(null);

  useEffect(() => {
    if (product) {
      ProductVariants();
      setSaved(product?.checkIfSaved);
    }
  }, [product]);

  // scroll ref
  const scrollRef = useRef();

  /**
   *
   * Save Product
   */
  const SaveProduct = async (itemId, userId) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSaved(true);

      await axios.patch(
        backendUrl + "/api/v1/marketplace/" + itemId + "/save",
        {
          saveFor: userId,
        }
      );
      if (currentUser?._id !== product.owner._id) {
        await axios.post(
          `${backendUrl}/api/v1/users/${product?.owner?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: ``,
            date: new Date(),
            type: "saveProduct",
            status: "unread",
            product: product?._id,
          }
        );
        if (product.owner?.pushNotificationToken) {
          await sendNotification(
            product.owner?.pushNotificationToken,
            currentUser.name,
            "saved your product!",
            { product: product?._id }
          );
        }
        socket.emit("updateUser", {
          targetId: product.owner?._id,
        });
      }
      dispatch(setRerenderProducts());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const UnSaveProduct = async (itemId, userId) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSaved(false);

      await axios.patch(
        backendUrl + "/api/v1/marketplace/" + itemId + "/save",
        {
          unSaveFor: currentUser._id,
        }
      );
      dispatch(setRerenderProducts());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", paddingBottom: 15 }}
      scrollEventThrottle={1}
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
    >
      <Gallery product={product} />
      <View
        style={{
          width: "100%",
          paddingHorizontal: 15,
          paddingBottom: 10,
          alignItems: "flex-end",
        }}
      >
        <Pressable
          style={{ padding: 5 }}
          onPress={
            saved
              ? () => UnSaveProduct(product._id, currentUser._id)
              : () => SaveProduct(product._id, currentUser._id)
          }
        >
          <MaterialIcons
            name="save-alt"
            color={saved ? currentTheme.pink : currentTheme.disabled}
            size={22}
          />
        </Pressable>
      </View>
      <View
        style={{
          gap: 8,
          width: "100%",
          alignItems: "center",
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 15,
            borderRadius: 10,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 0.5,
              color: currentTheme.font,
            }}
          >
            {language?.language?.Marketplace?.marketplace?.shop}:
          </Text>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            onPress={() =>
              navigation.navigate("User", {
                user: product.owner,
              })
            }
          >
            <View activeOpacity={0.9} style={{ marginLeft: 8 }}>
              {product.owner?.cover ? (
                <CacheableImage
                  source={{ uri: route.params.product.owner?.cover }}
                  style={{ width: 25, height: 25, borderRadius: 50 }}
                />
              ) : (
                <FontAwesome
                  name="user"
                  size={20}
                  color={currentTheme.disabled}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.pink,
              }}
            >
              {product?.owner.name}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 15,
            borderRadius: 10,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 0.5,
              color: currentTheme.font,
            }}
          >
            {language?.language?.Marketplace?.marketplace?.brand}:
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 0.5,
              color: currentTheme.pink,
            }}
          >
            {product?.brand}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 15,
            borderRadius: 10,
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 0.5,
              color: currentTheme.font,
            }}
          >
            {language?.language?.Marketplace?.marketplace?.categories}:
          </Text>
          {product.categories?.map((i, x) => {
            let lab = categoriesList?.find((it, ix) => it.value === i).label;
            return (
              <Text
                key={x}
                style={{
                  fontSize: 14,

                  letterSpacing: 0.5,
                  color: currentTheme.font,
                  marginLeft: 15,
                }}
              >
                - {lab}
              </Text>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 15,
            borderRadius: 10,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 0.5,
              color: currentTheme.font,
              // marginRight: 8,
            }}
          >
            {language?.language?.Marketplace?.marketplace?.price}:
          </Text>
          <Text
            style={{
              color: currentTheme.pink,
              letterSpacing: 0.3,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {product?.sale
              ? (product?.price - (product.price / 100) * product.sale).toFixed(
                  2
                )
              : product.price}
          </Text>
          {product.currency === "dollar" ? (
            <FontAwesome name="dollar" color={currentTheme.pink} size={14} />
          ) : product.currency === "euro" ? (
            <FontAwesome name="euro" color={currentTheme.pink} size={14} />
          ) : (
            <Text
              style={{
                fontWeight: "bold",
                color: currentTheme.pink,
                fontSize: 14,
              }}
            >
              {"\u20BE"}
            </Text>
          )}

          {product?.sale && (
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
                {product.price}
                {product.currency === "dollar" ? (
                  <FontAwesome
                    name="dollar"
                    color={currentTheme.disabled}
                    size={14}
                  />
                ) : product.currency === "euro" ? (
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
        {product?.inStock && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 15,
              borderRadius: 10,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.inStock}:
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {product?.inStock} pcs.
            </Text>
          </View>
        )}
        {product?.type === "professionals" && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 15,
              borderRadius: 10,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.pink,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.forProfessionals}
            </Text>
          </View>
        )}
        {(product?.shortDescription?.en?.length > 0 ||
          product?.shortDescription?.ru?.length > 0 ||
          product?.shortDescription?.ka?.length > 0) && (
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 15,
              borderRadius: 10,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.shortDescription}:
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginLeft: 15,
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {lang === "en"
                ? product?.shortDescription?.en
                : lang === "ru"
                ? product?.shortDescription?.ru
                : product?.shortDescription?.ka}
            </Text>
          </View>
        )}
        {product?.variants?.length > 0 && (
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 15,
              borderRadius: 10,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.variants}:
            </Text>
            <View
              style={{
                gap: 8,
              }}
            >
              {variants?.map((item, index) => {
                return (
                  <Pressable
                    onPress={() => {
                      navigation.navigate("Product", { product: item });
                      scrollRef.current?.scrollTo({ y: 0, animated: true });
                    }}
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 8,
                      borderRadius: 100,
                      borderWidth: 1,
                      borderColor: currentTheme.line,
                    }}
                  >
                    <CacheableImage
                      key={item.gallery[item.cover].url}
                      source={{ uri: item.gallery[item.cover].url }}
                      style={{ height: 35, width: 35, borderRadius: 100 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        marginLeft: 15,
                        letterSpacing: 0.5,
                        color: currentTheme.font,
                      }}
                    >
                      {item.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
        {(product?.description?.en?.length > 0 ||
          product?.description?.ru?.length > 0 ||
          product?.description?.ka?.length > 0) && (
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 15,
              borderRadius: 10,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.fullDescription}:
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginLeft: 15,
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {lang === "en"
                ? product?.description.en
                : lang === "ru"
                ? product?.description.ru
                : product?.description.ka}
            </Text>
          </View>
        )}
        {(product?.howToUse?.en?.length > 0 ||
          product?.howToUse?.ru?.length > 0 ||
          product?.howToUse?.ka?.length > 0) && (
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 15,
              borderRadius: 10,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.howToUse}:
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginLeft: 15,
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {lang === "en"
                ? product?.howToUse.en
                : lang === "ru"
                ? product?.howToUse.ru
                : product?.howToUse.ka}
            </Text>
          </View>
        )}
        {(product?.compositions?.en?.length > 0 ||
          product?.compositions?.ru?.length > 0 ||
          product?.compositions?.ka?.length > 0) && (
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.line,
              padding: 15,
              borderRadius: 10,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.compositions}:
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginLeft: 15,
                letterSpacing: 0.5,
                color: currentTheme.font,
              }}
            >
              {lang === "en"
                ? product?.compositions.en
                : lang === "ru"
                ? product?.compositions.ru
                : product?.compositions.ka}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Product;

const styles = StyleSheet.create({
  title: { fontSize: 14, color: "green", letterSpacing: 0.3 },
});
