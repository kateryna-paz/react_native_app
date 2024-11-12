import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded, error] = useFonts({
    SofiaSans: require("../assets/fonts/SofiaSans-Regular.ttf"),
    Kurale: require("../assets/fonts/Kurale-Regular.ttf"),
    RobotoSlab: require("../assets/fonts/RobotoSlab-Regular.ttf"),
    Marmelad: require("../assets/fonts/Marmelad-Regular.ttf"),
    Rubik: require("../assets/fonts/Rubik-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "green" },
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
