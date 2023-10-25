import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { CacheableImage } from "../components/cacheableImage";
import { Language } from "../context/language";
import { darkTheme, lightTheme } from "../context/theme";
import { Room } from "../screens/chat/room";
import { FeedItem } from "../screens/feedScreen";
import { AddBooking } from "../screens/bookings/addBooking";
import { Bookings } from "../screens/bookings/bookings";
import { SendBooking } from "../screens/bookings/sendBooking";
import { Statistics } from "../screens/bookings/statistics";
import { Prices } from "../screens/prices";
import { SentBookings } from "../screens/sentBookings/sentBookings";
import { QA } from "../screens/user/QA";
import { AddFeed } from "../screens/user/addFeed";
import { Notifications } from "../screens/user/notifications";
import { Privacy } from "../screens/user/privacy";
import { ScrollGallery } from "../screens/user/scrollGallery";
import { Addresses } from "../screens/user/settings/addresses";
import { PersonalInfo } from "../screens/user/settings/personalInfo";
import { Procedures } from "../screens/user/settings/procedures";
import { Settings } from "../screens/user/settings/settings";
import { WorkingInfo } from "../screens/user/settings/workingInfo";
import Charts from "../screens/user/statistics/chart";
import { Terms } from "../screens/user/terms";
import { Usage } from "../screens/user/usage";
import { User } from "../screens/user/user";
import { AddNewAddress } from "../screens/user/settings/addNewAddress";
import { AddNewProcedures } from "../screens/user/settings/addNewProcedures";
import { EditAddress } from "../screens/user/settings/editAddress";
import Products from "../Marketplace/screens/userProductListSettings";
import AddNewProduct from "../Marketplace/screens/addProduct";
import EditProduct from "../Marketplace/screens/editProduct";
import Product from "../Marketplace/screens/product";
import Support from "../screens/support";
import { SavedItems } from "../screens/user/settings/savedItems";
import { Image } from "@rneui/base";
import { BlurView } from "expo-blur";

/**
 * Create user profile stack, where include all main configs
 */
