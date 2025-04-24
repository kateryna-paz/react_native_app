import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect, useState } from "react";
import { MyLightTheme } from "../assets/theme/global";
import Toast from "react-native-toast-message";
import { loadFonts } from "../utils/font.loader";
import LoadingScreen from "../components/UI/LoadingScreen";
import { toastConfig } from "../utils/toast.config";
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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };
    loadResources();
  }, []);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
};
