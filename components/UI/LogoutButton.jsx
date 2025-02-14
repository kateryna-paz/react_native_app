import React, { useState } from "react";
import { Text, View } from "react-native";
import {
  IconButton,
  Dialog,
  Portal,
  Button,
  Paragraph,
} from "react-native-paper";
import { useRouter } from "expo-router";
import useAuthStore from "../../store/authStore";

export default function LogoutButton({ styles }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { logoutUser } = useAuthStore();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
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
        size={26}
        style={styles}
        onPress={showDialog}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>
            <Text>Confirm Logout</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              <Text>Are you sure you want to log out?</Text>
            </Paragraph>
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