const Stack = createStackNavigator();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export function ProfileStack({
  navigation,
  unreadNotifications,
  setUnreadNotifications,
  notifications,
  setNotifications,
  setScrollY,
}) {
  // language state
  const language = Language();
  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  const newBookings = useSelector((state) => state.storeBookings.new);
  const newSentBookings = useSelector((state) => state.storeSentBookings.new);
  /** in profile stack defined,
   * user personal data, settings
   * and control datas and feeds */

  const insets = useSafeAreaInsets();

  const screenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

  /**
   * blur
   */
  const blur = useSelector((state) => state.storeApp.blur);
  return (
    <ImageBackground
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      source={theme ? require("../assets/background.jpg") : null}
    >
      {/**
       * blur background
       */}

      <>
        {blur && (
          <BlurView
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              position: "absolute",
              zIndex: 1000,
              top: 0,
              left: 0,
            }}
            // style={styles.blurView}
            tint="dark" // or 'dark'
            intensity={40}
          ></BlurView>
        )}
      </>
      <Stack.Navigator
        initialRouteName="UserProfile"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Apply custom transition
          cardStyle: { backgroundColor: "transparent" }, // Set card background to transparent
        }}
      >
        {/* current user profile screen */}
        <Stack.Screen
          name="UserProfile"
          children={() => (
            <User
              user={currentUser}
              navigation={navigation}
              setScrollY={setScrollY}
            />
          )}
          options={({ route, navigation }) => ({
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitle: "",
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: theme
                ? "rgba(0,0,0,0.6)"
                : currentTheme.background,
            },
            headerLeft: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginLeft: 15,
                  width: SCREEN_WIDTH * 0.6,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    letterSpacing: 0.5,
                    color: currentTheme.font,
                    fontWeight: "bold",
                  }}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  {currentUser.name} {/* current user name un screen header */}
                </Text>
                {currentUser.subscription.status === "active" && (
                  <MaterialIcons
                    name="verified"
                    size={14}
                    color="#F866B1"
                    style={{ marginTop: 2 }}
                  />
                )}
              </View>
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* add feed icon in header of screen */}
                {currentUser.type !== "user" && (
                  <>
                    <Pressable
                      onPress={() => navigation.navigate("AddFeed")}
                      style={{ marginRight: 12, padding: 5, paddingRight: 0 }}
                    >
                      <MaterialIcons
                        name="library-add"
                        size={22}
                        color={currentTheme.pink}
                      />
                    </Pressable>

                    {/* <Pressable
                    acitveOpacity={0.3}
                    style={{
                      marginRight: 10,
                      marginLeft: 4,
                      flexDirection: "row",
                      opacity: 1,
                      alignItems: "center",
                      backgroundColor: currentTheme.line,
                      borderRadius: 50,
                      padding: 5,
                      paddingVertical: 2.5,
                    }}
                    onPress={() => navigation.navigate("Bookings")}
                  >
                    {newBookings > 0 && (
                      <View
                        style={{
                          width: "auto",
                          minWidth: 13,
                          height: 13,
                          backgroundColor: currentTheme.pink,
                          borderRadius: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          zIndex: 2,
                          right: -2,
                          top: -2,
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 10 }}>
                          {newBookings}
                        </Text>
                      </View>
                    )}
                    <Entypo
                      name="list"
                      size={24}
                      color={currentTheme.disabled}
                    />
                    <Text
                      style={{
                        color:
                          currentUser.subscription.status === "active"
                            ? currentTheme.pink
                            : currentTheme.disabled,
                        fontWeight: "bold",
                        letterSpacing: -1,
                        fontSize: 16,
                      }}
                    >
                      BMS
                    </Text>
                  </Pressable> */}
                  </>
                )}
                <View>
                  {unreadNotifications > 0 && (
                    <View
                      style={{
                        width: "auto",
                        minWidth: 13,
                        height: 13,
                        backgroundColor: currentTheme.pink,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        zIndex: 2,
                        right: 6,
                        top: 2,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 10 }}>
                        {unreadNotifications}
                      </Text>
                    </View>
                  )}
                  <Pressable
                    onPress={() => navigation.navigate("Notifications")}
                    style={{ marginRight: 5, padding: 5 }}
                  >
                    {/* settings button*/}
                    <Ionicons
                      name="notifications"
                      size={20.5}
                      color={currentTheme.disabled}
                    />
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => navigation.navigate("Settings")}
                  style={{ marginRight: 15, padding: 5 }}
                >
                  {currentUser?.type === "specialist" &&
                    newSentBookings > 0 && (
                      <View
                        style={{
                          width: "auto",
                          minWidth: 13,
                          height: 13,
                          backgroundColor: currentTheme.pink,
                          borderRadius: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          zIndex: 2,
                          right: -2,
                          top: 0,
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 10 }}>
                          {newSentBookings}
                        </Text>
                      </View>
                    )}
                  <Ionicons
                    name="settings"
                    size={20}
                    color={currentTheme.disabled}
                    style={{ marginBottom: 0.5 }}
                  />
                </Pressable>
              </View>
            ),
          })}
        />
        {/** user screen in feeds, visit page, that component gettings props "visitPage", so from this component only can to visit page, current user can't modify any data from there  */}
        <Stack.Screen
          name="User"
          children={() => <User navigation={navigation} />}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            headerTitle: (props) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  width: "100%",
                  gap: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    letterSpacing: 0.5,
                    color: currentTheme.font,
                    fontWeight: "bold",
                  }}
                >
                  {route.params.user.name}
                </Text>
                {route.params.user.subscription.status === "active" && (
                  <MaterialIcons name="verified" size={14} color="#F866B1" />
                )}
              </View>
            ),
            headerRight: (props) => {
              if (
                currentUser?.type.toLowerCase() !== "beautycenter" &&
                currentUser?.type.toLowerCase() !== "shop"
              ) {
                return (
                  <View style={{ marginRight: 20 }}>
                    {route.params?.user?._id !== currentUser._id &&
                      currentUser.type !== "beautycenter" &&
                      currentUser?.type !== "shop" &&
                      route.params?.user.type !== "shop" &&
                      route.params?.user.type !== "user" &&
                      route.params.user.subscription.status === "active" && (
                        <TouchableOpacity
                          acitveOpacity={0.3}
                          onPress={() =>
                            navigation.navigate("Send Booking", {
                              user: route.params.user,
                            })
                          }
                        >
                          <FontAwesome
                            name="calendar"
                            size={18}
                            color={currentTheme.font}
                          />
                        </TouchableOpacity>
                      )}
                  </View>
                );
              }
            },
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/** User notifications page */}
        <Stack.Screen
          name="Notifications"
          children={() => (
            <Notifications
              notifications={notifications}
              navigation={navigation}
              setNotifications={setNotifications}
              setUnreadNotifications={setUnreadNotifications}
            />
          )}
          options={({ route, navigation }) => ({
            headerTitle: language?.language?.Pages?.pages?.notifications,
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="UserVisit"
          children={() => (
            <User navigation={navigation} setScrollY={setScrollY} />
          )}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
            headerTitle: (props) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  width: "100%",
                  gap: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    letterSpacing: 0.5,
                    color: currentTheme.font,
                    fontWeight: "bold",
                  }}
                >
                  {route.params.user?.name}
                </Text>
                {route.params.user?.subscription.status === "active" && (
                  <MaterialIcons name="verified" size={14} color="#F866B1" />
                )}
              </View>
            ),
            headerRight: (props) => {
              return (
                <View style={{ marginRight: 20 }}>
                  {route.params?.user?._id !== currentUser._id &&
                    currentUser.type !== "beautycenter" &&
                    currentUser?.type !== "shop" &&
                    route.params?.user.type !== "shop" &&
                    route.params?.user.type !== "user" &&
                    route.params.user.subscription.status === "active" && (
                      <TouchableOpacity
                        acitveOpacity={0.3}
                        onPress={() =>
                          navigation.navigate("Send Booking", {
                            user: route.params.user,
                          })
                        }
                      >
                        <FontAwesome
                          name="calendar"
                          size={18}
                          color={currentTheme.font}
                        />
                      </TouchableOpacity>
                    )}
                </View>
              );
            },

            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* current user feed's list screen */}
        <Stack.Screen
          name="ScrollGallery"
          component={ScrollGallery}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.feeds,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="UserFeed"
          component={FeedItem}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.Main?.feedCard?.feed,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* add feed screen */}
        <Stack.Screen
          name="AddFeed"
          component={AddFeed}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.add,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/** main booking list screen  */}

        <Stack.Screen
          name="Send Booking"
          component={SendBooking}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.Bookings?.bookings?.createBooking,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="Sent Bookings"
          component={SentBookings}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.sentBookings,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />

        <Stack.Screen
          name="Booking Statistics"
          component={Statistics}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: "Booking statistics",
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* settings screen, inside settings are navigations to edit's screens */}
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.settings,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* edit personal info screen */}
        <Stack.Screen
          name="Personal info"
          component={PersonalInfo}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.personalInfo,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* edit procedures screen */}
        <Stack.Screen
          name="Procedures"
          component={Procedures}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.procedures,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
            headerRight: () => (
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <TouchableOpacity
                  acitveOpacity={0.3}
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate("AddNewProcedures")}
                >
                  <MaterialIcons
                    style={{
                      color: currentTheme.pink,
                    }}
                    name="add"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        {/* edit products screen */}
        <Stack.Screen
          name="Products"
          component={Products}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.products,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
            headerRight: () => (
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <TouchableOpacity
                  acitveOpacity={0.3}
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate("AddNewProduct")}
                >
                  <MaterialIcons
                    style={{
                      color: currentTheme.pink,
                    }}
                    name="add"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        {/* Add new product screen */}
        <Stack.Screen
          name="AddNewProduct"
          component={AddNewProduct}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.add,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* Edit product screen */}
        <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.Marketplace?.marketplace?.editProduct,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* product screen */}
        <Stack.Screen
          name="Product"
          component={Product}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("User", {
                    user: route.params.product.owner,
                  })
                }
                style={{ padding: 8, marginRight: 8 }}
              >
                {route.params.product.owner?.cover ? (
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
              </TouchableOpacity>
            ),
            title: route.params.product.title,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* edit working info screen */}
        <Stack.Screen
          name="Working info"
          component={WorkingInfo}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.workingInfo,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* edit addresses screen */}
        <Stack.Screen
          name="Addresses"
          component={Addresses}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.addresses,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
            headerRight: () => (
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <TouchableOpacity
                  acitveOpacity={0.3}
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate("AddNewAddress")}
                >
                  <MaterialIcons
                    style={{
                      color: currentTheme.pink,
                    }}
                    name="add"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        {/* edit addresses screen */}
        <Stack.Screen
          name="AddNewAddress"
          component={AddNewAddress}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: "Add new address",
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="EditAddress"
          component={EditAddress}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: "Edit address",
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* add procedures screen */}
        <Stack.Screen
          name="AddNewProcedures"
          component={AddNewProcedures}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: "Add new procedures",
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* prices screen */}
        <Stack.Screen
          name="Prices"
          component={Prices}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.prices,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        {/* this is a screen, which shows statistics of users with different time systems */}
        <Stack.Screen
          name="Charts"
          component={Charts}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: "Charts",
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="SavedItems"
          component={SavedItems}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.savedItems,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="Support"
          component={Support}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.User?.userPage?.support,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.Pages?.pages?.terms,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="Privacy"
          component={Privacy}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.Pages?.pages?.privacy,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="QA"
          component={QA}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.Pages?.pages?.qa,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="Usage"
          component={Usage}
          options={({ route, navigation }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            title: language?.language?.Pages?.pages?.usage,
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 0.5,
            },
            cardStyle: {
              backgroundColor: currentTheme.background,
            },
          })}
        />
        <Stack.Screen
          name="Room"
          component={Room}
          initialParams={{ screenHeight }}
          options={({ navigation, route }) => ({
            headerBackTitleVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.goBack()}
                style={{ padding: 8, paddingLeft: 15 }}
              >
                <FontAwesome
                  name="arrow-left"
                  color={currentTheme.pink}
                  size={22}
                />
              </TouchableOpacity>
            ),
            // title: "name",
            headerStyle: {
              height: SCREEN_HEIGHT / 9,
              backgroundColor: currentTheme.background,

              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitle: (props) => {
              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate("UserVisit", {
                      user: route.params.user,
                    })
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "center",
                    width: SCREEN_WIDTH - 150,
                  }}
                >
                  {route.params.user?.cover?.length > 0 && (
                    <CacheableImage
                      source={{ uri: route.params.user?.cover }}
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                        resizeMode: "cover",
                      }}
                      manipulationOptions={[
                        { resize: { width: 30, height: 30 } },
                        { rotate: 90 },
                      ]}
                    />
                  )}

                  <Text
                    style={{
                      fontSize: 18,
                      letterSpacing: 0.5,
                      color: currentTheme.font,
                      fontWeight: "bold",
                    }}
                  >
                    {route.params.user?.name}
                  </Text>
                </Pressable>
              );
            },
            headerTintColor: currentTheme.font,
            headerTitleStyle: {
              fontWeight: "bold",
              letterSpacing: 0.5,
              fontSize: 18,
            },
            cardStyle: {
              // backgroundColor: currentTheme.background,
            },
          })}
        />
      </Stack.Navigator>
    </ImageBackground>
  );
}
