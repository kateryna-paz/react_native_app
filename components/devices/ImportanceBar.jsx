import React from "react";
import { View } from "react-native";
import { MyLightTheme } from "../../assets/theme/global";

const ImportanceBar = ({ importance }) => {
  return (
    <View style={styles.importanceBar}>
      <View
        style={[
          styles.importanceSegment,
          { backgroundColor: MyLightTheme.colors.green },
        ]}
      />
      <View
        style={[
          styles.importanceSegment,
          {
            backgroundColor:
              importance === "Висока" || importance === "Середня"
                ? MyLightTheme.colors.green
                : MyLightTheme.colors.grayLight,
          },
        ]}
      />
      <View
        style={[
          styles.importanceSegment,
          {
            backgroundColor:
              importance === "Висока"
                ? MyLightTheme.colors.green
                : MyLightTheme.colors.grayLight,
          },
        ]}
      />
    </View>
  );
};

const styles = {
  importanceBar: {
    flexDirection: "row",
    width: "60%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 4,
  },
  importanceSegment: {
    flex: 1,
    height: "100%",
  },
};

export default ImportanceBar;
