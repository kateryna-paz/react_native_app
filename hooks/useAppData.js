import { useDispatch, useSelector } from "react-redux";
import {
  fetchCloudiness,
  fetchLocation,
  setPermission,
} from "../store/slices/locationAndMapSlice";
import { useEffect, useCallback, useState } from "react";
import { fetchPanelTypes } from "../store/slices/typesSlice";
import { fetchWeather } from "../store/slices/weatherSlice";
import { fetchPanels } from "../store/slices/panelSlice";

export const useAppData = () => {
  const dispatch = useDispatch();
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

  const { panelTypes, isTypesLoading, typesError } = useSelector(
    (state) => state.panelTypes
  );
  const {
    weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useSelector((state) => state.weather);

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

      if (location) {
        dispatch(fetchWeather());
      }
    } catch (error) {
      console.error("Error reloading app data:", error);
    }
  }, [location, permission, user?.id]);

  useEffect(() => {
    if (!permission) dispatch(setPermission());
  }, [permission]);

  useEffect(() => {
    if (!location) dispatch(fetchLocation());
  }, [location]);

  useEffect(() => {
    if (!panelTypes) dispatch(fetchPanelTypes());
    if (!panels && user?.id) dispatch(fetchPanels());
  }, [panelTypes, user?.id, panels]);

  useEffect(() => {
    if (!location) dispatch(fetchLocation());

    if (!weatherData) dispatch(fetchWeather());
  }, [weatherData, location]);

  return {
    user,
    location,
    weatherData,
    panels,
    panelTypes,
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
