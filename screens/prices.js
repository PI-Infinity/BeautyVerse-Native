import { MaterialIcons, Octicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { BackDrop } from "../components/backDropLoader";
import { darkTheme, lightTheme } from "../context/theme";
import {
  setRerenderCurrentUser,
  setRerenderUserList,
} from "../redux/rerenders";
import { Language } from "../context/language";

export const Prices = ({ route }) => {
  const dispatch = useDispatch();
  // define where route comes from
  const from = route.params.from;

  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const [loading, setLoading] = useState(false);

  // defines language
  const language = Language();

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // update subscription
  const UpdateSubscription = async () => {
    setLoading(true);
    let expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + 1);

    try {
      await axios.patch(`${backendUrl}/api/v1/users/${currentUser._id}`, {
        subscription: {
          status:
            currentUser.subscription?.status === "active"
              ? "inactive"
              : "active",
          activationDate: new Date(),
          expireDate: expireDate,
          // variant: "Monthly",
          // price: 10,
        },
      });
      dispatch(setRerenderCurrentUser());
      dispatch(setRerenderUserList());
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.log(error.response.data.message);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  // active monthly or early
  const [active, setActive] = useState("Monthly");

  return (
    <ScrollView
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? "never" : "always"}
      contentContainerStyle={styles.container}
      style={styles.container}
    >
      {loading && <BackDrop loading={loading} setLoading={setLoading} />}
      <View
        style={[
          styles.item,
          {
            backgroundColor: currentTheme.background,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0.5, // negative value places shadow on top
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            borderWidth: 1,
            borderColor: currentTheme.line,
          },
        ]}
      >
        <Text
          style={[
            styles.itemTitle,
            { color: currentTheme.font, letterSpacing: 0.5 },
          ]}
        >
          {language.language.Prices.prices.free}
        </Text>

        <View style={{ gap: 5 }}>
          <View style={styles.listItemBox}>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                {language.language.Prices.prices.feeds}
              </Text>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <MaterialIcons
                  name="done"
                  color={currentTheme.pink}
                  size={22}
                />

                <Text style={[styles.text, { color: currentTheme.disabled }]}>
                  {language.language.Prices.prices.feedsText1}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <MaterialIcons name="close" color="red" size={22} />
                <Text style={[styles.text, { color: currentTheme.disabled }]}>
                  {language.language.Prices.prices.feedsText2}
                </Text>
              </View>
            </View>
          </View>
          {(currentUser.type === "specialist" ||
            currentUser.type === "beautycenter") && (
            <View style={styles.listItemBox}>
              <View style={styles.listItem}>
                <Text style={[styles.title, { color: currentTheme.font }]}>
                  {language.language.Prices.prices.profileCards}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    marginLeft: 6,
                  }}
                >
                  <Octicons name="sort-desc" color="red" size={18} />

                  <Text style={[styles.text, { color: currentTheme.disabled }]}>
                    {language.language.Prices.prices.cardsText}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.listItemBox}>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                {language.language.Prices.prices.badge}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <View style={{ width: "10%" }}>
                  <MaterialIcons name="close" color="red" size={22} />
                </View>
                <Text style={[styles.text, { color: currentTheme.disabled }]}>
                  {language.language.Prices.prices.badgeText}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                {language.language.Prices.prices.bookings}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <View style={{ width: "10%" }}>
                  <MaterialIcons name="close" color="red" size={22} />
                </View>
                <Text style={[styles.text, { color: currentTheme.disabled }]}>
                  {language.language.Prices.prices.bookingsText}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginVertical: 15 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActive("Monthly")}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderRadius: 50,
            borderColor:
              active === "Monthly" ? currentTheme.pink : currentTheme.line,
            alignItems: "center",
            padding: 8,
          }}
        >
          <Text
            style={{
              color: active === "Monthly" ? "orange" : currentTheme.disabled,
              fontWeight: "bold",
            }}
          >
            {language.language.Prices.prices.monthly}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActive("Early")}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderRadius: 50,
            borderColor:
              active === "Early" ? currentTheme.pink : currentTheme.line,
            alignItems: "center",
            padding: 8,
          }}
        >
          <Text
            style={{
              color: active === "Early" ? "orange" : currentTheme.disabled,
              fontWeight: "bold",
            }}
          >
            {language.language.Prices.prices.anually} (-20%)
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.item,
          {
            borderWidth: 1,
            borderColor: currentTheme.line,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0.5, // negative value places shadow on top
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          },
        ]}
      >
        <View
          style={[
            styles.itemTitle,
            {
              //   flexDirection: "row",
              alignItems: "center",
              gap: 10,
              //   width: "60%",
            },
          ]}
        >
          <Text
            style={{
              color: currentTheme.pink,
              fontSize: 18,
              fontWeight: "bold",
              letterSpacing: 0.5,
            }}
          >
            {language.language.Prices.prices.subscription}
          </Text>
          <Text
            style={{
              color: currentTheme.font,
              fontWeight: "bold",
              fontSize: 22,
            }}
          >
            {active === "Monthly"
              ? "20$"
              : `16$ ${language.language.Prices.prices.mo} / 192$ ${language.language.Prices.prices.y}`}
          </Text>
        </View>
        <Text
          style={{
            color: currentTheme.font,
            fontSize: 14,
            position: "relative",
            bottom: 5,
          }}
        >
          {active === "Monthly"
            ? language.language.Prices.prices.perMonth
            : `${language.language.Prices.prices.save} 20%`}
        </Text>

        <View style={{ gap: 5, margin: 20, marginTop: 10 }}>
          <View style={styles.listItemBox}>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                {language.language.Prices.prices.feeds}
              </Text>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <MaterialIcons
                  name="done"
                  color={currentTheme.pink}
                  size={22}
                />

                <Text style={[styles.text, { color: currentTheme.disabled }]}>
                  {language.language.Prices.prices.feedsText2}
                </Text>
              </View>
            </View>
          </View>
          {(currentUser.type === "specialist" ||
            currentUser.type === "beautycenter") && (
            <View style={styles.listItemBox}>
              <View style={styles.listItem}>
                <Text style={[styles.title, { color: currentTheme.font }]}>
                  {language.language.Prices.prices.profileCards}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    marginLeft: 6,
                  }}
                >
                  <Octicons name="sort-asc" color="green" size={18} />

                  <Text style={[styles.text, { color: currentTheme.disabled }]}>
                    {language.language.Prices.prices.cardsText2}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View style={styles.listItemBox}>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                {language.language.Prices.prices.badge}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <View style={{ width: "10%" }}>
                  <MaterialIcons
                    name="done"
                    color={currentTheme.pink}
                    size={22}
                  />
                </View>
                <Text style={[styles.text, { color: currentTheme.disabled }]}>
                  {language.language.Prices.prices.badgeText2}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                {language.language.Prices.prices.bookings}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <View style={{ width: "10%" }}>
                  <MaterialIcons
                    name="done"
                    color={currentTheme.pink}
                    size={22}
                  />
                </View>
                <Text style={[styles.text, { color: currentTheme.disabled }]}>
                  {language.language.Prices.prices.bookingsText2}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {from === "Settings" && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: "60%",
              borderRadius: 50,
              borderWidth: 1.5,
              borderColor:
                currentUser.subscription.status === "active"
                  ? currentTheme.disabled
                  : currentTheme.pink,
              padding: 10,
              alignItems: "center",
              marginTop: 25,
            }}
            onPress={UpdateSubscription}
          >
            <Text style={{ fontWeight: "bold", color: currentTheme.pink }}>
              {currentUser.subscription.status === "active"
                ? language.language.Prices.prices.cancel
                : language.language.Prices.prices.activation}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 15,
    paddingBottom: 50,
  },
  item: {
    borderRadius: 10,
    alignItems: "center",
    padding: 15,
    paddingBottom: 50,
  },
  itemTitle: {
    fontSize: 18,
    margin: 10,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listItemBox: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  listItem: {
    gap: 10,
    width: "90%",
  },
  title: {
    fontWeight: "bold",
  },
  text: { letterSpacing: 0.3, fontSize: 14, lineHeight: 18 },
});
