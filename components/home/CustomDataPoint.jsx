import { View } from "react-native";

export default function customDataPoint({ color }) {
  return (
    <View
      style={{
        width: 8,
        height: 8,
        backgroundColor: color,

        borderRadius: 10,
        marginBottom: 5,
        marginLeft: 4,
      }}
    />
  );
}
