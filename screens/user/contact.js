import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import Map from "../../components/map";
import { darkTheme, lightTheme } from "../../context/theme";

/**
 * Contact component in user screen
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Contact = ({ targetUser }) => {
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);

  // define current user
  const currentTheme = theme ? darkTheme : lightTheme;

  // define link to can be press
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  // define displayed address
  const [activeAddress, setActiveAddress] = useState(0);

  // define map view ref
  const mapViewRef = useRef(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleLinkPress(`tel:${targetUser.phone}`)}
        style={[
          styles.item,
          {
            justifyContent: "space-between",
            backgroundColor: currentTheme.background2,
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {targetUser?.type !== "user" && (
            <>
              <View
                style={[
                  styles.title,
                  { backgroundColor: currentTheme.background2 },
                ]}
              >
                <Entypo name="phone" size={16} color={currentTheme.font} />
              </View>

              <Text
                style={[
                  [styles.value, { color: currentTheme.font }],
                  { color: currentTheme.font },
                ]}
              >
                {targetUser.phone}
              </Text>
            </>
          )}
        </View>
        {targetUser?.type !== "user" && (
          <TouchableOpacity
            onPress={(event) => event.stopPropagation()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 0,
              marginRight: 10,
              height: "100%",
            }}
          >
            {targetUser.media.whatsapp && (
              <TouchableOpacity
                onPress={() => {
                  handleLinkPress(`https://wa.me/${targetUser.phone}`);
                }}
                style={[
                  styles.title,
                  { backgroundColor: currentTheme.background2 },
                ]}
              >
                <FontAwesome
                  name="whatsapp"
                  size={18}
                  color={currentTheme.font}
                />
              </TouchableOpacity>
            )}
            {targetUser.media.telegram && (
              <TouchableOpacity
                onPress={() =>
                  handleLinkPress(`https://t.me/${targetUser.phone}`)
                }
                style={[
                  styles.title,
                  { backgroundColor: currentTheme.background2 },
                ]}
              >
                <FontAwesome
                  name="telegram"
                  size={16}
                  color={currentTheme.font}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleLinkPress(`mailto:${targetUser.email}`)}
        style={[styles.item, { backgroundColor: currentTheme.background2 }]}
      >
        <View
          style={[styles.title, { backgroundColor: currentTheme.background2 }]}
        >
          <Entypo name="email" size={16} color={currentTheme.font} />
        </View>
        <Text style={[styles.value, { color: currentTheme.font }]}>
          {targetUser.email}
        </Text>
      </TouchableOpacity>
      {targetUser.media.web && (
        <TouchableOpacity
          onPress={() => handleLinkPress(`https://${targetUser.media?.web}`)}
          style={[styles.item, { backgroundColor: currentTheme.background2 }]}
        >
          <View
            style={[
              styles.title,
              { backgroundColor: currentTheme.background2 },
            ]}
          >
            <MaterialCommunityIcons
              name="web"
              size={18}
              color={currentTheme.font}
            />
          </View>
          <Text style={[styles.value, { color: currentTheme.font }]}>
            {targetUser.media.web}
          </Text>
        </TouchableOpacity>
      )}
      {targetUser.media.facebook && (
        <TouchableOpacity
          onPress={() =>
            handleLinkPress(`fb://profile/${targetUser.media?.facebook}`)
          }
          style={[styles.item, { backgroundColor: currentTheme.background2 }]}
        >
          <View
            style={[
              styles.title,
              { backgroundColor: currentTheme.background2 },
            ]}
          >
            <FontAwesome name="facebook" size={20} color={currentTheme.font} />
          </View>
          <Text style={[styles.value, { color: currentTheme.font }]}>
            Facebook
          </Text>
        </TouchableOpacity>
      )}
      {targetUser.media.instagram && (
        <TouchableOpacity
          onPress={() =>
            handleLinkPress(
              `https://www.instagram.com/${targetUser.media?.instagram}`
            )
          }
          style={[styles.item, { backgroundColor: currentTheme.background2 }]}
        >
          <View
            style={[
              styles.title,
              { backgroundColor: currentTheme.background2 },
            ]}
          >
            <FontAwesome name="instagram" size={20} color={currentTheme.font} />
          </View>
          <Text style={[styles.value, { color: currentTheme.font }]}>
            {targetUser.media.instagram}
          </Text>
        </TouchableOpacity>
      )}
      {targetUser.media.tiktok && (
        <TouchableOpacity
          onPress={() =>
            handleLinkPress(
              `https://www.tiktok.com/${targetUser.media?.tiktok}`
            )
          }
          style={[styles.item, { backgroundColor: currentTheme.background2 }]}
        >
          <Text
            style={[
              styles.title,
              { backgroundColor: currentTheme.background2 },
            ]}
          >
            Tiktok:
          </Text>
          <Text style={[styles.value, { color: currentTheme.font }]}>
            {targetUser.media.tiktok}
          </Text>
        </TouchableOpacity>
      )}
      {targetUser.media.youtube && (
        <TouchableOpacity
          onPress={() =>
            handleLinkPress(
              `https://www.youtube.com/${targetUser.media?.youtube}`
            )
          }
          style={[styles.item, { backgroundColor: currentTheme.background2 }]}
        >
          <View
            style={[
              styles.title,
              { backgroundColor: currentTheme.background2 },
            ]}
          >
            <FontAwesome name="youtube" size={20} color={currentTheme.font} />
          </View>
          <Text style={[styles.value, { color: currentTheme.font }]}>
            {targetUser.media.youtube}
          </Text>
        </TouchableOpacity>
      )}
      <View
        style={{
          height: 450,
          marginTop: 10,
          marginBottom: 20,
          padding: 7.5,
          gap: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginBottom: 10,
          }}
        >
          <Entypo name="location-pin" color={currentTheme.pink} size={20} />
          <Text
            style={{
              color: currentTheme.font,
              fontSize: 16,
              letterSpacing: 0.3,
              fontWeight: "bold",
            }}
          >
            Address:
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={{
              color: currentTheme.font,
              fontWeight: "bold",
              letterSpacing: 0.3,
            }}
          >
            Country:{" "}
          </Text>
          <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
            {targetUser.address[activeAddress].country}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={{
              color: currentTheme.font,
              fontWeight: "bold",
              letterSpacing: 0.3,
            }}
          >
            Region:{" "}
          </Text>
          <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
            {targetUser.address[activeAddress].region}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={{
              color: currentTheme.font,
              fontWeight: "bold",
              letterSpacing: 0.3,
            }}
          >
            City:{" "}
          </Text>
          <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
            {targetUser.address[activeAddress]?.city?.replace("'", "")}
          </Text>
        </View>
        {targetUser.address[activeAddress]?.district?.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text
              style={{
                color: currentTheme.font,
                fontWeight: "bold",
                letterSpacing: 0.3,
              }}
            >
              District:{" "}
            </Text>
            <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
              {targetUser.address[activeAddress]?.district}
            </Text>
          </View>
        )}
        {targetUser.address[activeAddress]?.street?.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text
              style={{
                color: currentTheme.font,
                fontWeight: "bold",
                letterSpacing: 0.3,
              }}
            >
              Street:{" "}
            </Text>
            <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
              {targetUser.address[activeAddress]?.street}
            </Text>
          </View>
        )}
        {targetUser.address[activeAddress]?.number?.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text
              style={{
                color: currentTheme.font,
                fontWeight: "bold",
                letterSpacing: 0.3,
              }}
            >
              Number:{" "}
            </Text>
            <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
              {targetUser.address[activeAddress]?.number}
            </Text>
          </View>
        )}
        <View style={{ marginTop: 10 }}>
          {activeAddress > 0 && (
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                backgroundColor: "rgba(1,1,1,0.2)",
                position: "absolute",
                top: 135,
                zIndex: 100,
                left: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setActiveAddress(activeAddress - 1)}
            >
              <MaterialIcons
                name={"arrow-left"}
                color={currentTheme.font}
                size={30}
              />
            </TouchableOpacity>
          )}
          <View
            style={{
              width: SCREEN_WIDTH - 14,
              position: "absolute",
              left: -20,
            }}
          >
            <Map
              mapViewRef={mapViewRef}
              latitude={targetUser.address[activeAddress]?.latitude}
              longitude={targetUser.address[activeAddress].longitude}
              height={300}
            />
          </View>
          {activeAddress < targetUser.address?.length - 1 && (
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                backgroundColor: "rgba(1,1,1,0.2)",
                position: "absolute",
                top: 135,
                zIndex: 100,
                right: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setActiveAddress(activeAddress + 1)}
            >
              <MaterialIcons
                name={"arrow-right"}
                color={currentTheme.font}
                size={30}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 5,
    paddingTop: 20,
  },
  item: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    margin: 10,
  },
  value: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
