import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import CustomDataPoint from "./CustomDataPoint";
import setLabel from "../../services/setLabelItemChart";

export default function CloudinessChart({ weatherData }) {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const cloudinessData = weatherData.map((item, index) => ({
    value: parseFloat(item.cloudiness),
    label: setLabel(index, weatherData, item.interval),
    customDataPoint:
      index === 0 || index === weatherData.length - 1
        ? () => <View />
        : () => <CustomDataPoint color={theme.colors.greenDark} />,
  }));

  const chartWidth = Dimensions.get("window").width - 70;
  const maxValue = 110;

  if (isVisible) {
    return (
      <LinearGradient
        colors={["#e8f5e9", "#c8e6c9"]}
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
          Хмарність по годинах
        </Text>

        <LineChart
          style={{
            fontSize: 16,
            fontFamily: "Kurale",
          }}
          data={cloudinessData}
          width={chartWidth}
          height={220}
          spacing={chartWidth / cloudinessData.length - 2}
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
          startFillColor={theme.colors.greenLight}
          startOpacity={0.8}
          endFillColor={theme.colors.greenTwo}
          endOpacity={0.3}
          color1={theme.colors.green}
          showVerticalLines
          verticalLinesColor="#ddd"
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
                    backgroundColor: "#282C3E",
                    borderRadius: 4,
                    justifyContent: "center",
                    paddingLeft: 20,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
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
}
