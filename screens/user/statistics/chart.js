import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "../../../context/theme";

const Charts = ({ route }) => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  const data = route.params;
  const [activeChart, setActiveChart] = useState(0);

  let chart;
  if (activeChart === 0) {
    chart = (
      <View style={{ gap: 15 }}>
        <Chart
          data={data.data.dinamically.dailyInLastMonth}
          title="Last month's visitors"
          x={1}
          initial="Days:"
        />
        <Chart
          data={data.data.dinamically.dailyInLastMonth}
          title="Last month's stars"
          x={2}
          initial="Days:"
        />
        <Chart
          data={data.data.dinamically.dailyInLastMonth}
          title="Last month's followers"
          x={3}
          initial="Days:"
        />
      </View>
    );
  } else if (activeChart === 2) {
    chart = (
      <View style={{ gap: 15 }}>
        <Chart
          data={data.data.dinamically.monthlyStatsInLastYear}
          title="Last year's visitors"
          x={1}
          initial="Months:"
        />
        <Chart
          data={data.data.dinamically.monthlyStatsInLastYear}
          title="Last year's stars"
          x={2}
          initial="Months:"
        />
        <Chart
          data={data.data.dinamically.monthlyStatsInLastYear}
          title="Last year's followers"
          x={3}
          initial="Months:"
        />
      </View>
    );
  } else {
    chart = (
      <View style={{ gap: 15 }}>
        <Chart
          data={data.data.dinamically.yearlyStatsInLastYear}
          title="Last year's visitors"
          x={1}
          initial="Years:"
        />
        <Chart
          data={data.data.dinamically.yearlyStatsInLastYear}
          title="Last year's stars"
          x={2}
          initial="Years:"
        />
        <Chart
          data={data.data.dinamically.yearlyStatsInLastYear}
          title="Last year's followers"
          x={3}
          initial="Years:"
        />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: currentTheme.background, height: "100%" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        style={{
          marginTop: 20,
          paddingLeft: 20,
          maxHeight: 50,
        }}
        contentContainerStyle={{ gap: 15 }}
      >
        <TouchableOpacity
          style={{
            backgroundColor:
              activeChart === 0 ? currentTheme.pink : currentTheme.background,
            padding: 10,
            borderRadius: 50,
            maxHeight: 40,
          }}
          activeOpacity={0.3}
          onPress={() => setActiveChart(0)}
        >
          <Text
            style={[
              styles.itemTitle,
              { color: activeChart === 0 ? "#e5e5e5" : "#ccc" },
            ]}
          >
            Last month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor:
              activeChart === 2 ? currentTheme.pink : currentTheme.background,
            padding: 10,
            borderRadius: 50,
            maxHeight: 40,
          }}
          activeOpacity={0.3}
          onPress={() => setActiveChart(2)}
        >
          <Text
            style={[
              styles.itemTitle,
              { color: activeChart === 2 ? "#e5e5e5" : "#ccc" },
            ]}
          >
            Last year
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor:
              activeChart === 3 ? currentTheme.pink : currentTheme.background,
            padding: 10,
            borderRadius: 50,
            maxHeight: 40,
          }}
          activeOpacity={0.3}
          onPress={() => setActiveChart(3)}
        >
          <Text
            style={[
              styles.itemTitle,
              { color: activeChart === 3 ? "#e5e5e5" : "#ccc" },
            ]}
          >
            Yearly
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {chart}
    </View>
  );
};

const Chart = ({ data, title, x, initial }) => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  return (
    <View
      style={{
        paddingHorizontal: 10,
        backgroundColor: currentTheme.background2,
        marginHorizontal: 10,
        gap: 20,
        height: 180,
        paddingVertical: 15,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: currentTheme.font, fontWeight: "bold" }}>
        {title}
      </Text>
      <ScrollView
        horizontal={true}
        style={{
          paddingLeft: 0,
          width: "100%",
          height: "100%",
        }}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 5,
        }}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            width: 50,
            justifyContent: "flex-end",
            height: 120,
          }}
        >
          <Text style={{ fontSize: 12, color: currentTheme.font }}>
            {initial}
          </Text>
        </View>
        <View>
          <View
            style={{ flexDirection: "row", alignItems: "flex-end", gap: 5 }}
          >
            {data?.map((item, index) => {
              return (
                <View key={index + 1} style={{ gap: 5 }}>
                  <View
                    style={{
                      width: 20,
                      height: 15 + item[x] * 5,
                      borderRadius: 5,
                      backgroundColor: currentTheme.pink,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#e5e5e5", fontSize: 12 }}>
                      {item[x]}
                    </Text>
                  </View>
                  <View style={{ width: 20 }}>
                    <Text
                      style={{
                        color: currentTheme.font,
                        fontSize: 12,
                        // transform: [{ rotate: "270deg" }],
                      }}
                    >
                      {item[0].slice(item[0]?.length - 2, item[0]?.length)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Charts;

const styles = StyleSheet.create({
  sectionContainer: {
    padding: "10%",
    borderRadius: 20,
    gap: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  itemTitle: {
    fontWeight: "bold",
  },
});
