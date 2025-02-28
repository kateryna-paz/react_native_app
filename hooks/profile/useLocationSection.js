import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import { showToast } from "../../utils/showToast";
import useLocationStore from "../../store/locationAndMapStore";

export const useLocationSection = () => {
  const {
    location,
    getLocationWithGeo,
    isLoading,
    permission,
    setPermission,
    fetchLocation,
  } = useLocationStore();

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

  const animateOptions = useCallback(
    (show, duration = 500) => {
      animationProgress.value = withTiming(show ? 1 : 0, { duration });
      iconRotation.value = withTiming(show ? 1 : 0, { duration });
    },
    [animationProgress, iconRotation]
  );

  const openOptions = () => {
    const newValue = !visibleOptions;
    setVisibleOptions(newValue);
    animateOptions(newValue);
  };

  const closeOptions = useCallback(
    (duration = 300) => {
      setVisibleOptions(false);
      animateOptions(false, duration);
    },
    [animateOptions, setVisibleOptions]
  );

  const handleFetchLocation = async () => {
    try {
      await setPermission();
      await getLocationWithGeo();

      if (
        !localLocation ||
        location?.latitude !== localLocation?.latitude ||
        location?.longitude !== localLocation?.longitude
      ) {
        setTimeout(() => {
          setLocalLocation(useLocationStore.getState().location);
        }, 100);
      }

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
      setPermission();
    }
    if (!location) {
      fetchLocation();
      closeOptions(0);
    }
    if (location) {
      setLocalLocation(location);
    }
  }, [permission, location, setPermission, fetchLocation, closeOptions]);

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
