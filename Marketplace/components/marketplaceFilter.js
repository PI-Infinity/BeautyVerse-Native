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
  FontAwesome,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const FilterPopup = ({
  openFilter,
  setOpenFilter,
  categories,
  brands,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categoryFilter,
  setCategoryFilter,
  discounts,
  setDiscounts,
  type,
  setType,
  sex,
  setSex,
  brand,
  setBrands,
}) => {
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

  // badge options

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
          backgroundColor: currentTheme.background,
        }}
      >
        <View
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 15,
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          <View style={{ alignItems: "center", padding: 5, width: "100%" }}>
            <Text
              style={{
                color: currentTheme.pink,
                letterSpacing: 0.5,
                fontSize: 16,
              }}
            >
              Categories:
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
                          setCategoryFilter(
                            categoryFilter.filter((i, x) => i !== item)
                          )
                      : () => setCategoryFilter([...categoryFilter, item])
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
            borderColor: currentTheme.line,
            padding: 15,
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          <View style={{ alignItems: "center", padding: 5, width: "100%" }}>
            <Text
              style={{
                color: currentTheme.pink,
                letterSpacing: 0.5,
                fontSize: 16,
              }}
            >
              Brands:
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
                      ? () => setBrands(brand.filter((i, x) => i !== item))
                      : brands?.length > 1 && !brand?.includes(item)
                      ? () => setBrands([...brand, item])
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
            borderColor: currentTheme.line,

            padding: 15,
            borderRadius: 10,
          }}
        >
          <View style={{ alignItems: "center", padding: 5, width: "100%" }}>
            <Text
              style={{
                color: currentTheme.pink,
                letterSpacing: 0.5,
                fontSize: 16,
              }}
            >
              Price Range:
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
              placeholder="Min Price"
              value={minPrice}
              onChangeText={(val) => setMinPrice(val)}
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
              placeholder="Max Price"
              value={maxPrice}
              onChangeText={(val) => setMaxPrice(val)}
              placeholderTextColor={currentTheme.disabled}
            />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            marginTop: 10,
            borderWidth: 1,
            borderColor: currentTheme.line,

            padding: 15,
            borderRadius: 10,
          }}
        >
          <View style={{ alignItems: "center", padding: 5, width: "100%" }}>
            <Text
              style={{
                color: currentTheme.pink,
                letterSpacing: 0.5,
                fontSize: 16,
              }}
            >
              Discounts:
            </Text>
          </View>
          <View style={styles.priceInputContainer}>
            <Pressable
              onPress={
                discounts === "with"
                  ? () => setDiscounts("")
                  : () => setDiscounts("with")
              }
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor:
                  discounts === "with" ? currentTheme.pink : currentTheme.line,
                borderRadius: 50,
                width: "47.5%",
                alignItems: "center",
              }}
            >
              <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
                Only with
              </Text>
            </Pressable>
            <Pressable
              onPress={
                discounts === "without"
                  ? () => setDiscounts("")
                  : () => setDiscounts("without")
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
              <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
                Only without
              </Text>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            marginVertical: 10,
            borderWidth: 1,
            borderColor: currentTheme.line,
            padding: 15,
            borderRadius: 10,
          }}
        >
          <View style={{ alignItems: "center", padding: 5, width: "100%" }}>
            <Text
              style={{
                color: currentTheme.pink,
                letterSpacing: 0.5,
                fontSize: 16,
              }}
            >
              Sex:
            </Text>
          </View>
          <View style={styles.priceInputContainer}>
            <Pressable
              onPress={
                sex === "women" ? () => setSex("all") : () => setSex("women")
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
                Women
              </Text>
            </Pressable>
            <Pressable
              onPress={
                sex === "men" ? () => setSex("all") : () => setSex("men")
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
                Men
              </Text>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: currentTheme.line,

            padding: 15,
            borderRadius: 10,
          }}
        >
          <View style={{ alignItems: "center", padding: 5, width: "100%" }}>
            <Text
              style={{
                color: currentTheme.pink,
                letterSpacing: 0.5,
                fontSize: 16,
              }}
            >
              Type:
            </Text>
          </View>
          <View style={styles.priceInputContainer}>
            <Pressable
              onPress={
                type === "everyone"
                  ? () => setType("")
                  : () => setType("everyone")
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
              <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
                For Everyone
              </Text>
            </Pressable>
            <Pressable
              onPress={
                type === "professionals"
                  ? () => setType("")
                  : () => setType("professionals")
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
              <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
                For Professionals
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
            setMaxPrice("");
            setMinPrice("");
            setSex("all");
            setType("everyone");
            setBrands([]);
            setCategoryFilter([]);
            setDiscounts("");
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
            Clear
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
