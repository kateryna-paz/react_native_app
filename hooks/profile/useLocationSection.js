import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import {
  fetchLocation,
  getLocationWithGeo,
  setPermission,
} from "../../store/slices/locationAndMapSlice";
import { showToast } from "../../utils/showToast";

export const useLocationSection = () => {
  const dispatch = useDispatch();
  const { location, permission, isLoading } = useSelector(
    (state) => state.location
  );

  const [localLocation, setLocalLocation] = useState(null);
  const [visibleOptions, setVisibleOptions] = useState(false);

  const animationProgress = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  const optionsStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
    height: interpolate(animationProgress.value, [0, 1], [0, 120]),
    overflow: "hidden",
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(iconRotation.value, [0, 1], [-90, 0])}deg`,
      },
    ],
  }));

  const animateOptions = (show, duration = 500) => {
    animationProgress.value = withTiming(show ? 1 : 0, { duration });
    iconRotation.value = withTiming(show ? 1 : 0, { duration });
  };

  const openOptions = () => {
    const newValue = !visibleOptions;
    setVisibleOptions(newValue);
    animateOptions(newValue);
  };

  const closeOptions = (duration = 300) => {
    setVisibleOptions(false);
    animateOptions(false, duration);
  };

  const handleFetchLocation = async () => {
    try {
      await dispatch(setPermission()).unwrap();
      await dispatch(getLocationWithGeo()).unwrap();
      showToast("success", "Локацію успішно змінено!");
      closeOptions();
    } catch (err) {
      showToast("error", err);
    }
  };

  const handleUseMap = () => {
    router.push("/profile/map");
    closeOptions();
  };

  useEffect(() => {
    if (!permission) {
      dispatch(setPermission());
    }
    if (!location) {
      dispatch(fetchLocation());
      closeOptions(0);
    }
    if (location) {
      setLocalLocation(location);
    }
  }, [permission, location]);

  return {
    localLocation,
    isLoading,
    visibleOptions,
    optionsStyle,
    iconStyle,
    openOptions,
    handleFetchLocation,
    handleUseMap,
  };
};
