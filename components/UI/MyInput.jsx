import { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function MyInput({
  label,
  value,
  initialValue,
  onChangeText,
  keyboardType = "numeric",
  width = "47%",
  maxValue,
  selectionColor = MyLightTheme.colors.primary,
  outlineColor = MyLightTheme.colors.grayLight,
  styles,
}) {
  const [val, setVal] = useState(value || initialValue || "");

  useEffect(() => {
    setVal(value?.toString() || "");
  }, [value]);

  const handleChange = (text) => {
    if (keyboardType === "numeric") {
      let sanitizedText;

      if (maxValue === 24 || maxValue === 60) {
        sanitizedText = text.replace(/[^0-9]/g, "");
      } else {
        sanitizedText = text.replace(/[^0-9.]/g, "");

        if ((sanitizedText.match(/\./g) || []).length > 1) {
          sanitizedText = sanitizedText.slice(
            0,
            sanitizedText.lastIndexOf(".")
          );
        }
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

      if (maxValue && numValue >= maxValue) {
        return;
      }

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
      value={val}
      onChangeText={handleChange}
      style={[
        {
          fontFamily: FONTS.Kurale,
          fontSize: 16,
          width: width,
          paddingHorizontal: 12,
        },
        styles,
      ]}
      keyboardType={keyboardType}
      editable={true}
      selectionColor={selectionColor}
      outlineColor={outlineColor}
    />
  );
}
