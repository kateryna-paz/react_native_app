import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPanel, fetchPanels } from "../../store/slices/panelSlice";
import { fetchPanelTypes } from "../../store/slices/typesSlice";
import { showToast } from "../../utils/showToast";

export const usePanelsInfo = ({ user }) => {
  const dispatch = useDispatch();

  const {
    panels,
    isLoading: isPanelLoading,
    error,
  } = useSelector((state) => state.panel);

  const {
    panelTypes,
    isLoading: isTypesLoading,
    errorTypes,
  } = useSelector((state) => state.panelTypes);

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
    dispatch(fetchPanels());
  };

  const handleAddPanel = async () => {
    try {
      if (panelData.power <= 0 || panelData.number <= 0 || !panelData.typeId) {
        setShowAlert(true);
        return;
      }

      await dispatch(addPanel(panelData)).unwrap();
      showToast("success", "Нова панель успішно додана!");

      setPanelData({ power: null, number: null, typeId: null });
      setOpenAddDialog(false);
      await refresh();
    } catch (e) {
      showToast("error", `${e}`);
    }
  };

  useEffect(() => {
    if (user?.id || error) {
      dispatch(fetchPanels());
      dispatch(fetchPanelTypes());
    }
  }, [dispatch, user?.id]);

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
