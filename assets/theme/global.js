import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const MyLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,

    green: "#2EB84E",
    greenDark: "#1f6228",
    greenLight: "#eafced",
    greenTwo: "#5be57b",

    primary: "#672ab7",
    primarySelected: "#7E44C9",
    primaryLight: "#f6efff",
    primaryDark: "#360a70",

    secondary: "#83CFFF",
    secondaryDark: "#005ba1",
    secondaryLight: "#d7f0ff",
    blue: "#51bbfe",
    secondaryLight2: "#ecf8ff",

    accent: "#991818",
    red: "#ba0b0b",
    accentLight: "#ffc0c0",

    textPrimary: "#333",
    textSecondary: "#616161",
    textOnPrimary: "#ffffff",

    background: "#f5f5f5",
    cardBackground: "#ffffff",
    modalBackground: "#ffffff",

    border: "#E0E0E0",
    borderDark: "#BDBDBD",

    warning: "#ddA500",
    error: "#FF4C4C",
    success: "#4CAF50",

    grayLight: "#f0f0f0",
    grayDark: "#616161",
    white: "#ffffff",
    black: "#000000",

    transparent: "transparent",
    darkTransparent: "rgba(0,0,0,0.3)",
  },
};

export const FONTS = Object.freeze({
  Rubik: "Rubik",
  Kurale: "Kurale",
  SofiaSans: "SofiaSans",
  SofiaSansBold: "SofiaSansBold",
  RobotoSlabBold: "RobotoSlabBold",
  RobotoSlab: "RobotoSlab",
  Marmelad: "Marmelad",
});
