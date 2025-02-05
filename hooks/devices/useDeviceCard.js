import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteDevice, updateDevice } from "../../store/slices/devicesSlice";
import { importances } from "../../constants/importanceDevices";
import { showToast } from "../../utils/showToast";

export const useDeviceCard = (data, refresh) => {
  const dispatch = useDispatch();

  const [deviceData, setDeviceData] = useState({
    name: data.name || "",
    power: data.power || 0,
    importanceId:
      importances.find((imp) => imp.type.toLowerCase() === data.importance)
        .id || null,
    importance:
      importances.find((imp) => imp.type.toLowerCase() === data.importance)
        .type || "Невідомо",
  });

  const [reductOpen, setReductOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleReductDialog = () => {
    setReductOpen((vis) => !vis);
  };

  const handleDeleteDialog = () => {
    setDeleteOpen((vis) => !vis);
  };

  const handleUpdateDevice = async () => {
    try {
      if (
        deviceData.name === "" ||
        deviceData.power <= 0 ||
        !deviceData.importanceId
      ) {
        showToast(
          "error",
          "Введіть коректні значення назви приладу та потужності."
        );
        return;
      }

      await dispatch(
        updateDevice({
          id: data.id,
          importance: importances
            .find((imp) => imp.id === deviceData.importanceId)
            ?.type.toLowerCase(),
          power: deviceData.power,
          name: deviceData.name,
        })
      ).unwrap();
      showToast("success", "Прилад успішно оновлено");
    } catch (e) {
      showToast("error", "Помилка при оновленні приладу");
    }

    setReductOpen(false);
    await refresh();
  };

  const handleDeleteDevice = async () => {
    try {
      await dispatch(deleteDevice({ ...data })).unwrap();
      showToast("success", "Прилад успішно видалено");
    } catch (e) {
      showToast("error", "Помилка при видаленні приладу");
    }

    setDeleteOpen(false);
    await refresh();
  };

  return {
    deviceData,
    setDeviceData,
    reductOpen,
    deleteOpen,
    handleReductDialog,
    handleDeleteDialog,
    handleUpdateDevice,
    handleDeleteDevice,
  };
};
