import React, { useEffect, useState } from "react";
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
import { TotalEnergyChart } from "../../../components/home/TotalEnergyChart";
import StatisticsSection from "../../../components/home/StatisticsSection";

export default function HomeScreen() {
  const { isLoading, error, reloadData } = useAppData();

  const { calculateHourlyEnergy } = useSolarEnergyCalculator();

  const {
    location,
    show,
    refreshing,
    showAlert,
    hourlyEnergy,
    totalEnergy,
    blockAnimations,
    handleCountEnergy,
    onRefresh,
    setShowAlert,
    loading,
  } = useHomeScreen({
    calculateHourlyEnergy,
    reloadData,
  });

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading && !loading) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading, loading]);

  const getFormattedDate = () => {
    const date = new Date();
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return dd + "." + mm + "." + yyyy;
  };

  const dailyEnergyProduced = location?.dailyEnergyProduced.map((day) => ({
    date: day.date,
    energy: day.energy,
  }));

  if (isLoading || loading || refreshing || !showContent) {
    return <LoadingScreen title={"Головна"} />;
  }

  if (error) {
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
                    {
                      opacity: blockAnimations[0],
                      transform: [
                        {
                          translateY: blockAnimations[0].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: MyLightTheme.colors.primaryDark,
                      fontFamily: FONTS.SofiaSans,
                    }}
                  >
                    Очікувана енергія на {getFormattedDate()}:
                  </Text>
                  <Text style={styles.text}>
                    {totalEnergy && `${totalEnergy} кВт`}
                  </Text>
                </Animated.View>

                <Animated.View
                  style={{
                    opacity: blockAnimations[0],
                    transform: [
                      {
                        translateY: blockAnimations[0].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
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
                  style={{
                    opacity: blockAnimations[1],
                    transform: [
                      {
                        translateY: blockAnimations[1].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <EnergyChart weatherData={hourlyEnergy} />
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: blockAnimations[2],
                    transform: [
                      {
                        translateY: blockAnimations[2].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <CloudinessChart weatherData={hourlyEnergy} />
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: blockAnimations[3],
                    transform: [
                      {
                        translateY: blockAnimations[3].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                    marginVertical: 10,
                  }}
                >
                  <TotalEnergyChart dailyEnergyProduced={dailyEnergyProduced} />
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: blockAnimations[3],
                    transform: [
                      {
                        translateY: blockAnimations[3].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                    marginVertical: 10,
                  }}
                >
                  <StatisticsSection energyData={dailyEnergyProduced} />
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
          message={"Будь ласка, перевірте налаштування панелей та геолокації."}
        />
      </ScrollView>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,

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
  },
  totalEnergyContainer: {
    borderRadius: 16,
    marginHorizontal: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderWidth: 3,
    borderColor: MyLightTheme.colors.primaryDark,
    width: "94%",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "94%",
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
