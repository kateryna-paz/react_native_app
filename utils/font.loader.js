import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    SofiaSans: require("../assets/fonts/SofiaSans-Regular.ttf"),
    SofiaSansBold: require("../assets/fonts/SofiaSans-Bold.ttf"),
    Kurale: require("../assets/fonts/Kurale-Regular.ttf"),
    RobotoSlab: require("../assets/fonts/RobotoSlab-Regular.ttf"),
    RobotoSlabBold: require("../assets/fonts/RobotoSlab-Bold.ttf"),
    Marmelad: require("../assets/fonts/Marmelad-Regular.ttf"),
    Rubik: require("../assets/fonts/Rubik-Regular.ttf"),
  });
};
