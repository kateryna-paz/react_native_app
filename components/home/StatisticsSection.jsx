import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import { useEnergyStatistics } from "../../hooks/home/useEnergyStatistics";

export default function StatisticsSection({ energyData }) {
  const { weekly, monthly, yearly } = useEnergyStatistics(energyData);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Тиждень</Text>
        <Text style={styles.value}>
          {weekly.value} <Text style={styles.unit}> {weekly.unit}</Text>
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.card}>
        <Text style={styles.label}>Місяць</Text>
        <Text style={styles.value}>
          {monthly.value} <Text style={styles.unit}> {monthly.unit}</Text>
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.card}>
        <Text style={styles.label}>Рік</Text>
        <Text style={styles.value}>
          {yearly.value} <Text style={styles.unit}> {yearly.unit}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: MyLightTheme.colors.background,
  },
  card: {
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
    padding: 10,
    flex: 1,
  },
  divider: {
    width: 1.25,
    borderRadius: 28,
    backgroundColor: MyLightTheme.colors.greenDark,
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: MyLightTheme.colors.textPrimary,
    fontFamily: FONTS.Kurale,
  },
  unit: {
    fontSize: 14,
  },
  value: {
    fontSize: 20,
    color: MyLightTheme.colors.primaryDark,
    fontFamily: FONTS.Marmelad,
    paddingLeft: 5,
  },
});
