import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import moment from "moment";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export const TotalEnergyChart = ({ dailyEnergyProduced }) => {
  const today = moment().startOf("day");
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    today.clone().subtract(i, "days").format("YYYY-MM-DD")
  ).reverse();

  const energyData = last7Days.map((date) => {
    const entry = dailyEnergyProduced.find((e) =>
      moment(e.date).isSame(date, "day")
    );
    return {
      value: entry ? entry.energy : 0,
      label: moment(date).format("DD.MM"),
      frontColor: entry ? MyLightTheme.colors.secondaryDark : "#D3D3D3",
      topLabelComponent: () => (
        <Text
          style={{
            color: MyLightTheme.colors.textPrimary,
            fontSize: 12,
            marginBottom: 6,
            fontFamily: FONTS.Marmelad,
            width: 32,
            marginLeft: -4,
            textAlign: "center",
          }}
        >
          {entry ? entry.energy : 0}
        </Text>
      ),
    };
  });

  const chartWidth = Dimensions.get("window").width - 40;
  const maxDataValue = Math.max(...energyData.map((d) => d.value));
  const maxValue = maxDataValue >= 10 ? maxDataValue + 2 : maxDataValue + 1;

  return (
    <View style={{ padding: 10, marginHorizontal: 15, alignItems: "center" }}>
      <Text
        style={{
          textAlign: "center",
          fontFamily: FONTS.Marmelad,
          fontSize: 20,
          marginBottom: 14,
          marginTop: 6,
          color: MyLightTheme.colors.textPrimary,
        }}
      >
        Виробіток енергії за 7 днів
      </Text>
      <BarChart
        data={energyData}
        width={chartWidth}
        initialSpacing={10}
        noOfSections={4}
        barWidth={28}
        spacing={18}
        barBorderRadius={6}
        frontColor={MyLightTheme.colors.secondaryDark}
        isAnimated
        animateOnDataChange
        animationDuration={2500}
        onDataChangeAnimationDuration={500}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={MyLightTheme.colors.textPrimary}
        yAxisTextStyle={{
          fontSize: 12,
          color: MyLightTheme.colors.primaryText,
          fontFamily: FONTS.Kurale,
        }}
        xAxisLabelTextStyle={{
          fontSize: 10,
          color: MyLightTheme.colors.textPrimary,
          fontFamily: FONTS.Kurale,
        }}
        maxValue={maxValue}
      />
    </View>
  );
};
