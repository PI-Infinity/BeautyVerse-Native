import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../../../components/alertMessage";
import ProcedureDurationPicker from "../../../components/durationList";
import ProcedurePricePicker from "../../../components/priceList";
import SearchableSelect from "../../../components/searchableSelect";
import { darkTheme, lightTheme } from "../../../context/theme";
import { ProceduresOptions } from "../../../datas/registerDatas";
import { setRerenderCurrentUser } from "../../../redux/rerenders";
import {
  AddCurrentUserProcedure,
  RemoveCurrentUserProcedure,
  UpdateCurrentUserProcedure,
} from "../../../redux/user";
import DeleteDialog from "../../../components/confirmDialog";
import { setLoading } from "../../../redux/app";
import { BackDrop } from "../../../components/backDropLoader";
import { Language } from "../../../context/language";
import { Header } from "./header";
import { AddNewProcedures } from "./addNewProcedures";

/**
 * User procedures in settings
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Procedures = ({ hideModal }) => {
  // define redux dispatch
  const dispatch = useDispatch();

  // defines language
  const language = Language();

  // define procedures option
  const proceduresOptions = ProceduresOptions();

  // define loader
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // split procedures value to find label
  const splited = proceduresOptions
    ?.map((item) => {
      let spltd = item?.value?.split(" - ");
      // Check if ' -' appears exactly 2 times
      if (spltd.length > 1) {
        return item;
      }
    })
    .filter(Boolean);

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // add procedure success message
  const [success, setSuccess] = useState(false);
  // remove procedure success message
  const [ItemId, setItemId] = useState(null);

  const [proc, setProc] = useState(null);

  // edit price popup
  const [editPrice, setEditPrice] = useState(false);

  // open duration popup
  const [visible, setVisible] = useState(false);

  const fadeDurationAnim = useRef(new Animated.Value(0)).current;
  const showDurationModal = () => {
    setVisible(true);
    Animated.timing(fadeDurationAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // edit procedure
  const EditProcedure = async (val) => {
    let updatedProcedure;

    if (val.duration) {
      updatedProcedure = {
        _id: proc._id,
        value: proc?.value,
        duration: val.duration,
        price: proc?.price,
      };
    } else if (val.price) {
      updatedProcedure = {
        _id: proc._id,
        value: proc?.value,
        duration: proc?.duration,
        price: val?.price,
      };
    }

    dispatch(
      UpdateCurrentUserProcedure({
        procedureId: proc._id,
        updatedProcedure,
      })
    );
    setEditPrice(false);

    try {
      await axios.patch(
        backendUrl +
          "/api/v1/users/" +
          currentUser._id +
          "/procedures/" +
          proc._id,
        val
      );
      setVisible(false);
      dispatch(setRerenderCurrentUser());
    } catch (error) {
      setEditPrice(false);
      Alert.alert(error.data.response.message);
    }
  };

  // delete procedure item
  const Deleting = async (itemId) => {
    setLoading(true);
    if (currentUser?.procedures?.length > 1) {
      dispatch(RemoveCurrentUserProcedure(itemId));
      const url =
        backendUrl + `/api/v1/users/${currentUser?._id}/procedures/${itemId}`;
      const response = await fetch(url, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => dispatch(setRerenderCurrentUser()))
        .then(() =>
          setTimeout(() => {
            setLoading(false);
          }, 1000)
        )
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    } else {
      Alert.alert("You cant delete last procedure");
    }
  };

  // define categories
  const [categories, setCategories] = useState([]);

  // define active category
  const [active, setActive] = useState("all");

  useEffect(() => {
    const cats = Array.from(
      new Set(currentUser.procedures.map((item) => item?.value.split(" - ")[0]))
    );
    setCategories(
      cats.map((item, index) => {
        let lab = proceduresOptions.find((it) => {
          return it?.value?.toLowerCase().includes(item?.toLowerCase());
        });
        return lab;
      })
    );
    setActive("all");
  }, [currentUser.procedures]);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 100);
  }, []);

  // scrolling ref
  const scrollRef = useRef();
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  // edit address modal
  const [openEditProcedure, setOpenEditProcedure] = useState({
    active: false,
    target: {},
  });

  return (
    <>
      <BackDrop loading={loading} setLoading={setLoading} />
      {loader ? (
        <View
          style={{
            height: 500,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={currentTheme.pink} />
        </View>
      ) : (
        <ScrollView
          bounces={Platform.OS === "ios" ? false : undefined}
          overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          keyboardShouldPersistTaps="handled"
          horizontal
          pagingEnabled
          ref={scrollRef}
          onScroll={(event) => {
            // Get current scroll position
            const position = event.nativeEvent.contentOffset;
            setScrollPosition(position);
          }}
        >
          <View
            style={{
              width: SCREEN_WIDTH,
              paddingBottom: 15,
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Header
              onBack={hideModal}
              title="Procedures"
              subScreen={{
                icon: (
                  <MaterialIcons
                    name="add"
                    size={24}
                    color={currentTheme.pink}
                  />
                ),
                title: "Add New Procedure",
                onPress: () =>
                  scrollRef.current.scrollTo({
                    x: SCREEN_WIDTH,
                    animated: true,
                  }),
              }}
            />
            <DeleteDialog
              isVisible={success}
              onClose={() => setSuccess(false)}
              onDelete={() => Deleting(ItemId)}
              delet="Remove"
              cancel="Cancel"
              title="Are you sure to want to delete this procedure?"
            />
            <View
              style={{
                width: SCREEN_WIDTH,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              {categories?.length > 1 && (
                <ScrollView
                  bounces={Platform.OS === "ios" ? false : undefined}
                  overScrollMode={Platform.OS === "ios" ? "never" : "always"}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.navigator}
                  contentContainerStyle={{
                    flexDirection: "row",
                    paddingRight: 30,
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setActive("all")}
                    style={[
                      active === "all"
                        ? styles.categoryButtonActive
                        : styles.categoryButton,

                      {
                        borderWidth: 1.5,
                        borderColor:
                          active === "all"
                            ? currentTheme.pink
                            : currentTheme.line,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          color: active === "all" ? currentTheme.pink : "#ccc",
                        },
                      ]}
                    >
                      {language?.language?.User?.userPage?.all}
                    </Text>
                  </TouchableOpacity>
                  {categories?.map((cat, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setActive(cat?.value)}
                      style={[
                        active.toLowerCase() === cat?.value.toLowerCase()
                          ? styles.categoryButtonActive
                          : styles.categoryButton,
                        {
                          borderWidth: 1.5,
                          borderColor:
                            active.toLowerCase() === cat?.value.toLowerCase()
                              ? currentTheme.pink
                              : currentTheme.line,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            color:
                              active.toLowerCase() === cat?.value.toLowerCase()
                                ? currentTheme.pink
                                : "#ccc",
                          },
                        ]}
                      >
                        {cat?.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <ScrollView
                style={{
                  height: SCREEN_HEIGHT - 150,
                  width: "95%",
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}
              >
                {currentUser.procedures
                  .filter((item) => {
                    if (active === "all" || categories?.length < 1) {
                      return item;
                    } else if (
                      item?.value.toLowerCase().includes(active.toLowerCase())
                    ) {
                      return item;
                    }
                  })
                  .map((item, index) => {
                    const label = splited.find((c) => item?.value === c.value);
                    return (
                      <View
                        style={[
                          styles.item,
                          {
                            // backgroundColor: currentTheme.background2,
                            gap: 8,
                          },
                        ]}
                        key={index}
                      >
                        <View>
                          <Text
                            style={{
                              color: currentTheme.font,
                              letterSpacing: 0.2,
                            }}
                          >
                            {label?.label}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            onPress={() => {
                              setEditPrice(true);
                              setProc(item);
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              borderWidth: 1,
                              borderColor: currentTheme.line,
                              borderRadius: 5,
                              padding: 5,
                              paddingVertical: 2.5,
                              width: 70,
                            }}
                          >
                            <Text
                              style={{
                                color: currentTheme.font,
                                padding: 5,
                                letterSpacing: 0.2,
                              }}
                            >
                              {item.price}
                            </Text>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                              }}
                            >
                              {currentUser?.currency === "Dollar" ? (
                                <FontAwesome
                                  name="dollar"
                                  color={currentTheme.pink}
                                  size={14}
                                />
                              ) : currentUser?.currency === "Euro" ? (
                                <FontAwesome
                                  name="euro"
                                  color={currentTheme.pink}
                                  size={14}
                                />
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
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            acitveOpacity={2}
                            onPress={() => {
                              showDurationModal();
                              setProc(item);
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              borderWidth: 1,
                              borderColor: currentTheme.line,
                              padding: 5,
                              paddingVertical: 2.5,
                              width: item.duration ? 120 : 50,
                              justifyContent: "center",
                              marginLeft: 8,
                              borderRadius: 5,
                            }}
                          >
                            {item.duration && (
                              <Text
                                style={{
                                  color: currentTheme.font,
                                  padding: 5,
                                  letterSpacing: 0.2,
                                }}
                              >
                                {item.duration < 60
                                  ? item.duration + " min."
                                  : item.duration >= 60
                                  ? Math.floor(item.duration / 60) +
                                    "h" +
                                    (item.duration % 60 > 0
                                      ? " " + (item.duration % 60) + " min."
                                      : "")
                                  : "0h"}
                              </Text>
                            )}
                            <FontAwesome5
                              name="clock"
                              color={currentTheme.pink}
                              size={16}
                            />
                          </TouchableOpacity>
                        </View>
                        {currentUser?.procedures?.length > 1 && (
                          <View
                            style={{ position: "absolute", top: 8, right: 8 }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                setItemId(item._id);
                                setSuccess(true);
                              }}
                              style={{ flex: 0.5, alignItems: "flex-end" }}
                            >
                              <FontAwesome5
                                name="times"
                                color="red"
                                size={20}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })}
                <ProcedurePricePicker
                  currentTheme={currentTheme}
                  isVisible={editPrice}
                  setEditPrice={setEditPrice}
                  closeModal={EditProcedure}
                  oldPrice={proc?.price}
                  // fadeAnim={fadeDurationAnim}
                />
                <ProcedureDurationPicker
                  currentTheme={currentTheme}
                  visible={visible}
                  setVisible={setVisible}
                  fadeAnim={fadeDurationAnim}
                  EditProcedure={EditProcedure}
                />
              </ScrollView>
            </View>
          </View>
          <View>
            <AddNewProcedures
              onBack={() =>
                scrollRef.current.scrollTo({ x: 0, animated: true })
              }
            />
          </View>
        </ScrollView>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  item: {
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: "center",
    marginHorizontal: 0,
    marginTop: 5,
  },
  input: {
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 14,
    letterSpacing: 0.2,
    //
  },
  text: {
    color: "white",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  navigator: {
    width: "100%",
    marginTop: 10,
    paddingLeft: 15,
  },
  categoryButton: {
    borderRadius: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    height: 30,
    justifyContent: "center",
  },
  categoryButtonActive: {
    paddingHorizontal: 15,
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
});
