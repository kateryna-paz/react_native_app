import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import { MyLightTheme } from "../../assets/theme/global";
import CustomDataPoint from "./CustomDataPoint";
import setLabel from "../../services/setLabelItemChart";

export default function EnergyChart({ weatherData }) {
  const theme = useTheme();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

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

  if (isVisible) {
    return (
      <LinearGradient
        colors={["#f5f5f5", "#e0e0e0"]}
        style={{
          padding: 10,
          borderRadius: 16,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Marmelad",
            fontSize: 18,
            marginBottom: 12,
            marginTop: 6,
            color: theme.colors.textPrimary,
          }}
        >
          Вироблена енергія по годинах
        </Text>

        <LineChart
          style={{
            fontSize: 16,
            fontFamily: "Kurale",
          }}
          data={energyData}
          width={chartWidth}
          height={220}
          spacing={chartWidth / energyData.length - 2}
          initialSpacing={16}
          thickness={5}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor="#aaa"
          yAxisTextStyle={{
            color: theme.colors.primaryText,
            fontSize: 12,
            fontFamily: "Kurale",
          }}
          xAxisLabelTextStyle={{
            color: "#333",
            fontSize: 10,
            fontFamily: "Kurale",
          }}
          isAnimated
          animateOnDataChange
          animationDuration={2500}
          onDataChangeAnimationDuration={500}
          curved
          areaChart
          startFillColor={theme.colors.primary}
          startOpacity={0.8}
          endFillColor={theme.colors.secondaryLight}
          endOpacity={0.3}
          color1={theme.colors.primary}
          showVerticalLines
          verticalLinesColor="#ddd"
          showStripOnPress
          stripColor="rgba(3, 169, 244, 0.1)"
          noOfSections={5}
          maxValue={maxValue}
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
                <View
                  style={{
                    height: 60,
                    width: 80,
                    backgroundColor: "#282C3E",
                    borderRadius: 4,
                    justifyContent: "center",
                    paddingLeft: 18,
                  }}
                >
                  <Text style={{ color: "lightgray", fontSize: 12 }}>
                    Energy
                  </Text>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {items[0].value}
                  </Text>
                </View>
              );
            },
          }}
        />
      </LinearGradient>
    );
  }
}
