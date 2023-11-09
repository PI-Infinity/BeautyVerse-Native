import { FontAwesome, Fontisto, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Showroom from "../../Marketplace/components/shworoom";
import { CacheableImage } from "../../components/cacheableImage";
import ConfirmPopup from "../../components/confirmDialog";
import InputFile from "../../components/coverInput";
import InputCoverAndroid from "../../components/coverInputAndroid";
import { Circle } from "../../components/skeltons";
import { Language } from "../../context/language";
import { darkTheme, lightTheme } from "../../context/theme";
import { setRerenderCurrentUser } from "../../redux/rerenders";
import { setProfileScrollY } from "../../redux/scrolls";
import { Audience } from "./audience";
import { Contact } from "./contact";
import { Feeds } from "./feeds";
import { ProceduresList } from "./procedures";
import { Header } from "./settings/profileHeader";
import { Statistics } from "./statistics/main";
import { WorkingInfo } from "./workingInfo";
import { ScreenModal } from "./settings/screenModal";

/**
 * User Profile Screen
 */

export const User = ({ navigation, variant, hideModal }) => {
  // Initialize language for multi-language support
  const language = Language();
  const dispatch = useDispatch();
  // Get current route for navigation
  const route = useRoute();

  // zoom to top on change dependency
  const zoomToTop = useSelector((state) => state.storeApp.zoomToTop);

  // Scroll ref for scrollable content
  const scrollViewRef = useRef();
  let firstRend = useRef(true);
  useEffect(() => {
    if (firstRend.current) {
      firstRend.current = false;
      return;
    }
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [zoomToTop]);

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // Get currentUser from global Redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // Select theme from global Redux state (dark or light theme)
  const theme = useSelector((state) => state.storeApp.theme);

  // Set currentTheme based on the theme
  const currentTheme = theme ? darkTheme : lightTheme;

  // Get rerenderCurrentUser from global Redux state
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );

  // State for loading indication
  const [loading, setLoading] = useState(true);

  // A reference used to skip the first run of useEffect
  const profileCleanRef = useRef(true);

  // useEffect for rerenderCurrentUser
  useEffect(() => {
    if (profileCleanRef.current) {
      profileCleanRef.current = false;
      return;
    }
    openLoading();

    const timer = setTimeout(() => {
      closeLoading();
    }, 1300);
    return () => clearTimeout(timer); // clear the timer if the component is unmounted
  }, [rerenderCurrentUser]);

  // useEffect for setting cover image
  useEffect(() => {
    setLoading(true);
    // setCover(targetUser.cover + `?rand=${Math.random()}`);
  }, [currentUser?.cover]);

  // Function to handle cover updates
  const handleCoverUpdate = (newCover) => {
    setCover(newCover);
  };

  // Function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const tp = capitalizeFirstLetter(currentUser.type);
  let userType;
  if (tp === "Beautycenter") {
    userType = language?.language?.Auth?.auth?.beautySalon;
  } else if (tp === "Shop") {
    userType = language.language.Marketplace.marketplace.shop;
  } else {
    userType = tp;
  }

  // State for active navigator
  const [active, setActive] = useState(
    currentUser.type === "user" ? 2 : currentUser.type === "shop" ? 0 : 1
  );
  const navigatorRef = useRef(null);

  useEffect(() => {
    setActive(
      currentUser.type === "user" ? 2 : currentUser?.type === "shop" ? 0 : 1
    );
    navigatorRef.current.scrollToOffset({ offset: 0, animated: true });
  }, [route]);

  // State for number of visible lines in about
  const [numOfLines, setNumOfLines] = useState(3);

  // Function to change height (number of visible lines)
  function changeHeight() {
    if (numOfLines > 3) {
      setNumOfLines(3);
    } else {
      setNumOfLines(8);
    }
  }

  // Navigator items configuration
  const navigatorItems = [
    {
      id: 0,
      name: language?.language?.User?.userPage.showroom,
      icon: (
        <Fontisto
          name="shopping-bag-1"
          color={active === 0 ? currentTheme.pink : currentTheme.disabled}
          size={17}
        />
      ),
    },
    {
      id: 1,
      name: language?.language?.User?.userPage?.feeds,
      icon: (
        <MaterialIcons
          name="dynamic-feed"
          color={active === 1 ? currentTheme.pink : currentTheme.disabled}
          size={18}
        />
      ),
    },
    {
      id: 2,
      name: language?.language?.User?.userPage?.contact,
      icon: (
        <MaterialIcons
          name="contacts"
          color={active === 2 ? currentTheme.pink : currentTheme.disabled}
          size={16}
        />
      ),
    },
    {
      id: 3,
      name: language?.language?.User?.userPage?.service,
      icon: (
        <MaterialIcons
          name="format-list-bulleted"
          color={active === 3 ? currentTheme.pink : currentTheme.disabled}
          size={16}
        />
      ),
    },
    {
      id: 4,
      name: language?.language?.User?.userPage?.workingInfo,
      icon: (
        <MaterialIcons
          name="info-outline"
          color={active === 4 ? currentTheme.pink : currentTheme.disabled}
          size={16}
        />
      ),
    },
    {
      id: 5,
      name: language?.language?.User?.userPage?.statistics,
      icon: (
        <MaterialIcons
          name="bar-chart"
          color={active === 5 ? currentTheme.pink : currentTheme.disabled}
          size={16}
        />
      ),
    },
    {
      id: 6,
      name: language?.language?.User?.userPage?.audience,
      icon: (
        <MaterialIcons
          name="supervised-user-circle"
          color={active === 6 ? currentTheme.pink : currentTheme.disabled}
          size={16}
        />
      ),
    },
  ];

  /** Define following to user or not
   * //
   */

  const [render, setRender] = useState(false);

  /**
   * Feeds state
   */
  // user feeds page in backend
  const [page, setPage] = useState(1);

  const [feedsLength, setFeedsLength] = useState(0);
  const [feeds, setFeeds] = useState([]);

  // Animate component appearance
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  /**
   *  // add new feeds to feeds, when scrolling bottom
   */

  async function AddFeeds(p) {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/${currentUser._id}/feeds?page=${p}&limit=8&check=${currentUser?._id}`
      );
      setFeeds((prev) => {
        const newFeeds = response.data.data?.feeds;
        if (newFeeds) {
          const uniqueNewFeeds = newFeeds.filter(
            (newFeed) => !prev.some((prevFeed) => prevFeed._id === newFeed._id)
          );

          return [...prev, ...uniqueNewFeeds];
        } else {
          return [...prev];
        }
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  // delete cover configs
  const [openPopup, setOpenPopup] = useState(false);

  // remove cover
  const RemoveCover = async () => {
    try {
      await axios.patch(backendUrl + `/api/v1/users/${currentUser?._id}`, {
        cover: "",
      });
      dispatch(setRerenderCurrentUser());
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * get user products for showroom
   */
  /**
   * get user products
   */
  // loading state
  const [loadingProducts, setLoadingProducts] = useState(true);
  // search state
  const [search, setSearch] = useState("");

  // list
  const [list, setList] = useState([]);
  // categories
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // filters
  const categoryFilter = useSelector(
    (state) => state.storeMarketplace.categories
  );
  const brandFilter = useSelector((state) => state.storeMarketplace.brands);
  const minPrice = useSelector((state) => state.storeMarketplace.minPrice);
  const maxPrice = useSelector((state) => state.storeMarketplace.maxPrice);
  const sexFilter = useSelector((state) => state.storeMarketplace.sex);
  const typeFilter = useSelector((state) => state.storeMarketplace.type);
  const discounts = useSelector((state) => state.storeMarketplace.discounts);

  // shworoom pages
  const [pageSh, setPageSh] = useState(1);

  // rerender products
  const rerenderProducts = useSelector(
    (state) => state.storeMarketplace.rerenderProducts
  );

  useEffect(() => {
    const GetUserProducts = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/marketplace/" +
            currentUser._id +
            "/products?page=1&limit=6&search=" +
            search +
            "&categories=" +
            categoryFilter +
            "&brand=" +
            brandFilter +
            "&discounts=" +
            discounts +
            "&minPrice=" +
            minPrice +
            "&maxPrice=" +
            maxPrice +
            "&sex=" +
            sexFilter +
            "&type=" +
            typeFilter +
            "&from=showroom" +
            "&check=" +
            currentUser._id
        );
        if (response.data.data.products) {
          setPageSh(1);
          setList(response.data.data.products);
          setCategories(response.data.categories);
          setBrands(response.data.brands);
          setLoadingProducts(false);
        }
      } catch (error) {
        console.log("Error fetching user products:", error);
        setLoadingProducts(false);
      }
    };

    try {
      if (currentUser) {
        GetUserProducts();
      }
    } catch (error) {
      console.log("Error in useEffect:", error);
    }
  }, [
    rerenderProducts,
    search,
    currentUser,
    categoryFilter,
    sexFilter,
    typeFilter,
    minPrice,
    maxPrice,
    brandFilter,
    discounts,
  ]);

  const AddUserProducts = async () => {
    // Helper function to merge two arrays while ensuring uniqueness based on _id
    try {
      const response = await axios.get(
        backendUrl +
          "/api/v1/marketplace/" +
          currentUser._id +
          "/products?page=" +
          parseInt(pageSh + 1) +
          "&search=" +
          search +
          "&categories=" +
          categoryFilter +
          "&brand=" +
          brandFilter +
          "&discounts=" +
          discounts +
          "&minPrice=" +
          minPrice +
          "&maxPrice=" +
          maxPrice +
          "&sex=" +
          sexFilter +
          "&type=" +
          typeFilter +
          "&from=showroom" +
          "&check=" +
          currentUser._id
      );
      if (response.data.data.products) {
        const newProducts = response.data.data.products;
        const updatedUserProducts = mergeUniqueProducts(list, newProducts);
        setList(updatedUserProducts);
        setCategories(response.data.categories);
        setBrands(response.data.brands);
        setPageSh(pageSh + 1);
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
    const canLoadMore = feedsLength > feeds.length;

    if (route.name === "UserProfile") {
      dispatch(setProfileScrollY(offsetY));
    }

    if (isBottom && active === 0 && currentUser?.type === "shop") {
      AddUserProducts();
    }
    if (isBottom && canLoadMore) {
      AddFeeds(page + 1);
      console.log("Reached the bottom. New page:", page + 1);
    }
  };

  // Define activeContent based on active state
  let activeContent;
  if (active == 0) {
    activeContent = (
      <Showroom
        list={list}
        search={search}
        setSearch={setSearch}
        targetUser={currentUser}
        loading={loadingProducts}
        categories={categories}
        brands={brands}
      />
    );
  } else if (active == 1) {
    activeContent = (
      <Feeds
        page={page}
        setPage={setPage}
        feeds={feeds}
        setFeeds={setFeeds}
        feedsLength={feedsLength}
        setFeedsLength={setFeedsLength}
        targetUser={currentUser}
        scrollViewRef={scrollViewRef}
        navigation={navigation}
        variant={variant}
      />
    );
  } else if (active == 2) {
    activeContent = <Contact targetUser={currentUser} />;
  } else if (active == 3) {
    activeContent = <ProceduresList targetUser={currentUser} />;
  } else if (active == 4) {
    activeContent = (
      <WorkingInfo targetUser={currentUser} navigation={navigation} />
    );
  } else if (active == 5) {
    activeContent = (
      <Statistics targetUser={currentUser} navigation={navigation} />
    );
  } else if (active == 6) {
    activeContent = (
      <Audience
        targetUser={currentUser}
        navigation={navigation}
        renderCheck={render}
        setRenderCheck={setRender}
        hideModal={hideModal}
      />
    );
  }

  // refresh inidcator animation
  const opacityValue = useRef(new Animated.Value(0)).current;
  const transformScroll = useRef(new Animated.Value(0)).current;

  const openLoading = () => {
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(transformScroll, {
        toValue: 60,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeLoading = () => {
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(transformScroll, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // screens modal state
  const screenModal = useSelector((state) => state.storeApp.screenModal);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/** screens modal */}
      {screenModal?.active && (
        <ScreenModal
          visible={screenModal?.active}
          screen={screenModal.screen}
          navigation={navigation}
        />
      )}

      <Header onBack={hideModal} title={currentUser?.name} />

      <ConfirmPopup
        isVisible={openPopup}
        onClose={() => setOpenPopup(false)}
        onDelete={RemoveCover}
        title="Are you sure to want delete Cover image?"
        cancel="Cancel"
        delet="Delete"
      />
      <View>
        <Animated.View
          style={{
            opacity: opacityValue,
            transform: [{ scale: 1.2 }],
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            color={currentTheme.pink}
            style={{ position: "absolute", top: 15 }}
            size={20}
          />
        </Animated.View>
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          transform: [{ translateY: transformScroll }],
        }}
        overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      >
        <View style={styles.header}>
          <View
            style={{
              flex: 2,
              justifyContent: "center",
            }}
          >
            <View>
              <View style={styles.coverImg}>
                {route.name === "UserProfile" && (
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 10000,
                      height: 100,
                      width: 100,
                    }}
                  >
                    {Platform.OS === "ios" ? (
                      <InputFile
                        targetUser={currentUser}
                        setOpenPopup={setOpenPopup}
                      />
                    ) : (
                      <InputCoverAndroid
                        targetUser={currentUser}
                        onCoverUpdate={handleCoverUpdate}
                      />
                    )}
                  </View>
                )}
                {currentUser?.cover?.length > 30 ? (
                  <View
                    style={{
                      width: 110,
                      aspectRatio: 0.99,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {loading && (
                      <View
                        style={{
                          position: "absolute",
                          width: 110,
                          aspectRatio: 0.99,
                          borderRadius: 50,
                          zIndex: 120,
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Circle />
                      </View>
                    )}
                    <Animated.View
                      style={{
                        opacity: fadeAnim,
                        padding: 10,
                      }}
                    >
                      <CacheableImage
                        key={currentUser?.cover}
                        style={{
                          width: "100%",
                          aspectRatio: 1,
                          resizeMode: "cover",
                        }}
                        source={{
                          uri: currentUser?.cover,
                        }}
                        manipulationOptions={[
                          {
                            resize: {
                              width: "100%",
                              aspectRatio: 1,
                              resizeMode: "cover",
                            },
                          },
                          { rotate: 90 },
                        ]}
                        onLoad={() =>
                          setTimeout(() => {
                            setLoading(false);
                          }, 200)
                        }
                        onError={() => console.log("Error loading image")}
                      />
                    </Animated.View>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 110,
                      aspectRatio: 1,
                      borderWidth: 2,
                      backgroundColor: currentTheme.background2,
                    }}
                  >
                    <FontAwesome
                      name="user"
                      size={40}
                      color={currentTheme.disabled}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={{ flex: 6, justifyContent: "center" }}>
            <View
              name="info"
              style={{
                gap: 10,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: currentTheme.font,
                  letterSpacing: 0.2,
                }}
              >
                {currentUser.username ? currentUser.username : userType}
              </Text>
            </View>

            <Pressable
              style={{
                marginTop: 5,
              }}
              onPress={changeHeight}
            >
              <View>
                <Text
                  multiline
                  numberOfLines={numOfLines}
                  style={{
                    fontSize: 14,
                    color: currentTheme.font,
                    lineHeight: 20,
                    letterSpacing: 0.2,
                  }}
                  ellipsizeMode="tail"
                >
                  {currentUser?.about}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <>
          <View
            name="navigator"
            style={[
              styles.navigator,
              {
                borderBottomColor: currentTheme.background2,
                borderTopColor: currentTheme.background2,
              },
            ]}
          >
            <FlatList
              ref={navigatorRef}
              data={navigatorItems}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              bounces={Platform.OS === "ios" ? false : undefined}
              overScrollMode={Platform.OS === "ios" ? "never" : "always"}
              renderItem={({ item }) => {
                if (currentUser.type === "shop" && item.id === 3) {
                  return;
                }
                if (currentUser.type !== "shop" && item.id === 0) {
                  return;
                }
                if (
                  item.id !== 2 &&
                  item.id !== 6 &&
                  currentUser?.type === "user"
                ) {
                  return null;
                }
                if (
                  currentUser.type === "user" &&
                  (item.id === 2 || item.id === 6)
                ) {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setActive(item?.id);
                        setPage(1);
                      }}
                      style={{
                        height: 28,
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                        margin: 5,
                        marginVertical: 7.5,
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderRadius: 50,
                        backgroundColor: currentTheme.background2,
                        borderWidth: 1.5,
                        borderColor:
                          active === item.id ? "#F866B1" : "rgba(0,0,0,0)",
                      }}
                    >
                      {item.icon}
                      <Text
                        style={{
                          letterSpacing: 0.2,
                          color:
                            active === item.id
                              ? currentTheme.pink
                              : currentTheme.disabled,
                        }}
                      >
                        {item?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setActive(item?.id);
                        setPage(1);
                      }}
                      style={{
                        height: 28,
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                        margin: 5,
                        marginVertical: 7.5,
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderRadius: 50,
                        borderWidth: 1.5,
                        borderColor:
                          active === item.id ? "#F866B1" : "rgba(0,0,0,0)",
                      }}
                    >
                      {item.icon}
                      <Text
                        style={{
                          color:
                            active === item.id
                              ? currentTheme.pink
                              : currentTheme.disabled,
                        }}
                      >
                        {item?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              }}
              keyExtractor={(item) => item?.id}
            />
          </View>
          <View name="content">{activeContent}</View>
        </>

        {/* )} */}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: 15,
    paddingRight: 25,
    paddingBottom: 10,
    paddingTop: 20,
    flexDirection: "row",
    gap: 25,
  },
  coverImg: {
    width: 90,
    height: 90,
    overflow: "hidden",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  navigator: {
    borderBottomWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    marginTop: 10,
    paddingLeft: 5,
  },
});
