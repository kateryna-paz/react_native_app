import { useState, useEffect, useMemo, useCallback } from "react";
import { Animated } from "react-native";
import { showToast } from "../../utils/showToast";
import useDistributeDevicesStore from "../../store/distributeStore";

export const useHomeScreen = ({
  location,
  panels,
  weatherData,
  panelTypes,
  calculateHourlyEnergy,
  reloadData,
}) => {
  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [hourlyEnergy, setHourlyEnergy] = useState(null);
  const [totalEnergy, setTotalEnergy] = useState(null);

  const { setTotalDistributeEnergy } = useDistributeDevicesStore();

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

  const insolation = useMemo(
    () => location?.monthlyInsolation?.[new Date().getMonth()] || 0,
    [location]
  );

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

  const checkData = useCallback(() => {
    if (!location)
      return showToast("error", "Помилка: Дані про локацію відсутні"), false;
    if (!panels.length || !panelTypes.length)
      return (
        showToast("error", "Помилка: Немає даних про сонячні панелі"), false
      );
    if (
      !weatherData?.hourlyClouds ||
      !weatherData?.sunrise ||
      !weatherData?.sunset
    ) {
      return showToast("error", "Помилка: Немає погодних даних"), false;
    }
    return true;
  }, [location, weatherData, panels, panelTypes]);

  const handleCountEnergy = useCallback(() => {
    if (!checkData()) {
      setShowAlert(true);
      return;
    }
    setShow(true);

    const { hourlyEnergy, allEnergy } = calculateHourlyEnergy(
      weatherData.hourlyClouds,
      weatherData.sunrise,
      weatherData.sunset,
      insolation,
      panelsPower
    );

    setTotalDistributeEnergy(allEnergy);
    setHourlyEnergy(hourlyEnergy);
    setTotalEnergy(allEnergy);
  }, [
    checkData,
    insolation,
    panelsPower,
    weatherData,
    calculateHourlyEnergy,
    setTotalDistributeEnergy,
    setHourlyEnergy,
    setTotalEnergy,
  ]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setTotalEnergy(null);
      setShow(false);

      await reloadData();

      blockAnimations.forEach((anim) => anim.setValue(0));
    } catch (error) {
      showToast("error", "Не вдалося оновити дані.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (show) {
      handleCountEnergy();
      startBlockAnimations();
    }
  }, [show, handleCountEnergy, startBlockAnimations]);

  useEffect(() => {
    if (totalEnergy && show) {
      startBlockAnimations();
    }
  }, [totalEnergy, startBlockAnimations, show]);

  useEffect(() => {
    if (!panels.length || !weatherData || !location) {
      setShow(false);
      setTotalEnergy(null);
      setHourlyEnergy(null);
    }
  }, [panels, weatherData, location]);

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
