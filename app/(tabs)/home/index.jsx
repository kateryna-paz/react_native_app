import React, { useRef, useEffect, useState, useMemo } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
import { useTheme } from "react-native-paper";
import MyContainer from "../../../components/UI/MyContainer";
import EnergyButton from "../../../components/home/EnergyButton";
import { useAppData } from "../../../hooks/useAppData";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import { MyLightTheme } from "../../../assets/theme/global";

export default function HomeScreen() {
  const theme = useTheme();

  const [show, setShow] = useState(false);

  const { user, location, panels, weatherData, panelTypes, isLoading, error } =
    useAppData();

  const [panelsSquare, setPanelsSquare] = useState({
    monocristal: 0,
    policristal: 0,
    amorfni: 0,
  });

  const [efficiency, setEfficincy] = useState({
    monocristal: 0,
    policristal: 0,
    amorfni: 0,
  });
  const [insolation, setInsolation] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(null);

  const blockAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const calculateDailyEnergy = useMemo(() => {
    return (cloudiness, dailyInsolation, energy) => {
      const cloudImpact = 1 - 0.8 * (cloudiness / 100);
      const totalEnergy = energy * dailyInsolation * cloudImpact;
      console.log("Вироблена енергія (кВт·год/день):", totalEnergy);
      return totalEnergy;
    };
  }, []);

  const handleCountEnergy = () => {
    if (!weatherData || !location || !panels) return;

    const energyMono =
      panelsSquare.monocristal * (efficiency.monocristal / 100);
    const energyPoly =
      panelsSquare.policristal * (efficiency.policristal / 100);
    const energyAmorph = panelsSquare.amorfni * (efficiency.amorfni / 100);
    const totalPanelsEnergy = energyMono + energyPoly + energyAmorph;

    const dailyInsolation = insolation * weatherData.sunDayHours;
    const calculatedEnergy = calculateDailyEnergy(
      weatherData.cloudiness,
      dailyInsolation,
      totalPanelsEnergy
    );

    setTotalEnergy(calculatedEnergy);

    blockAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 500,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    if (panels?.length > 0 && panelTypes?.length > 0) {
      const newPanelsSquare = panels.reduce(
        (acc, panel) => {
          if (panel.type === "Монокристалічні") {
            acc.monocristal += panel.number * panel.square;
          } else if (panel.type === "Полікристалічні") {
            acc.policristal += panel.number * panel.square;
          } else if (panel.type === "Аморфні") {
            acc.amorfni += panel.number * panel.square;
          }
          return acc;
        },
        { monocristal: 0, policristal: 0, amorfni: 0 }
      );
      setEfficincy({
        monocristal: panelTypes.find(
          (panel) => panel.type === "Монокристалічні"
        ).efficiency,
        policristal: panelTypes.find(
          (panel) => panel.type === "Полікристалічні"
        ).efficiency,
        amorfni: panelTypes.find((panel) => panel.type === "Аморфні")
          .efficiency,
      });
      setPanelsSquare(newPanelsSquare);
    }
    if (location) {
      const monthNumber = new Date().getMonth();
      setInsolation(location.monthlyInsolation[monthNumber]);
    }
  }, [user, panels, panelTypes, location, weatherData]);

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
      />
    );
  }

  return (
    <MyContainer
      colorStart={theme.colors.secondaryDark}
      colorEnd={theme.colors.secondaryLight}
    >
      <View
        style={[{ backgroundColor: theme.colors.background }, styles.container]}
      >
        <EnergyButton
          style={styles.energyButton}
          onPress={handleCountEnergy}
          theme={theme}
        />

        <Animated.View
          style={[styles.paragraphContainer, { opacity: blockAnimations[0] }]}
        >
          <View>
            <Text style={styles.heading}>
              Геолокація{"  "}
              <Text style={styles.highlightText}>
                ({location?.regionName.split(" ")[0]} обл.)
              </Text>
            </Text>
          </View>
          <Text style={styles.text}>
            {location?.latitude?.toFixed(10)},{" "}
            {location?.longitude?.toFixed(10)}
            {"\n"}
          </Text>
        </Animated.View>

        <Animated.View
          style={[styles.paragraphContainer, { opacity: blockAnimations[1] }]}
        >
          <Text style={styles.heading}>Панелі</Text>
          <Text style={styles.text}>
            {panelsSquare.monocristal !== 0 && (
              <Text>
                Монокристалічні (ККД = {efficiency.monocristal}%)
                <Text style={styles.highlightText}>
                  {" "}
                  - {panelsSquare.monocristal} м² {"\n"}
                </Text>
              </Text>
            )}
            {panelsSquare.policristal !== 0 && (
              <Text>
                Полікристалічні (ККД = {efficiency.policristal}%)
                <Text style={styles.highlightText}>
                  {" "}
                  - {panelsSquare.policristal} м² {"\n"}
                </Text>
              </Text>
            )}
            {panelsSquare.amorfni !== 0 && (
              <Text>
                Аморфні (ККД = {efficiency.amorfni}%)
                <Text style={styles.highlightText}>
                  {" "}
                  - {panelsSquare.amorfni} м²
                </Text>
              </Text>
            )}
          </Text>
        </Animated.View>

        <Animated.View
          style={[styles.paragraphContainer, { opacity: blockAnimations[2] }]}
        >
          <Text style={styles.heading}>Інсоляція цього місяця</Text>

          <Text style={styles.text}>
            <Text style={styles.highlightText}>{insolation} </Text> кВт·год/м²
            за день
          </Text>
        </Animated.View>

        <Animated.View
          style={[styles.paragraphContainer, { opacity: blockAnimations[3] }]}
        >
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Сонячний день</Text>
            <Text style={styles.heading}>Хмарність</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.highlightText}>
              {weatherData?.sunDayHours} год
            </Text>
            <Text style={styles.highlightText}>{weatherData?.cloudiness}%</Text>
          </View>
        </Animated.View>
        <Animated.View
          style={[styles.paragraphContainer, { opacity: blockAnimations[4] }]}
        >
          <Text style={styles.heading}>Очікувана енергія</Text>
          <Text style={styles.text}>
            {totalEnergy && `${totalEnergy.toFixed(2)} кВт·год/день`}
          </Text>
        </Animated.View>
      </View>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    paddingTop: 30,
    marginHorizontal: 16,
    marginBottom: 110,
    flex: 1,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  paragraphContainer: {
    borderRadius: 12,
    padding: 18,
    marginTop: 12,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: MyLightTheme.colors.primary,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    width: "100%",
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
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    color: MyLightTheme.colors.greenDark,
    lineHeight: 24,
    fontFamily: "SofiaSans",
  },
  highlightText: {
    color: MyLightTheme.colors.primary,
    fontFamily: "SofiaSans",
    fontSize: 16,
  },
  shadowBox: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  energyButton: {
    backgroundColor: MyLightTheme.colors.secondaryLight,
    borderRadius: 30,
    padding: 15,
    marginBottom: 10,
    shadowColor: MyLightTheme.colors.secondaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
