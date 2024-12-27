import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { importances } from "../../constants/importanceDevices";

export default function DeleteDeviceDialog({
  visible,
  hideDialog,
  deviceData,
  deleteDevice,
}) {
  const type = importances.find((imp) => imp.id === deviceData.importanceId);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>
          Видалення приладу
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogText}>
            Ви дійсно хочете видалити інформацію про цей прилад?
          </Text>
          <Text style={styles.deviceInfo}>
            Назва приладу:{" "}
            <Text style={styles.boldText}>{deviceData.name}</Text>
          </Text>

          <Text style={styles.deviceInfo}>
            Важливість при розподіленні:{" "}
            <Text style={styles.boldText}>{type?.type || "Невідомо"}</Text>
          </Text>

          <Text style={styles.deviceInfo}>
            Потужність:{" "}
            <Text style={styles.boldText}>{deviceData.power} Вт</Text>
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="outlined" onPress={hideDialog} style={styles.button}>
            Ні
          </Button>
          <Button
            mode="contained"
            onPress={deleteDevice}
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
  deviceInfo: {
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
