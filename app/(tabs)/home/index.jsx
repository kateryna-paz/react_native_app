import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import { Icon } from "react-native-paper";
import MyContainer from "../../../components/UI/MyContainer";
import EnergyButton from "../../../components/home/EnergyButton";
import { useAppData } from "../../../hooks/home/useAppData";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import { FONTS, MyLightTheme } from "../../../assets/theme/global";
import { router } from "expo-router";
import useSolarEnergyCalculator from "../../../hooks/home/useSolarEnergyCalculator";
import EnergyChart from "../../../components/home/EnergyChart";
import CloudinessChart from "../../../components/home/CloudinessChart";
import Header from "../../../components/UI/Header";
import { AnimatedIcon } from "../../../components/home/AnimatedIcon";
import CustomAlert from "../../../components/UI/CustomAlert";
import { useHomeScreen } from "../../../hooks/home/useHomeScreen";

export default function HomeScreen() {
  const {
    location,
    panels,
    weatherData,
    panelTypes,
    isDataMissingCalc,
    isLoading,
    error,
    reloadData,
  } = useAppData();

  const { calculateHourlyEnergy } = useSolarEnergyCalculator();

  const {
    show,
    refreshing,
    showAlert,
    hourlyEnergy,
    totalEnergy,
    blockAnimations,
    handleCountEnergy,
    onRefresh,
    setShowAlert,
  } = useHomeScreen({
    location,
    panels,
    weatherData,
    panelTypes,
    calculateHourlyEnergy,
    reloadData,
  });

  if (isLoading) {
    return <LoadingScreen title={"Головна"} />;
  }

  if (error || isDataMissingCalc) {
    return (
      <ErrorScreen
        errorMessage={
          error ||
          "Для розрахунку енергії невистачає даних про локацію або інформації про сонячні панелі"
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
        title={"Головна"}
      />
    );
  }

  return (
    <MyContainer
      colorStart={MyLightTheme.colors.primaryLight}
      colorEnd={MyLightTheme.colors.secondaryLight}
    >
      <Header title={"Головна"} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            enabled={true}
            progressViewOffset={50}
            progressBackgroundColor={MyLightTheme.colors.secondaryLight}
            tintColor={MyLightTheme.colors.secondaryLight}
            titleColor={MyLightTheme.colors.secondaryLight}
            refreshingProp={0.4}
          />
        }
      >
        <View style={!show ? styles.buttonContainer : styles.container}>
          {show && !isLoading && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.dataContainer}>
                <Animated.View
                  style={[
                    styles.totalEnergyContainer,
                    { opacity: blockAnimations[0] },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: MyLightTheme.colors.primaryDark,
                      fontFamily: FONTS.SofiaSans,
                    }}
                  >
                    Очікувана енергія
                  </Text>
                  <Text style={styles.text}>
                    {totalEnergy && `${totalEnergy} кВт·год/день`}
                  </Text>
                </Animated.View>

                <Animated.View style={{ opacity: blockAnimations[0] }}>
                  <Pressable
                    onPress={() => router.push("/energy_distribution")}
                    style={styles.linkContainer}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: FONTS.SofiaSans,
                        color: MyLightTheme.colors.black,
                        textAlign: "left",
                      }}
                    >
                      Розподілити енергію між приладами
                    </Text>

                    <Icon
                      source={"arrow-right-thin"}
                      size={20}
                      color={MyLightTheme.colors.black}
                    />
                  </Pressable>
                </Animated.View>

                <Animated.View
                  style={{ opacity: blockAnimations[1], marginVertical: 10 }}
                >
                  <EnergyChart weatherData={hourlyEnergy} />
                </Animated.View>
                <Animated.View
                  style={{ opacity: blockAnimations[2], marginVertical: 10 }}
                >
                  <CloudinessChart weatherData={hourlyEnergy} />
                </Animated.View>
              </View>
            </ScrollView>
          )}

          {!show && !isLoading && (
            <View>
              <AnimatedIcon />
              <EnergyButton
                style={styles.energyButton}
                onPress={handleCountEnergy}
              />
            </View>
          )}
        </View>
        <CustomAlert
          showAlert={showAlert}
          title={"Недостатньо даних"}
          onConfirm={() => {
            setShowAlert(false);
          }}
          showCancelButton={false}
          message={"Будь ласка, перевірте налаштування панелей та геолокації."}
        />
      </ScrollView>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingTop: 2,
    flex: 1,
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  dataContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 10,
  },
  totalEnergyContainer: {
    borderRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderWidth: 3,
    borderColor: MyLightTheme.colors.primaryDark,
    width: "100%",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    margin: 10,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 26,
    marginTop: 14,
    textAlign: "right",
    color: MyLightTheme.colors.primary,
    fontFamily: FONTS.SofiaSansBold,
  },
  energyButton: {
    backgroundColor: MyLightTheme.colors.secondaryLight,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: MyLightTheme.colors.secondaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 128,
  },
});
