import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  IconButton,
  Dialog,
  Portal,
  Button,
  Paragraph,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import { useRouter } from "expo-router";

export default function LogoutButton({ styles }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      console.log("User logged out");
      hideDialog();
      router.push("/auth");
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
        size={28}
        style={[stylesC.iconButton, styles]}
        onPress={showDialog}
      />

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to log out?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleLogout}>Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const stylesC = StyleSheet.create({
  iconButton: {
    width: 48,
    height: 48,
  },
});
