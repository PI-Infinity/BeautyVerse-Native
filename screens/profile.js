import { StyleSheet, Text, Dimensions, Animated } from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const Profile = () => {
  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
        flex: 1,
        width: "100%",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff" }}>Profile</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    width: "100%",
    alignItems: "center",
  },
});
