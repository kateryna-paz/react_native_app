import { useState } from "react";
import { TextInput } from "react-native-paper";
import { FONTS } from "../../assets/theme/global";

export default function MyInput({
  label,
  initialValue,
  onChangeText,
  keyboardType = "numeric",
  width = "47%",
  styles,
}) {
  const [val, setVal] = useState(initialValue || "");

  const handleChange = (text) => {
    if (keyboardType === "numeric") {
      let sanitizedText = text.replace(/[^0-9.]/g, "");

      if ((sanitizedText.match(/\./g) || []).length > 1) {
        sanitizedText = sanitizedText.slice(0, sanitizedText.lastIndexOf("."));
      }

      if (/^0[0-9]/.test(sanitizedText)) {
        sanitizedText = sanitizedText.replace(/^0+/, "");
      }

      if (sanitizedText === "") {
        setVal("");
        onChangeText(null);
        return;
      }

      const numValue = Number(sanitizedText);

      if (!isNaN(numValue)) {
        setVal(sanitizedText);
        onChangeText(numValue);
      }
    } else {
      setVal(text);
      onChangeText(text);
    }
  };
  return (
    <TextInput
      label={label}
      mode="outlined"
      value={val}
      onChangeText={handleChange}
      style={[
        {
          fontFamily: FONTS.Kurale,
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
