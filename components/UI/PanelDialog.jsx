import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Button,
  Dialog,
  Modal,
  PaperProvider,
  Portal,
} from "react-native-paper";
import ReductPanelCard from "../profile/ReductCardPanel";

export default function PanelDialog({
  visible,
  hideDialog,
  panelData,
  saveChanges,
  setPanelData,
  panelTypes,
  title,
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title style={styles.dialogTitle}>{title}</Dialog.Title>
        <Dialog.Content>
          <ReductPanelCard
            panelTypes={panelTypes}
            panelData={panelData}
            setPanelData={setPanelData}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="outlined" style={styles.button} onPress={hideDialog}>
            Скасувати
          </Button>
          <Button
            mode="contained"
            style={styles.saveButton}
            onPress={saveChanges}
          >
            Зберегти
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialogTitle: {
    fontFamily: "Marmelad",
    fontSize: 22,
    color: "#672ab7",
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    marginRight: 10,
    borderColor: "#672ab7",
    borderWidth: 1,
    color: "#672ab7",
    paddingHorizontal: 15,
  },
  saveButton: {
    backgroundColor: "#672ab7",
    borderColor: "#672ab7",
    borderWidth: 1,
    color: "white",
    paddingHorizontal: 42,
  },
});
