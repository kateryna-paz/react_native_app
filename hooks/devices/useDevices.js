import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDevice, fetchDevices } from "../../store/slices/devicesSlice";
import { importances } from "../../constants/importanceDevices";
import { showToast } from "../../utils/showToast";

export const useDevices = () => {
  const dispatch = useDispatch();
  const { devices, isLoading, error } = useSelector((state) => state.devices);

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
      await dispatch(
        addDevice({
          ...deviceData,
          importance: importances
            .find((imp) => imp.id === deviceData.importanceId)
            .type.toLocaleLowerCase(),
        })
      ).unwrap();
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
      await dispatch(fetchDevices());
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
    dispatch(fetchDevices());
  }, [dispatch]);

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
