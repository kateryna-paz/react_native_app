import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store/store";
import { FontProvider, useFontsLoaded } from "../context/fontsContext";
import { PaperProvider } from "react-native-paper";

export default function Layout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <FontProvider>
          <MainLayout />
        </FontProvider>
      </PaperProvider>
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
