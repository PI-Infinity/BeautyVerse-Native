// components/Clock.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formattedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
  },
});

export default Clock;
