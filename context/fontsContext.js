// fontsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [loaded, error] = useFonts({
    SofiaSans: require("../assets/fonts/SofiaSans-Regular.ttf"),
    SofiaSansBold: require("../assets/fonts/SofiaSans-Bold.ttf"),
    Kurale: require("../assets/fonts/Kurale-Regular.ttf"),
    RobotoSlab: require("../assets/fonts/RobotoSlab-Regular.ttf"),
    RobotoSlabBold: require("../assets/fonts/RobotoSlab-Bold.ttf"),
    Marmelad: require("../assets/fonts/Marmelad-Regular.ttf"),
    Rubik: require("../assets/fonts/Rubik-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <FontContext.Provider value={{ loaded, error }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontsLoaded = () => useContext(FontContext);
