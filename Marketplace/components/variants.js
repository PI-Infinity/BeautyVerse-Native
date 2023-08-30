import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { CacheableImage } from "../../components/cacheableImage";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Variants = ({
  setIsModalVisible,
  isModalVisible,
  setVariants,
  variants,
  currentProduct,
}) => {
  const [loading, setLoading] = useState(true);
  // language state
  const language = Language();
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // currentuser
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // search state
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);

  // add category function
  const handleCategoryPress = (variantValue) => {
    if (!variants?.includes(variantValue)) {
      setVariants((prevvariants) => [...prevvariants, variantValue]);
    } else {
      setVariants((prev) => prev?.filter((itm) => itm !== variantValue));
    }
  };

  // user products
  const products = useSelector((state) => state.storeMarketplace.userProducts);

  /**
   * get user products
   */
  useEffect(() => {
    const GetUserProducts = async () => {
      // setLoading(true);
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/marketplace/" +
            currentUser._id +
            "/products?page=1&limit=20&search=" +
            search +
            "&from=settings"
        );
        if (response.data.data.products) {
          setList(response.data.data.products);
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
  }, [search]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModalVisible}
      onRequestClose={() => {
        setIsModalVisible(!isModalVisible);
      }}
    >
      <View
        style={{
          width: "100%",
          height: SCREEN_HEIGHT,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 70,
          backgroundColor: currentTheme.background,
          gap: 15,
        }}
      >
        <Pressable
          style={{ width: "100%", alignItems: "center" }}
          onPress={() => setIsModalVisible(false)}
        >
          <FontAwesome5 size={20} color={currentTheme.pink} name="arrow-down" />
        </Pressable>
        <View style={{ paddingHorizontal: 15, width: "100%" }}>
          <View
            style={{
              width: "100%",
              height: 40,
              borderRadius: 50,
              borderWidth: 1.5,
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
          <ActivityIndicator size="small" color={currentTheme.pink} />
        ) : (
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              gap: 8,
              paddingHorizontal: 25,
              paddingBottom: 50,
            }}
          >
            {list?.length > 0 ? (
              list?.map((i, x) => {
                if (i._id === currentProduct._id) {
                  return;
                }
                let isDefined = variants?.find((it) => it === i);

                return (
                  <Pressable
                    key={i._id}
                    style={{
                      borderWidth: 1.5,
                      borderRadius: 50,
                      borderColor: isDefined
                        ? currentTheme.pink
                        : currentTheme.line,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                      padding: 8,
                    }}
                    onPress={() => handleCategoryPress(i)}
                  >
                    <CacheableImage
                      source={{ uri: i.gallery[i.cover].url }}
                      style={{ height: 40, width: 40, borderRadius: 50 }}
                    />
                    <Text
                      style={{
                        color: isDefined
                          ? currentTheme.pink
                          : currentTheme.font,
                        fontSize: 16,
                        letterSpacing: 0.3,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {i.title}
                    </Text>
                  </Pressable>
                );
              })
            ) : (
              <View
                style={{ width: "100%", alignItems: "center", marginTop: 50 }}
              >
                <Text style={{ color: currentTheme.disabled }}>
                  No products found!
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default Variants;

const styles = StyleSheet.create({});
