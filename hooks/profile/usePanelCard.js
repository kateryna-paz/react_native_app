import { useState } from "react";
import { showToast } from "../../utils/showToast";
import usePanelsStore from "../../store/panelsStore";

export const usePanelCard = ({ id, power, number, typeId, refresh }) => {
  const [panelData, setPanelData] = useState({
    power: power || null,
    number: number || null,
    typeId: typeId || null,
  });
  const [reductOpen, setReductOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { changePanel, deletePanel } = usePanelsStore();

  const handleReductPanel = () => {
    setReductOpen((prev) => !prev);
  };

  const handleDeleteDialog = () => {
    setDeleteOpen((prev) => !prev);
  };

  const handleConfirm = () => setShowAlert(false);

  const handleSaveChanges = async () => {
    try {
      const power = Number(panelData.power);
      const number = Number(panelData.number);

      if (
        isNaN(power) ||
        power <= 0 ||
        isNaN(number) ||
        number <= 0 ||
        !typeId
      ) {
        setShowAlert(true);
        return;
      }

      await changePanel({ id, ...panelData });
      showToast("success", "Дані успішно оновлені");
      setReductOpen(false);
      refresh();
    } catch (error) {
      showToast("error", "Помилка при оновленні даних");
    }
  };

  const handleDelete = async () => {
    try {
      await deletePanel(id);
      showToast("success", "Панель успішно видалена");
      setDeleteOpen(false);
      refresh();
    } catch (e) {
      showToast("error", "Помилка при видалення панелі");
    }
  };

  const closeReductDialog = () => setReductOpen(false);
  const closeDeleteDialog = () => setDeleteOpen(false);

  return {
    panelData,
    setPanelData,
    reductOpen,
    deleteOpen,
    showAlert,
    handleReductPanel,
    handleDeleteDialog,
    handleConfirm,
    handleSaveChanges,
    handleDelete,
    closeReductDialog,
    closeDeleteDialog,
  };
};
