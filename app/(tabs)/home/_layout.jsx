import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [loaded, error] = useFonts({
    SofiaSans: require("../../../assets/fonts/SofiaSans-Regular.ttf"),
    Kurale: require("../../../assets/fonts/Kurale-Regular.ttf"),
    RobotoSlab: require("../../../assets/fonts/RobotoSlab-Regular.ttf"),
    Marmelad: require("../../../assets/fonts/Marmelad-Regular.ttf"),
    Rubik: require("../../../assets/fonts/Rubik-Regular.ttf"),
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
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

