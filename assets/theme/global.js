import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const MyLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,

    green: "#2EB84E",
    greenDark: "#1f6228",
    greenLight: "#eefbf0",
    greenTwo: "#5be57b",

    primary: "#672ab7",
    primaryLight: "#f6efff",
    primaryDark: "#360a70",

    secondary: "#83CFFF",
    secondaryDark: "#005ba1",
    secondaryLight: "#d7f0ff",
    blue: "#51bbfe",

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
  },
};
