import React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import ReductPanelCard from "../profile/ReductCardPanel";
import { MyLightTheme } from "../../assets/theme/global";

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
    color: MyLightTheme.colors.primary,
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    marginRight: 10,
    borderColor: MyLightTheme.colors.primary,
    borderWidth: 1,
    color: MyLightTheme.colors.primary,
    paddingHorizontal: 15,
  },
  saveButton: {
    backgroundColor: MyLightTheme.colors.primary,
    borderColor: MyLightTheme.colors.primary,
    borderWidth: 1,
    color: "white",
    paddingHorizontal: 42,
  },
});
