import React from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";

export default function PanelCard() {
  const [square, setSquare] = React.useState(0);
  const [number, setNumber] = React.useState(0);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
          marginHorizontal: 20,
        }}
      >
        <TextInput
          label="Площа 1 панелі (м2)"
          placeholder="5"
          mode="outlined"
          value={square}
          onChangeText={(square) => setSquare(+square)}
          style={{
            fontFamily: "Kurale",
            fontSize: 16,
            width: "47%",
          }}
          keyboardType="numeric"
        />
        <TextInput
          label="Кількість панелей"
          placeholder="10"
          mode="outlined"
          value={number}
          onChangeText={(number) => setNumber(+number)}
          style={{
            fontFamily: "Kurale",
            fontSize: 16,
            width: "47%",
          }}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}
