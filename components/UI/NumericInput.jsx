import React from "react";
import { View } from "react-native";
import { TextInput, Text } from "react-native-paper";

export const NumericInput = ({
  value,
  onChange,
  error,
  errorMessage,
  styleInputContainer,
  styleInput,
  styleErrorText,
  label,
  ...props
}) => {
  const handleChangeText = (text) => {
    const sanitizedText = text.replace(/[^\d.]/g, "");

    const parts = sanitizedText.split(".");
    const processedText =
      parts.length > 2
        ? `${parts[0]}.${parts.slice(1).join("")}`
        : sanitizedText;

    const numValue = processedText === "" ? "" : Number(processedText);

    if (processedText === "" || !isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <View style={styleInputContainer}>
      <TextInput
        mode="flat"
        style={styleInput}
        value={value?.toString() || ""}
        onChangeText={handleChangeText}
        keyboardType="decimal-pad"
        error={!!error}
        label={label}
        placeholder={label}
        {...props}
      />
      {error && errorMessage && (
        <Text style={styleErrorText}>{errorMessage}</Text>
      )}
    </View>
  );
};
