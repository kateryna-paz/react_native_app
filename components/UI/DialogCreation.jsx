import React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function DialogCreation({
  visible,
  hideDialog,
  saveChanges,
  title,
  children,
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title style={styles.dialogTitle}>{title}</Dialog.Title>
        <Dialog.Content>{children}</Dialog.Content>
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
    fontFamily: FONTS.Marmelad,
    fontSize: 22,
    color: MyLightTheme.colors.primary,
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    marginRight: 10,
    marginTop: 10,
    borderColor: MyLightTheme.colors.primary,
    borderWidth: 2,
    color: MyLightTheme.colors.primary,
    backgroundColor: MyLightTheme.colors.white,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: MyLightTheme.colors.primary,
    borderColor: MyLightTheme.colors.primary,
    borderWidth: 2,
    borderRadius: 6,
    color: MyLightTheme.colors.white,
    paddingHorizontal: 42,
    marginTop: 10,
  },
});
