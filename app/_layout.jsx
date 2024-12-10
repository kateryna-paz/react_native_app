import { Stack } from "expo-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../store/store";
import { FontProvider, useFontsLoaded } from "../context/fontsContext";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import { initializeAuth } from "../store/slices/authSlice";
import { MyLightTheme } from "../assets/theme/global";

export default function Layout() {
  return (
    <Provider store={store}>
      <PaperProvider theme={MyLightTheme}>
        <FontProvider>
          <MainLayout />
        </FontProvider>
      </PaperProvider>
    </Provider>
  );
}

const MainLayout = () => {
  const dispatch = useDispatch();
  const { loaded, error } = useFontsLoaded();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  if (error) {
    return <Text>Error loading fonts</Text>;
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
