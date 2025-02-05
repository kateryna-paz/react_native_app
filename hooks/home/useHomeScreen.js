import { useState, useEffect, useMemo, useCallback } from "react";
import { Animated } from "react-native";
import { useDispatch } from "react-redux";
import { showToast } from "../../utils/showToast";
import { setTotalDistributeEnergy } from "../../store/slices/distributeDevicesSlice";

export const useHomeScreen = ({
  location,
  panels,
  weatherData,
  panelTypes,
  calculateHourlyEnergy,
  reloadData,
}) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
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

  const startBlockAnimations = useCallback(() => {
    blockAnimations.forEach((animation) => animation.setValue(0));
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
      setShowAlert(true);
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

    dispatch(setTotalDistributeEnergy(allEnergy));

    setHourlyEnergy(hourlyEnergy);
    setTotalEnergy(allEnergy);
  }, [
    weatherData,
    location,
    panels,
    insolation,
    panelsPower,
    calculateHourlyEnergy,
    dispatch,
  ]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setTotalEnergy(null);
      await reloadData();
      blockAnimations.forEach((anim) => anim.setValue(0));
    } catch (error) {
      showToast("error", "Не вдалося оновити дані.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    blockAnimations.forEach((anim) => {
      anim.setValue(0);
    });
    if (totalEnergy && show) {
      startBlockAnimations();
    }
  }, [totalEnergy, blockAnimations, startBlockAnimations]);

  useEffect(() => {
    if (weatherData && location && panels?.length > 0 && show) {
      handleCountEnergy();
    }
  }, [handleCountEnergy, location, panels, weatherData]);

  return {
    show,
    refreshing,
    showAlert,
    hourlyEnergy,
    totalEnergy,
    blockAnimations,
    handleCountEnergy,
    onRefresh,
    setShowAlert,
  };
};
