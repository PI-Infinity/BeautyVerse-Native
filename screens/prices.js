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

  // update subscription
  const UpdateSubscription = async () => {
    setLoading(true);
    let expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + 1);

    try {
      await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser._id}`,
        {
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
        }
      );
      dispatch(setRerenderCurrentUser());
      dispatch(setRerenderUserList());
      setTimeout(() => {
        setLoading(false);
      }, 500);
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
            backgroundColor: currentTheme.background2,
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
        <Text
          style={[
            styles.itemTitle,
            { color: currentTheme.font, letterSpacing: 0.5 },
          ]}
        >
          Free
        </Text>

        <View style={{ gap: 5 }}>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="circle" color="orange" size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Registered Profile:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                Your profile will be listed in the cards section, allowing
                everyone to discover and connect with you.
              </Text>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="circle" color="orange" size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Content Sharing:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                Your posts and updates will be visible only to your followers in
                the feeds section. This helps create a more intimate and
                personal community for your interactions.
              </Text>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <Octicons name="sort-asc" color="red" size={20} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Positioning:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                Your profile will be sorted at the second level in the cards
                section, providing decent visibility among the community.
              </Text>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="close" color="red" size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Verification Badge:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                The verification badge is not available for free users, ensuring
                that premium users stand out.
              </Text>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="close" color="red" size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Order Management System:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                Free users do not have access to the order management system.
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActive("Monthly")}
          style={{
            flex: 1,
            borderWidth: 2,
            borderRadius: 50,
            borderColor:
              active === "Monthly" ? currentTheme.pink : currentTheme.disabled,
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
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActive("Early")}
          style={{
            flex: 1,
            borderWidth: 2,
            borderRadius: 50,
            borderColor:
              active === "Early" ? currentTheme.pink : currentTheme.disabled,
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
            Yearly (-20%)
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.item,
          {
            backgroundColor: currentTheme.background2,
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
            Subscription
          </Text>
          <Text
            style={{
              color: currentTheme.font,
              fontWeight: "bold",
              fontSize: 22,
            }}
          >
            {active === "Monthly" ? "10$" : "8$ mo. / 96$ y."}
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
          {active === "Monthly" ? "Per month" : "Save 20%"}
        </Text>

        <View style={{ gap: 5, margin: 20, marginTop: 10 }}>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="done" color={currentTheme.pink} size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Registered Profile:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                Your profile will be listed at the top of both the feeds and
                cards sections, providing the highest visibility to all users.
              </Text>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="done" color={currentTheme.pink} size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Content Sharing:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                Your posts and updates will be visible to everyone in both the
                feeds and cards sections, ensuring that your content reaches a
                broader audience.
              </Text>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="done" color={currentTheme.pink} size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Top Level Sorting:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                Your profile will always be sorted at the top level in both the
                feeds and cards sections. This prominent positioning maximizes
                your exposure and influence within the community.
              </Text>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="done" color={currentTheme.pink} size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Verification Badge:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                As a Premium subscriber, you get a verification badge on your
                profile, distinguishing you as a trusted and significant user.
              </Text>
            </View>
          </View>
          <View style={styles.listItemBox}>
            <View style={{ width: "10%" }}>
              <MaterialIcons name="done" color={currentTheme.pink} size={22} />
            </View>
            <View style={styles.listItem}>
              <Text style={[styles.title, { color: currentTheme.font }]}>
                Order Management System:
              </Text>
              <Text style={[styles.text, { color: currentTheme.disabled }]}>
                As a Premium subscriber, you have full access to the order
                management system, allowing for a more comprehensive and
                convenient user experience.
              </Text>
            </View>
          </View>
        </View>

        {from === "Settings" && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: "60%",
              borderRadius: 50,
              backgroundColor:
                currentUser.subscription.status === "active"
                  ? currentTheme.disabled
                  : currentTheme.pink,
              padding: 10,
              alignItems: "center",
            }}
            onPress={UpdateSubscription}
          >
            <Text style={{ fontWeight: "bold", color: "#ccc" }}>
              {currentUser.subscription.status === "active"
                ? "Cancel"
                : "Activation"}
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
    paddingBottom: 30,
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
    width: "85%",
  },
  title: {
    fontWeight: "bold",
  },
  text: {},
});
