import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocation,
  setPermission,
} from "../../store/slices/locationAndMapSlice";
import { useEffect, useCallback, useMemo } from "react";
import { fetchPanelTypes } from "../../store/slices/typesSlice";
import { fetchWeather } from "../../store/slices/weatherSlice";
import { fetchPanels } from "../../store/slices/panelSlice";
import { useRouter } from "expo-router";

export const useAppData = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    user,
    isLoading: isUserLoading,
    error,
  } = useSelector((state) => state.auth);
  const {
    location,
    permission,
    isLoading: isLocationLoading,
    error: locationError,
  } = useSelector((state) => state.location);
  const {
    panels,
    isLoading: isPanelsLoading,
    error: panelsError,
  } = useSelector((state) => state.panel);
  const {
    panelTypes,
    isLoading: isTypesLoading,
    typesError,
  } = useSelector((state) => state.panelTypes);
  const {
    weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useSelector((state) => state.weather);

  const isDataMissingCalc = useMemo(() => {
    return !location || !panels || panels.length === 0;
  }, [location, panels]);

  const reloadData = useCallback(async () => {
    try {
      if (!permission) {
        dispatch(setPermission());
      }
      if (!location) dispatch(fetchLocation());

      dispatch(fetchPanelTypes());

      if (user?.id) {
        dispatch(fetchPanels());
      }

      if (!isDataMissingCalc) {
        dispatch(fetchWeather());
      }
    } catch (error) {
      console.error("Error reloading app data:", error);
    }
  }, [location, permission, user?.id, isDataMissingCalc]);

  useEffect(() => {
    if (error === "Помилка авторизації") {
      router.push("/auth");
    }
  }, [error]);

  useEffect(() => {
    if (!permission) dispatch(setPermission());
  }, [permission]);

  useEffect(() => {
    if (!location) dispatch(fetchLocation());
    if (!panelTypes) dispatch(fetchPanelTypes());
    if (!panels && user?.id) dispatch(fetchPanels());
    if (!isDataMissingCalc && !weatherData) {
      dispatch(fetchWeather());
    }
  }, [weatherData, isDataMissingCalc, location, panelTypes, panels, user?.id]);

  return {
    user,
    location,
    weatherData,
    panels,
    panelTypes,
    isDataMissingCalc,
    isLoading:
      isUserLoading ||
      isLocationLoading ||
      isPanelsLoading ||
      isTypesLoading ||
      isWeatherLoading,
    error: error || locationError || panelsError || typesError || weatherError,
    reloadData,
  };
};
