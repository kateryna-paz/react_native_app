import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";

export default function DeletePanelDialog({
  visible,
  hideDialog,
  panelData,
  deletePanel,
  panelTypes,
}) {
  const type = panelTypes.find((t) => t.id === panelData.typeId);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Видалення панелі</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogText}>
            Ви дійсно хочете видалити інформацію про цю панель?
          </Text>

          <Text style={styles.panelInfo}>
            Тип панелі:{" "}
            <Text style={styles.boldText}>{type?.type || "Невідомий тип"}</Text>
          </Text>
          <Text style={styles.panelInfo}>
            Площа: <Text style={styles.boldText}>{panelData.square} м²</Text>
          </Text>
          <Text style={styles.panelInfo}>
            Кількість панелей:{" "}
            <Text style={styles.boldText}>{panelData.number}</Text>
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="outlined" onPress={hideDialog} style={styles.button}>
            Ні
          </Button>
          <Button
            mode="contained"
            onPress={deletePanel}
            style={styles.deleteButton}
          >
            Так
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 20,
  },
  dialogTitle: {
    fontFamily: "Marmelad",
    fontSize: 22,
    color: "#672ab7",
    textAlign: "center",
  },
  dialogText: {
    fontFamily: "Marmelad",
    fontSize: 17,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  panelInfo: {
    fontFamily: "Marmelad",
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  boldText: {
    color: "#672ab7",
  },
  button: {
    marginRight: 10,
    borderColor: "#672ab7",
    borderWidth: 1,
    color: "#672ab7",
    paddingHorizontal: 15,
  },
  deleteButton: {
    backgroundColor: "#672ab7",
    borderColor: "#672ab7",
    borderWidth: 1,
    color: "#fff",
    paddingHorizontal: 20,
  },
});
