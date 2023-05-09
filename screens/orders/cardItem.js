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

export const Card = ({ item, bg, currentUser, currentTheme }) => {
  return (
    <View
      style={{
        padding: 15,
        borderRadius: 10,
        backgroundColor: bg,
        gap: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
          Order number: N{item.orderNumber}
        </Text>
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
          Status: {item.status}
        </Text>
      </View>
      <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
        Procedure Date: {item.date.slice(0, 16)}
      </Text>
      <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
        Procedure: {item.orderedProcedure}
      </Text>
      <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>
        Procedure Price: {item.orderSum} {currentUser.currency}
      </Text>
      <View style={{ marginTop: 10, gap: 10 }}>
        <Text style={{ color: "#ccc", letterSpacing: 0.3 }}>Client:</Text>
        <View
          style={{
            width: "100%",
            backgroundColor: "#333",
            padding: 10,
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
                width: 40,
                aspectRatio: 0.95,
                resizeMode: "cover",
                borderRadius: 50,
              }}
              source={{
                uri: item?.user?.cover,
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
      <Text style={{ color: "#ccc", letterSpacing: 0.3, marginTop: 10 }}>
        Ordered At: {item.orderAt.slice(0, 16)}
      </Text>
    </View>
  );
};
