import { useEffect, useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import useAuthStore from "../../store/authStore";
import usePanelTypesStore from "../../store/panelTypesStore";
import usePanelsStore from "../../store/panelsStore";
import useLocationStore from "../../store/locationAndMapStore";
import useWeatherStore from "../../store/weatherStore";

export const useAppData = () => {
  const router = useRouter();

  const [hadLoadingError, setHadLoadingError] = useState(false);

  const {
    user,
    isLoading: isUserLoading,
    error,
    logoutUser,
    initializeAuth,
  } = useAuthStore();
  const {
    location,
    permission,
    isLoading: isLocationLoading,
    error: locationError,
    fetchLocation,
    setPermission,
  } = useLocationStore();
  const {
    panels,
    isLoading: isPanelsLoading,
    error: panelsError,
    fetchPanels,
  } = usePanelsStore();
  const { panelTypes, isTypesLoading, errorTypes, fetchPanelTypes } =
    usePanelTypesStore();
  const {
    weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
    fetchWeather,
  } = useWeatherStore();

  const isLoading =
    isUserLoading ||
    isLocationLoading ||
    isPanelsLoading ||
    isTypesLoading ||
    isWeatherLoading;

  const checkDataCompleteness = useCallback(() => {
    return Boolean(location && panels && panelTypes && weatherData);
  }, [location, panels, panelTypes, weatherData]);

  const loadInitialData = useCallback(async () => {
    try {
      setHadLoadingError(false);

      if (!user || !user.id) {
        await initializeAuth();
      }

      if (!permission) {
        await setPermission();
      }

      if (!panelTypes) await fetchPanelTypes();
      if (!panels) await fetchPanels();

      if (!location) {
        await fetchLocation();
      }

      if (location && !weatherData) await fetchWeather();
    } catch (error) {
      console.error("Error loading initial data:", error);
      setHadLoadingError(true);
    }
  }, [
    permission,
    location,
    panelTypes,
    panels,
    weatherData,
    setPermission,
    fetchLocation,
    fetchPanelTypes,
    fetchPanels,
    fetchWeather,
    user,
    initializeAuth,
  ]);

  const reloadData = useCallback(async () => {
    try {
      await loadInitialData();
    } catch (error) {
      console.error("Error reloading app data:", error);
    }
  }, [loadInitialData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!isLoading) {
      checkDataCompleteness();
    }
  }, [isLoading, checkDataCompleteness]);

  useEffect(() => {
    if (user) {
      fetchPanels();
    }
  }, [user, fetchPanels]);

  useEffect(() => {
    if (error === "Помилка авторизації") {
      (async () => {
        await logoutUser();
        router.push("/auth");
      })();
    }
  }, [error, router, logoutUser]);

  const errorMsg = useMemo(() => {
    if (isLoading) return null;

    if (hadLoadingError) {
      return (
        error ||
        locationError ||
        panelsError ||
        weatherError ||
        errorTypes ||
        "Дані не завантажені"
      );
    }
    return null;
  }, [
    isLoading,
    hadLoadingError,
    error,
    locationError,
    panelsError,
    weatherError,
    errorTypes,
  ]);

  return {
    location,
    panels,
    weatherData,
    panelTypes,
    isLoading,
    error: errorMsg,
    reloadData,
  };
};
