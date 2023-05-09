import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { CacheableImage } from "../../components/cacheableImage";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const ListItem = ({ item, bg, currentUser, currentTheme }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={Platform.OS === "ios" ? false : undefined}
      overScrollMode={Platform.OS === "ios" ? undefined : false}
      contentContainerStyle={{
        height: 40,
        alignItems: "center",
        // justifyContent: "center",
      }}
      style={{
        // padding: 15,
        borderRadius: 10,
        backgroundColor: bg,
      }}
    >
      <View
        style={{
          height: "100%",
          borderRightWidth: 1,
          borderColor: currentTheme.disabled,
          padding: 5,
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
          minWidth: 50,
        }}
      >
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
          N{item.orderNumber}
        </Text>
      </View>
      <View
        style={{
          height: "100%",
          borderRightWidth: 1,
          borderColor: currentTheme.disabled,
          padding: 5,
          paddingHorizontal: 10,
          justifyContent: "center",
          minWidth: 150,
        }}
      >
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
          Status: {item.status}
        </Text>
      </View>
      <View
        style={{
          height: "100%",
          borderRightWidth: 1,
          borderColor: currentTheme.disabled,
          padding: 5,
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
          Date: {item.date.slice(0, 16)}
        </Text>
      </View>
      <View
        style={{
          height: "100%",
          borderRightWidth: 1,
          borderColor: currentTheme.disabled,
          padding: 5,
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
          Procedure: {item.orderedProcedure}
        </Text>
      </View>
      <View
        style={{
          height: "100%",
          borderRightWidth: 1,
          borderColor: currentTheme.disabled,
          padding: 5,
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
          Price: {item.orderSum} {currentUser.currency}
        </Text>
      </View>
      <View
        style={{
          gap: 10,
          flexDirection: "row",
          alignItems: "center",
          padding: 5,
          paddingHorizontal: 10,
          height: "100%",
          borderRightWidth: 1,
          borderColor: currentTheme.disabled,
        }}
      >
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>Client:</Text>
        <View
          style={{
            borderRadius: 10,
            gap: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <CacheableImage
              style={{
                width: 30,
                aspectRatio: 0.95,
                resizeMode: "cover",
                borderRadius: 50,
              }}
              source={{
                uri: item.user?.cover,
              }}
              manipulationOptions={[
                {
                  resize: {
                    width: "100%",
                    aspectRatio: 0.95,
                    resizeMode: "cover",
                  },
                },
                { rotate: 90 },
              ]}
            />

            <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
              {item.user.name}
            </Text>
          </View>
          <TouchableOpacity
            style={{ padding: 5, paddingHorizontal: 10 }}
            activeOpacity={0.3}
          >
            <MaterialCommunityIcons
              name="chat-processing"
              size={22}
              color={currentTheme.font}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: "100%",
          padding: 5,
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
          Ordered At: {item.orderAt.slice(0, 16)}
        </Text>
      </View>
    </ScrollView>
  );
};
