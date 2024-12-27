import { useState } from "react";
import { TextInput } from "react-native-paper";

export default function MyInput({
  label,
  initialValue,
  onChangeText,
  keyboardType = "numeric",
  width = "47%",
  styles,
}) {
  const [val, setVal] = useState(initialValue || "");

  const handleChange = (newValue) => {
    setVal(newValue);
    onChangeText(newValue);
  };
  return (
    <TextInput
      label={label}
      mode="outlined"
      value={val}
      onChangeText={handleChange}
      style={[
        {
          fontFamily: "Kurale",
          fontSize: 16,
          width: width,
        },
        styles,
      ]}
      keyboardType={keyboardType}
      editable={true}
    />
  );
}
