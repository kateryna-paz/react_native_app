import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { showToast } from "../../utils/showToast";
import useLocationStore from "../../store/locationAndMapStore";

export const useRegisterLocation = () => {
  const router = useRouter();
  const {
    addLocation,
    setRegisterLocationWithGeo,
    setPermission,
    isLoading,
    permission,
    registerLocation,
  } = useLocationStore();

  const [location, setLocation] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleRegister = async () => {
    if (!registerLocation) {
      setShowAlert(true);
      return;
    }
    try {
      await addLocation();

      router.replace("/profile");
    } catch (err) {
      showToast("error", err || "Упс...б щось пішло не так");
    }
  };

  const handleFetchLocation = async () => {
    try {
      await setRegisterLocationWithGeo();
      setTimeout(() => {
        setLocation(useLocationStore.getState().registerLocation);
      }, 100);

      setShowAlert(true);
    } catch (err) {
      showToast("error", err || "Щось пішло не так");
    }
  };

  const handleMapNavigation = () => {
    router.push({
      pathname: "/auth/register/map",
      params: {
        onSaveLocation: () => setRegisterLocationWithGeo(),
      },
    });
  };

  const handleConfirm = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (!permission) {
      setPermission();
    }
    if (registerLocation) {
      setLocation(registerLocation);
    }
  }, [permission, registerLocation, setPermission]);

  return {
    location,
    showAlert,
    isLoading,
    handleRegister,
    handleFetchLocation,
    handleMapNavigation,
    handleConfirm,
  };
};
