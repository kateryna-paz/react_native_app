import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import setLabel from "../../utils/setLabelItemChart";

export default function WeatherVisualization({ weatherData }) {
  const chartWidth = Dimensions.get("window").width - 80;

  const prepareData = () => {
    const temperatureData = weatherData.map((item, index) => ({
      value: parseFloat(item.temp),
      dataPointColor: MyLightTheme.colors.warning,
      label: setLabel(index, weatherData, item.interval),
    }));

    const cloudinessData = weatherData.map((item) => ({
      value: parseFloat(item.cloudiness),
      dataPointColor: MyLightTheme.colors.greenDark,
    }));

    return { temperatureData, cloudinessData };
  };

  const renderDualAxisView = () => {
    const { temperatureData, cloudinessData } = prepareData();

    const maxTemperature =
      Math.max(...weatherData.map((item) => parseFloat(item.temp))) + 3;

    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={temperatureData}
          height={220}
          spacing={chartWidth / temperatureData.length - 2}
          initialSpacing={8}
          endSpacing={6}
          thickness={3}
          color={MyLightTheme.colors.warning}
          dataPointsColor={MyLightTheme.colors.warning}
          startFillColor="rgba(255, 100, 100, 0.2)"
          endFillColor="rgba(255, 100, 100, 0.01)"
          startOpacity={0.7}
          endOpacity={0.1}
          curved
          yAxisColor={MyLightTheme.colors.warning}
          xAxisColor={MyLightTheme.colors.grayDark}
          yAxisTextStyle={{
            ...styles.axisText,
            color: MyLightTheme.colors.warning,
          }}
          xAxisLabelTextStyle={styles.axisLabel}
          noOfSections={5}
          maxValue={maxTemperature}
          yAxisLabelSuffix="°C"
          showSecondaryYAxis
          secondaryData={cloudinessData}
          secondaryYAxis={{
            maxValue: 100,
            noOfSections: 5,
            yAxisColor: MyLightTheme.colors.greenDark,
            yAxisTextStyle: {
              ...styles.axisText,
              color: MyLightTheme.colors.greenDark,
            },
            yAxisLabelSuffix: "%",
          }}
          secondaryLineConfig={{
            color: MyLightTheme.colors.greenDark,
            thickness: 3,
            curved: true,
            dataPointsColor: MyLightTheme.colors.greenDark,
            startFillColor: "rgba(46, 184, 78, 0.2)",
            endFillColor: "rgba(46, 184, 78, 0.01)",
            startOpacity: 0.7,
            endOpacity: 0.1,
          }}
          hideDataPoints1={false}
          hideDataPoints2={false}
          dataPointsShape1="circular"
          dataPointsShape2="circular"
          dataPointsWidth1={6}
          dataPointsWidth2={6}
          isAnimated
          animationDuration={1000}
        />
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: MyLightTheme.colors.warning },
              ]}
            />
            <Text style={styles.legendText}>Температура (°C)</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: MyLightTheme.colors.greenDark },
              ]}
            />
            <Text style={styles.legendText}>Хмарність (%)</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Хмарність та Температура по годинах</Text>
      {renderDualAxisView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingVertical: 15,
  },
  title: {
    textAlign: "center",
    fontFamily: FONTS.Marmelad,
    fontSize: 18,
    marginBottom: 16,
    color: MyLightTheme.colors.textPrimary,
    fontWeight: "600",
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontFamily: FONTS.Kurale,
    fontSize: 12,
    color: MyLightTheme.colors.textPrimary,
  },
  axisText: {
    color: MyLightTheme.colors.grayDark,
    fontSize: 10,
    fontFamily: FONTS.Kurale,
  },
  axisLabel: {
    color: MyLightTheme.colors.textPrimary,
    fontSize: 10,
    width: 30,
    fontFamily: FONTS.Kurale,
    textAlign: "center",
  },
});
