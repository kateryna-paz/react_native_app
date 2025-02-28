import { useState, useEffect, useMemo, useCallback } from "react";
import { Animated } from "react-native";
import { showToast } from "../../utils/showToast";
import useDistributeDevicesStore from "../../store/distributeStore";
import useLocationStore from "../../store/locationAndMapStore";
import usePanelsStore from "../../store/panelsStore";
import usePanelTypesStore from "../../store/panelTypesStore";
import useWeatherStore from "../../store/weatherStore";

export const useHomeScreen = ({ calculateHourlyEnergy, reloadData }) => {
  // UI state
  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data state
  const [hourlyEnergy, setHourlyEnergy] = useState(null);
  const [totalEnergy, setTotalEnergy] = useState(null);

  // External store functions
  const { setTotalDistributeEnergy } = useDistributeDevicesStore();
  const { location, updateDailyEnergyArray } = useLocationStore();

  const { panels } = usePanelsStore();
  const { panelTypes } = usePanelTypesStore();
  const { weatherData } = useWeatherStore();

  // Animation setup
  const blockAnimations = useMemo(
    () => Array.from({ length: 4 }, () => new Animated.Value(0)),
    []
  );

  // Start animations
  const startBlockAnimations = useCallback(() => {
    blockAnimations.forEach((animation) => animation.setValue(0));

    Animated.stagger(
      800,
      blockAnimations.map((animation) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [blockAnimations]);

  // Validate required data
  const checkData = useCallback(() => {
    if (
      !location ||
      !panels?.length ||
      !panelTypes?.length ||
      !weatherData?.hourlyClouds ||
      !weatherData?.sunrise ||
      !weatherData?.sunset
    ) {
      return false;
    }

    return true;
  }, [location, weatherData, panels, panelTypes]);

  const hasTodayEnergyData = useCallback(() => {
    if (
      !location?.dailyEnergyProduced ||
      location.dailyEnergyProduced.length === 0
    ) {
      return false;
    }

    const today = new Date().toISOString().split("T")[0];
    const todayEntry = location.dailyEnergyProduced.find((entry) =>
      entry.date?.startsWith(today)
    );

    if (!todayEntry) {
      return false;
    }

    setTotalEnergy(todayEntry.energy);
    setHourlyEnergy(todayEntry.hourlyEnergy);

    return true;
  }, [location]);

  // Calculate energy data
  const calculateEnergyData = useCallback(async () => {
    if (!checkData()) {
      return false;
    }

    try {
      const { hourlyEnergy: newHourlyEnergy, allEnergy } =
        calculateHourlyEnergy(
          weatherData.hourlyClouds,
          weatherData.sunrise,
          weatherData.sunset
        );

      console.log("newHourlyEnergy", newHourlyEnergy, allEnergy);

      if (!newHourlyEnergy && !allEnergy) {
        showToast("error", "Помилка розрахунку енергії");
        return false;
      }

      const isEnergyChanged =
        totalEnergy !== allEnergy ||
        JSON.stringify(hourlyEnergy) !== JSON.stringify(newHourlyEnergy);

      setTotalDistributeEnergy(allEnergy);
      setHourlyEnergy(newHourlyEnergy);
      setTotalEnergy(allEnergy);

      const today = new Date().toISOString().split("T")[0];
      const todayEntry = location?.dailyEnergyProduced?.find((entry) =>
        entry.date?.startsWith(today)
      );

      if (!todayEntry || isEnergyChanged) {
        await updateDailyEnergyArray(
          allEnergy,
          newHourlyEnergy,
          isEnergyChanged
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }, [
    setTotalDistributeEnergy,
    calculateHourlyEnergy,
    weatherData,
    checkData,
    updateDailyEnergyArray,
  ]);

  const handleCountEnergy = useCallback(() => {
    setLoading(true);

    setShow(false);

    if (hourlyEnergy && totalEnergy) {
      setShow(true);
      startBlockAnimations();
      setLoading(false);
      return;
    }

    if (hasTodayEnergyData()) {
      setShow(true);
      startBlockAnimations();
      setLoading(false);
      return;
    }

    if (!checkData()) {
      showToast("error", "Перевірте дані про локацію та панелі");
      setLoading(false);
      return;
    }

    if (calculateEnergyData()) {
      setShow(true);
      startBlockAnimations();
    }

    setLoading(false);
  }, [
    hourlyEnergy,
    totalEnergy,
    hasTodayEnergyData,
    checkData,
    calculateEnergyData,
    startBlockAnimations,
  ]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setShow(false);

      blockAnimations.forEach((anim) => anim.setValue(0));
      setTotalEnergy(null);
      setHourlyEnergy(null);

      await reloadData();
    } catch (error) {
      console.error("Refresh error:", error);
      showToast("error", "Не вдалося оновити дані.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [reloadData, blockAnimations]);

  useEffect(() => {
    setLoading(true);

    if (!hasTodayEnergyData() && !checkData()) {
      setShow(false);
      setTotalEnergy(null);
      setHourlyEnergy(null);
    }

    setLoading(false);
  }, [checkData, hasTodayEnergyData]);

  useEffect(() => {
    if (panels && panels.length > 0 && location && weatherData) {
      setShow(false);
      setTotalEnergy(null);
      setHourlyEnergy(null);

      calculateEnergyData();
    }
  }, [panels, location, weatherData, calculateEnergyData]);

  // Handle stored data display
  useEffect(() => {
    if (hasTodayEnergyData()) {
      setShow(true);
      startBlockAnimations();
    }
  }, [hasTodayEnergyData, startBlockAnimations]);

  return {
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
  };
};
