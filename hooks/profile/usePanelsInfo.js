import { useState, useEffect } from "react";
import { showToast } from "../../utils/showToast";
import usePanelTypesStore from "../../store/panelTypesStore";
import usePanelsStore from "../../store/panelsStore";

export const usePanelsInfo = ({ user }) => {
  const {
    panels,
    isLoading: isPanelLoading,
    error,
    fetchPanels,
    addPanel,
  } = usePanelsStore();

  const { panelTypes, isTypesLoading, errorTypes, fetchPanelTypes } =
    usePanelTypesStore();

  const [panelData, setPanelData] = useState({
    power: null,
    number: null,
    typeId: null,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleConfirm = () => {
    setShowAlert(false);
  };

  const refresh = async () => {
    await fetchPanels();
  };

  const handleAddPanel = async () => {
    try {
      if (panelData.power <= 0 || panelData.number <= 0 || !panelData.typeId) {
        setShowAlert(true);
        return;
      }
      setOpenAddDialog(false);

      await addPanel(panelData);
      showToast("success", "Нова панель успішно додана!");

      setPanelData({ power: null, number: null, typeId: null });
      await refresh();
    } catch (e) {
      showToast("error", `${e}`);
    }
  };

  useEffect(() => {
    if (user?.id || error) {
      fetchPanelTypes();
      fetchPanels();
    }
  }, [user?.id, error, fetchPanelTypes, fetchPanels]);

  const closeAddDialog = () => setOpenAddDialog(false);
  const openAddPanelDialog = () => setOpenAddDialog(true);

  const isLoading = isPanelLoading || isTypesLoading;
  const isError = error || errorTypes;

  return {
    panels,
    panelTypes,
    panelData,
    setPanelData,
    showAlert,
    openAddDialog,
    isLoading,
    isError,
    error,
    errorTypes,
    handleConfirm,
    handleAddPanel,
    refresh,
    closeAddDialog,
    openAddPanelDialog,
  };
};
