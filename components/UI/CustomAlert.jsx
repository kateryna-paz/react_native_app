import React from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import { StyleSheet } from "react-native";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function CustomAlert({
  showAlert,
  onConfirm,
  onCancel,
  showCancelButton = false,
  message,
  title,
  confirmText = "OK",
  cancelText = "Відмінити",
  closeOnTouchOutside = true,
}) {
  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={closeOnTouchOutside}
      closeOnHardwareBackPress={false}
      showCancelButton={showCancelButton}
      showConfirmButton={true}
      cancelText={cancelText}
      confirmText={confirmText}
      confirmButtonColor={MyLightTheme.colors.primary}
      cancelButtonColor={MyLightTheme.colors.gray}
      onCancelPressed={onCancel}
      onConfirmPressed={onConfirm}
      onDismiss={onCancel ? onCancel : onConfirm}
      titleStyle={styles.alertTitle}
      messageStyle={styles.alertMessage}
      contentContainerStyle={styles.alertContainer}
      cancelButtonStyle={styles.alertCancelButton}
      confirmButtonStyle={styles.alertButton}
      cancelButtonTextStyle={[styles.buttonText, styles.cancelButtonText]}
      confirmButtonTextStyle={styles.buttonText}
    />
  );
}

const styles = StyleSheet.create({
  alertTitle: {
    fontFamily: FONTS.Kurale,
    fontSize: 18,
    color: MyLightTheme.colors.black,
    textAlign: "center",
    marginBottom: 10,
  },
  alertMessage: {
    fontFamily: FONTS.Kurale,
    color: MyLightTheme.colors.black,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  alertContainer: {
    width: "90%",
    borderRadius: 10,
    padding: 10,
  },
  alertCancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 120,
  },
  alertButton: {
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 120,
  },
  buttonText: {
    fontFamily: FONTS.Kurale,
    fontSize: 16,
    color: MyLightTheme.colors.white,
    textAlign: "center",
  },
  cancelButtonText: {
    color: MyLightTheme.colors.black,
  },
});
