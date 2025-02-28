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
    error: authError,
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
    isLoading: isPanelsLoading,
    error: panelsError,
    fetchPanels,
  } = usePanelsStore();

  const {
    panelTypes,
    isLoading: isTypesLoading,
    error: errorTypes,
    fetchPanelTypes,
  } = usePanelTypesStore();

  const {
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

  useEffect(() => {
    const initialize = async () => {
      try {
        if (!user) {
          await initializeAuth();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setHadLoadingError(true);
      }
    };

    initialize();
  }, [user, initializeAuth]);

  useEffect(() => {
    const setupLocationServices = async () => {
      try {
        if (user) {
          if (!permission) {
            await setPermission();
          }

          await fetchLocation();
        }
      } catch (error) {
        console.error("Location setup error:", error);
        setHadLoadingError(true);
      }
    };

    setupLocationServices();
  }, [user, permission, setPermission, fetchLocation]);

  useEffect(() => {
    const loadPanelTypes = async () => {
      try {
        if (!panelTypes) {
          await fetchPanelTypes();
        }
      } catch (error) {
        console.error("Panel types fetch error:", error);
        setHadLoadingError(true);
      }
    };

    loadPanelTypes();
  }, [panelTypes, fetchPanelTypes]);

  useEffect(() => {
    const loadPanels = async () => {
      try {
        if (user) {
          await fetchPanels();
        }
      } catch (error) {
        console.error("Panels fetch error:", error);
        setHadLoadingError(true);
      }
    };

    loadPanels();
  }, [user, fetchPanels]);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        if (user && location) {
          await fetchWeather();
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
        setHadLoadingError(true);
      }
    };

    loadWeather();
  }, [user, location, fetchWeather]);

  useEffect(() => {
    if (authError === "Помилка авторизації") {
      (async () => {
        await logoutUser();
        router.replace("/auth");
      })();
    }
  }, [authError, router, logoutUser]);

  const reloadData = useCallback(async () => {
    try {
      setHadLoadingError(false);

      if (!user) {
        await initializeAuth();
      }

      if (user) {
        if (!permission) {
          await setPermission();
        }

        await fetchLocation();
        await fetchPanels();

        if (location) {
          await fetchWeather();
        }
      }

      if (!panelTypes) {
        await fetchPanelTypes();
      }
    } catch (error) {
      console.error("Error reloading app data:", error);
      setHadLoadingError(true);
    }
  }, [
    user,
    permission,
    location,
    panelTypes,
    initializeAuth,
    setPermission,
    fetchLocation,
    fetchPanels,
    fetchWeather,
    fetchPanelTypes,
  ]);

  const errorMsg = useMemo(() => {
    if (isLoading) return null;

    if (hadLoadingError) {
      return (
        authError ||
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
    authError,
    locationError,
    panelsError,
    weatherError,
    errorTypes,
  ]);

  return {
    isLoading,
    error: errorMsg,
    reloadData,
  };
};
