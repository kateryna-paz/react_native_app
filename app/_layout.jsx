import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect, useState } from "react";
import { MyLightTheme } from "../assets/theme/global";
import Toast from "react-native-toast-message";
import { loadFonts } from "../utils/font.loader";
import LoadingScreen from "../components/UI/LoadingScreen";
import { toastConfig } from "../utils/toast.config";
import useAuthStore from "../store/authStore";
import { useAuthHandler } from "../hooks/auth/useAuthHandler";

export default function Layout() {
  return (
    <PaperProvider theme={MyLightTheme}>
      <MainLayout />
      <Toast config={toastConfig} position="top" />
    </PaperProvider>
  );
}

const MainLayout = () => {
  useAuthHandler();
  const { isLoggedIn, initializeAuth } = useAuthStore();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await loadFonts();
      setFontsLoaded(true);
      await initializeAuth();
    };
    loadResources();
  }, [initializeAuth]);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="auth" />
      )}
    </Stack>
  );
};
