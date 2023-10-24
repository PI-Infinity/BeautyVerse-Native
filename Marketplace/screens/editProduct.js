import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  Dimensions,
  Alert,
  Vibration,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import CategoryList from "../../Marketplace/components/categoryList";
import { ProceduresOptions } from "../../datas/registerDatas";
import {
  Entypo,
  FontAwesome,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import InputFile from "../../Marketplace/components/fileInput";
import Variants from "../../Marketplace/components/variants";
import uuid from "react-native-uuid";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "../../firebase";
import { BackDrop } from "../../components/backDropLoader";
import { useNavigation } from "@react-navigation/native";
import { setRerenderProducts } from "../../redux/Marketplace";
import DeleteConfirmPopup from "../../components/confirmDialog";
import CountryFlag from "react-native-country-flag";
import { Circle } from "../../components/skeltons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const EditProduct = ({ route }) => {
  //
  const Product = route.params.product;
  // defines backendUrl
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // defines current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // language state
  const language = Language();
  const lang = useSelector((state) => state.storeApp.language);
  // language activator
  const [inputLanguage, setInputLanguage] = useState("us");
  useEffect(() => {
    setInputLanguage(lang === "en" ? "us" : lang === "ka" ? "ge" : "ru");
  }, [lang]);

  // defines dispatch
  const dispatch = useDispatch();

  // naviagtion
  const navigation = useNavigation();

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // loading state
  const [loading, setLoading] = useState(false);

  // categories
  const categoriesList = ProceduresOptions();

  // input refs
  const brandRef = useRef();
  const priceRef = useRef();
  const saleRef = useRef();
  const stockRef = useRef();
  const shortDescRef = useRef();
  const fullDescRef = useRef();
  const howToUseRef = useRef();
  const compositionsRef = useRef();
  const variantsRef = useRef();

  // category list modal opening state
  const [isModalVisible, setIsModalVisible] = useState(false);

  // field states
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState("everyone");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [sale, setSale] = useState(null);
  const [inStock, setInStock] = useState(null);
  const [sex, setSex] = useState("all");
  const [shortDescription, setShortDescription] = useState("");
  const [shortDescriptionRu, setShortDescriptionRu] = useState("");
  const [shortDescriptionKa, setShortDescriptionKa] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [fullDescriptionRu, setFullDescriptionRu] = useState("");
  const [fullDescriptionKa, setFullDescriptionKa] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [howToUseRu, setHowToUseRu] = useState("");
  const [howToUseKa, setHowToUseKa] = useState("");
  const [compositons, setCompositions] = useState("");
  const [compositonsRu, setCompositionsRu] = useState("");
  const [compositonsKa, setCompositionsKa] = useState("");
  const [variants, setVariants] = useState([]);
  const [files, setFiles] = useState([]);
  const [cover, setCover] = useState(0);

  useEffect(() => {
    setActive(Product?.active);
    setTitle(Product?.title);
    setCategories(Product?.categories);
    setType(Product?.type);
    setBrand(Product?.brand);
    setPrice(Product?.price);
    setCurrency(currentUser.currency);
    setSale(Product?.sale);
    setInStock(Product?.inStock);
    setSex(Product?.sex);
    setShortDescription(Product?.shortDescription?.en);
    setShortDescriptionRu(Product?.shortDescription?.ru);
    setShortDescriptionKa(Product?.shortDescription?.ka);
    setFullDescription(Product?.description?.en);
    setFullDescriptionRu(Product?.description?.ru);
    setFullDescriptionKa(Product?.description?.ka);
    setHowToUse(Product?.howToUse?.en);
    setHowToUseRu(Product?.howToUse?.ru);
    setHowToUseKa(Product?.howToUse?.ka);
    setCompositions(Product?.compositions?.en);
    setCompositionsRu(Product?.compositions?.ru);
    setCompositionsKa(Product?.compositions?.ka);
    setVariants(Product?.variants);
    setFiles(Product?.gallery);
    setCover(Product?.cover);
  }, []);

  // variants list modal opening state
  const [isModalVisibleVariants, setIsModalVisibleVariants] = useState(false);

  // if delete old files, this function checks and deletes from cloud.
  const func = async () => {
    const filePath = `marketplace/${currentUser?._id}/products/images/${route.params.product.gallery[0].folder}`;
    const fileRef = ref(storage, filePath);

    listAll(fileRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          let imgId =
            itemRef._location.path_.split("/")[
              itemRef._location.path_.split("/")?.length - 1
            ];
          let imgDefined = files.find((i) => i.imgId === imgId);
          if (!imgDefined) {
            deleteObject(itemRef).then(async () => {
              console.log("deleted");
            });
          }
        });
      })
      .catch((error) => {
        console.log("error : " + error);
      });
  };

  /**
   * Active product
   */
  const ActiveProduct = async (value) => {
    try {
      setActive(value);
      await axios.patch(
        backendUrl + "/api/v1/marketplace/" + route.params.product._id,
        { active: value }
      );
      dispatch(setRerenderProducts());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * Add product function
   */
  const UploadProduct = async () => {
    if (files?.length < 1) {
      return Alert.alert("The product must have any image!");
    }
    if (title?.length < 3) {
      return Alert.alert("Title must include min. 3 symbols!");
    }
    if (categories?.length < 1) {
      return Alert.alert("The product must have a category!");
    }
    if (brand?.length < 1) {
      return Alert.alert("The product must have a brand!");
    }
    if (!price) {
      return Alert.alert("The product must have a price!");
    }
    // if (!inStock) {
    //   return Alert.alert("Please add in stock quantity!");
    // }
    if (
      shortDescription?.length < 1 &&
      shortDescriptionKa?.length < 1 &&
      shortDescriptionRu?.length < 1
    ) {
      return Alert.alert("Short Description not defined!");
    }
    setLoading(true);
    // convert file to blob

    await func();

    async function uriToBlob(uri) {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        const response = await fetch(uri);
        return await response.blob();
      }
    }
    const AddFileInCloud = async (index, folder, uri) => {
      let imgId = title + uuid.v4();
      let fileRef = ref(
        storage,
        `marketplace/${currentUser?._id}/products/images/${folder}/${imgId}/`
      );
      const blb = await uriToBlob(uri);

      if (fileRef) {
        // add desktop version
        const snapshot = await uploadBytesResumable(fileRef, blb);
        const url = await getDownloadURL(snapshot.ref);
        return { url: url, imgId: imgId, folder: folder };
      }
    };
    let folderId = route.params.product.gallery[0].folder;

    const uploadPromises = files.map(async (file, index) => {
      if (file.uri) {
        return await AddFileInCloud(index, folderId, file.uri);
      } else {
        return {
          url: file.url,
          imgId: file.imgId,
          folder: file.folder,
        };
      }
    });

    Promise.all(uploadPromises).then(async (uploadedUrls) => {
      try {
        const product = {
          _id: route?.params.product._id,
          title: title,
          categories: categories,
          type: type,
          brand: brand,
          price: price,
          currency: currency,
          sale: sale,
          inStock: inStock,
          sex: sex,
          shortDescription: {
            en: shortDescription,
            ru: shortDescriptionRu,
            ka: shortDescriptionKa,
          },
          description: {
            en: fullDescription,
            ru: fullDescriptionRu,
            ka: fullDescriptionKa,
          },
          howToUse: {
            en: howToUse,
            ru: howToUseRu,
            ka: howToUseKa,
          },
          compositions: {
            en: compositons,
            ru: compositonsRu,
            ka: compositonsKa,
          },
          variants: variants?.map((i, x) => {
            return i;
          }),
          cover: cover,
          gallery: uploadedUrls,
          totalOrders: 0,
          owner: currentUser?._id,
          lastOrderDate: new Date(),
          reviews: [],
        };
        const response = await axios.patch(
          backendUrl + "/api/v1/marketplace/" + route.params.product._id,
          product
        );
        dispatch(setRerenderProducts());
        setTimeout(() => {
          navigation.navigate("Products");
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error(error.response.data.message);
        setTimeout(async () => {
          setLoading(false);
        }, 2000);
      }
    });
  };

  /**
   * Dublicate product
   */
  /**
   * Add product function
   */

  const product = {
    title: Product?.title + " (copy)",
    categories: Product?.categories,
    type: Product?.type,
    brand: Product?.brand,
    price: Product?.price,
    currency: Product?.currency,
    sale: Product?.sale,
    inStock: Product?.inStock,
    sex: Product?.sex,
    shortDescription: Product?.shortDescription,
    description: Product?.description,
    howToUse: Product?.howToUse,
    compositions: Product?.compositions,
    variants: Product?.variants,
    cover: Product?.cover,
    gallery: Product?.gallery,
    totalOrders: 0,
    owner: Product?.owner,
    lastOrderDate: new Date(),
    reviews: [],
  };

  async function duplicateFolder() {
    let folderId = route.params.product.gallery[0].folder;
    const sourceFolder = `marketplace/${currentUser?._id}/products/images/${folderId}/`;
    let newfolderId = currentUser?._id + title + brand + uuid.v4();
    const destinationFolder = `marketplace/${currentUser?._id}/products/images/${newfolderId}/`;

    const sourceReference = ref(storage, sourceFolder);
    const listResult = await listAll(sourceReference);

    const newGallery = [];

    const copyPromises = listResult.items.map(async (item) => {
      const sourcePath = `${sourceFolder}${item.name}`;
      const destinationPath = `${destinationFolder}${item.name}`;

      const url = await getDownloadURL(ref(storage, sourcePath));
      const response = await fetch(url);
      const blob = await response.blob();
      await uploadBytesResumable(ref(storage, destinationPath), blob);
      const newObj = { url: url, imgId: item.name, folder: newfolderId };
      newGallery.push(newObj); // Collect new URLs and meta-data.
      return newObj;
    });

    try {
      await Promise.all(copyPromises);
      console.log("Folder duplicated successfully");
      return newGallery; // Return the new URLs and meta-data.
    } catch (error) {
      console.error("Error duplicating folder:", error);
      throw error; // Throwing the error to be caught in Dublicate.
    }
  }

  const Dublicate = async () => {
    if (files?.length < 1) {
      return Alert.alert("The product must have any image!");
    }
    if (title?.length < 3) {
      return Alert.alert("Title must include min. 3 symbols!");
    }
    if (categories?.length < 1) {
      return Alert.alert("The product must have a category!");
    }
    if (brand?.length < 1) {
      return Alert.alert("The product must have a brand!");
    }
    if (!price) {
      return Alert.alert("The product must have a price!");
    }
    // if (!inStock) {
    //   return Alert.alert("Please add in stock quantity!");
    // }
    if (
      shortDescription?.length < 1 &&
      shortDescriptionKa?.length < 1 &&
      shortDescriptionRu?.length < 1
    ) {
      return Alert.alert("Short Description not defined!");
    }
    setLoading(true);
    // convert file to blob

    try {
      const newGallery = await duplicateFolder(); // Await the new URLs from folder duplication.

      // Use the new URLs to create a new product on your backend.
      await axios.post(backendUrl + "/api/v1/marketplace", {
        ...product,
        gallery: newGallery, // Overwrite the gallery with new URLs.
      });

      dispatch(setRerenderProducts());
      setTimeout(() => {
        navigation.navigate("Products");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error.response.data.message);
      setTimeout(async () => {
        setLoading(false);
      }, 2000);
    }
  };

  /**
   * Delete product
   *
   */

  // confirm delete product
  const [confirmPopup, setConfirmPopup] = useState(false);

  const DeleteProduct = async () => {
    try {
      const filePath = `marketplace/${currentUser?._id}/products/images/${route.params.product.gallery[0].folder}`;
      const fileRef = ref(storage, filePath);

      listAll(fileRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            deleteObject(itemRef).then(async () => {
              console.log("deleted");
            });
          });
        })
        .catch((error) => {
          console.log("error : " + error);
        });
      await axios.delete(
        backendUrl + "/api/v1/marketplace/" + route.params.product._id
      );

      dispatch(setRerenderProducts());

      setTimeout(() => {
        navigation.navigate("Products");
      }, 500);
    } catch (error) {
      console.error("Delete Product Error:", error);
      console.log(
        error.response?.data.message ||
          "An error occurred while deleting the product."
      );
    }
  };

  return (
    <KeyboardAvoidingView // <-- Add this wrapper
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
    >
      <DeleteConfirmPopup
        isVisible={confirmPopup}
        onClose={() => setConfirmPopup(false)}
        title="Are you sure to want to delete this product?"
        cancel="Cancel"
        delet="Delete"
        onDelete={DeleteProduct}
      />
      <BackDrop loading={loading} setLoading={setLoading} />
      <CategoryList
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        categories={categories}
        setCategories={setCategories}
        categoriesList={categoriesList}
      />
      <Variants
        isModalVisible={isModalVisibleVariants}
        setIsModalVisible={setIsModalVisibleVariants}
        setVariants={setVariants}
        variants={variants}
        currentProduct={Product}
      />
      <ScrollView
        style={[styles.container, {}]}
        contentContainerStyle={{
          alignItems: "center",
          padding: 15,
          gap: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 15,
          }}
        >
          {(title?.length > 0 ||
            categories?.length > 0 ||
            brand?.length > 0 ||
            price ||
            sale ||
            inStock ||
            sex !== "all",
          type !== "everyone" ||
            shortDescription?.length > 0 ||
            shortDescriptionKa?.length > 0 ||
            shortDescriptionRu?.length > 0 ||
            fullDescription?.length > 0 ||
            fullDescriptionKa?.length > 0 ||
            fullDescriptionRu?.length > 0 ||
            howToUse?.length > 0 ||
            howToUseKa?.length > 0 ||
            howToUseRu?.length > 0 ||
            compositons?.length > 0 ||
            compositonsKa?.length > 0 ||
            compositonsRu?.length > 0 ||
            variants?.length > 0 ||
            files?.length > 0) && (
            <Pressable
              onPress={() => {
                setTitle("");
                setSex("all");
                setCategories([]);
                setBrand("");
                setPrice(null);
                setCurrency(null);
                setSale(null);
                setInStock(null);
                setShortDescription("");
                setShortDescriptionRu("");
                setShortDescriptionKa("");
                setFullDescription("");
                setFullDescriptionRu("");
                setFullDescriptionKa("");
                setHowToUse("");
                setHowToUseRu("");
                setHowToUseKa("");
                setCompositions("");
                setCompositionsRu("");
                setCompositionsKa("");
                setVariants([]);
                setFiles([]);
                setCover(0);
                setType("everyone");
              }}
              style={{ position: "relative" }}
            >
              <Text style={{ color: "red", letterSpacing: 0.3 }}>
                {language?.language?.Marketplace?.marketplace?.clearAllFields}
              </Text>
            </Pressable>
          )}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <Pressable onPress={() => ActiveProduct(active ? false : true)}>
              <Octicons
                name={active ? "eye" : "eye-closed"}
                style={{ marginRight: 3 }}
                size={22}
                color={active ? currentTheme.pink : currentTheme.disabled}
              />
            </Pressable>
            <Pressable
              onPress={() => Dublicate()}
              style={{ position: "relative" }}
            >
              <MaterialIcons
                color={currentTheme.font}
                name="content-copy"
                size={19}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setConfirmPopup(true);
                Vibration.vibrate();
              }}
              style={{ position: "relative" }}
            >
              <MaterialIcons color="red" name="delete" size={24} />
            </Pressable>
          </View>
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              overflow: "hidden",
              paddingHorizontal: 15,

              borderColor: currentTheme.line,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
              {language?.language?.Marketplace?.marketplace?.files}
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              gap: 15,
              paddingRight: 65,
            }}
            style={{ width: SCREEN_WIDTH }}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={Platform.OS === "ios" ? false : undefined}
            overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          >
            <InputFile
              files={files}
              setFiles={setFiles}
              currentTheme={currentTheme}
            />
            {files?.map((i, x) => {
              return (
                <Pressable onPress={() => setCover(x)} key={x}>
                  {x === cover && (
                    <View
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        zIndex: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: currentTheme.pink,
                          letterSpacing: 0.3,
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        {language?.language?.Marketplace?.marketplace?.cover}
                      </Text>
                    </View>
                  )}
                  {x !== cover && (
                    <Pressable
                      onPress={() => {
                        setFiles((prev) => prev.filter((item) => item !== i));
                        setCover(0);
                      }}
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        zIndex: 10,
                        padding: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          letterSpacing: 0.3,
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        X
                      </Text>
                    </Pressable>
                  )}

                  <Img x={x} i={i} currentTheme={currentTheme} cover={cover} />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 3 }}>
              <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
                {language?.language?.Marketplace?.marketplace?.title}
              </Text>
            </View>
          </View>
          <TextInput
            value={title}
            placeholder={
              language?.language?.Marketplace?.marketplace?.addProductName
            }
            placeholderTextColor={currentTheme.disabled}
            style={[
              styles.inputField,
              {
                borderColor: currentTheme.line,
                color: currentTheme.pink,
              },
            ]}
            onChangeText={(val) => setTitle(val)}
            returnKeyType="next"
            onSubmitEditing={() => setIsModalVisible(true)}
          />
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              marginVertical: 10,
              borderColor: currentTheme.line,
            },
          ]}
        >
          <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
            {language?.language?.Marketplace?.marketplace?.type}
          </Text>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity
              onPress={() => setType("everyone")}
              style={{
                padding: 8,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor:
                  type !== "professionals"
                    ? currentTheme.pink
                    : currentTheme.line,
                width: "45%",

                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color:
                    type === "professionals"
                      ? currentTheme.font
                      : currentTheme.pink,
                  letterSpacing: 0.3,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.forEveryone}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType("professionals")}
              style={{
                padding: 8,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor:
                  type === "professionals"
                    ? currentTheme.pink
                    : currentTheme.line,
                width: "45%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color:
                    type !== "professionals"
                      ? currentTheme.font
                      : currentTheme.pink,
                  letterSpacing: 0.3,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.forProfessionals}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              marginVertical: 10,
              borderColor: currentTheme.line,
            },
          ]}
        >
          <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
            {language?.language?.Marketplace?.marketplace?.sex}
          </Text>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity
              onPress={() => setSex("all")}
              style={{
                padding: 8,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor:
                  sex === "all" ? currentTheme.pink : currentTheme.line,
                width: "30%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: sex === "all" ? currentTheme.pink : currentTheme.font,
                  letterSpacing: 0.3,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.all}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSex("women")}
              style={{
                padding: 8,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor:
                  sex === "women" ? currentTheme.pink : currentTheme.line,
                width: "30%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color:
                    sex === "women" ? currentTheme.pink : currentTheme.font,
                  letterSpacing: 0.3,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.women}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSex("men")}
              style={{
                padding: 8,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor:
                  sex === "men" ? currentTheme.pink : currentTheme.line,
                width: "30%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: sex === "men" ? currentTheme.pink : currentTheme.font,
                  letterSpacing: 0.3,
                }}
              >
                {language?.language?.Marketplace?.marketplace?.men}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
            {language?.language?.Marketplace?.marketplace?.categories}
          </Text>
          <View
            style={{
              gap: categories?.length > 0 ? 8 : 0,
              marginVertical: categories?.length > 0 ? 15 : 0,
            }}
          >
            {categories?.map((it, x) => {
              let lab = categoriesList?.find((i) => i.value === it);
              return (
                <View
                  key={it}
                  style={{
                    width: "80%",
                    flexDirection: "row",
                    padding: 8,
                    borderRadius: 50,
                    backgroundColor: currentTheme.pink,
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ color: "#fff" }}>{lab.label}</Text>
                  <MaterialIcons
                    name="close"
                    color="red"
                    size={18}
                    onPress={() =>
                      setCategories((prev) => prev?.filter((i) => i !== it))
                    }
                  />
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={[
              styles.inputField,
              {
                borderColor: currentTheme.line,
                color: currentTheme.font,
              },
            ]}
          >
            <Text
              style={{
                borderColor: currentTheme.line,
                color:
                  categories?.length > 0
                    ? currentTheme.pink
                    : currentTheme.font,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.choiceCategory}...
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
            {language?.language?.Marketplace?.marketplace?.brand}
          </Text>
          <TextInput
            value={brand}
            ref={brandRef}
            placeholder={
              language?.language?.Marketplace?.marketplace?.addBrandName
            }
            placeholderTextColor={currentTheme.disabled}
            style={[
              styles.inputField,
              {
                borderColor: currentTheme.line,
                color: currentTheme.pink,
              },
            ]}
            onChangeText={(val) => setBrand(val)}
            returnKeyType="next"
            onSubmitEditing={() => priceRef.current?.focus()}
          />
        </View>
        <View
          style={[styles.fieldContainer, { borderColor: currentTheme.line }]}
        >
          <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
            {language?.language?.Marketplace?.marketplace?.price}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 15,
            }}
          >
            <TextInput
              value={price?.toString()}
              keyboardType="numeric"
              ref={priceRef}
              placeholder={
                language?.language?.Marketplace?.marketplace?.addPrice
              }
              placeholderTextColor={currentTheme.disabled}
              style={[
                styles.inputField,
                {
                  borderColor: currentTheme.line,
                  color: currentTheme.pink,
                  width: "50%",
                },
              ]}
              onChangeText={(val) => setPrice(val)}
              returnKeyType="next"
              onSubmitEditing={() => saleRef.current?.focus()}
            />
            <Pressable
              style={{ padding: 8, marginRight: 8 }}
              onPress={() =>
                setCurrency(
                  !currency || currency === "dollar"
                    ? "euro"
                    : currency === "euro"
                    ? "lari"
                    : "dollar"
                )
              }
            >
              <View
                style={{
                  width: 30,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {!currency || currency === "dollar" ? (
                  <FontAwesome
                    name="dollar"
                    color={currentTheme.pink}
                    size={20}
                  />
                ) : currency === "euro" ? (
                  <FontAwesome
                    name="euro"
                    color={currentTheme.pink}
                    size={20}
                  />
                ) : (
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: currentTheme.pink,
                      fontSize: 20,
                    }}
                  >
                    {"\u20BE"}
                  </Text>
                )}
                <Entypo
                  name="select-arrows"
                  color={currentTheme.font}
                  size={12}
                />
              </View>
            </Pressable>
          </View>
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
            {language?.language?.Marketplace?.marketplace?.sale} % (
            {language?.language?.Marketplace?.marketplace?.optional})
          </Text>
          <TextInput
            value={sale?.toString()}
            keyboardType="numeric"
            ref={saleRef}
            placeholder={language?.language?.Marketplace?.marketplace?.addSale}
            placeholderTextColor={currentTheme.disabled}
            style={[
              styles.inputField,
              {
                borderColor: currentTheme.line,
                color: currentTheme.pink,
                width: "50%",
              },
            ]}
            onChangeText={(val) => setSale(val)}
            returnKeyType="next"
            onSubmitEditing={() => stockRef.current?.focus()}
          />
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
            {language?.language?.Marketplace?.marketplace?.inStock} (
            {language?.language?.Marketplace?.marketplace?.optional})
          </Text>
          <TextInput
            keyboardType="numeric"
            value={inStock?.toString()}
            ref={stockRef}
            placeholder={
              language?.language?.Marketplace?.marketplace?.addInStock
            }
            placeholderTextColor={currentTheme.disabled}
            style={[
              styles.inputField,
              {
                borderColor: currentTheme.line,
                color: currentTheme.pink,
                width: "50%",
              },
            ]}
            onChangeText={(val) => setInStock(val)}
            returnKeyType="next"
            onSubmitEditing={() => shortDescRef.current?.focus()}
          />
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
            {language?.language?.Marketplace?.marketplace?.variants} (
            {language?.language?.Marketplace?.marketplace?.optional})
          </Text>
          <View
            style={{
              gap: variants?.length > 0 ? 8 : 0,
              marginVertical: variants?.length > 0 ? 15 : 0,
            }}
          >
            {variants?.map((it, x) => {
              return (
                <View
                  key={it._id}
                  style={{
                    width: "80%",
                    minWidth: "80%",
                    flexDirection: "row",
                    padding: 4,
                    borderRadius: 50,
                    backgroundColor: currentTheme.pink,
                    alignItems: "center",
                    justifyContent: "space-between",
                    // paddingHorizontal: 15,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      key={it?.gallery[it.cover]?.url}
                      style={{ width: 40, height: 40, borderRadius: 50 }}
                      source={{ uri: it?.gallery[it.cover]?.url }}
                    />
                    <Text style={{ color: "#fff", fontSize: 16 }}>
                      {it.title}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="close"
                    color="red"
                    size={22}
                    onPress={() =>
                      setVariants((prev) => prev?.filter((i) => i !== it))
                    }
                    style={{ marginRight: 4 }}
                  />
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            onPress={() => setIsModalVisibleVariants(true)}
            style={[
              styles.inputField,
              {
                borderColor: currentTheme.line,
                color: currentTheme.font,
              },
            ]}
          >
            <Text
              style={{
                borderColor: currentTheme.line,
                color:
                  variants?.length > 0 ? currentTheme.pink : currentTheme.font,
              }}
            >
              {language?.language?.Marketplace?.marketplace?.choiceVariants}...
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 3 }}>
              <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
                {language?.language?.Marketplace?.marketplace?.shortDescription}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 4, flex: 1 }}>
              <TouchableOpacity
                onPress={() => setInputLanguage("us")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="us"
                  size={10}
                  style={{ opacity: inputLanguage === "us" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputLanguage("ge")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="ge"
                  size={10}
                  style={{ opacity: inputLanguage === "ge" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputLanguage("ru")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="ru"
                  size={10}
                  style={{ opacity: inputLanguage === "ru" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            value={
              inputLanguage === "us"
                ? shortDescription
                : inputLanguage === "ru"
                ? shortDescriptionRu
                : shortDescriptionKa
            }
            ref={shortDescRef}
            placeholder={
              language?.language?.Marketplace?.marketplace?.addShortDescriptions
            }
            placeholderTextColor={currentTheme.disabled}
            multiline
            numberOfLines={15}
            maxLength={600}
            style={[
              styles.inputField,

              {
                borderColor: currentTheme.line,
                color: currentTheme.pink,
                height: 150,
                borderRadius: 10,
                paddingTop: 15,
              },
            ]}
            onChangeText={
              inputLanguage === "us"
                ? (val) => setShortDescription(val)
                : inputLanguage === "ru"
                ? (val) => setShortDescriptionRu(val)
                : (val) => setShortDescriptionKa(val)
            }
            returnKeyType="next"
            onSubmitEditing={() => fullDescRef.current?.focus()}
          />
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 3 }}>
              <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
                {language?.language?.Marketplace?.marketplace?.fullDescription}{" "}
                ({language?.language?.Marketplace?.marketplace?.optional})
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 4, flex: 1 }}>
              <TouchableOpacity
                onPress={() => setInputLanguage("us")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="us"
                  size={10}
                  style={{ opacity: inputLanguage === "us" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputLanguage("ge")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="ge"
                  size={10}
                  style={{ opacity: inputLanguage === "ge" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputLanguage("ru")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="ru"
                  size={10}
                  style={{ opacity: inputLanguage === "ru" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            value={
              inputLanguage === "us"
                ? fullDescription
                : inputLanguage === "ru"
                ? fullDescriptionRu
                : fullDescriptionKa
            }
            onChangeText={
              inputLanguage === "us"
                ? (val) => setFullDescription(val)
                : inputLanguage === "ru"
                ? (val) => setFullDescriptionRu(val)
                : (val) => setFullDescriptionKa(val)
            }
            ref={fullDescRef}
            placeholder={
              language?.language?.Marketplace?.marketplace?.addFullDescription
            }
            placeholderTextColor={currentTheme.disabled}
            multiline
            numberOfLines={15}
            maxLength={1200}
            style={[
              styles.inputField,

              {
                borderColor: currentTheme.line,
                color: currentTheme.pink,
                height: 300,
                borderRadius: 10,
                paddingTop: 15,
              },
            ]}
            returnKeyType="next"
            onSubmitEditing={() => howToUseRef.current?.focus()}
          />
        </View>
        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 3 }}>
              <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
                {language?.language?.Marketplace?.marketplace?.howToUse} (
                {language?.language?.Marketplace?.marketplace?.optional})
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 4, flex: 1 }}>
              <TouchableOpacity
                onPress={() => setInputLanguage("us")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="us"
                  size={10}
                  style={{ opacity: inputLanguage === "us" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputLanguage("ge")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="ge"
                  size={10}
                  style={{ opacity: inputLanguage === "ge" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputLanguage("ru")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="ru"
                  size={10}
                  style={{ opacity: inputLanguage === "ru" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            value={
              inputLanguage === "us"
                ? howToUse
                : inputLanguage === "ru"
                ? howToUseRu
                : howToUseKa
            }
            onChangeText={
              inputLanguage === "us"
                ? (val) => setHowToUse(val)
                : inputLanguage === "ru"
                ? (val) => setHowToUseRu(val)
                : (val) => setHowToUseKa(val)
            }
            ref={howToUseRef}
            placeholder={
              language?.language?.Marketplace?.marketplace?.addHowToUse
            }
            placeholderTextColor={currentTheme.disabled}
            multiline
            numberOfLines={15}
            maxLength={800}
            style={[
              styles.inputField,

              {
                borderColor: currentTheme.line,
                color: currentTheme.pink,
                height: 300,
                borderRadius: 10,
                paddingTop: 15,
              },
            ]}
            returnKeyType="next"
            onSubmitEditing={() => compositionsRef.current?.focus()}
          />
        </View>

        <View
          style={[
            styles.fieldContainer,
            {
              borderColor: currentTheme.line,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 3 }}>
              <Text style={[styles.fieldTitle, { color: currentTheme.font }]}>
                {language?.language?.Marketplace?.marketplace?.compositions} (
                {language?.language?.Marketplace?.marketplace?.optional})
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 4, flex: 1 }}>
              <TouchableOpacity
                onPress={() => setInputLanguage("us")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="us"
                  size={10}
                  style={{ opacity: inputLanguage === "us" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputLanguage("ge")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="ge"
                  size={10}
                  style={{ opacity: inputLanguage === "ge" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputLanguage("ru")}
                style={{ padding: 5 }}
              >
                <CountryFlag
                  isoCode="ru"
                  size={10}
                  style={{ opacity: inputLanguage === "ru" ? 1 : 0.3 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            value={
              inputLanguage === "us"
                ? compositons
                : inputLanguage === "ru"
                ? compositonsRu
                : compositonsKa
            }
            onChangeText={
              inputLanguage === "us"
                ? (val) => setCompositions(val)
                : inputLanguage === "ru"
                ? (val) => setCompositionsRu(val)
                : (val) => setCompositionsKa(val)
            }
            ref={compositionsRef}
            placeholder={
              language?.language?.Marketplace?.marketplace?.addCompositions
            }
            placeholderTextColor={currentTheme.disabled}
            multiline
            numberOfLines={15}
            maxLength={600}
            style={[
              styles.inputField,

              {
                borderColor: currentTheme.line,
                color: currentTheme.pink,
                height: 300,
                borderRadius: 10,
                paddingTop: 15,
              },
            ]}
            returnKeyType="next"
            onSubmitEditing={() => variantsRef.current?.focus()}
          />
        </View>

        <TouchableOpacity
          onPress={UploadProduct}
          style={{
            width: "45%",
            borderRadius: 50,
            backgroundColor: currentTheme.pink,
            padding: 8,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20,
          }}
        >
          <Text style={{ color: "#fff" }}>
            {language?.language?.Marketplace?.marketplace?.save}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  container: { flex: 1 },
  fieldContainer: {
    width: "100%",
    gap: 10,
    borderWidth: 1,
    borderColor: "red",
    padding: 15,
    borderRadius: 10,
  },
  fieldTitle: { fontSize: 16, fontWeight: "bold", letterSpacing: 0.5 },
  inputField: {
    borderWidth: 1,
    letterSpacing: 0.3,
    borderWidth: 2,
    borderRadius: 50,
    padding: 15,
  },
});

const Img = ({ x, cover, currentTheme, i }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View
      style={{
        width: 150,
        aspectRatio: 1,
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      {loading && <Circle />}
      <Image
        style={{
          aspectRatio: 1,
          width: 150,
          borderRadius: 5,
          resizeMode: "cover",
          borderWidth: 2,
          borderColor: x === cover ? currentTheme.pink : "transparent",
          borderRadius: 10,
        }}
        source={{ uri: i.uri || i.url }}
        onLoad={() => setLoading(false)}
      />
    </View>
  );
};
