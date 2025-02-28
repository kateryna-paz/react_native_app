import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  IconButton,
  Dialog,
  Portal,
  Button,
  Paragraph,
} from "react-native-paper";
import { useRouter } from "expo-router";
import useAuthStore from "../../store/authStore";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import useDistributeDevicesStore from "../../store/distributeStore";
import useLocationStore from "../../store/locationAndMapStore";
import useWeatherStore from "../../store/weatherStore";

export default function LogoutButton({ styles }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { logoutUser } = useAuthStore();
  const { clearState } = useDistributeDevicesStore();
  const { clearData } = useLocationStore();
  const { clearWeatherData } = useWeatherStore();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      hideDialog();
      clearState();
      clearData();
      clearWeatherData();
      router.replace("/auth");
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };

  return (
    <View>
      <IconButton
        icon="logout-variant"
        mode="outlined"
        iconColor="#991818"
        size={26}
        style={styles}
        onPress={showDialog}
      />

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={dialogStyles.dialog}
        >
          <Dialog.Title>
            <Text style={dialogStyles.dialogTitle}>Підтвердження виходу</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              <Text style={dialogStyles.dialogText}>
                Ви впевнені, що хочете вийти?
              </Text>
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} style={dialogStyles.button}>
              Відмінити
            </Button>
            <Button onPress={handleLogout} style={dialogStyles.deleteButton}>
              <Text style={dialogStyles.buttonText}>Вийти</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const dialogStyles = StyleSheet.create({
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

    paddingHorizontal: 20,
  },
  buttonText: {
    color: MyLightTheme.colors.white,
  },
});
