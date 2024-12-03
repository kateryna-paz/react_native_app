import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import PanelCard from "./PanelCard";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import { addPanel, fetchPanels } from "../../store/slices/panelSlice";
import PanelDialog from "../UI/PanelDialog";
import { fetchPanelTypes } from "../../store/slices/typesSlice";
import ErrorText from "../UI/ErrorText";

export default function PanelsInfoSection({ user }) {
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

  const handleAddPanel = async () => {
    if (panelData.square <= 0 || panelData.number <= 0 || !panelData.typeId) {
      Alert.alert(
        "Помилка створення нової панелі",
        "Будь ласка, оберіть тип панелей, введіть площу 1 панелі (у м²) та кількість таких панелей."
      );
      return;
    }
    await dispatch(addPanel(panelData))
      .unwrap()
      .then(() => Alert.alert("Нова панель успішно додана!"))
      .catch((err) =>
        Alert.alert("Упс... Сталася помилка при відправленні даних.", `${err}`)
      );

    setPanelData({ square: 0, number: 0, typeId: null });
    setOpenAddDialog(false);
    await refresh();
  };

  useEffect(() => {
    if (user?.id || error) {
      dispatch(fetchPanels());
      dispatch(fetchPanelTypes());
    }
  }, [dispatch, user?.id]);

  const refresh = async () => {
    await dispatch(fetchPanels());
  };

  const isLoading = !isLoaded || !isTypesLoaded;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сонячні панелі</Text>
      <View style={{ alignItems: "center" }}>
        {(errorTypes || error) && <ErrorText error={errorTypes || error} />}
        {isLoading && !error && (
          <ActivityIndicator
            style={{ marginTop: 30, marginBottom: 20 }}
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
              marginBottom: 10,
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
        {panels && !errorTypes && isTypesLoaded && (
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
        )}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    paddingTop: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontFamily: "Marmelad",
    fontSize: 24,
    marginLeft: 10,
    marginBottom: 10,
  },
});
