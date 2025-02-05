import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../utils/showToast";
import {
  addLocation,
  setPermission,
  setRegisterLocationWithGeo,
} from "../../store/slices/locationAndMapSlice";

export const useRegisterLocation = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [location, setLocation] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const { permission, registerLocation, isLoading } = useSelector(
    (state) => state.location
  );

  const handleRegister = async () => {
    if (!registerLocation) {
      setShowAlert(true);
      return;
    }
    try {
      const locationResult = await dispatch(addLocation()).unwrap();
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
      const result = await dispatch(setRegisterLocationWithGeo()).unwrap();
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
        onSaveLocation: () => dispatch(setRegisterLocationWithGeo()),
      },
    });
  };

  const handleConfirm = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (!permission) {
      dispatch(setPermission());
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
