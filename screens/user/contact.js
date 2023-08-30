import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  Fontisto,
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
import { Language } from "../../context/language";

/**
 * Contact component in user screen
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Contact = ({ targetUser }) => {
  // defines language
  const language = Language();

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
      {targetUser?.type !== "user" && (
        <TouchableOpacity
          onPress={() => handleLinkPress(`tel:${targetUser.phone}`)}
          style={[
            styles.item,
            {
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: currentTheme.line,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {targetUser?.type !== "user" && (
              <>
                <View style={[styles.title, {}]}>
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
                style={[styles.title, {}]}
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
                style={[styles.title, {}]}
              >
                <FontAwesome
                  name="telegram"
                  size={16}
                  color={currentTheme.font}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => handleLinkPress(`mailto:${targetUser.email}`)}
        style={[
          styles.item,
          { borderWidth: 1, borderColor: currentTheme.line },
        ]}
      >
        <View style={[styles.title, {}]}>
          <Entypo name="email" size={16} color={currentTheme.font} />
        </View>
        <Text style={[styles.value, { color: currentTheme.font }]}>
          {targetUser.email}
        </Text>
      </TouchableOpacity>
      {targetUser.media.web && (
        <TouchableOpacity
          onPress={() => handleLinkPress(`https://${targetUser.media?.web}`)}
          style={[
            styles.item,
            { borderWidth: 1, borderColor: currentTheme.line },
          ]}
        >
          <View style={[styles.title, {}]}>
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
          style={[
            styles.item,
            { borderWidth: 1, borderColor: currentTheme.line },
          ]}
        >
          <View style={[styles.title, {}]}>
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
          style={[
            styles.item,
            { borderWidth: 1, borderColor: currentTheme.line },
          ]}
        >
          <View style={[styles.title, {}]}>
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
          style={[
            styles.item,
            { borderWidth: 1, borderColor: currentTheme.line },
          ]}
        >
          <Text style={[styles.title, {}]}>Tiktok:</Text>
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
          style={[
            styles.item,
            { borderWidth: 1, borderColor: currentTheme.line },
          ]}
        >
          <View style={[styles.title, {}]}>
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
              fontSize: 14,
              letterSpacing: 0.3,
              fontWeight: "bold",
            }}
          >
            {language?.language?.User?.userPage?.address}
            {targetUser?.address?.length > 1 ? `(${activeAddress + 1})` : null}:
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
            {language?.language?.User?.userPage?.country}:
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
            {language?.language?.User?.userPage?.region}:
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
            {language?.language?.User?.userPage?.city}:
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
              {language?.language?.User?.userPage?.district}:
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
              {language?.language?.User?.userPage?.street}:
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
              {language?.language?.User?.userPage?.number}:
            </Text>
            <Text style={{ color: currentTheme.font, letterSpacing: 0.3 }}>
              {targetUser.address[activeAddress]?.number}
            </Text>
          </View>
        )}
        <View
          style={{
            width: "100%",
            height: 20,
          }}
        >
          {activeAddress > 0 && (
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,

                position: "absolute",

                left: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setActiveAddress(activeAddress - 1)}
            >
              <Fontisto
                name={"arrow-left-l"}
                color={currentTheme.pink}
                size={30}
              />
            </TouchableOpacity>
          )}
          {activeAddress < targetUser.address?.length - 1 && (
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,

                position: "absolute",
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                // opacity: 0.6,
              }}
              onPress={() => setActiveAddress(activeAddress + 1)}
            >
              <Fontisto
                name={"arrow-right-l"}
                color={currentTheme.pink}
                size={30}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={{ marginTop: 10 }}>
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
    paddingBottom: 70,
  },
  item: {
    padding: 0,
    borderRadius: 50,
    // backgroundColor: "rgba(255,255,255,0.05)",
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
