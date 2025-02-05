import { useCallback, useState } from "react";

export const useMapAlert = ({ onSaveLocation, router }) => {
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    showCancelButton: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  const clearAlert = useCallback(() => {
    setAlertConfig((prev) => ({
      ...prev,
      show: false,
      onConfirm: null,
      onCancel: null,
    }));
  }, []);

  const showErrorAlert = (message) => {
    const newConfig = {
      show: true,
      showCancelButton: false,
      title: "Помилка",
      message,
      onConfirm: clearAlert,
      onCancel: null,
    };
    setAlertConfig(newConfig);
  };

  const showLocationAlert = (locationData) => {
    const newConfig = {
      show: true,
      showCancelButton: true,
      title: "Ваше місцезнаходження",
      message: `Широта: ${locationData?.latitude}, \nДовгота: ${locationData?.longitude}, \nВаша область: ${locationData?.regionName}`,
      onConfirm: () => {
        clearAlert();
        if (onSaveLocation) {
          onSaveLocation();
          router.back();
        }
      },
      onCancel: clearAlert,
    };

    setAlertConfig(newConfig);
  };

  return {
    alertConfig,
    showErrorAlert,
    showLocationAlert,
  };
};
