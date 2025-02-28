import { useState, useEffect } from "react";
import { importances } from "../../constants/importanceDevices";
import { showToast } from "../../utils/showToast";
import useDevicesStore from "../../store/devicesStore";

export const useDevices = () => {
  const { fetchDevices, addDevice, devices, isLoading, error } =
    useDevicesStore();

  const [deviceData, setDeviceData] = useState({
    name: "",
    power: "",
    importanceId: null,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleAddDevice = async () => {
    try {
      if (
        deviceData.name === "" ||
        deviceData.power <= 0 ||
        !deviceData.importanceId
      ) {
        setShowAlert(true);
        return;
      }
      await addDevice({
        ...deviceData,
        importance: importances
          .find((imp) => imp.id === deviceData.importanceId)
          .type.toLocaleLowerCase(),
      });
      showToast("success", "Новий прилад успішно додано!");
      resetDeviceData();
      await refresh();
    } catch (e) {
      showToast("error", "Упс... Сталася помилка при відправленні даних.");
    }
  };

  const refresh = async () => {
    try {
      setRefreshing(true);
      fetchDevices();
    } catch (_) {
      showToast("error", "Упс... Сталася помилка при оновленні даних.");
    } finally {
      setRefreshing(false);
    }
  };

  const resetDeviceData = () => {
    setDeviceData({ name: "", power: "", importanceId: null });
    setOpenAddDialog(false);
  };

  useEffect(() => {
    if (devices.length === 0 && !isLoading) {
      fetchDevices();
    }
  }, []);

  return {
    devices,
    isLoading,
    error,
    deviceData,
    setDeviceData,
    refreshing,
    openAddDialog,
    setOpenAddDialog,
    showAlert,
    setShowAlert,
    handleAddDevice,
    refresh,
  };
};
