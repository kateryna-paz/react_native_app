import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import CustomDataPoint from "./CustomDataPoint";
import setLabel from "../../utils/setLabelItemChart";

export default function EnergyChart({ weatherData }) {
  const energyData = weatherData.map((item, index) => ({
    value: parseFloat(item.energy),
    label: setLabel(index, weatherData, item.interval),
    customDataPoint:
      index === 0 || index === weatherData.length - 1
        ? () => <View />
        : () => <CustomDataPoint color={MyLightTheme.colors.primaryDark} />,
  }));

  const chartWidth = Dimensions.get("window").width - 70;
  const maxDataValue = Math.max(...energyData.map((d) => d.value));
  const maxValue =
    maxDataValue >= 0.2 ? maxDataValue + 0.4 : maxDataValue + 0.05;

  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <Text style={styles.title}>Вироблена енергія по годинах</Text>

        <LineChart
          data={energyData}
          height={220}
          spacing={chartWidth / energyData.length}
          initialSpacing={0}
          endSpacing={16}
          thickness={5}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={MyLightTheme.colors.primary}
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisLabel}
          isAnimated
          animateOnDataChange
          animationDuration={2500}
          onDataChangeAnimationDuration={500}
          curved
          areaChart
          startFillColor={MyLightTheme.colors.primary}
          startOpacity={0.8}
          endFillColor={MyLightTheme.colors.secondaryLight}
          endOpacity={0.3}
          color={MyLightTheme.colors.primary}
          showVerticalLines
          verticalLinesColor="#ddd"
          showStripOnPress
          stripColor="rgba(3, 169, 244, 0.1)"
          noOfSections={5}
          maxValue={maxValue}
          yAxisLabelTexts={Array.from({ length: 6 }, (_, i) =>
            (maxValue * (i / 5)).toFixed(5)
          )}
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: "lightgray",
            pointerStripWidth: 2,
            strokeDashArray: [2, 5],
            pointerColor: "lightgray",
            radius: 4,
            pointerLabelWidth: 100,
            pointerLabelHeight: 120,
            pointerLabelComponent: (items) => {
              return (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerText}>{items[0].value}</Text>
                </View>
              );
            },
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  gradientContainer: {
    padding: 10,
    paddingHorizontal: 30,
  },
  title: {
    textAlign: "center",
    fontFamily: FONTS.Marmelad,
    fontSize: 18,
    marginBottom: 12,
    marginTop: 6,
    color: MyLightTheme.colors.textPrimary,
  },
  yAxisText: {
    color: MyLightTheme.colors.primaryText,
    fontSize: 11,
    width: 26,
    fontFamily: FONTS.Kurale,
  },
  xAxisLabel: {
    color: MyLightTheme.colors.textPrimary,
    fontSize: 10,
    width: 30,
    marginLeft: 10,
    fontFamily: FONTS.Kurale,
  },
  pointerLabel: {
    height: 40,
    width: 60,
    backgroundColor: MyLightTheme.colors.grayDark,
    borderRadius: 4,
    justifyContent: "center",
    paddingLeft: 12,
  },
  pointerText: {
    color: MyLightTheme.colors.white,
    fontWeight: "bold",
  },
});
