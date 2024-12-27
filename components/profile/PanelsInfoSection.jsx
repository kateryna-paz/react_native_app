import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import PanelCard from "./PanelCard";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  Button,
  IconButton,
  useTheme,
} from "react-native-paper";
import { addPanel, fetchPanels } from "../../store/slices/panelSlice";
import DialogCreation from "../UI/DialogCreation";
import { fetchPanelTypes } from "../../store/slices/typesSlice";
import ErrorText from "../UI/ErrorText";
import ReductPanelCard from "./ReductCardPanel";

export default function PanelsInfoSection({ user }) {
  const dispatch = useDispatch();
  const {
    panels,
    isLoading: isPanelLoading,
    error,
  } = useSelector((state) => state.panel);
  const { panelTypes, isTypesLoading, errorTypes } = useSelector(
    (state) => state.panelTypes
  );

  const [panelData, setPanelData] = useState({
    power: 0,
    number: 0,
    typeId: null,
  });

  const theme = useTheme();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddPanel = async () => {
    if (panelData.power <= 0 || panelData.number <= 0 || !panelData.typeId) {
      Alert.alert(
        "Помилка створення нової панелі",
        "Будь ласка, оберіть тип панелей, введіть потужність 1 панелі (у Вт) та кількість таких панелей."
      );
      return;
    }
    await dispatch(addPanel(panelData))
      .unwrap()
      .then(() => Alert.alert("Нова панель успішно додана!"))
      .catch((err) =>
        Alert.alert("Упс... Сталася помилка при відправленні даних.", `${err}`)
      );

    setPanelData({ power: 0, number: 0, typeId: null });
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

  const isLoading = isPanelLoading || isTypesLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сонячні панелі</Text>
      <View style={{ alignItems: "center" }}>
        {(errorTypes || error) && <ErrorText error={errorTypes || error} />}
        {isLoading && !error && !panels && (
          <ActivityIndicator
            style={{ marginTop: 30, marginBottom: 20 }}
            size="large"
            color={theme.colors.blue}
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
              power={panel.power}
              number={panel.number}
              typeId={panel.typeId}
              type={panel.type}
              panelTypes={panelTypes}
              refresh={refresh}
            />
          ))}
        {panels && !errorTypes && (
          <IconButton
            icon="plus"
            mode="contained"
            containerColor={theme.colors.blue}
            iconColor="white"
            style={{ marginTop: 10 }}
            size={30}
            onPress={() => {
              setOpenAddDialog(true);
            }}
          />
        )}
        <DialogCreation
          visible={openAddDialog}
          hideDialog={() => setOpenAddDialog(false)}
          saveChanges={handleAddPanel}
          title="Додати нову панель"
        >
          <ReductPanelCard
            panelTypes={panelTypes}
            panelData={panelData}
            setPanelData={setPanelData}
          />
        </DialogCreation>
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
