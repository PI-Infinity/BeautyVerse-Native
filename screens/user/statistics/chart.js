import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../../context/theme";

/**
 * Define statistic's chart component in user screen
 */

const Charts = ({ route }) => {
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);

  // define current user
  const currentTheme = theme ? darkTheme : lightTheme;

  // define statistics data
  const data = route.params;

  // define active chart
  const [activeChart, setActiveChart] = useState(1);

  /**
   * Define chart
   */

  let chart;
  if (activeChart === 1) {
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
    <ScrollView
      style={{ backgroundColor: currentTheme.background }}
      contentContainerStyle={{ gap: 15, paddingBottom: 50 }}
    >
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
            padding: 10,
            paddingVertical: 5,
            borderRadius: 50,
            alignItems: "center",
            borderWidth: 2,
            borderColor:
              activeChart === 1 ? currentTheme.pink : currentTheme.background,
            height: 30,
          }}
          activeOpacity={0.3}
          onPress={() => setActiveChart(1)}
        >
          <Text style={[styles.itemTitle, { color: "#ccc" }]}>Last month</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 10,
            paddingVertical: 5,
            borderRadius: 50,
            alignItems: "center",
            borderWidth: 2,
            borderColor:
              activeChart === 2 ? currentTheme.pink : currentTheme.background,
            height: 30,
          }}
          activeOpacity={0.3}
          onPress={() => setActiveChart(2)}
        >
          <Text style={[styles.itemTitle, { color: "#ccc" }]}>Last year</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            paddingVertical: 5,
            borderRadius: 50,
            alignItems: "center",
            borderWidth: 2,
            borderColor:
              activeChart === 3 ? currentTheme.pink : currentTheme.background,
            height: 30,
          }}
          activeOpacity={0.3}
          onPress={() => setActiveChart(3)}
        >
          <Text style={[styles.itemTitle, { color: "#ccc" }]}>Annually</Text>
        </TouchableOpacity>
      </ScrollView>
      <View>{chart}</View>
    </ScrollView>
  );
};

const Chart = ({ data, title, x, initial }) => {
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;
  return (
    <View
      style={{
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: currentTheme.line,
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
                <View key={index + 1} style={{ gap: 5, alignItems: "center" }}>
                  <View
                    style={{
                      minWidth: 20,
                      height: 15 + item[x] * 0.2,
                      borderRadius: 5,
                      backgroundColor: currentTheme.pink,
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text style={{ color: "#e5e5e5", fontSize: 12 }}>
                      {item[x]}
                    </Text>
                  </View>
                  <View style={{ width: 20 }}>
                    <Text
                      style={{
                        color: currentTheme.disabled,
                        fontSize: 12,
                        fontStyle: "italic",
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
