import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { useSelector, useDispatch } from "react-redux";
import { ProceduresOptions } from "../../datas/registerDatas";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  setBrands,
  setCategories,
  setMaxPrice,
  setMinPrice,
  setSex,
  setType,
  setDiscounts,
} from "../../redux/Marketplace";
import { BlurView } from "expo-blur";

const FilterPopup = ({ openFilter, setOpenFilter, categories, brands }) => {
  // language state
  const language = Language();

  // dispatch
  const dispatch = useDispatch();

  // Get currentUser from global Redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // categories
  const categoriesList = ProceduresOptions();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

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
    <Modal
      animationType="slide"
      transparent={true}
      visible={openFilter}
      onRequestClose={() => {
        setOpenFilter(!openFilter);
      }}
    >
      <BlurView
        style={{
          flex: 1,
          backgroundColor: theme
            ? "rgba(0, 1, 8, 0.8)"
            : currentTheme.background,
        }}
        tint="dark"
        intensity={60}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingVertical: 60,
            paddingBottom: 20,
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            // backgroundColor: currentTheme.background,
          }}
        >
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.pink,
              padding: 15,
              borderRadius: 10,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
                width: "100%",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Entypo name="list" size={20} color={currentTheme.font} />
              <Text
                style={{
                  color: currentTheme.pink,
                  letterSpacing: 0.5,
                  fontSize: 16,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.categories}:
              </Text>
            </View>
            <View style={{ alignItems: "center", gap: 8, marginTop: 15 }}>
              {categories?.map((item, index) => {
                let lab = categoriesList.find(
                  (i, x) =>
                    i.value?.toLocaleLowerCase() === item?.toLocaleLowerCase()
                ).label;
                return (
                  <Pressable
                    key={index}
                    onPress={
                      categoryFilter?.includes(item)
                        ? () =>
                            dispatch(
                              setCategories(
                                categoryFilter.filter((i, x) => i !== item)
                              )
                            )
                        : () =>
                            dispatch(setCategories([...categoryFilter, item]))
                    }
                    style={{
                      padding: 10,
                      paddingHorizontal: 15,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: categoryFilter?.includes(item)
                        ? currentTheme.pink
                        : currentTheme.line,
                      width: "90%",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ letterSpacing: 0.3, color: currentTheme.font }}
                    >
                      {lab}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.pink,

              padding: 15,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                padding: 5,
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Feather name="type" size={18} color={currentTheme.font} />
              <Text
                style={{
                  color: currentTheme.pink,
                  letterSpacing: 0.5,
                  fontSize: 16,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.type}:
              </Text>
            </View>
            <View style={styles.priceInputContainer}>
              <Pressable
                onPress={
                  type === "everyone"
                    ? () => dispatch(setType(""))
                    : () => dispatch(setType("everyone"))
                }
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor:
                    type === "everyone" ? currentTheme.pink : currentTheme.line,
                  borderRadius: 50,
                  width: "47.5%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: currentTheme.font, letterSpacing: 0.3 }}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  {language?.language?.Marketplace?.marketplace?.forEveryone}
                </Text>
              </Pressable>
              <Pressable
                onPress={
                  type === "professionals"
                    ? () => dispatch(setType(""))
                    : () => dispatch(setType("professionals"))
                }
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor:
                    type === "professionals"
                      ? currentTheme.pink
                      : currentTheme.line,
                  borderRadius: 50,
                  width: "47.5%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: currentTheme.font, letterSpacing: 0.3 }}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  {
                    language?.language?.Marketplace?.marketplace
                      ?.forProfessionals
                  }
                </Text>
              </Pressable>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: currentTheme.pink,
              padding: 15,
              borderRadius: 10,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                padding: 5,
                width: "100%",
                flexDirection: "row",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <Entypo name="price-ribbon" size={20} color={currentTheme.font} />
              <Text
                style={{
                  color: currentTheme.pink,
                  letterSpacing: 0.5,
                  fontSize: 16,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.brands}:
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                gap: 8,
                marginTop: 10,
                width: "100%",
              }}
            >
              {brands?.map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={
                      brands?.length > 1 && brand?.includes(item)
                        ? () =>
                            dispatch(
                              setBrands(brand.filter((i, x) => i !== item))
                            )
                        : brands?.length > 1 && !brand?.includes(item)
                        ? () => dispatch(setBrands([...brand, item]))
                        : undefined
                    }
                    style={{
                      padding: 10,
                      paddingHorizontal: 15,
                      borderRadius: 50,
                      borderWidth: 1,

                      borderColor: brand?.includes(item)
                        ? currentTheme.pink
                        : currentTheme.line,
                      width: "90%",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        letterSpacing: 0.3,
                        color:
                          brands?.length > 1
                            ? currentTheme.font
                            : currentTheme.disabled,
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View
            style={{
              width: "100%",
              // marginVertical: 10,
              borderWidth: 1,
              borderColor: currentTheme.pink,

              padding: 15,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                padding: 5,
                width: "100%",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <FontAwesome5
                name="money-bill-alt"
                size={15}
                color={currentTheme.font}
              />
              <Text
                style={{
                  color: currentTheme.pink,
                  letterSpacing: 0.5,
                  fontSize: 16,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.priceRange}:
              </Text>
            </View>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={[
                  styles.priceInput,
                  {
                    color: currentTheme.font,
                    borderColor:
                      minPrice === "" ? currentTheme.line : currentTheme.pink,
                  },
                ]}
                keyboardType="number-pad"
                placeholder={
                  language?.language?.Marketplace?.marketplace?.minPrice
                }
                value={minPrice}
                onChangeText={(val) => dispatch(setMinPrice(val))}
                placeholderTextColor={currentTheme.disabled}
              />
              <TextInput
                style={[
                  styles.priceInput,
                  {
                    color: currentTheme.font,
                    borderColor:
                      maxPrice === "" ? currentTheme.line : currentTheme.pink,
                  },
                ]}
                keyboardType="number-pad"
                placeholder={
                  language?.language?.Marketplace?.marketplace?.maxPrice
                }
                value={maxPrice}
                onChangeText={(val) => dispatch(setMaxPrice(val))}
                placeholderTextColor={currentTheme.disabled}
              />
            </View>
          </View>
          <View
            style={{
              width: "100%",
              marginTop: 10,
              borderWidth: 1,
              borderColor: currentTheme.pink,

              padding: 15,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                padding: 5,
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <MaterialCommunityIcons
                name="sale"
                size={18}
                color={currentTheme.font}
              />

              <Text
                style={{
                  color: currentTheme.pink,
                  letterSpacing: 0.5,
                  fontSize: 16,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.discounts}:
              </Text>
            </View>
            <View style={styles.priceInputContainer}>
              <Pressable
                onPress={
                  discounts === "with"
                    ? () => dispatch(setDiscounts(""))
                    : () => dispatch(setDiscounts("with"))
                }
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor:
                    discounts === "with"
                      ? currentTheme.pink
                      : currentTheme.line,
                  borderRadius: 50,
                  width: "47.5%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: currentTheme.font, letterSpacing: 0.3 }}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  {language?.language?.Marketplace?.marketplace?.onlyWith}
                </Text>
              </Pressable>
              <Pressable
                onPress={
                  discounts === "without"
                    ? () => dispatch(setDiscounts(""))
                    : () => dispatch(setDiscounts("without"))
                }
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor:
                    discounts === "without"
                      ? currentTheme.pink
                      : currentTheme.line,
                  borderRadius: 50,
                  width: "47.5%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: currentTheme.font, letterSpacing: 0.3 }}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  {language?.language?.Marketplace?.marketplace?.onlyWithout}
                </Text>
              </Pressable>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              marginVertical: 10,
              borderWidth: 1,
              borderColor: currentTheme.pink,
              padding: 15,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                padding: 5,
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FontAwesome
                name="intersex"
                size={18}
                color={currentTheme.font}
              />
              <Text
                style={{
                  color: currentTheme.pink,
                  letterSpacing: 0.5,
                  fontSize: 16,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.sex}:
              </Text>
            </View>
            <View style={styles.priceInputContainer}>
              <Pressable
                onPress={
                  sex === "women"
                    ? () => dispatch(setSex("all"))
                    : () => dispatch(setSex("women"))
                }
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor:
                    sex === "women" ? currentTheme.pink : currentTheme.line,
                  borderRadius: 50,
                  width: "47.5%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
                  {language?.language?.Marketplace?.marketplace?.women}
                </Text>
              </Pressable>
              <Pressable
                onPress={
                  sex === "men"
                    ? () => dispatch(setSex("all"))
                    : () => dispatch(setSex("men"))
                }
                style={{
                  padding: 10,
                  borderWidth: 1,

                  borderColor:
                    sex === "men" ? currentTheme.pink : currentTheme.line,
                  borderRadius: 50,
                  width: "47.5%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
                  {language?.language?.Marketplace?.marketplace?.men}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </BlurView>

      <View
        style={{
          height: 80,
          width: "100%",
          backgroundColor: currentTheme.background2,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          paddingHorizontal: 15,
        }}
      >
        <Pressable
          onPress={() => {
            dispatch(setMaxPrice(""));
            dispatch(setMinPrice(""));
            dispatch(setSex("all"));
            dispatch(setType("everyone"));
            dispatch(setBrands([]));
            dispatch(setCategories([]));
            dispatch(setDiscounts(""));
          }}
          style={{
            padding: 5,
            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text
            style={{
              color: total > 0 ? currentTheme.pink : currentTheme.disabled,
              letterSpacing: 0.3,
              fontSize: 16,
            }}
          >
            {language?.language?.Marketplace?.marketplace?.clear}
          </Text>
          {total > 0 && (
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 50,
                backgroundColor: currentTheme.pink,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 3,
              }}
            >
              <Text style={{ fontSize: 10, color: "#fff" }}>{total}</Text>
            </View>
          )}
        </Pressable>
        <Pressable
          onPress={() => setOpenFilter(false)}
          style={{
            padding: 5,
          }}
        >
          {total === 0 ? (
            <MaterialIcons
              name="close"
              size={24}
              color={currentTheme.disabled}
            />
          ) : (
            <FontAwesome name="arrow-up" size={24} color={currentTheme.pink} />
          )}
        </Pressable>
      </View>
    </Modal>
  );
};

export default FilterPopup;

const styles = StyleSheet.create({
  priceInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    width: "47.5%",
    textAlign: "center",
  },
});
