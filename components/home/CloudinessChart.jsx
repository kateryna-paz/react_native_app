import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-gifted-charts";
import CustomDataPoint from "./CustomDataPoint";
import setLabel from "../../utils/setLabelItemChart";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function CloudinessChart({ weatherData }) {
  const cloudinessData = weatherData.map((item, index) => ({
    value: parseFloat(item.cloudiness),
    label: setLabel(index, weatherData, item.interval),
    customDataPoint:
      index === 0 || index === weatherData.length - 1
        ? () => <View />
        : () => <CustomDataPoint color={MyLightTheme.colors.greenDark} />,
  }));

  const chartWidth = Dimensions.get("window").width - 70;
  const maxValue = 100;

  return (
    <LinearGradient
      colors={[MyLightTheme.colors.white, MyLightTheme.colors.greenLight]}
      style={{
        padding: 10,
        borderRadius: 16,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontFamily: FONTS.Marmelad,
          fontSize: 18,
          marginBottom: 12,
          marginTop: 6,
          color: MyLightTheme.colors.textPrimary,
        }}
      >
        Хмарність по годинах
      </Text>

      <LineChart
        data={cloudinessData}
        width={chartWidth}
        height={220}
        spacing={chartWidth / cloudinessData.length - 0.5}
        initialSpacing={0}
        thickness={5}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={MyLightTheme.colors.green}
        yAxisTextStyle={{
          color: MyLightTheme.colors.primaryText,
          fontSize: 12,
          fontFamily: FONTS.Kurale,
        }}
        xAxisLabelTextStyle={{
          color: MyLightTheme.colors.textPrimary,
          fontSize: 10,
          width: 28,
          marginLeft: 10,
          fontFamily: FONTS.Kurale,
        }}
        isAnimated
        animateOnDataChange
        animationDuration={2500}
        onDataChangeAnimationDuration={500}
        curved
        areaChart
        startFillColor={MyLightTheme.colors.greenLight}
        startOpacity={0.8}
        endFillColor={MyLightTheme.colors.greenTwo}
        endOpacity={0.3}
        color1={MyLightTheme.colors.green}
        showVerticalLines
        verticalLinesColor={MyLightTheme.colors.background}
        showStripOnPress
        stripColor="rgba(46, 184, 78, 0.1)"
        noOfSections={5}
        maxValue={maxValue}
        pointerConfig={{
          pointerStripUptoDataPoint: true,
          pointerStripColor: "lightgray",
          pointerStripWidth: 2,
          strokeDashArray: [2, 5],
          pointerColor: "lightgray",
          radius: 4,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items) => {
            return (
              <View
                style={{
                  height: 40,
                  width: 60,
                  backgroundColor: MyLightTheme.colors.grayDark,
                  borderRadius: 4,
                  justifyContent: "center",
                  paddingLeft: 20,
                }}
              >
                <Text
                  style={{
                    color: MyLightTheme.colors.white,
                    fontWeight: "bold",
                  }}
                >
                  {items[0].value}%
                </Text>
              </View>
            );
          },
        }}
      />
    </LinearGradient>
  );
}
