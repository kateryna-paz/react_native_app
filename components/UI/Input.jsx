import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function InputNumber() {
  const [number, onChangeNumber] = React.useState(0);
  return (
    <TextInput
      style={styles.input}
      onChangeText={onChangeNumber}
      value={number}
      placeholder="8"
      keyboardType="numeric"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
