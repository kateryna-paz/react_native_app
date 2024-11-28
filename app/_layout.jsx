import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store/store";
import { FontProvider, useFontsLoaded } from "../context/fontsContext";
import { PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

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
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  if (!loaded || isLoggedIn === null) {
    return null;
  }

  if (error) {
    return <Text>Error loading fonts</Text>;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="auth" />
      )}
    </Stack>
  );
};
