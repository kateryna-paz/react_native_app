import { useDispatch, useSelector } from "react-redux";
import {
  fetchCloudiness,
  fetchLocation,
  setPermission,
} from "../store/slices/locationAndMapSlice";
import { useEffect } from "react";
import { fetchPanelTypes } from "../store/slices/typesSlice";
import { fetchWeather } from "../store/slices/weatherSlice";
import { fetchPanels } from "../store/slices/panelSlice";

export const useAppData = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
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

  useEffect(() => {
    if (!permission) {
      dispatch(setPermission());
    }
    if (!location) {
      dispatch(fetchLocation());
    }

    if (!panelTypes) {
      dispatch(fetchPanelTypes());
    }

    if (!panels && user?.id) {
      dispatch(fetchPanels());
    }
  }, [user?.id, panels, location, panelTypes]);

  useEffect(() => {
    const updateWeather = () => {
      if (location) {
        dispatch(fetchWeather());
      }
    };

    updateWeather();

    const interval = setInterval(updateWeather, 12 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, location]);

  return {
    user,
    location,
    weatherData,
    panels,
    panelTypes,
    isLoading:
      isLoading ||
      isLocationLoading ||
      isPanelsLoading ||
      isTypesLoading ||
      isWeatherLoading,
    error: error || locationError || panelsError || typesError || weatherError,
  };
};
