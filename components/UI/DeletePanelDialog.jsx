import React from "react";
import { Text, StyleSheet } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

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
        <Dialog.Title>
          <Text style={styles.dialogTitle}>Видалення панелі</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogText}>
            Ви дійсно хочете видалити інформацію про цю панель?
          </Text>

          <Text style={styles.panelInfo}>
            Тип панелі:{" "}
            <Text style={styles.boldText}>{type?.type || "Невідомий тип"}</Text>
          </Text>
          <Text style={styles.panelInfo}>
            Потужність:{" "}
            <Text style={styles.boldText}>{panelData.power} Вт</Text>
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
  panelInfo: {
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
    backgroundColor: MyLightTheme.colors.white,
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
