// DeleteFeedPopup.js
import axios from "axios";
import React, { useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../../context/theme";

export const Reports = ({
  isVisible,
  onClose,
  Press,
  contentOwner,
  contentId,
}) => {
  const [animation] = useState(new Animated.Value(0));
  const theme = useSelector((state) => state.storeApp.theme);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const currentTheme = theme ? darkTheme : lightTheme;

  const [active, setActive] = useState(null);

  // send report
  const SendReport = async () => {
    const { number, ...activeWithoutNumber } = active;
    try {
      await axios.post("https://beautyverse.herokuapp.com/api/v1/reports", {
        ...number,
        ...activeWithoutNumber,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <Animated.View style={[styles.background, { opacity: 0 }]}>
        <TouchableOpacity style={styles.fill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: currentTheme.background,
            borderWidth: 1.5,
            borderColor: currentTheme.pink,
            borderBottomWidth: 0,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
          style={{ height: 500 }}
        >
          <Text style={[styles.title, { color: currentTheme.font }]}>
            Report Feed:
          </Text>
          <TouchableOpacity
            onPress={() =>
              setActive({
                number: 1,
                title: "Non-Thematic Content:",
                content: { contentOwner: contentOwner, contentId: contentId },
                user: currentUser._id,
              })
            }
            activeOpacity={0.8}
            style={[
              styles.item,
              {
                borderColor:
                  active?.number === 1 ? currentTheme.pink : currentTheme.line,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.subTitle, { color: currentTheme.font }]}>
              Non-Thematic Content:
            </Text>
            <Text style={[styles.text, { color: currentTheme.font }]}>
              This category is for content that doesn't align with the app's
              main theme or purpose.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActive({
                number: 2,
                title: "Spam:",
                content: { contentOwner: contentOwner, contentId: contentId },
                user: currentUser._id,
              })
            }
            activeOpacity={0.8}
            style={[
              styles.item,
              {
                borderColor:
                  active?.number === 2 ? currentTheme.pink : currentTheme.line,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.subTitle, { color: currentTheme.font }]}>
              Spam:
            </Text>
            <Text style={[styles.text, { color: currentTheme.font }]}>
              This is for unsolicited or junk content that clutters up the feed.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActive({
                number: 3,
                title: "Inappropriate Content:",
                content: { contentOwner: contentOwner, contentId: contentId },
                user: currentUser._id,
              })
            }
            activeOpacity={0.8}
            style={[
              styles.item,
              {
                borderColor:
                  active?.number === 3 ? currentTheme.pink : currentTheme.line,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.subTitle, { color: currentTheme.font }]}>
              Inappropriate Content:
            </Text>
            <Text style={[styles.text, { color: currentTheme.font }]}>
              This covers content that violates our terms of service, such as
              violent, graphic, sexually explicit, hateful, or discriminatory
              content.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActive({
                number: 4,
                title: "Misinformation:",
                content: { contentOwner: contentOwner, contentId: contentId },
                user: currentUser._id,
              })
            }
            activeOpacity={0.8}
            style={[
              styles.item,
              {
                borderColor:
                  active?.number === 4 ? currentTheme.pink : currentTheme.line,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.subTitle, { color: currentTheme.font }]}>
              Misinformation:
            </Text>
            <Text style={[styles.text, { color: currentTheme.font }]}>
              Use this category for content that seems to be spreading false or
              misleading information.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActive({
                number: 5,
                title: "Harassment or Bullying:",
                content: { contentOwner: contentOwner, contentId: contentId },
                user: currentUser._id,
              })
            }
            activeOpacity={0.8}
            style={[
              styles.item,
              {
                borderColor:
                  active?.number === 5 ? currentTheme.pink : currentTheme.line,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.subTitle, { color: currentTheme.font }]}>
              Harassment or Bullying:
            </Text>
            <Text style={[styles.text, { color: currentTheme.font }]}>
              This is for posts where the user is directly harassing or bullying
              another individual.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActive({
                number: 6,
                title: "Impersonation:",
                content: { contentOwner: contentOwner, contentId: contentId },
                user: currentUser._id,
              })
            }
            activeOpacity={0.8}
            style={[
              styles.item,
              {
                borderColor:
                  active?.number === 6 ? currentTheme.pink : currentTheme.line,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.subTitle, { color: currentTheme.font }]}>
              Impersonation:
            </Text>
            <Text style={[styles.text, { color: currentTheme.font }]}>
              Use this for situations where someone is pretending to be someone
              else without their consent.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActive({
                number: 7,
                title: "Copyright Violation:",
                content: { contentOwner: contentOwner, contentId: contentId },
                user: currentUser._id,
              })
            }
            activeOpacity={0.8}
            style={[
              styles.item,
              {
                borderColor:
                  active?.number === 7 ? currentTheme.pink : currentTheme.line,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.subTitle, { color: currentTheme.font }]}>
              Copyright Violation:
            </Text>
            <Text style={[styles.text, { color: currentTheme.font }]}>
              This is for content that infringes on someone else's copyright.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActive({
                number: 8,
                title: "Illegal Activities:",
                content: { contentOwner: contentOwner, contentId: contentId },
                user: currentUser._id,
              })
            }
            activeOpacity={0.8}
            style={[
              styles.item,
              {
                borderColor:
                  active?.number === 8 ? currentTheme.pink : currentTheme.line,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.subTitle, { color: currentTheme.font }]}>
              Illegal Activities:
            </Text>
            <Text style={[styles.text, { color: currentTheme.font }]}>
              This is for content that promotes activities that are illegal.
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={[styles.buttonText, { color: currentTheme.disabled }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await SendReport();
              Press();
              setActive(null);
            }}
          >
            <Text style={[styles.buttonText, { color: currentTheme.pink }]}>
              Send Report
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  item: { borderWidth: 1, borderRadius: 10, padding: 10, gap: 5 },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  text: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
  },
});
