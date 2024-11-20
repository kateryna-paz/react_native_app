import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store/store";
import { FontProvider, useFontsLoaded } from "../context/fontsContext";

export default function Layout() {
  return (
    <Provider store={store}>
      <FontProvider>
        <MainLayout />
      </FontProvider>
    </Provider>
  );
}

const MainLayout = () => {
  const { loaded, error } = useFontsLoaded();

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};
