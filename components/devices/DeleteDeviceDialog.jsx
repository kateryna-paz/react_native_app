import React from "react";
import { Text, StyleSheet } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { importances } from "../../constants/importanceDevices";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

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
          <Text>Видалення приладу</Text>
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
    fontFamily: FONTS.Marmelad,
    fontSize: 22,
    color: MyLightTheme.colors.primary,
    textAlign: "center",
  },
  dialogText: {
    fontFamily: FONTS.Marmelad,
    fontSize: 17,
    color: MyLightTheme.colors.black,
    marginBottom: 15,
    textAlign: "center",
  },
  deviceInfo: {
    fontFamily: FONTS.Marmelad,
    fontSize: 16,
    color: MyLightTheme.colors.black,
    marginBottom: 5,
  },
  boldText: {
    color: MyLightTheme.colors.primary,
  },
  button: {
    marginRight: 10,
    borderColor: MyLightTheme.colors.primary,
    borderWidth: 1,
    color: MyLightTheme.colors.primary,
    paddingHorizontal: 15,
  },
  deleteButton: {
    backgroundColor: MyLightTheme.colors.primary,
    borderColor: MyLightTheme.colors.primary,
    borderWidth: 1,
    color: MyLightTheme.colors.white,
    paddingHorizontal: 20,
  },
});
