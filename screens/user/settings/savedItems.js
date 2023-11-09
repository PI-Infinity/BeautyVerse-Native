import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { CacheableImage } from "../../../components/cacheableImage";
import { Circle } from "../../../components/skeltons";
import { darkTheme, lightTheme } from "../../../context/theme";
import { ProceduresOptions } from "../../../datas/registerDatas";
import { setFeedRefreshControl } from "../../../redux/rerenders";
import { Feed } from "../../../screens/feeds/feedCard/feedCard";
import { ScrollGallery } from "../../../screens/feeds/scrollGallery";
import { Header } from "./header";
import { setScreenModal } from "../../../redux/app";
import { RouteNameContext } from "../../../context/routName";

/**
 * Feeds screen
 */

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const SavedItems = ({ hideModal }) => {
  // defines when screen focused
  const isFocused = useIsFocused();

  // navigation
  const navigation = useNavigation();

  // defines theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user from redux
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  /*
   * users states with last feed
   */
  const [feeds, setFeeds] = useState([]);
  const [products, setProducts] = useState([]);

  // defines navigator of for you list or followings list
  const [activeList, setActiveList] = useState(false);

  /*
  page defines query for backend
  this state used to add new users on scrolling. when page changes, in state adds new users with last feeds
  */

  const [page, setPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);

  // Selector for the cleanup state
  const cleanUp = useSelector((state) => state.storeRerenders.cleanUp);

  // define active app language
  const lang = useSelector((state) => state.storeApp.language);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const [loading, setLoading] = useState(true);
  /**
   * Get users function when screen loads
   */
  useEffect(() => {
    // Function to get feed data from server
    const Getting = async () => {
      // setFirstLoading(true);
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/feeds/${currentUser._id}/saved?&page=1`
        );
        setFeeds(response.data.data.feeds);

        setTimeout(() => {
          dispatch(setFeedRefreshControl(false));
          setLoading(false);

          setPage(1);
        }, 500);
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(setFeedRefreshControl(false));
        setPage(1);
      }
    };
    Getting();
  }, [cleanUp]);

  // getting followings feeds
  useEffect(() => {
    // Function to get feed data from server
    const Getting = async () => {
      // setFirstLoading(true);
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/marketplace/${currentUser._id}/saved?&page=1`
        );
        setProducts(response.data.data.products);

        setTimeout(() => {
          dispatch(setFeedRefreshControl(false));
          setLoading(false);

          setProductsPage(1);
        }, 500);
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(setFeedRefreshControl(false));
        setProductsPage(1);
      }
    };
    Getting();
  }, [cleanUp]);

  /**
   * Function to get new users with feeds and adding them in user state while user scrolling to bottom
   *  */
  const AddUsersWithFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/${currentUser._id}/saved?&page=${currentPage}`
      );

      // Update users' state with new feed data
      const newUsers = response.data.data.feeds;
      if (newUsers) {
        setFeeds((prev) => {
          return newUsers.reduce((acc, curr) => {
            const existingUserIndex = acc.findIndex(
              (user) => user._id === curr._id
            );
            if (existingUserIndex !== -1) {
              // User already exists, merge the data
              const mergedUser = { ...acc[existingUserIndex], ...curr };
              return [
                ...acc.slice(0, existingUserIndex),
                mergedUser,
                ...acc.slice(existingUserIndex + 1),
              ];
            } else {
              // User doesn't exist, add to the end of the array
              return [...acc, curr];
            }
          }, prev);
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
    dispatch(setFeedRefreshControl(false));
  };
  const AddProducts = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/marketplace/${currentUser._id}/saved?&page=${currentPage}`
      );

      // Update users' state with new feed data
      const newProducts = response.data.data.products;
      if (newProducts) {
        setProducts((prev) => {
          return newProducts.reduce((acc, curr) => {
            const existingUserIndex = acc.findIndex(
              (pr) => pr._id === curr._id
            );
            if (existingUserIndex !== -1) {
              // User already exists, merge the data
              const mergedUser = { ...acc[existingUserIndex], ...curr };
              return [
                ...acc.slice(0, existingUserIndex),
                mergedUser,
                ...acc.slice(existingUserIndex + 1),
              ];
            } else {
              // User doesn't exist, add to the end of the array
              return [...acc, curr];
            }
          }, prev);
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
    dispatch(setFeedRefreshControl(false));
  };

  const flatListRef = useRef();
  const flatListRefF = useRef();

  // Callback to handle scroll
  const scrollYRef = useRef(0);

  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // setScrollY(offsetY);
    // console.log(offsetY);
    scrollYRef.current = offsetY; // Store the scroll position in scrollYRef, not flatListRef
  }, []);
  // Callback to handle scroll
  const scrollYRefF = useRef(0);

  const handleScrollF = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // setScrollYF(offsetY);
    // console.log(offsetY);
    scrollYRefF.current = offsetY; // Store the scroll position in scrollYRef, not flatListRef
  }, []);

  // State to keep track of displayed video index
  const [currentIndex, setCurrentIndex] = useState(0);

  // useRef to keep track of viewable items
  const onViewableItemsChangedRef = useRef(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      const topVisibleItemIndex = viewableItems[0].index;
      const topVisibleItem = viewableItems[0];
      topVisibleItem.item?.owner_id, topVisibleItem.item?._id;
      setCurrentIndex(topVisibleItemIndex);
    }
  });

  // useMemo to memoize the viewabilityConfig
  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 70, // at least 70% of the item should be visible
    }),
    []
  );

  // view first item
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current && feeds.length > 0) {
      feeds[0]?.owner._id, feeds[0]?._id;
      isFirstRender.current = false;
    }
  }, [feeds]);

  /**
   * alert messages
   */
  // send report
  const sendReport = useSelector((state) => state.storeAlerts.sendReport);

  // zoom to top on change dependency
  const zoomToTop = useSelector((state) => state.storeApp.zoomToTop);
  let firstRend = useRef();
  useEffect(() => {
    if (firstRend.current) {
      firstRend.current = false;
      return;
    }
    if (!activeList) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } else {
      flatListRefF.current?.scrollToOffset({ offset: 0, animated: true });
    }
    // }
  }, [zoomToTop]);

  const handleScrollList = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    let wdth = Dimensions.get("window").width;

    if (x > wdth / 2) {
      setActiveList(true); // Sets to followings list
    } else {
      setActiveList(false); // Sets to "For you" list
    }
  };

  const scrollRef = useRef();

  const handlePress = () => {
    scrollRef.current.scrollTo({
      x: 0, // Scroll to the extreme left
      animated: true,
    });
    // setActiveList(false);
  };

  const handlePressRight = () => {
    scrollRef.current.scrollTo({
      x: Dimensions.get("window").width, // Scroll to the width of the screen (or another value to determine how far to scroll to the right)
      animated: true,
    });
    // setActiveList(true);
  };

  // product categories list
  const categoriesList = ProceduresOptions();

  /**
   * user feeds gallery
   */
  const [activeGallery, setActiveGallery] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <Header onBack={hideModal} title="Saved Items" />
      <View>
        <NavigatorComponent
          activeList={activeList}
          currentTheme={currentTheme}
          setActiveList={setActiveList}
          handlePressRight={handlePressRight}
          handlePress={handlePress}
        />
      </View>
      {loading ? (
        <View
          style={{ paddingVertical: 15, height: 600, justifyContent: "center" }}
        >
          <ActivityIndicator color={currentTheme.pink} size="large" />
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          onScroll={handleScrollList}
          horizontal
          bounces={Platform.OS === "ios" ? false : undefined}
          overScrollMode={Platform.OS === "ios" ? "never" : "always"}
          style={{ flex: 1 }}
          pagingEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {feeds?.length > 0 ? (
            <FlatList
              contentContainerStyle={{ minHeight: SCREEN_HEIGHT }}
              style={{ width: SCREEN_WIDTH }}
              showsVerticalScrollIndicator={false}
              ref={flatListRef}
              data={feeds}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                return (
                  <Feed
                    x={index}
                    feed={item}
                    navigation={navigation}
                    feeds={feeds}
                    currentIndex={currentIndex}
                    isFocused={isFocused}
                    feedsLength={feeds?.length}
                    setActiveGallery={setActiveGallery}
                    activeGallery={activeGallery}
                  />
                );
              }}
              onEndReached={() => {
                AddUsersWithFeeds(page + 1);
                setPage(page + 1);
              }}
              onEndReachedThreshold={0.5}
              keyExtractor={(item) => item?._id}
              onViewableItemsChanged={onViewableItemsChangedRef.current}
              viewabilityConfig={viewabilityConfig}
            />
          ) : (
            <View
              style={{
                width: SCREEN_WIDTH,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: currentTheme.disabled }}>
                No Feeds found
              </Text>
            </View>
          )}
          {products?.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                minHeight: SCREEN_HEIGHT,
                alignItems: "center",
                gap: 10,
                paddingTop: 10,
              }}
              style={{ width: SCREEN_WIDTH }}
              showsVerticalScrollIndicator={false}
              ref={flatListRefF}
              data={products}
              onScroll={handleScrollF}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                return (
                  <ProductItem
                    x={index}
                    item={item}
                    navigation={navigation}
                    feeds={feeds}
                    currentIndex={currentIndex}
                    isFocused={isFocused}
                    feedsLength={feeds?.length}
                    currentTheme={currentTheme}
                    categoriesList={categoriesList}
                  />
                );
              }}
              onEndReached={() => {
                AddProducts(productsPage + 1);
                setProductsPage(productsPage + 1);
              }}
              onEndReachedThreshold={0.5}
              keyExtractor={(item) => item?._id}
              onViewableItemsChanged={onViewableItemsChangedRef.current}
              viewabilityConfig={viewabilityConfig}
            />
          ) : (
            <View
              style={{
                width: SCREEN_WIDTH,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: currentTheme.disabled }}>
                No Products found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      {activeGallery && (
        <Modal isVisible={activeGallery} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              paddingTop: SCREEN_HEIGHT / 15,
              backgroundColor: currentTheme.background,
            }}
          >
            <ScrollGallery
              route={{ params: activeGallery }}
              setActiveGallery={setActiveGallery}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const NavigatorComponent = ({
  activeList,
  currentTheme,
  setActiveList,
  handlePress,
  handlePressRight,
}) => {
  const dispatch = useDispatch();
  return (
    <View
      style={{
        width: "100%",
        height: 40,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => {
          // dispatch(setZoomToTop());
          handlePress();
        }}
        style={{
          flex: 1,
          alignItems: "center",
          paddingVertical: 10,
          borderBottomWidth: 1.5,
          borderBottomColor: !activeList
            ? currentTheme.pink
            : currentTheme.line,
        }}
      >
        <Text
          style={{
            color: !activeList ? currentTheme.font : currentTheme.disabled,
            letterSpacing: 0.3,
            fontWeight: "bold",
          }}
        >
          Feeds
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          // dispatch(setZoomToTop());
          handlePressRight();
        }}
        style={{
          flex: 1,
          alignItems: "center",
          paddingVertical: 10,
          borderBottomWidth: 1.5,
          borderBottomColor: activeList ? currentTheme.pink : currentTheme.line,
        }}
      >
        <Text
          style={{
            color: activeList ? currentTheme.font : currentTheme.disabled,
            letterSpacing: 0.3,
            fontWeight: "bold",
          }}
        >
          Products
        </Text>
      </Pressable>
    </View>
  );
};

const ProductItem = ({ item, navigation, currentTheme, categoriesList }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const route = useRoute();

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
        width: "95%",
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
