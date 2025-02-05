import { Stack } from "expo-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../store/store";
import { PaperProvider } from "react-native-paper";
import { useEffect, useState } from "react";
import { initializeAuth } from "../store/slices/authSlice";
import { MyLightTheme } from "../assets/theme/global";
import Toast from "react-native-toast-message";
import { loadFonts } from "../utils/font.loader";
import LoadingScreen from "../components/UI/LoadingScreen";
import { toastConfig } from "../utils/toast.config";

export default function Layout() {
  return (
    <Provider store={store}>
      <PaperProvider theme={MyLightTheme}>
        <MainLayout />
        <Toast config={toastConfig} position="top" />
      </PaperProvider>
    </Provider>
  );
}

const MainLayout = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };
    loadResources();
    dispatch(initializeAuth());
  }, [dispatch]);

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
