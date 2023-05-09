import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Feed } from "../../components/feedCard/feedCard";
import { useIsFocused } from "@react-navigation/native";

export const UserFeed = ({ route, navigation }) => {
  let user = route.params.user;
  let feed = route.params.feedObj;
  const isFocused = useIsFocused();

  const [updatedUser, setUpdatedUser] = useState([]);

  useEffect(() => {
    if (feed) {
      setUpdatedUser({
        ...user,
        feed: feed,
      });
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Feed
        user={updatedUser}
        x={2}
        feeds={[]}
        navigation={navigation}
        currentIndex={3}
        isFocused={isFocused}
        from="notifications"
      />
    </View>
  );
};

const styles = StyleSheet.create({});
