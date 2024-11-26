import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import PanelCard from "./PanelCard";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import { addPanel, fetchPanels } from "../../store/slices/panelSlice";
import PanelDialog from "../UI/PanelDialog";
import { fetchPanelTypes } from "../../store/slices/typesSlice";

export default function PanelsInfoSection() {
  const dispatch = useDispatch();
  const { panels, isLoaded, error } = useSelector((state) => state.panel);
  const { panelTypes, isTypesLoaded, errorTypes } = useSelector(
    (state) => state.panelTypes
  );

  const [panelData, setPanelData] = useState({
    square: 0,
    number: 0,
    typeId: null,
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddPanel = () => {
    if (panelData.square <= 0 || panelData.number <= 0 || !panelData.typeId) {
      Alert.alert(
        "Помилка створення нової панелі",
        "Будь ласка, оберіть тип панелей, введіть площу 1 панелі (у м²) та кількість таких панелей."
      );
      return;
    }
    dispatch(addPanel(panelData))
      .unwrap()
      .then(() => Alert.alert("Нова панель успішно додана!"))
      .catch((err) =>
        Alert.alert("Упс... Сталася помилка при відправленні даних.", `${err}`)
      );

    setPanelData({ square: 0, number: 0, typeId: null });
    setOpenAddDialog(false);
    refresh();
  };

  useEffect(() => {
    dispatch(fetchPanels());
    dispatch(fetchPanelTypes());
    if (errorTypes) {
      console.error("Error fetching panel types:", errorTypes);
    }
    if (error) {
      console.error("Error fetching panels: ", error);
    }
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchPanels());
  };

  const isLoading = !isLoaded || !isTypesLoaded;

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontFamily: "Marmelad",
          fontSize: 24,
          marginLeft: 20,
        }}
      >
        Сонячні панелі
      </Text>
      <View style={{ alignItems: "center" }}>
        {(errorTypes || error) && (
          <Text
            style={{
              color: "red",
              textAlign: "center",
              fontFamily: "Marmelad",
              fontSize: 16,
              marginTop: 20,
            }}
          >
            {error || errorTypes}
          </Text>
        )}
        {isLoading && (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            size="large"
            color="#51bbfe"
          />
        )}
        {!error && !isLoading && panels && panels.length === 0 && (
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Marmelad",
              fontSize: 16,
              marginTop: 20,
            }}
          >
            Наразі тут немає жодної інформації про ваші панелі. Додайте її
            натиснувши кноку нижче
          </Text>
        )}
        {panels &&
          panels.map((panel) => (
            <PanelCard
              key={panel.id}
              id={panel.id}
              square={panel.square}
              number={panel.number}
              typeId={panel.typeId}
              type={panel.type}
              panelTypes={panelTypes}
              refresh={refresh}
            />
          ))}
        <IconButton
          icon="plus"
          mode="contained"
          containerColor="#51bbfe"
          iconColor="white"
          style={{ marginTop: 10 }}
          size={30}
          onPress={() => {
            setOpenAddDialog(true);
          }}
        />
        <PanelDialog
          visible={openAddDialog}
          hideDialog={() => setOpenAddDialog(false)}
          saveChanges={handleAddPanel}
          panelData={panelData}
          setPanelData={setPanelData}
          panelTypes={panelTypes}
          title="Додати нову панель"
        />
      </View>
    </View>
  );
}
