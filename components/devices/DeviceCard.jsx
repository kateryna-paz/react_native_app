import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { Card, Icon, IconButton, useTheme } from "react-native-paper";
import { importances } from "../../constants/importanceDevices";
import SelectList from "../UI/SelectList";
import ReductDeviceCard from "./ReductDeviceCard";
import DialogCreation from "../UI/DialogCreation";
import DeleteDeviceDialog from "./DeleteDeviceDialog";
import { MyLightTheme } from "../../assets/theme/global";
import { deleteDevice, updateDevice } from "../../store/slices/devicesSlice";
import { useDispatch } from "react-redux";

export default function DeviceCard({ data, refresh }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleImportanceChange = useCallback(
    (importanceId) => {
      setDeviceData((prev) => ({ ...prev, importanceId }));
    },
    [setDeviceData]
  );

  const [deviceData, setDeviceData] = useState({
    name: data.name || "",
    power: data.power || 0,
    importanceId:
      importances.find((imp) => imp.type.toLowerCase() === data.importance)
        .id || null,
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
    if (
      deviceData.name === "" ||
      deviceData.power <= 0 ||
      !deviceData.importanceId
    ) {
      Alert.alert("Введіть коректні значення назви приладу та потужності.");
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
    )
      .unwrap()
      .then(() => Alert.alert("Прилад успішно оновлено"))
      .catch(() => Alert.alert("Помилка при оновленні приладу"));

    setReductOpen(false);
    await refresh();
  };

  const handleDeleteDevice = async () => {
    await dispatch(deleteDevice({ ...data }))
      .unwrap()
      .then(() => Alert.alert("Прилад успішно видалено"))
      .catch(() => Alert.alert("Помилка при видаленні приладу"));
    setDeleteOpen(false);
    await refresh();
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Pressable onPress={handleDeleteDialog} style={styles.deleteButton}>
          <Icon source="delete" size={18} color={theme.colors.accent} />
        </Pressable>
        <Pressable onPress={handleReductDialog} style={styles.editButton}>
          <Icon source="pencil" size={18} color={theme.colors.primary} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.deviceName}>{deviceData.name}</Text>
        <Text style={styles.power}>{deviceData.power} Вт</Text>
        <SelectList
          title="Select Importance"
          items={importances}
          selectedTypeId={deviceData.importanceId}
          onSelect={(id) => handleImportanceChange(id)}
          style={styles.selectList}
          textStyle={{ fontSize: 15 }}
        />
      </View>

      {reductOpen && (
        <DialogCreation
          visible={reductOpen}
          hideDialog={() => setReductOpen(false)}
          title="Редагувати прилад"
          saveChanges={handleUpdateDevice}
        >
          <ReductDeviceCard
            deviceData={deviceData}
            setDeviceData={setDeviceData}
          />
        </DialogCreation>
      )}
      {deleteOpen && (
        <DeleteDeviceDialog
          visible={deleteOpen}
          hideDialog={() => setDeleteOpen(false)}
          deleteDevice={handleDeleteDevice}
          deviceData={deviceData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
    width: "45%",
    elevation: 4,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: -1,
    right: -1,
    left: -1,
  },
  deleteButton: {
    opacity: 0.6,
    padding: 12,
    borderTopStartRadius: 12,
    borderTopEndRadius: 2,
    borderBottomLeftRadius: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: MyLightTheme.colors.accent,
  },
  editButton: {
    backgroundColor: MyLightTheme.colors.secondary,
    padding: 12,
    opacity: 0.6,
    borderRadius: 22,
    borderTopEndRadius: 12,
    borderTopStartRadius: 2,
    borderBottomRightRadius: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: MyLightTheme.colors.primary,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 42,
  },
  selectList: {
    width: "80%",
    height: "25%",
    marginTop: 4,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SofiaSansBpld",
    marginBottom: 8,
  },
  power: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Marmelad",
    marginBottom: 16,
  },
});
