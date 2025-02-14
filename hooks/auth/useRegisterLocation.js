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
      const locationResult = await addLocation();
      if (!locationResult || locationResult?.error) {
        showToast(
          "error",
          locationResult?.error || "Помилка реєстрації користувача"
        );
      }

      router.push("/profile");
    } catch (err) {
      showToast("error", err || "Упс...б щось пішло не так");
    }
  };

  const handleFetchLocation = async () => {
    try {
      const result = await setRegisterLocationWithGeo();
      setLocation(result);
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
  }, [permission, registerLocation]);

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
