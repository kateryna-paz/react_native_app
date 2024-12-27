import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import { Icon, useTheme } from "react-native-paper";
import MyContainer from "../../../components/UI/MyContainer";
import EnergyButton from "../../../components/home/EnergyButton";
import { useAppData } from "../../../hooks/useAppData";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import { MyLightTheme } from "../../../assets/theme/global";
import { router } from "expo-router";
import useSolarEnergyCalculator from "../../../hooks/useSolarEnergyCalculator";
import EnergyChart from "../../../components/home/EnergyChart";
import CloudinessChart from "../../../components/home/CloudinessChart";

export default function HomeScreen() {
  const theme = useTheme();

  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    location,
    panels,
    weatherData,
    panelTypes,
    isLoading,
    error,
    reloadData,
  } = useAppData();
  const { calculateHourlyEnergy } = useSolarEnergyCalculator();

  const [hourlyEnergy, setHourlyEnergy] = useState(null);
  const [totalEnergy, setTotalEnergy] = useState(null);

  const efficiency = useMemo(() => {
    if (!panels?.length || !panelTypes?.length) return null;

    const effMono =
      panelTypes.find((pT) => pT.type === "Монокристалічні").efficiency / 100;
    const effPoli =
      panelTypes.find((pT) => pT.type === "Полікристалічні").efficiency / 100;
    const effAmo =
      panelTypes.find((pT) => pT.type === "Аморфні").efficiency / 100;

    return {
      monocristal: effMono,
      policristal: effPoli,
      amorfni: effAmo,
    };
  }, [panels, panelTypes]);

  const panelsPower = useMemo(() => {
    if (!panels?.length || !efficiency) return null;

    return panels.reduce(
      (acc, panel) => {
        const totalPower = (+panel.number * +panel.power) / 1000;
        if (panel.type === "Монокристалічні") {
          acc.monocristal += totalPower * efficiency.monocristal;
        } else if (panel.type === "Полікристалічні") {
          acc.policristal += totalPower * efficiency.policristal;
        } else if (panel.type === "Аморфні") {
          acc.amorfni += totalPower * efficiency.amorfni;
        }
        return acc;
      },
      { monocristal: 0, policristal: 0, amorfni: 0 }
    );
  }, [panels, efficiency]);

  const insolation = useMemo(() => {
    if (!location) return 0;
    const monthNumber = new Date().getMonth();
    return location.monthlyInsolation[monthNumber];
  }, [location]);

  const blockAnimations = useMemo(
    () => Array.from({ length: 3 }, () => new Animated.Value(0)),
    []
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setShow(false);
      setTotalEnergy(null);
      await reloadData();
      blockAnimations.forEach((anim) => anim.setValue(0));
    } catch (error) {
      Alert.alert("Помилка оновлення", "Не вдалося оновити дані.");
    } finally {
      setRefreshing(false);
    }
  };

  const startBlockAnimations = useCallback(() => {
    Animated.stagger(
      600,
      blockAnimations.map((animation) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [blockAnimations]);

  const handleCountEnergy = useCallback(() => {
    setShow(true);
    if (!weatherData || !location || !panels || panels.length === 0) {
      Alert.alert(
        "Недостатньо даних",
        "Будь ласка, перевірте налаштування панелей та геолокації."
      );
      return;
    }

    const { hourlyEnergy, allEnergy } = calculateHourlyEnergy(
      weatherData.hourlyClouds,
      weatherData.sunrise,
      weatherData.sunset,
      insolation,
      panelsPower,
      panels
    );

    setHourlyEnergy(hourlyEnergy);
    setTotalEnergy(allEnergy);

    setTimeout(() => {
      startBlockAnimations();
    }, 100);
  }, [
    weatherData,
    location,
    panels,
    insolation,
    panelsPower,
    calculateHourlyEnergy,
    startBlockAnimations,
  ]);

  useEffect(() => {
    blockAnimations.forEach((anim) => {
      anim.setValue(0);
    });
    if (totalEnergy) {
      startBlockAnimations();
    }
  }, [totalEnergy]);

  useEffect(() => {
    if (!isLoading && show && weatherData && location && panels?.length > 0) {
      handleCountEnergy();
    }
  }, [isLoading, show, handleCountEnergy]);

  if (isLoading) {
    return (
      <LoadingScreen
        colorStart={theme.colors.secondaryDark}
        colorEnd={theme.colors.secondaryLight}
        indicatorColor={theme.colors.white}
      />
    );
  }

  if (error) {
    return (
      <ErrorScreen
        colorStart={theme.colors.secondaryDark}
        colorEnd={theme.colors.secondaryLight}
        theme={theme}
        errorMessage={error}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    );
  }

  return (
    <MyContainer
      colorStart={theme.colors.secondaryDark}
      colorEnd={theme.colors.secondaryLight}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            enabled={true}
            progressViewOffset={50}
            progressBackgroundColor={theme.colors.secondaryLight}
            tintColor={theme.colors.secondaryLight}
            titleColor={theme.colors.secondaryLight}
            refreshingProp={0.4}
          />
        }
      >
        <View style={!show ? styles.buttonContainer : styles.container}>
          {show && (
            <ScrollView>
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
                      color: theme.colors.primaryLight,
                      fontFamily: "SofiaSans",
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
                        fontFamily: "SofiaSans",
                        color: theme.colors.white,
                        textAlign: "left",
                      }}
                    >
                      Розподілити енергію між приладами
                    </Text>

                    <Icon
                      source={"arrow-right-thin"}
                      size={20}
                      color={theme.colors.white}
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

          {!show && (
            <EnergyButton
              style={styles.energyButton}
              onPress={handleCountEnergy}
              theme={theme}
            />
          )}
        </View>
      </ScrollView>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginHorizontal: 10,
    marginBottom: 128,
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
    borderRadius: 10,
    padding: 20,
    backgroundColor: MyLightTheme.colors.primaryDark,
    borderWidth: 3,
    borderColor: MyLightTheme.colors.primaryLight,
    shadowColor: "white",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
    width: "100%",
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  heading: {
    fontSize: 20,
    color: MyLightTheme.colors.primaryDark,
    fontFamily: "SofiaSansBold",
  },
  text: {
    fontSize: 24,
    marginTop: 14,
    textAlign: "right",
    color: MyLightTheme.colors.white,
    fontFamily: "SofiaSansBold",
  },
  highlightText: {
    color: MyLightTheme.colors.primary,
    fontFamily: "SofiaSans",
    fontSize: 16,
  },
  energyButton: {
    backgroundColor: MyLightTheme.colors.secondaryLight,
    marginHorizontal: 20,
    borderRadius: 30,
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
