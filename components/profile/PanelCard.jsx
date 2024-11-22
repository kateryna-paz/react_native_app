import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import SelectList from "../UI/SelectList";
import { fetchPanelTypes } from "../../store/slices/typesSlice";
import { useSelector, useDispatch } from "react-redux";

const types = [
  { id: 1, title: "Monocrystals" },
  { id: 2, title: "Polycrystals" },
  { id: 3, title: "Multicrystals" },
];

export default function PanelCard() {
  const [square, setSquare] = React.useState(0);
  const [number, setNumber] = React.useState(0);
  const dispatch = useDispatch();
  const { panelTypes, isLoaded, error } = useSelector(
    (state) => state.panelTypes
  );

  useEffect(() => {
    dispatch(fetchPanelTypes());
  }, [dispatch]);
  return (
    <View
      style={{
        flexDirection: "column",
        gap: 15,
        alignItems: "center",
        marginHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
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
      <SelectList
        style={{ width: "100%" }}
        title="Оберіть тип панелей"
        items={panelTypes || types}
        icon="atom"
      />
    </View>
  );
}
